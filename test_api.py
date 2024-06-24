import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app  # assuming your FastAPI app is in main.py
from db.database import Base, get_db
from models.models import Data

# Setup test database
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:123456@localhost/handle_data"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables in the test database
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Test data
test_item = {
    "customer": "Test Customer",
    "product": "Test Product",
    "length1": 10.0,
    "length2": 20.0,
    "length3": 30.0,
    "width1": 5.0,
    "width2": 15.0,
    "width3": 25.0
}

# Tests
def test_create_data():
    response = client.post("/api/data/", json=test_item)
    assert response.status_code == 200
    assert "id" in response.json()
    assert response.json()["message"] == "Data saved successfully"

def test_get_data():
    response = client.get("/api/data/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    if len(response.json()) > 0:
        assert "customer" in response.json()[0]

def test_update_data():
    # First, create an item
    create_response = client.post("/api/data/", json=test_item)
    item_id = create_response.json()["id"]

    # Now update it
    updated_item = test_item.copy()
    updated_item["customer"] = "Updated Customer"
    updated_item["id"] = item_id
    update_response = client.post("/api/data/", json=updated_item)
    assert update_response.status_code == 200
    assert update_response.json()["message"] == "Data saved successfully"

    # Verify the update
    get_response = client.get("/api/data/")
    updated_item_in_response = next((item for item in get_response.json() if item["id"] == item_id), None)
    assert updated_item_in_response["customer"] == "Updated Customer"

def test_get_stats():
    # Ensure there's data in the database
    client.post("/api/data/", json=test_item)

    response = client.get("/api/stats/")
    assert response.status_code == 200
    assert "average" in response.json()
    assert "standardDeviation" in response.json()

def test_get_stats_no_data():
    # Clear the database
    db = next(override_get_db())
    db.query(Data).delete()
    db.commit()

    response = client.get("/api/stats/")
    assert response.status_code == 404
    assert response.json()["detail"] == "No data available"

# Run this after all tests to clean up
@pytest.fixture(autouse=True, scope="module")
def cleanup():
    yield
    db = next(override_get_db())
    db.query(Data).delete()
    db.commit()