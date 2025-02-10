from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from sklearn.cluster import KMeans
import numpy as np
from typing import List
import os

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["risk-radar-db"]

router = APIRouter(prefix="/threats", tags=["threats"])

# Function to assign clusters
def assign_clusters(threats):
    print("Before clustering:", threats)  # Debugging

    valid_threats = [t for t in threats if "latitude" in t and "longitude" in t]
    print("Valid threats for clustering:", valid_threats)  # Debugging

    if len(valid_threats) > 1:
        locations = np.array([[t["latitude"], t["longitude"]] for t in valid_threats])
        print("Locations array for clustering:", locations)  # Debugging

        kmeans = KMeans(n_clusters=min(len(valid_threats), 5), random_state=42)
        labels = kmeans.fit_predict(locations)

        for i, threat in enumerate(valid_threats):
            threat["cluster"] = f"Cluster {labels[i]}"
            print(f"Threat {threat['title']} assigned to cluster {labels[i]}")  # Debugging

    for threat in threats:
        if "cluster" not in threat:
            threat["cluster"] = "N/A"

    print("After clustering:", threats)  # Debugging
    return threats




# API to fetch all threats
@router.get("/", response_model=List[dict])
async def get_threats():
    threats = list(db.threats.find({}, {"_id": 0}))  # Restore correct projection
    
    if not threats:
        return []  # Instead of raising 404, return empty list

    threats = assign_clusters(threats)  # Apply clustering
    return threats





# API to add a threat
@router.post("/")
async def create_threat(threat: dict):
    required_fields = ["title", "description", "severity", "location", "latitude", "longitude"]
    for field in required_fields:
        if field not in threat:
            raise HTTPException(status_code=400, detail=f"Missing field: {field}")

    result = db.threats.insert_one(threat)
    return {"message": "Threat added", "id": str(result.inserted_id)}

# API to delete a threat
@router.delete("/{threat_id}")
async def delete_threat(threat_id: str):
    result = db.threats.delete_one({"_id": threat_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Threat not found")
    return {"message": "Threat deleted successfully"}
