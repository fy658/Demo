from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from db.database import get_db
from models.models import Data
from schemas.schemas import DataItem
import statistics

# Create an instance of APIRouter
router = APIRouter()


# Define route to get all data
@router.get("/data/", response_model=List[DataItem])
async def get_data(db: Session = Depends(get_db)):
    # Query all Data records from the database
    data = db.query(Data).all()
    return data


# Define route to save data
@router.post("/data/")
async def save_data(item: DataItem):
    # Get database session
    db = next(get_db())

    # If item has no id, create a new record
    if item.id is None:
        db_item = Data(**item.dict(exclude={'id'}))
        db.add(db_item)
    else:
        # If id exists, try to update the existing record
        db_item = db.query(Data).filter(Data.id == item.id).first()
        if db_item:
            # Update all fields of the found record
            for key, value in item.dict(exclude={'id'}).items():
                setattr(db_item, key, value)
        else:
            # If no record with the given id is found, raise 404 error
            raise HTTPException(status_code=404, detail="Item not found")

    # Commit changes and refresh the database item
    db.commit()
    db.refresh(db_item)
    return {"message": "Data saved successfully", "id": db_item.id}


# Define route to get statistical data
@router.get("/stats/")
async def get_stats(db: Session = Depends(get_db)):
    # Get all data records
    data = db.query(Data).all()

    # Extract values from all numeric fields
    all_numbers = [
        getattr(item, field)
        for item in data
        for field in ['length1', 'length2', 'length3', 'width1', 'width2', 'width3']
    ]

    # If no data is available, raise 404 error
    if not all_numbers:
        raise HTTPException(status_code=404, detail="No data available")

    # Calculate and return average and standard deviation
    return {
        "average": statistics.mean(all_numbers),
        "standardDeviation": statistics.stdev(all_numbers) if len(all_numbers) > 1 else 0
    }
