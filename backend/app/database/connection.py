from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get MongoDB connection string from .env
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = "risk-radar-db"  # Update if using a different database name

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

print("✅ Connected to MongoDB successfully!")
