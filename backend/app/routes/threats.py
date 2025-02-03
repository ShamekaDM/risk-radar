from fastapi import APIRouter, HTTPException
from app.database.connection import db

router = APIRouter()

@router.get("/threats/")
async def get_threats():
    try:
        threats = list(db.threats.find())
        print("Fetched threats from MongoDB:", threats)  # Debugging
        
        if not threats:
            return {"message": "No threats found"}
        
        # Convert ObjectId to string
        for threat in threats:
            threat["_id"] = str(threat["_id"])
        
        return threats
    except Exception as e:
        print("❌ Error fetching threats:", e)  # Debugging
        raise HTTPException(status_code=500, detail=str(e))
from fastapi import HTTPException
from bson import ObjectId

@router.delete("/threats/{threat_id}")
async def delete_threat(threat_id: str):
    try:
        result = db.threats.delete_one({"_id": ObjectId(threat_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Threat not found")
        return {"message": "Threat deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
from fastapi import Query

@router.get("/threats/")
async def get_threats(severity: str = Query(None), search: str = Query(None)):
    try:
        query = {}
        if severity:
            query["severity"] = severity  # Filter threats by severity
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},  # Case-insensitive search in title
                {"description": {"$regex": search, "$options": "i"}}  # Case-insensitive search in description
            ]

        threats = list(db.threats.find(query))

        # Convert ObjectId to string
        for threat in threats:
            threat["_id"] = str(threat["_id"])

        return threats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
from sklearn.cluster import KMeans
import numpy as np

@router.get("/threats/clusters/")
async def get_threat_clusters():
    try:
        threats = list(db.threats.find({}, {"_id": 1, "location": 1}))
        if len(threats) < 2:
            return {"message": "Not enough threats for clustering"}

        # Convert locations into numerical data (mock coordinates for now)
        coordinates = []
        for threat in threats:
            threat["_id"] = str(threat["_id"])
            # Mock latitude/longitude data (this should be replaced with actual geolocation)
            coordinates.append([np.random.uniform(-90, 90), np.random.uniform(-180, 180)])

        kmeans = KMeans(n_clusters=3, random_state=42)
        clusters = kmeans.fit_predict(coordinates)

        for i, threat in enumerate(threats):
            threat["cluster"] = int(clusters[i])  # Assign cluster ID

        return threats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
