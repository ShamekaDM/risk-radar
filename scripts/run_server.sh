#!/bin/bash
# Ensure script is run from the project root
cd "$(dirname "$0")/.."

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "Virtual environment not found! Creating it now..."
    python3 -m venv venv
    source venv/bin/activate
fi

# Start backend servercd backend
uvicorn app.main:app --reload
#!/bin/bash
source venv/bin/activate  # Activate virtual environment
cd backend                # Navigate to the backend folder
uvicorn app.main:app --reload  # Start FastAPI server
#!/bin/bash
source venv/bin/activate  # Activate virtual environment
cd backend
uvicorn app.main:app --reload  # Run FastAPI server
