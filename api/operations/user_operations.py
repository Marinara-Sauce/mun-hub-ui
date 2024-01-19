from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.models import AdminUser
from schemas.user_schema import AdminUserCreate, AdminUserUpdate
from operations.authentication import hash_password


# get all users
def get_all_users(db: Session):
    return db.query(AdminUser).all()


# get user by id
def get_user_by_id(db: Session, user_id: int):
    user = db.query(AdminUser).filter(AdminUser.user_id == user_id).first()
    
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {user_id} not found")
    
    return user


# get user by username
def get_user_by_username(db: Session, username: str) -> Optional[AdminUser]:
    return db.query(AdminUser).filter(AdminUser.username == username).first()


# create a user
def create_user(db: Session, user: AdminUserCreate):
    password = hash_password(user.unhashed_password)
    
    user = AdminUser(
        first_name = user.first_name,
        last_name = user.last_name,
        username = user.username,
        password = password,
        super_user = user.super_user,
    )
    
    try:
        db.add(user)
        db.commit()
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Username {user.username} is taken")
    
    return user


# change a password
def change_password(db: Session, user_id: int, unhashed_password: str):
    password = hash_password(unhashed_password)
    
    user = get_user_by_id(db, user_id)
    
    setattr(user, "password", password)
    
    db.commit()
    db.refresh(user)
    
    return True


# delete a user
def delete_user(db: Session, user_id: int):
    user = get_user_by_id(db, user_id)
    
    db.delete(user)
    db.commit()
    
    return True


# patch user details (does not include password)
def patch_user(db: Session, user_update: AdminUserUpdate):
    user = get_user_by_id(db, user_update.user_id)
    
    for key, value in user_update.model_dump().items():
        setattr(user, key, value)
        
    db.commit()
    db.refresh(user)
    
    return user