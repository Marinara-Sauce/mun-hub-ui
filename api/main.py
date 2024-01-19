from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import database as database
from endpoints import delegation_endpoints, committee_endpoints, user_endpoints

import operations.user_operations as user_operations
from schemas.user_schema import AdminUserCreate
from settings import settings

app = FastAPI("/docs" if settings.enable_docs else None)

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# build tables
database.Base.metadata.create_all(bind=database.engine)

# routers
app.include_router(committee_endpoints.router)
app.include_router(delegation_endpoints.router)
app.include_router(user_endpoints.router)

# check for the super user in the database
session = database.SessionLocal()

super_user = user_operations.get_user_by_username(session, settings.super_user_username)
if super_user == None:
    user_operations.create_user(session, AdminUserCreate(
        first_name="Super",
        last_name="User",
        username=settings.super_user_username,
        unhashed_password=settings.super_user_password,
        super_user=True
    ))
    

@app.get("/ping", tags=['Basic'])
async def root():
    return {"message": "Success"}
