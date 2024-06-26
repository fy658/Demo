from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from db.database import get_db
from models.models import Data
from schemas.schemas import DataItem, BulkDataUpdate

# Create an instance of APIRouter
router = APIRouter()


# Define route to get all data
@router.get("/data/", response_model=List[DataItem])
async def get_data(db: Session = Depends(get_db)):
    # Query all Data records from the database
    data = db.query(Data).all()
    return data


# Define route to save data
@router.post("/data/bulk/")
async def bulk_update_data(bulk_data: BulkDataUpdate):
    # Get database session
    db = next(get_db())
    try:
        for item in bulk_data.items:
            if item.id:
                # Update existing item
                db_item = db.query(Data).filter(Data.id == item.id).first()
                if db_item:
                    for key, value in item.dict(exclude_unset=True).items():
                        setattr(db_item, key, value)
                else:
                    raise HTTPException(status_code=404, detail=f"Item with id {item.id} not found")
            else:
                # Create new item
                db_item = Data(**item.dict(exclude_unset=True))
                db.add(db_item)
        db.commit()
        return {"message": "Data updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
