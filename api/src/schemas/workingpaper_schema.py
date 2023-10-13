from pydantic import BaseModel

from src.schemas.delegation_schema import Delegation

# Working Papers
class WorkingPaperBase(BaseModel):
    paper_link: str
    working_group_name: str
    committee_id: int

class WorkingPaperCreate(WorkingPaperBase):
    delegation_ids: int

class WorkingPaper(WorkingPaperBase):
    working_paper_id: int
    delegations: list[Delegation]
    
    class Config:
        orm_mode = True