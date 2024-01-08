from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import aliased, joinedload

from sqlalchemy.orm import Session
from schemas.speakerlist_schema import SpeakerListBase, SpeakerListCreate
from schemas.workingpaper_schema import WorkingPaperCreate

from models.models import Committee, Delegation, Participant, SpeakerList, WorkingPaper, WorkingPaperDelegation
from schemas.committee_schema import CommitteeCreate, CommitteeUpdate


def get_committees(db: Session):
    return db.query(Committee).all()


def create_committee(db: Session, user: CommitteeCreate):
    db_user = Committee(
        committee_name=user.committee_name, 
        committee_abbreviation=user.committee_abbreviation
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


def get_committee_by_id(db: Session, committee_id: str) -> Optional[Committee]:
    """
    Get a committee by its id.

    :param db: Database session object
    :param committee_id: ID of the committee
    :return: The committee, if it exists, otherwise None
    """
    return db.query(Committee).filter(Committee.committee_id == committee_id).first()


def patch_committee(db: Session, committee_update: CommitteeUpdate) -> Optional[Committee]:
    old_committee = get_committee_by_id(db, committee_update.committee_id)
    
    if old_committee is None:
        return False
    
    for key, value in committee_update.model_dump().items():
        setattr(old_committee, key, value)
    
    db.commit()
    db.refresh(old_committee)
    
    return old_committee


def delete_committee(db: Session, committee_id: str):
    committee = db.query(Committee).filter(Committee.committee_id == committee_id).first()
    
    if committee is None:
        return False
    
    db.delete(committee)
    db.commit()

    return True


# get participants
def get_participants(db: Session):
    return db.query(Participant).all()


# get participant by ID
def get_participant_by_id(db: Session, participant_id: str) -> Optional[Participant]:
    return db.query(Participant).filter(Participant.participant_id == participant_id).first()


# add many delegations to a single committee
def add_participants(db: Session, committee_id: int, delegation_ids: [int]) -> [Participant]:
    if not db.query(Committee).filter(Committee.committee_id == committee_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Commitee {committee_id} Not Found"
        )
    
    participants = [Participant(committee_id=committee_id, delegation_id=d) for d in delegation_ids]
    
    db.add_all(participants) # TODO: Catch unique errors
    db.commit()

    return participants


# remove a delegation from a committee
def remove_participant(db: Session, committee_id: int, delegation_id: int) -> bool:
    participant = db.query(Participant).filter(Participant.committee_id == committee_id).filter(Participant.delegation_id == delegation_id).first()

    if participant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Could not find delegation with id: {delegation_id} in committee: {committee_id}"
        )
    
    db.delete(participant)
    db.commit()
    
    return True


# replace a committee's list of delegations
def patch_participants(db: Session, committee_id: int, delegation_ids: [int]):
    # remove all participants first
    current_participants = db.query(Participant).filter(Participant.committee_id == committee_id).all()
    
    for p in current_participants:
        remove_participant(db, committee_id, p.delegation_id)
    
    # add the new participants
    return add_participants(db, committee_id, delegation_ids)



def patch_working_papers(db: Session, committee_id: int, working_papers: [WorkingPaperCreate]):
    # remove all working papers first
    current_working_papers = db.query(WorkingPaper).filter(WorkingPaper.committee_id == committee_id).all()
    
    # make a list of all the working paper ids
    current_wp_ids = [wp.working_paper_id for wp in current_working_papers]
    current_working_paper_delegations = db.query(WorkingPaperDelegation).filter(WorkingPaperDelegation.working_paper_id in current_wp_ids).all()
    
    for d in current_working_paper_delegations:
        remove_delegation_from_working_paper(db, d.working_paper_id, d.delegation_id)
    
    for wp in current_working_papers:
        delete_working_paper(db, wp.working_paper_id)
        
    # add new working papers
    for wp in working_papers:
        db_wp = add_working_paper(db, wp)

    return True
        
# add a working paper to a committee
def add_working_paper(db: Session, working_paper: WorkingPaperCreate):

    db_working_paper = WorkingPaper(
        committee_id = working_paper.committee_id,
        working_group_name = working_paper.working_group_name,
        paper_link = working_paper.paper_link,
    )

    db.add(db_working_paper)
    db.commit()
    db.refresh(db_working_paper)
    
    # add all delegations to the working paper
    add_delegations_to_working_paper(db, db_working_paper.working_paper_id, working_paper.delegation_ids)

    return db_working_paper


# add a delegation to a working paper
def add_delegations_to_working_paper(db: Session, working_paper_id: int, delegation_id: [int]):
    db_delegation_workingpaper = [WorkingPaperDelegation(working_paper_id = working_paper_id, delegation_id = d) for d in delegation_id]
    
    db.add_all(db_delegation_workingpaper)
    db.commit()
    
    return db_delegation_workingpaper

# remove a delegation from a working paper
def remove_delegation_from_working_paper(db: Session, working_paper_id: int, delegation_id: int):
    relationship = db.query(WorkingPaperDelegation).filter(WorkingPaperDelegation.working_paper_id == working_paper_id).filter(WorkingPaperDelegation.delegation_id == delegation_id).first()
    
    db.delete(relationship)
    db.commit()
    
    return True


# delete a working paper
def delete_working_paper(db: Session, working_paper_id: int):
    working_paper = db.query(WorkingPaper).filter(WorkingPaper.working_paper_id == working_paper_id).first()

    if working_paper is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Could not find working paper with ID: {working_paper_id}"
        )
        
    # M:N relationships don't work well with cascade, have to manually delete them
    working_paper_delegations = db.query(WorkingPaperDelegation).filter(WorkingPaperDelegation.working_paper_id == working_paper_id)
    
    for d in working_paper_delegations:
        db.delete(d)
        
    db.delete(working_paper)
    db.commit()
    
    return True


def get_committee_speaker_list(db: Session, committee_id: int):
    delegations_alias = aliased(Delegation)

    speakers = (
        db.query(SpeakerList, delegations_alias.delegation_name)
            .join(delegations_alias, SpeakerList.delegation_id == delegations_alias.delegation_id)
            .filter(SpeakerList.committee_id == committee_id)
            .filter(SpeakerList.spoke == False)
            .order_by(SpeakerList.timestamp)
            .all()
    )
    
    # The query returns two objects, this combines them into one
    combined_results = []

    for s in speakers:
        speaker_object = s[0]
        speaker_object.delegation_name = s[1]
        combined_results.append(speaker_object)
    
    return combined_results


def add_delegation_to_speaker_list(db: Session, committee_id: int, delegation_id: int):
    # First check that the delegation isn't already in the list
    delegation_in_list = db.query(SpeakerList).filter(SpeakerList.committee_id == committee_id).filter(SpeakerList.delegation_id == delegation_id).filter(SpeakerList.spoke == False).all()
    
    if len(delegation_in_list) > 0:
        return False

    db_speaker_list_entry = SpeakerList(
        delegation_id=delegation_id,
        committee_id=committee_id
    )
    
    db.add(db_speaker_list_entry)
    db.commit()
    
    return True


def remove_delegation_from_speaker_list(db: Session, speaker_list_id: int):
    speaker_list_entry = db.query(SpeakerList).filter(SpeakerList.speakerlist_id == speaker_list_id).first()
    setattr(speaker_list_entry, "spoke", True)
    
    db.commit()
    db.refresh(speaker_list_entry)
    
    return True