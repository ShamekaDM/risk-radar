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
