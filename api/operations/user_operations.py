from typing import Optional
from sqlalchemy.orm import Session
from models.models import AdminUser
from schemas.user_schema import AdminUserCreate
from operations.authentication import hash_password

# get user by id
def get_user_by_id(db: Session, user_id: int):
    return db.query(AdminUser).filter(AdminUser.user_id == user_id).first()


# get user by username
def get_user_by_username(db: Session, username: str) -> Optional[AdminUser]:
    return db.query(AdminUser).filter(AdminUser.username == username).first()


# create a user
def add_user(db: Session, user: AdminUserCreate):
    password = hash_password(user.unhashed_password)
    
    user = AdminUser(
        first_name = user.first_name,
        last_name = user.last_name,
        username = user.username,
        password = password,
        super_user = user.super_user,
    )
    
    db.add(user)
    db.commit()
    
    return user