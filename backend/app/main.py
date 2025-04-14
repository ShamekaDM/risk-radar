from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.routes import threats
from motor.motor_asyncio import AsyncIOMotorClient
import os
from contextlib import asynccontextmanager

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["threats"]
    print("Connected to MongoDB:", await db.list_collection_names())  # Ensure it's awaited
    yield
    client.close()

app = FastAPI(lifespan=lifespan)

@app.get("/")
def root():
    return {"message": "Risk Radar API is running"}

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to restrict allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routes
app.include_router(threats.router)
