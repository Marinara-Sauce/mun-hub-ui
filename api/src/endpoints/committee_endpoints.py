from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from src.schemas.workingpaper_schema import WorkingPaperCreate

from src.database.database import SessionLocal
from src.models.models import AdminUser, CommitteePollingTypes
from src.schemas import committee_schema
from src.operations import committee_operations

from src.operations.authentication import get_current_user

router = APIRouter()

# get the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class CommitteeConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, committee_id: str):
        await websocket.accept()
        if committee_id not in self.active_connections:
            self.active_connections[committee_id] = []
            
        self.active_connections[committee_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, committee_id: str):
        self.active_connections[committee_id].remove(websocket)
    
    async def broadcast_poll_change(self, committee_id: str, poll: CommitteePollingTypes):
        if committee_id in self.active_connections:
            for con in self.active_connections[committee_id]:
                await con.send_json(poll)
 

manager = CommitteeConnectionManager()

# Get all
@router.get("/committees", tags=["Committees"])
def get_committees(db: Session = Depends(get_db)) -> Optional[list[committee_schema.Committee]]:
    return committee_operations.get_committees(db)


# Get by ID
@router.get("/committees/{committee_id}", tags=["Committees"])
def get_committee_by_id(committee_id: str, db: Session = Depends(get_db)) -> Optional[committee_schema.Committee]:
    result = committee_operations.get_committee_by_id(db, committee_id)

    # check for valid result
    if committee_id is None:
        raise HTTPException(status_code=404, detail=f"Committee of ID {committee_id} not found.")
    else:
        return result


# Create
@router.post("/committees", tags=["Committees"])
def create_committee(committee: committee_schema.CommitteeCreate, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db), ):
    return committee_operations.create_committee(db, committee)


# Patch committee
@router.patch("/committees", tags=["Committees"])
def patch_committee(committee: committee_schema.CommitteeUpdate, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    response = committee_operations.patch_committee(db, committee)
    
    if response:
        return response
    
    raise HTTPException(status_code=404, detail=f"Committee of ID {committee.committee_id} not found.")


# change poll
@router.put("/committees/{committee_id}/poll", tags=["Committees"])
async def change_committee_poll(committee_id: str, new_poll: CommitteePollingTypes, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    response = committee_operations.change_committee_poll(db, committee_id, new_poll)
    
    # check for valid change
    if response:
        await manager.broadcast_poll_change(committee_id, new_poll)
        return {"message": "Poll changed."}
    else:
        raise HTTPException(status_code=404, detail=f"Committee of ID {committee_id} not found.")


# delete a committee
@router.delete("/committees/{id}", tags=["Committees"])
async def delete_committee(committee_id: str, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    response = committee_operations.delete_committee(db, committee_id)
    
    if response:
        return {"message", "Success"}
    else:
        raise HTTPException(status_code=404, detail=f"Committee of ID {committee_id} not found.")


# add delegations
@router.post("/committees/{id}/participants", tags=["Committees"])
def add_delegates(committee_id: int, delegation_ids: List[int], user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    return committee_operations.create_multiple_participants(db, committee_id, delegation_ids)


# remove a delegation
@router.delete("/committees/{id}/participants", tags=["Committees"])
def remove_delegate(committee_id: int, delegation_id: int, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    return committee_operations.remove_participant(db, committee_id, delegation_id)


# add a working paper
@router.post("/committees/working-paper", tags=["Committees"])
def add_working_paper(working_paper: WorkingPaperCreate, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    return committee_operations.add_working_paper(db, working_paper)


# delete a working paper
@router.delete("/committees/working-paper/{id}", tags=["Committees"])
def delete_working_paper(working_paper_id: int, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    return committee_operations.delete_working_paper(db, working_paper_id)


# add a delegate to a working paper
@router.post("/committees/working-paper/{id}", tags=["Committees"])
def add_delegate_to_working_paper(working_paper_id: int, delegation_ids: List[int], user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    return committee_operations.add_delegations_to_working_paper(db, working_paper_id, delegation_ids)


# delete a member from a working paper
@router.delete("/committees/working-paper/{working_paper_id}/remove", tags=["Committees"])
def remove_delegation_from_working_paper(working_paper_id: int, delgation_id: int, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    return committee_operations.remove_delegation_from_working_paper(db, working_paper_id, delgation_id)


# websocket for polls
@router.websocket("/committees/{committee_id}/ws")
async def committee_websocket_endpoint(websocket: WebSocket, committee_id: str):
    await manager.connect(websocket, committee_id)
    try:
        while True:
            heartbeat = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, committee_id)
