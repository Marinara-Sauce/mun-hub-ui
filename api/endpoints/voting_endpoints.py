from typing import Annotated
from fastapi import APIRouter, Depends
from requests import Session

from database.database import SessionLocal
from models.models import AdminUser, Vote
from operations.authentication import get_current_user

import operations.voting_operations as voting_operations

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

        
@router.post("/voting/start", tags=["Voting"])
def start_vote(committee_id: int, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    return voting_operations.create_voting_session(db, committee_id)


@router.post("/voting/end", tags=["Voting"])
def end_current_vote(committee_id: int, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    return voting_operations.end_current_voting_session(db, committee_id)


@router.get("/voting", tags=["Voting"])
def get_current_vote(committee_id: int, db: Session = Depends(get_db)):
    return voting_operations.get_current_voting_session(db, committee_id)


@router.get("/voting/closed", tags=["Voting"])
def get_closed_votes(committee_id: int, user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    return voting_operations.get_closed_voting_sessions(db, committee_id)


@router.post("/voting/vote", tags=["Voting"])
def cast_vote(committee_id: int, delegation_id: int, vote: Vote, db: Session = Depends(get_db)):
    return voting_operations.cast_vote(db, committee_id, delegation_id, vote)