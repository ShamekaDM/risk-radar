from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

client = MongoClient("mongodb://localhost:27017/")
db = client["RiskRadar"]  # Ensure this matches the correct database name
threats_collection = db["threats"]

# 10 Sample threats
test_threats = [
    {
        "_id": ObjectId(),
        "title": "Phishing Email Campaign",
        "description": "Mass phishing attack targeting enterprise users.",
        "severity": "High",
        "type": "Phishing",
        "location": "New York",
        "date": datetime(2025, 3, 25, 10, 15, 0)
    },
    {
        "_id": ObjectId(),
        "title": "SQL Injection Attempt",
        "description": "Detected SQL injection attempt on login portal.",
        "severity": "Medium",
        "type": "Injection",
        "location": "California",
        "date": datetime(2025, 3, 26, 14, 30, 0)
    },
    {
        "_id": ObjectId(),
        "title": "Brute Force Attack",
        "description": "Repeated failed login attempts detected.",
        "severity": "Medium",
        "type": "Unauthorized Access",
        "location": "Texas",
        "date": datetime(2025, 3, 27, 8, 0, 0)
    },
    {
        "_id": ObjectId(),
        "title": "Malware Installation",
        "description": "Suspicious executable downloaded from an email attachment.",
        "severity": "High",
        "type": "Malware",
        "location": "Florida",
        "date": datetime(2025, 3, 28, 12, 45, 0)
    },
    {
        "_id": ObjectId(),
        "title": "Data Breach Alert",
        "description": "Customer data exposed on dark web forums.",
        "severity": "High",
        "type": "Data Leak",
        "location": "Illinois",
        "date": datetime(2025, 3, 29, 16, 20, 0)
    },
    {
        "_id": ObjectId(),
        "title": "DDoS Attack",
        "description": "Unusual traffic spike causing website downtime.",
        "severity": "High",
        "type": "Denial of Service",
        "location": "Washington",
        "date": datetime(2025, 3, 30, 9, 10, 0)
    },
    {
        "_id": ObjectId(),
        "title": "Ransomware Infection",
        "description": "System files encrypted, ransom note found.",
        "severity": "Low",
        "type": "Ransomware",
        "location": "Ohio",
        "date": datetime(2025, 4, 1, 22, 50, 0)
    },
    {
        "_id": ObjectId(),
        "title": "Zero-Day Exploit Detected",
        "description": "New vulnerability actively being exploited.",
        "severity": "Low",
        "type": "Exploit",
        "location": "Nevada",
        "date": datetime(2025, 4, 2, 11, 25, 0)
    },
    {
        "_id": ObjectId(),
        "title": "Suspicious Network Traffic",
        "description": "Unusual outbound traffic to foreign IP addresses.",
        "severity": "Medium",
        "type": "Network Anomaly",
        "location": "Georgia",
        "date": datetime(2025, 4, 3, 5, 35, 0)
    },
    {
        "_id": ObjectId(),
        "title": "Insider Threat",
        "description": "Employee accessed unauthorized confidential files.",
        "severity": "High",
        "type": "Unauthorized Access",
        "location": "Pennsylvania",
        "date": datetime(2025, 4, 4, 19, 55, 0)
    }
]

# Insert test threats
inserted = threats_collection.insert_many(test_threats)

print(f" {len(inserted.inserted_ids)} test threats successfully inserted!")
