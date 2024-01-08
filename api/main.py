from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import database as database
from endpoints import delegation_endpoints, committee_endpoints, user_endpoints

app = FastAPI()

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


@app.get("/ping", tags=['Basic'])
async def root():
    return {"message": "Success"}
