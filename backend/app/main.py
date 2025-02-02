from fastapi import FastAPI

app = FastAPI()  # ✅ This is required for Uvicorn to recognize the app

@app.get("/")
def read_root():
    return {"message": "Welcome to Risk Radar!"}
