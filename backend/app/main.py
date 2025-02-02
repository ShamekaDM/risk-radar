from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.threats import router as threat_router

app = FastAPI()

# ✅ Fix: Allow frontend requests from http://localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(threat_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Risk Radar!"}
