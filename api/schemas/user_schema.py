from pydantic import BaseModel

class AdminUserBase(BaseModel):
    username: str


class AdminUserCreate(AdminUserBase):
    first_name: str = "Super"
    last_name: str = "User"
    super_user: bool
    unhashed_password: str


class AdminUserUpdate(AdminUserBase):
    user_id: int
    first_name: str
    last_name: str
    super_user: bool
    
    
class AdminUser(AdminUserBase):
    user_id: int

    first_name: str
    last_name: str
    super_user: bool = False
    
    class Config:
        from_attributes = True
