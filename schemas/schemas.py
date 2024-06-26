from pydantic import BaseModel, Field
from typing import List, Optional


class DataItem(BaseModel):
    id: Optional[int] = None
    customer: Optional[str] = None
    product: Optional[str] = None
    length1: Optional[float] = Field(None, ge=0)
    length2: Optional[float] = Field(None, ge=0)
    length3: Optional[float] = Field(None, ge=0)
    width1: Optional[float] = Field(None, ge=0)
    width2: Optional[float] = Field(None, ge=0)
    width3: Optional[float] = Field(None, ge=0)

    class Config:
        orm_mode = True


class BulkDataUpdate(BaseModel):
    items: List[DataItem]
