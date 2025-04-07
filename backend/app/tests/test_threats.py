import pytest
from fastapi.testclient import TestClient
from datetime import datetime
from bson import ObjectId
from backend.main import app  # Explicit import from the `app` package

# Initialize test client
client = TestClient(app)

# Sample data for testing
sample_threat = {
    "title": "Phishing Attempt",
    "description": "Fake email detected",
    "severity": "High",
    "location": "New York",
    "type": "Phishing",
    "timestamp": datetime.utcnow().isoformat()
}

@pytest.fixture
def create_test_threat():
    """Fixture to create a test threat before running tests."""
    response = client.post("/threats/", json=sample_threat)
    assert response.status_code == 200
    return response.json()["id"]

def test_get_all_threats():
    """Test retrieving all threats"""
    response = client.get("/threats/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_threat():
    """Test creating a new threat"""
    response = client.post("/threats/", json=sample_threat)
    assert response.status_code == 200
    assert "id" in response.json()

def test_create_threat_missing_fields():
    """Test creating a threat with missing required fields"""
    incomplete_threat = {
        "title": "Incomplete Threat",
        "severity": "Medium",
    }
    response = client.post("/threats/", json=incomplete_threat)
    assert response.status_code == 400
    assert "detail" in response.json()

def test_get_specific_threat(create_test_threat):
    """Test retrieving a specific threat by ID"""
    threat_id = create_test_threat
    response = client.get(f"/threats/{threat_id}")
    assert response.status_code == 200
    assert response.json()["_id"] == threat_id

def test_update_threat(create_test_threat):
    """Test updating an existing threat"""
    threat_id = create_test_threat
    updated_data = {"description": "Updated description", "severity": "Medium"}
    response = client.put(f"/threats/{threat_id}", json=updated_data)
    assert response.status_code == 200
    assert response.json()["updated_threat"]["description"] == "Updated description"
    assert response.json()["updated_threat"]["severity"] == "Medium"

def test_update_nonexistent_threat():
    """Test updating a threat that does not exist"""
    invalid_id = str(ObjectId())  # Generate a random ObjectId
    response = client.put(f"/threats/{invalid_id}", json={"description": "New Desc"})
    assert response.status_code == 404

def test_delete_threat(create_test_threat):
    """Test deleting a specific threat"""
    threat_id = create_test_threat
    response = client.delete(f"/threats/{threat_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Threat deleted successfully"

def test_delete_nonexistent_threat():
    """Test deleting a threat that does not exist"""
    invalid_id = str(ObjectId())
    response = client.delete(f"/threats/{invalid_id}")
    assert response.status_code == 404

def test_filter_threats():
    """Test filtering threats by severity and location"""
    response = client.get("/threats/?severity=High&location=New York")
    assert response.status_code == 200
    threats = response.json()
    if threats:
        for threat in threats:
            assert threat["severity"] == "High"
            assert threat["location"] == "New York"