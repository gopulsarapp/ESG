# engine/validators.py
from pydantic import BaseModel
from typing import Optional

class RawRecord(BaseModel):
    id: Optional[str] = None
    type: str
    site: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    fuel_type: Optional[str] = None
    scope: Optional[str] = None
    supplier: Optional[str] = None
    employee_id: Optional[str] = None
    hours: Optional[float] = None
    hire_date: Optional[str] = None
