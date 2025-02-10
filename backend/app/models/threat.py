from pydantic import BaseModel
from typing import Optional

class Threat(BaseModel):
    title: str
    description: str
    severity: str
    location: str
    cluster: Optional[str] = None  # Ensure this field exists

