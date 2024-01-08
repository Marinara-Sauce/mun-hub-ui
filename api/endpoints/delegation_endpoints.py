from fastapi import APIRouter, Depends

from database.database import SessionLocal
from schemas.delegation_schema import DelegationCreate
from operations import delegation_operations

router = APIRouter()


# get the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Get all delegations
@router.get("/delegations", tags=["Delegations"])
def get_delegations(db=Depends(get_db)):
    return delegation_operations.get_delegations(db)


# Get delegations by ID
@router.get("/delegations/{delegation_id}", tags=["Delegations"])
def get_delegations_by_id(delegation_id: str, db=Depends(get_db)):
    result = delegation_operations.get_delegate_by_id(db, delegation_id)

    if result is None:
        return {"message": f"Delegation ID [{delegation_id}] not found"}
    else:
        return result


# Get advanced information on delegation with id
@router.get("/delegations/advanced/{delegation_id}", tags=["Delegations"])
def get_advanced_delegation_by_id(delegation_id: str, db=Depends(get_db)):
    delegation = delegation_operations.get_delegate_by_id(db, delegation_id)
    
    working_papers = delegation_operations.get_working_papers_with_delegations(db, delegation_id)
    committees = delegation_operations.get_committees_delegations_in(db, delegation_id)
    
    return {
        "delegation_id": delegation.delegation_id,
        "delegation_name": delegation.delegation_name,
        "working_papers": working_papers,
        "committees": committees
    }
    
    
# Create a delegation
@router.post("/delegations", tags=["Delegations"])
def create_delegation(delegation: DelegationCreate, db=Depends(get_db)):
    return delegation_operations.create_delegation(db, delegation)


# Update a delegation
@router.put("/delegations/{delegation_id}", tags=["Delegations"])
def update_delegation(delegation_id: str, new_delegation_name: str, db=Depends(get_db)):
    result = delegation_operations.update_delegation(db, delegation_id, new_delegation_name)

    if result is None:
        return {"message": f"Delegation ID [{delegation_id}] not found"}
    else:
        return result


# Delete a delegation
@router.delete("/delegations/{delegation_id}", tags=["Delegations"])
def delete_delegation(delegation_id: int, db=Depends(get_db)):
    return delegation_operations.delete_delegation(db, delegation_id)
