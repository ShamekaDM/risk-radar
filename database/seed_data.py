from pymongo import MongoClient
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017/")
db = client["RiskRadar"]
threats_collection = db["threats"]

# Sample threats with proper ObjectId format
sample_threats = [
    {
        "_id": ObjectId(),  #Ensure _id is stored as an ObjectId
        "title": "Phishing Attack Detected",
        "description": "Suspicious email containing malware links.",
        "severity": "High",
        "type": "Phishing",
        "location": "New York",
        "date": "2025-03-20T14:30:00Z"
    },
    {
        "_id": ObjectId(),
        "title": "Unauthorized Access Attempt",
        "description": "Brute force attack detected on the internal network.",
        "severity": "Medium",
        "type": "Unauthorized Access",
        "location": "California",
        "date": "2025-03-21T09:45:00Z"
    }
]

# Clear old threats (so we don't mix string IDs with ObjectIds)
threats_collection.delete_many({})

# Insert the new threats
threats_collection.insert_many(sample_threats)

print("Sample threats inserted successfully with proper ObjectIds!")
