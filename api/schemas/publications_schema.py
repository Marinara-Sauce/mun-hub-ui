from pydantic import BaseModel

# Working Papers
class PublicationBase(BaseModel):
    paper_link: str
    publication_name: str
    committee_id: int
    
class PublicationCreate(PublicationBase):
    pass
    
class Publication(PublicationBase):
    publication_id: int
    
    class Config:
        from_attributes = True