#!/bin/bash
source ../venv/bin/activate  # Activates the virtual environment
cd ../backend/app            # Navigates to backend folder
uvicorn main:app --reload # Starts FastAPI backend server
