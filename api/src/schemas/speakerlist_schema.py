from pydantic import BaseModel


class SpeakerListBase(BaseModel):
    committee_id: int
    delegation_id: int
    
    
class SpeakerListCreate(SpeakerListBase):
    pass


class SpeakerList(SpeakerListBase):
    speakerlist_id: int
    spoke: bool = False
    timestamp: str
    
    class Config:
        from_attributes = True