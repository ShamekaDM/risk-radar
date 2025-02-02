#!/bin/bash
source ../venv/bin/activate  # Activates the virtual environment
cd ../database               # Navigates to database folder

# Apply database migrations (this assumes Alembic or a similar tool)
alembic upgrade head  

# Seed test data
python seed_data.py  

echo "Database setup complete!"
