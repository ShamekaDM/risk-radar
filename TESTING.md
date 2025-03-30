# Risk Radar Testing Documentation

This document provides details on the unit and system tests performed on the Risk Radar application.

---

## PDF Export API Test

### **Test Name:** `test_pdf_export`
- **Description:** Tests that the `/export_pdf/` API correctly generates a PDF report.
- **Test Steps:**
  1. Send a `GET` request to `/export_pdf/`
  2. Verify the response status is `200 OK`
  3. Ensure the response has `Content-Type: application/pdf`
  4. Validate that the PDF file is not empty
- **Expected Result:** The API successfully returns a valid, non-empty PDF file.
- **Test Status:** Passed on *[3-30-25]* (Test log below)
- **Status Code: 200
- **Content Type: application/pdf
- **PDF Size: 32KB

#### **Test Log**


---

## CSV Upload API Test (Planned)
### **Test Name:** `test_csv_upload`
- **Description:** Tests the `/upload_csv/` API to ensure proper CSV parsing and storage.
- **Test Steps:**
  1. Upload a valid CSV file
  2. Verify that the data is parsed correctly
  3. Ensure entries are stored in MongoDB
- **Expected Result:** Data should be successfully stored in the database.
- **Test Status:** *In Progress*

---

## **Test Summary**
| Test Name          | API Endpoint       | Status  | Last Run  |
|--------------------|-------------------|---------|-----------|
| `test_pdf_export` | `/export_pdf/`     |  Passed | *[3-30-25]*  |
| `test_csv_upload` | `/upload_csv/`     | In Progress | *[TBD]*  |

---

## Future Improvements
- Automate test execution with GitHub Actions
- Expand test coverage for error handling and invalid inputs
- Implement integration tests for API endpoints

---

## Notes
- All tests are executed using **pytest**
- Mock data is used for non-destructive testing
