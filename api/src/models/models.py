from enum import IntEnum

from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import relationship

from src.database.database import Base


class CommitteeSessionTypes(IntEnum):
    """
    Different types of committee sessions.
    """
    IN_SESSION = 1
    SUSPENDED_SESSION = 2
    OUT_OF_SESSION = 3
    UNMOD = 4
    MOD = 5


class CommitteePollingTypes(IntEnum):
    """
    Different types of polls that can be running on a committee
    """
    NONE = 1
    VOTING = 2
    ATTENDANCE = 3
    
    
class Participant(Base):
    __tablename__ = "participants"

    # ids
    participant_id = Column(Integer, primary_key=True, index=True, unique=True, autoincrement=True)

    # foreign ids
    delegation_id = Column(Integer, ForeignKey("delegations.delegation_id"))
    committee_id = Column(Integer, ForeignKey("committees.committee_id"))
    
    __table_args__ = (
        UniqueConstraint('delegation_id', 'committee_id', name='unique_delegation_committee'),
    )


class Committee(Base):
    __tablename__ = "committees"

    # id
    committee_id = Column(Integer, primary_key=True, index=True, autoincrement=True, unique=True)

    # participants in delegation
    delegations = relationship("Delegation", secondary="participants")
    speakerlists = relationship("SpeakerList", back_populates="committee", cascade="all,delete")
    working_papers = relationship("WorkingPaper", back_populates="committee", cascade="all,delete")

    # data
    committee_name = Column(String)
    committee_abbreviation = Column(String)
    committee_description = Column(String, default="")
    committee_status = Column(Enum(CommitteeSessionTypes), default=CommitteeSessionTypes.OUT_OF_SESSION)
    committee_announcement = Column(String, default="")
    committee_poll = Column(Enum(CommitteePollingTypes), default=CommitteePollingTypes.NONE)


class Delegation(Base):
    __tablename__ = "delegations"

    # id
    delegation_id = Column(Integer, primary_key=True, index=True, unique=True)

    # data
    delegation_name = Column(String)


class SpeakerList(Base):
    __tablename__ = "speakerlists"

    # id
    speakerlist_id = Column(Integer, primary_key=True, index=True, unique=True)

    # foreign ids
    committee_id = Column(Integer, ForeignKey("committees.committee_id"))

    # data
    speakerlist_name = Column(String)

    # relationships
    committee = relationship("Committee", back_populates="speakerlists")
    speakerlistentries = relationship("SpeakerListEntry", back_populates="speakerlist")


class SpeakerListEntry(Base):
    __tablename__ = "speakerlistentries"

    # id
    speakerlistentry_id = Column(Integer, primary_key=True, index=True, unique=True)

    # foreign ids
    speakerlist_id = Column(Integer, ForeignKey("speakerlists.speakerlist_id"))
    participant_id = Column(Integer, ForeignKey("participants.participant_id"))

    # relationships
    speakerlist = relationship("SpeakerList", back_populates="speakerlistentries")


class WorkingPaper(Base):
    __tablename__ = "workingpapers"

    # id
    working_paper_id = Column(Integer, primary_key=True, index=True, autoincrement=True, unique=True)

    # foreign ids
    committee_id = Column(Integer, ForeignKey("committees.committee_id"))

    # relationships
    committee = relationship("Committee", back_populates="working_papers")
    delegations = relationship("Delegation", secondary="workingpaperdelegations")

    # data
    paper_link = Column(String)
    working_group_name = Column(String, unique=True)


class WorkingPaperDelegation(Base):
    __tablename__ = "workingpaperdelegations"

    # id
    working_paper_relationship_id = Column(Integer, primary_key=True, index=True, autoincrement=True, unique=True)

    # foreign keys
    working_paper_id = Column(Integer, ForeignKey("workingpapers.working_paper_id"))
    delegation_id = Column(Integer, ForeignKey("delegations.delegation_id"))


class AdminUser(Base):
    __tablename__ = "adminusers"

    # id
    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True, unique=True)

    # data
    first_name = Column(String)
    last_name = Column(String)
    username = Column(String, unique=True)
    password = Column(String)
    super_user = Column(Boolean, default=False)