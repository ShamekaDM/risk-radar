from pymongo import MongoClient
import random

# Connect to MongoDB
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["risk-radar-db"]
threats_collection = db["threats"]

# List of U.S. states with sample coordinates
US_LOCATIONS = [
    {"state": "California", "latitude": 36.7783, "longitude": -119.4179},
    {"state": "Texas", "latitude": 31.9686, "longitude": -99.9018},
    {"state": "Florida", "latitude": 27.9944, "longitude": -81.7603},
    {"state": "New York", "latitude": 40.7128, "longitude": -74.0060},
    {"state": "Illinois", "latitude": 40.6331, "longitude": -89.3985},
    {"state": "Washington", "latitude": 47.7511, "longitude": -120.7401},
    {"state": "Georgia", "latitude": 32.1656, "longitude": -82.9001},
    {"state": "Ohio", "latitude": 40.4173, "longitude": -82.9071},
    {"state": "Colorado", "latitude": 39.5501, "longitude": -105.7821},
    {"state": "Nevada", "latitude": 38.8026, "longitude": -116.4194}
]

# Fetch all threats and update their locations randomly
threats = list(threats_collection.find())

for threat in threats:
    random_location = random.choice(US_LOCATIONS)
    threats_collection.update_one(
        {"_id": threat["_id"]},
        {"$set": {
            "location": random_location["state"],
            "latitude": random_location["latitude"],
            "longitude": random_location["longitude"]
        }}
    )

print("Threat locations have been successfully randomized.")