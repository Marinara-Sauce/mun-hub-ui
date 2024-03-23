from pydantic import BaseModel

from models.models import Votes


class VotingSessionBase(BaseModel):
    committee_id: int


class VotingSessionUpdate(VotingSessionBase):
    live: bool
    close_time: str
    

class VotingSession(VotingSessionBase):
    voting_session_id: int
    live: bool = True
    open_time: str
    close_time: str
    
    class Config:
        from_attributes = True