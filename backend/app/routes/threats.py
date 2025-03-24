from fastapi import APIRouter, HTTPException, Query, Request, status
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import os
from typing import List, Optional

#  Ensure the database name is correct
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["RiskRadar"]  # Ensure this matches `seed_data.py`
threats_collection = db["threats"]  #  Define the collection properly

router = APIRouter(prefix="/threats", tags=["threats"])

#  GET: Fetch threats with optional filters
@router.get("/", response_model=List[dict])
async def get_threats(
    severity: Optional[str] = Query(None, description="Filter by severity"),
    location: Optional[str] = Query(None, description="Filter by location"),
    start_date: Optional[str] = Query(None, description="Start Date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End Date (YYYY-MM-DD)")
):
    query = {}

    if severity:
        query["severity"] = severity
    if location:
        query["location"] = location

    #  Ensure date filtering is correctly formatted
    if start_date or end_date:
        try:
            date_query = {}
            if start_date:
                date_query["$gte"] = datetime.strptime(start_date, "%Y-%m-%d")
            if end_date:
                date_query["$lte"] = datetime.strptime(end_date, "%Y-%m-%d")
            query["date"] = date_query
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    threats = list(threats_collection.find(query, {"_id": 1, "title": 1, "description": 1, "severity": 1, "location": 1, "type": 1, "date": 1}))

    #  Convert `_id` to string and ensure `date` is returned as ISO format
    for threat in threats:
        threat["_id"] = str(threat["_id"])
        if "date" in threat and isinstance(threat["date"], datetime):
            threat["date"] = threat["date"].isoformat()  # Convert datetime to string

    return threats

#  DELETE: Remove a threat by ID
@router.delete("/{threat_id}")
async def delete_threat(threat_id: str):
    """Delete a threat by ID in MongoDB"""
    try:
        obj_id = ObjectId(threat_id)  # Convert ID
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    existing_threat = threats_collection.find_one({"_id": obj_id})
    if not existing_threat:
        raise HTTPException(status_code=404, detail="Threat not found")

    delete_result = threats_collection.delete_one({"_id": obj_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Threat not found (after deletion attempt)")

    return {"message": "Threat deleted successfully"}

#  POST: Add a new threat
@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_threat(request: Request):
    """Add a new threat to MongoDB"""
    threat_data = await request.json()

    #  Validate required fields
    required_fields = ["title", "description", "severity", "type", "location", "date"]
    for field in required_fields:
        if field not in threat_data:
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")

    #  Convert date to datetime object
    try:
        threat_data["date"] = datetime.fromisoformat(threat_data["date"])
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format.")

    #  Insert into MongoDB
    inserted = threats_collection.insert_one(threat_data)
    threat_data["_id"] = str(inserted.inserted_id)  # Convert ObjectId to string
    return threat_data

#  PUT: Update an existing threat
@router.put("/{threat_id}")
async def update_threat(threat_id: str, threat_data: dict):
    """Update a threat by ID and automatically update the date to the current date/time."""
    try:
        obj_id = ObjectId(threat_id)  # Convert to ObjectId
    except:
        print(f" Invalid ObjectId format: {threat_id}")
        raise HTTPException(status_code=400, detail="Invalid Threat ID format")

    #  Log received data before updating
    print(f" Received update request for ID: {threat_id} with data: {threat_data}")

    #  Ensure `_id` is not included in the update
    if "_id" in threat_data:
        del threat_data["_id"]  #  Remove `_id` to avoid modification error

    #  Automatically update date to the current datetime
    threat_data["date"] = datetime.utcnow().isoformat()

    update_result = db.threats.update_one({"_id": obj_id}, {"$set": threat_data})

    #  Log the update result
    print(f"🛠 MongoDB Update Result: {update_result.raw_result}")

    if update_result.matched_count == 0:
        print(f" No matching threat found for ID: {threat_id}")
        raise HTTPException(status_code=404, detail="Threat not found")

    print(f" Threat updated successfully with new date: {threat_data['date']}")
    return {"message": "Threat updated successfully", "updated_date": threat_data["date"]}
