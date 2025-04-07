import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.main import app
import pytest
import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Sample CSV data for testing (formatted correctly)
VALID_CSV_CONTENT = b"title,description,severity,type,location,date\nThreat1,Test threat,High,Ransomware,California,2025-03-25T12:00:00"
INVALID_CSV_CONTENT = b"invalid_field1,invalid_field2\nData1,Data2"
EMPTY_CSV_CONTENT = b""

def test_successful_csv_upload():
    """Test successful CSV file upload"""
    files = {"file": ("test.csv", io.BytesIO(VALID_CSV_CONTENT), "text/csv")}
    response = client.post("/threats/upload_csv/", files=files)
    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"].startswith("CSV uploaded successfully")

    
def test_invalid_csv_format():
    """Test uploading a CSV with invalid format"""
    files = {"file": ("test.csv", io.BytesIO(INVALID_CSV_CONTENT), "text/csv")}
    response = client.post("/threats/upload_csv/", files=files)
    assert response.status_code == 400
    assert "detail" in response.json()
    assert "Invalid CSV format. Missing required columns." in response.json()["detail"]


def test_empty_csv_upload():
    """Test uploading an empty CSV file"""
    files = {"file": ("empty.csv", io.BytesIO(EMPTY_CSV_CONTENT), "text/csv")}
    response = client.post("/threats/upload_csv/", files=files)
    assert response.status_code == 400
    assert "detail" in response.json()
    assert response.json()["detail"] == "CSV file is empty"  # Ensure test matches actual response

def test_missing_file():
    """Test sending request without a file"""
    response = client.post("/threats/upload_csv/")
    assert response.status_code == 400  # Now checking for 400 Bad Request
    assert response.json()["detail"] == "No file was provided"
