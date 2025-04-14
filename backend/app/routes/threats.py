from fastapi import APIRouter, HTTPException, Query, Request, UploadFile, File, status
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import io
import os
import csv
import pandas as pd
from io import StringIO
from typing import List, Optional
from fastapi.responses import Response
from app.utils.pdf_generator import generate_pdf
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder

# Ensure the database name is correct
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["RiskRadar"]
threats_collection = db["threats"]
report_logs_collection = db["report_logs"]

router = APIRouter(prefix="/threats", tags=["threats"])

# GET: Fetch threats with optional filters
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

    for threat in threats:
        threat["_id"] = str(threat["_id"])
        if "date" in threat and isinstance(threat["date"], datetime):
            threat["date"] = threat["date"].isoformat()

    return threats

# DELETE: Remove a threat by ID
@router.delete("/{threat_id}")
async def delete_threat(threat_id: str):
    try:
        obj_id = ObjectId(threat_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    existing_threat = threats_collection.find_one({"_id": obj_id})
    if not existing_threat:
        raise HTTPException(status_code=404, detail="Threat not found")

    delete_result = threats_collection.delete_one({"_id": obj_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Threat not found (after deletion attempt)")

    return {"message": "Threat deleted successfully"}

# POST: Add a new threat
@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_threat(request: Request):
    threat_data = await request.json()

    required_fields = ["title", "description", "severity", "type", "location", "date"]
    for field in required_fields:
        if field not in threat_data:
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")

    try:
        threat_data["date"] = datetime.fromisoformat(threat_data["date"])
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format.")

    inserted = threats_collection.insert_one(threat_data)
    threat_data["_id"] = str(inserted.inserted_id)
    return threat_data

# PUT: Update an existing threat
@router.put("/{threat_id}")
async def update_threat(threat_id: str, threat_data: dict):
    try:
        obj_id = ObjectId(threat_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid Threat ID format")

    if "_id" in threat_data:
        del threat_data["_id"]

    threat_data["date"] = datetime.utcnow().isoformat()

    update_result = db.threats.update_one({"_id": obj_id}, {"$set": threat_data})

    if update_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Threat not found")

    return {"message": "Threat updated successfully", "updated_date": threat_data["date"]}

# GET: Export PDF + log timestamp
@router.get("/export/pdf", response_class=Response)
async def export_pdf():
    threats = list(db.threats.find({}, {"_id": 0, "title": 1, "severity": 1, "type": 1, "location": 1}))

    if not threats:
        raise HTTPException(status_code=404, detail="No threats found to export.")

    report_logs_collection.insert_one({"generated_at": datetime.utcnow()})

    pdf_buffer = generate_pdf(threats)

    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=threat_report.pdf"}
    )

# GET: List report logs
@router.get("/report_logs/", response_model=List[str])
async def get_report_logs():
    logs = report_logs_collection.find().sort("generated_at", -1)
    return [log["generated_at"].isoformat() for log in logs]

# DELETE: Clear report logs
@router.delete("/report_logs/")
async def clear_report_logs():
    result = report_logs_collection.delete_many({})
    return {"deleted": result.deleted_count}

# POST: Upload CSV
@router.post("/upload_csv/", status_code=status.HTTP_200_OK)
async def upload_csv(file: UploadFile = File(None)):
    if file is None:
        raise HTTPException(status_code=400, detail="No file was provided")

    try:
        contents = await file.read()
        decoded = contents.decode("utf-8")

        df = pd.read_csv(io.StringIO(decoded))

        if df.empty:
            raise HTTPException(status_code=400, detail="CSV file is empty")

        required_columns = {"title", "description", "severity", "type", "location", "date"}
        if not required_columns.issubset(set(df.columns)):
            raise HTTPException(status_code=400, detail="Invalid CSV format. Missing required columns.")

        threats_to_insert = []
        for index, row in df.iterrows():
            try:
                threat = {
                    "title": str(row["title"]).strip(),
                    "description": str(row["description"]).strip(),
                    "severity": str(row["severity"]).strip(),
                    "type": str(row["type"]).strip(),
                    "location": str(row["location"]).strip(),
                    "date": datetime.fromisoformat(str(row["date"]).strip())
                }
                threats_to_insert.append(threat)
            except Exception as e:
                print(f"Row {index} skipped due to error: {e}")

        if not threats_to_insert:
            return {"message": "CSV uploaded but no valid threats to insert.", "filename": file.filename}

        inserted = threats_collection.insert_many(threats_to_insert)
        return {
            "message": f"CSV uploaded successfully. Inserted {len(inserted.inserted_ids)} threats.",
            "filename": file.filename
        }

    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="CSV file is empty")

    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV format")

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/clusters", response_model=List[dict])
async def get_threat_clusters(
    severity: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    k: int = 3,
):
    query = {}

    if severity:
        query["severity"] = severity
    if location:
        query["location"] = location

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

    threats = list(threats_collection.find(query, {
        "_id": 1, "title": 1, "severity": 1, "type": 1, "location": 1, "latitude": 1, "longitude": 1
    }))

    if not threats:
        return []

    df = pd.DataFrame(threats)

    if "latitude" not in df.columns or "longitude" not in df.columns:
        raise HTTPException(status_code=500, detail="Missing latitude/longitude fields in data.")

    df["latitude_raw"] = df["latitude"]
    df["longitude_raw"] = df["longitude"]

    encoders = {}
    for col in ["severity", "type", "location"]:
        encoder = LabelEncoder()
        df[col] = encoder.fit_transform(df[col].astype(str))
        encoders[col] = encoder

    kmeans = KMeans(n_clusters=min(k, len(df)), random_state=0)
    df["cluster"] = kmeans.fit_predict(df[["severity", "type", "location"]])

    df["latitude"] = df["latitude_raw"]
    df["longitude"] = df["longitude_raw"]
    df.drop(columns=["latitude_raw", "longitude_raw"], inplace=True)

    clustered_data = df.to_dict(orient="records")
    for item in clustered_data:
        item["_id"] = str(item["_id"])

    return clustered_data

@router.get("/map_threats", response_model=List[dict])
async def get_threats_with_coordinates(
    severity: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
):
    query = {
        "latitude": {"$exists": True},
        "longitude": {"$exists": True},
    }

    if severity:
        query["severity"] = severity
    if type:
        query["type"] = type
    if location:
        query["location"] = location

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

    threats = list(threats_collection.find(query, {
        "_id": 1,
        "title": 1,
        "severity": 1,
        "type": 1,
        "location": 1,
        "latitude": 1,
        "longitude": 1
    }))

    for threat in threats:
        threat["_id"] = str(threat["_id"])

    return threats
