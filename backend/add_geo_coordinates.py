from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["RiskRadar"]
threats_collection = db["threats"]

# Sample hardcoded mapping for demo (should use a real geocoding service in production)
sample_coords = [
    ("California", 36.7783, -119.4179),
    ("New York", 40.7128, -74.0060),
    ("Texas", 31.9686, -99.9018),
    ("Florida", 27.9944, -81.7603),
    ("Illinois", 40.6331, -89.3985),
]

# Iterate through threats and add lat/lon if missing
for threat in threats_collection.find({"latitude": {"$exists": False}}):
    location = threat.get("location", "")
    match = next(((loc, lat, lon) for loc, lat, lon in sample_coords if loc == location), None)
    
    if match:
        _, lat, lon = match
        threats_collection.update_one(
            {"_id": threat["_id"]},
            {"$set": {"latitude": lat, "longitude": lon}}
        )

print("Coordinate update complete.")