from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from operations.authentication import generate_token, get_current_user, verify_password

from database.database import SessionLocal
from schemas.user_schema import AdminUser, AdminUserCreate, AdminUserUpdate
from settings import settings

import operations.user_operations as user_operations

router = APIRouter()

# get the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# attempt a login
@router.post("/token", tags=["User"])
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    user: AdminUser = user_operations.get_user_by_username(db, form_data.username)

    if not user:
        raise HTTPException(status_code=404, detail=(f"No users with the username {form_data.username}"))
    
    # check the password
    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=403, detail=(f"Incorrect Password"))
    
    user.__delattr__("password")
    token = generate_token(user.user_id)
    return {"access_token": token, "token_type": "bearer", "expiration": settings.token_life_time, "user": user} # TODO: Not hard code the 30 minutes


# get all users
@router.get("/user", tags=["User"])
def get_users(acting_user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    if not acting_user.super_user:
        raise HTTPException(status_code=403, detail="You do not have permission to do this")
    
    return user_operations.get_all_users(db)


# create a user
@router.post("/user/create", tags=["User"])
def create_user(user: AdminUserCreate, acting_user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    if not acting_user.super_user:
        raise HTTPException(status_code=403, detail="You do not have permission to do this")
    
    return user_operations.create_user(db, user)


# change a password
@router.post("/user/update/password", tags=["User"])
def change_password(user_id: int, new_password: str, acting_user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    if not acting_user.super_user:
        raise HTTPException(status_code=403, detail="You do not have permission to do this")
    
    return user_operations.change_password(db, user_id, new_password)


# patch a user
@router.patch("/user/update", tags=["User"])
def patch_user(user: AdminUserUpdate, acting_user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    if not acting_user.super_user:
        raise HTTPException(status_code=403, detail="You do not have permission to do this")
    
    return user_operations.patch_user(db, user)


# delete a user
@router.delete("/user", tags=["User"])
def delete_user(user_id: int, acting_user: Annotated[AdminUser, Depends(get_current_user)], db: Session = Depends(get_db)):
    if not acting_user.super_user:
        raise HTTPException(status_code=403, detail="You do not have permission to do this")
    
    return user_operations.delete_user(db, user_id)