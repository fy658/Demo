from pydantic import BaseModel
from typing import Optional


class DataItem(BaseModel):
    id: Optional[int] = None
    customer: str
    product: str
    length1: float
    length2: float
    length3: float
    width1: float
    width2: float
    width3: float
