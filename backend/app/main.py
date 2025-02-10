from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import threats
from pymongo import MongoClient
import os

app = FastAPI()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["risk-radar-db"]  # Ensure the database name is correct

print("✅ Connected to MongoDB:", db.list_collection_names())  # Add this line

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
