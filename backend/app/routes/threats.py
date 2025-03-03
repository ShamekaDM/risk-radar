from fastapi import APIRouter, HTTPException, Query
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import os
from typing import List, Optional

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["risk-radar-db"]

router = APIRouter(prefix="/threats", tags=["threats"])

# API to fetch all threats
@router.get("/", response_model=List[dict])
async def get_threats(
    severity: Optional[str] = Query(None, description="Filter threats by severity"),
    location: Optional[str] = Query(None, description="Filter threats by location")
):
    query = {}
    if severity:
        query["severity"] = severity
    if location:
        query["location"] = location

    threats = list(db.threats.find({}, {"_id": 1, "title": 1, "description": 1, "severity": 1, "location": 1, "type": 1, "timestamp": 1}))
    
    # Convert ObjectId to string
    for threat in threats:
        threat["_id"] = str(threat["_id"])
    
    return threats

# API to add a threat
@router.post("/")
async def create_threat(threat: dict):
    required_fields = ["title", "description", "severity", "location"]
    
    for field in required_fields:
        if field not in threat:
            raise HTTPException(status_code=400, detail=f"Missing field: {field}")

    # Ensure timestamp is included
    if "timestamp" not in threat or not threat["timestamp"]:
        threat["timestamp"] = datetime.utcnow().isoformat()

    result = db.threats.insert_one(threat)
    return {"message": "Threat added", "id": str(result.inserted_id)}

# API to delete a threat
@router.delete("/{threat_id}")
async def delete_threat(threat_id: str):
    try:
        result = db.threats.delete_one({"_id": ObjectId(threat_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Threat not found")
        return {"message": "Threat deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting threat: {str(e)}")