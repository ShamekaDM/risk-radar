from pydantic import BaseModel
from typing import Optional

class Threat(BaseModel):
    title: str
    description: str
    severity: str
    location: str
    timestamp: Optional[str] = None
