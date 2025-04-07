from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database import db

client = TestClient(app)

def test_export_threats_as_pdf():
    # Insert a test threat into the database
    threat_id = db.threats.insert_one({
        "title": "Test Threat",
        "description": "This is a test threat.",
        "severity": "High",
        "type": "Phishing",
        "location": "New York",
        "date": "2025-03-24T01:52:08.309Z"
    }).inserted_id

    # Send request to export PDF
    response = client.get("/threats/export/pdf/")

    # Assertions
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert "Content-Disposition" in response.headers
    assert b"%PDF" in response.content[:10]  # Verify the content starts with '%PDF'

    # Clean up
    db.threats.delete_one({"_id": threat_id})