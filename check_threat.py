from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["RiskRadar"]
threats_collection = db["threats"]

# Fetch and print all threats
threats = threats_collection.find()

print("Full Threat Data in MongoDB:")
found_any = False
for threat in threats:
    print(threat)  # This will print each document, including _id format
    found_any = True

if not found_any:
    print("No threats found in the database.")
