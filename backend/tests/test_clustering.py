from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database import db

client = TestClient(app)

def test_threat_clustering():
    # Insert sample threats
    db.threats.insert_many([
        {
            "title": "Test Threat 1",
            "description": "Desc",
            "severity": "High",
            "type": "Phishing",
            "location": "California",
            "date": "2025-03-30T00:00:00"
        },
        {
            "title": "Test Threat 2",
            "description": "Desc",
            "severity": "Medium",
            "type": "Malware",
            "location": "New York",
            "date": "2025-03-30T00:00:00"
        },
        {
            "title": "Test Threat 3",
            "description": "Desc",
            "severity": "Low",
            "type": "Ransomware",
            "location": "Texas",
            "date": "2025-03-30T00:00:00"
        }
    ])

    # Call clustering endpoint
    response = client.get("/threats/clusters?k=2")
    assert response.status_code == 200
    data = response.json()

    # Confirm all entries have cluster labels
    assert isinstance(data, list)
    assert all("cluster" in threat for threat in data)
    assert len(data) >= 3  # At least the inserted threats

    # Clean up test data
    db.threats.delete_many({"title": {"$regex": "Test Threat"}})