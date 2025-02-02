# Risk Radar
**AI-Powered Threat Map for Real-Time Cybersecurity Monitoring**

## 📌 Project Overview
Risk Radar is an AI-driven threat visualization system that maps real-time cybersecurity threats using machine learning and geospatial data.

## 📂 Project Structure
risk-radar/ ├── backend/ # FastAPI backend API ├── frontend/ # React frontend ├── database/ # PostgreSQL database setup & test data ├── scripts/ # Shell scripts for automation

## 🚀 Setup Instructions
### 1. Install Dependencies
pip install -r backend/requirements.txt cd frontend && npm install

### 2. Run the Backend
cd scripts sh run_server.sh

### 3. Run the Frontend
cd frontend npm start

### 4. Run Database Setup (If Not Already Configured)
cd scripts sh setup_db.sh

## ✅ Features
- Real-time threat map visualization
- AI-powered clustering of threat data
- Secure authentication with OAuth
- REST API for external data integrations
- Automated deployment with CI/CD
