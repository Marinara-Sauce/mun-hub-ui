from fastapi import HTTPException, status
from requests import Session
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from models.models import AttendanceEntry, AttendanceEntryType, AttendanceEntry, AttendanceSession


def get_current_attendance_session(db: Session, committee_id: int, must_be_live: bool = True, throw_on_not_found: bool = True):
    if must_be_live:
        attendance_session = db.query(AttendanceSession).filter(AttendanceSession.committee_id == committee_id).filter(AttendanceSession.live).options(joinedload(AttendanceSession.entries)).first()
    else:
        attendance_session = db.query(AttendanceSession).filter(AttendanceSession.committee_id == committee_id).order_by(AttendanceSession.attendance_session_id.desc()).options(joinedload(AttendanceSession.entries)).first()
    
    if not attendance_session:
        if throw_on_not_found:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND
            )
        else:
            return None
        
    return attendance_session


def get_most_recent_submission(db: Session, committee_id: int, delegation_id: int):
    most_recent_session = get_current_attendance_session(db, committee_id, must_be_live=False, throw_on_not_found=False)
    
    if not most_recent_session:
        return None
    
    return db.query(AttendanceEntry).filter(AttendanceEntry.attendance_session_id == most_recent_session.attendance_session_id).filter(AttendanceEntry.delegation_id == delegation_id).order_by(AttendanceEntry.attendance_session_id.desc()).first()


def create_attendance_session(db: Session, committee_id: int):
    attendance_session = db.query(AttendanceSession).filter(AttendanceSession.committee_id == committee_id).filter(AttendanceSession.live).options(joinedload(AttendanceSession.entries)).first()
    
    if attendance_session:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An attendance session is already live for this committee"
        )
    
    db_attendance = AttendanceSession(committee_id=committee_id)
    
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    
    return db_attendance


def end_current_attendance_session(db: Session, committee_id: int):
    current_session = get_current_attendance_session(db, committee_id)
    
    if not current_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Committee {committee_id} does not have a live attendance session"
        )
        
    setattr(current_session, 'live', False)
    setattr(current_session, 'close_time', func.now())
    
    db.commit()
    db.refresh(current_session)
    
    return current_session


def get_closed_attendance_sessions(db: Session, committee_id: int):
    return db.query(AttendanceSession).filter(AttendanceSession.committee_id == committee_id).filter(AttendanceSession.live == False).order_by(AttendanceSession.close_time).options(joinedload(AttendanceSession.entries)).all()


def can_delegate_submit(db: Session, committee_id: int, delegation_id: int, attendance_session: AttendanceSession = None):
    if not attendance_session:
        attendance_session = get_current_attendance_session(db, committee_id)
    
    delegate_vote = db.query(AttendanceEntry).filter(AttendanceEntry.delegation_id == delegation_id).filter(AttendanceEntry.attendance_session_id == attendance_session.attendance_session_id).first()
            
    return not delegate_vote
    
    
def submit_attendance(db: Session, committee_id: int, delegation_id: int, entry: AttendanceEntryType, admin_override: bool = False):
    attendance_session = get_current_attendance_session(db, committee_id, not admin_override)
    can_submit = admin_override or can_delegate_submit(db, committee_id, delegation_id, attendance_session)
    
    if not can_submit:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Delegation {delegation_id} already submitted attendance in this session"
        )
        
    attendance = AttendanceEntry(
        attendance_session_id = attendance_session.attendance_session_id,
        delegation_id = delegation_id,
        entry = entry,
    )
    
    # if duplicate, delete
    if admin_override:
        most_recent_submission = get_most_recent_submission(db, committee_id, delegation_id)
        if most_recent_submission:
            db.delete(most_recent_submission)
    
    db.add(attendance)
    
    db.commit()
    db.refresh(attendance)
    db.refresh(attendance_session)
    
    return attendance_session


def remove_attendance_submission(db: Session, committee_id: int, delegation_id: int):
    attendance_session = get_current_attendance_session(db, committee_id, False)
    prior_submission = db.query(AttendanceEntry).filter(AttendanceEntry.delegation_id == delegation_id).filter(AttendanceEntry.attendance_session_id == attendance_session.attendance_session_id).first()
    
    if not prior_submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Delegation {delegation_id} is already absent"
        )
        
    db.delete(prior_submission)
    db.commit()
    db.refresh(attendance_session)
    
    return attendance_session