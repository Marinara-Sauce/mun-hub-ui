from fastapi import HTTPException, status
from requests import Session
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from models.models import Vote, Votes, VotingSession


def get_current_voting_session(db: Session, committee_id: int):
    voting_session = db.query(VotingSession).filter(VotingSession.committee_id == committee_id).filter(VotingSession.live).options(joinedload(VotingSession.votes)).first()
    
    if not voting_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    return voting_session


def create_voting_session(db: Session, committee_id: int):
    voting_session = db.query(VotingSession).filter(VotingSession.committee_id == committee_id).filter(VotingSession.live).options(joinedload(VotingSession.votes)).first()
    
    if voting_session:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A vote is already live for this committee"
        )
    
    db_vote = VotingSession(committee_id=committee_id)
    
    db.add(db_vote)
    db.commit()
    db.refresh(db_vote)
    
    return db_vote


def end_current_voting_session(db: Session, committee_id: int):
    current_session = get_current_voting_session(db, committee_id)
    
    if not current_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Committee {committee_id} does not have a live vote"
        )
        
    setattr(current_session, 'live', False)
    setattr(current_session, 'close_time', func.now())
    
    db.commit()
    db.refresh(current_session)
    
    return current_session


def get_closed_voting_sessions(db: Session, committee_id: int):
    return db.query(VotingSession).filter(VotingSession.committee_id == committee_id).filter(VotingSession.live == False).order_by(VotingSession.close_time).options(joinedload(VotingSession.votes)).all()


def can_delegate_vote(db: Session, committee_id: int, delegation_id: int, vote_session: VotingSession = None):
    if not vote_session:
        vote_session = get_current_voting_session(db, committee_id)
    
    delegate_vote = db.query(Votes).filter(Votes.delegation_id == delegation_id).filter(Votes.voting_session_id == vote_session.voting_session_id).first()
            
    return not delegate_vote
    
    
def cast_vote(db: Session, committee_id: int, delegation_id: int, vote: Vote):
    voting_session = get_current_voting_session(db, committee_id)
    can_vote = can_delegate_vote(db, committee_id, delegation_id, voting_session)
    
    if not can_vote:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Delegation {delegation_id} already voted in this session"
        )
        
    vote = Votes(
        voting_session_id = voting_session.voting_session_id,
        delegation_id = delegation_id,
        vote = vote
    )
    
    db.add(vote)
    db.commit()
    db.refresh(vote)
    db.refresh(voting_session)
    
    return voting_session