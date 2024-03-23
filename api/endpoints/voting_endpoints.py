from typing import Annotated
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from flask import Flask, jsonify
from requests import Session
from sqlalchemy import JSON

from database.database import SessionLocal
from models.models import AdminUser, Vote, VotingSession
from operations.authentication import get_current_user

import operations.voting_operations as voting_operations

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    
    
class VotingConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, committee_id: int):
        await websocket.accept()
        if committee_id not in self.active_connections:
            self.active_connections[committee_id] = []
            
        self.active_connections[committee_id].append(websocket)
        print(f"Connect: {len(self.active_connections[committee_id])}")
    
    def disconnect(self, websocket: WebSocket, committee_id: int):
        self.active_connections[committee_id].remove(websocket)
        print(f"Disconnect: {len(self.active_connections[committee_id])}")
                
    async def broadcast_vote(self, committee_id: int, update_json: VotingSession):
        if committee_id in self.active_connections:
            for con in self.active_connections[committee_id]:
                print("Voting sending update...")
                await con.send_json(update_json.to_dict())
        else:
            print(f"Committee {committee_id} not in arr")
 
manager = VotingConnectionManager()

        
@router.post("/voting/start", tags=["Voting"])
async def start_vote(committee_id: int, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    vote_session = voting_operations.create_voting_session(db, committee_id)
    await manager.broadcast_vote(committee_id, vote_session)
    
    return vote_session


@router.post("/voting/end", tags=["Voting"])
async def end_current_vote(committee_id: int, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    vote_session = voting_operations.end_current_voting_session(db, committee_id)
    await manager.broadcast_vote(committee_id, vote_session)
    
    return vote_session


@router.get("/voting", tags=["Voting"])
def get_current_vote(committee_id: int, db: Session = Depends(get_db)):
    return voting_operations.get_current_voting_session(db, committee_id)


@router.get("/voting/closed", tags=["Voting"])
def get_closed_votes(committee_id: int, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    return voting_operations.get_closed_voting_sessions(db, committee_id)


@router.post("/voting/vote", tags=["Voting"])
async def cast_vote(committee_id: int, delegation_id: int, vote: Vote, db: Session = Depends(get_db)):
    vote = voting_operations.cast_vote(db, committee_id, delegation_id, vote)
    vote_session = get_current_vote(committee_id, db)
    await manager.broadcast_vote(committee_id, vote_session)
    
    return vote


# websocket for voting
@router.websocket("/voting/{committee_id}/ws")
async def committee_websocket_endpoint(websocket: WebSocket, committee_id: int):
    await manager.connect(websocket, committee_id)
    try:
        while True:
            heartbeat = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, committee_id)