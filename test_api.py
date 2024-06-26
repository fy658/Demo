import pytest
from fastapi.testclient import TestClient
from main import app
from db.database import Base, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.models import Data

# Setup test database
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:123456@localhost/handle_data"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables in the test database
Base.metadata.create_all(bind=engine)


# Override the get_db dependency
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


def test_create_data():
    """Test creating new data"""
    response = client.post("/api/data/bulk/", json={"items": [test_item]})
    assert response.status_code == 200
    assert response.json()["message"] == "Data updated successfully"


def test_get_data():
    """Test retrieving all data"""
    response = client.get("/api/data/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    if len(response.json()) > 0:
        assert "customer" in response.json()[0]


def test_update_data():
    """Test updating existing data"""
    # First, create an item
    create_response = client.post("/api/data/bulk/", json={"items": [test_item]})
    assert create_response.status_code == 200

    # Get data to find the ID of the newly created item
    get_response = client.get("/api/data/")
    item_id = get_response.json()[0]["id"]

    # Update the item
    updated_item = test_item.copy()
    updated_item["id"] = item_id
    updated_item["customer"] = "Updated Customer"
    update_response = client.post("/api/data/bulk/", json={"items": [updated_item]})
    assert update_response.status_code == 200
    assert update_response.json()["message"] == "Data updated successfully"

    # Verify the update
    get_response = client.get("/api/data/")
    updated_item_in_response = next((item for item in get_response.json() if item["id"] == item_id), None)
    assert updated_item_in_response["customer"] == "Updated Customer"


def test_partial_update():
    """Test partial update of data"""
    # Create a new item
    create_response = client.post("/api/data/bulk/", json={"items": [test_item]})
    assert create_response.status_code == 200

    # Get data to find the ID of the newly created item
    get_response = client.get("/api/data/")
    item_id = get_response.json()[0]["id"]

    # Partially update the item
    partial_item = {
        "id": item_id,
        "customer": "Partial Update Customer"
    }
    update_response = client.post("/api/data/bulk/", json={"items": [partial_item]})
    assert update_response.status_code == 200

    # Verify the partial update
    get_response = client.get("/api/data/")
    updated_item = next((item for item in get_response.json() if item["id"] == item_id), None)
    assert updated_item["customer"] == "Partial Update Customer"
    assert updated_item["product"] == test_item["product"]  # Ensure other fields were not modified


def test_create_invalid_data():
    """Test creating invalid data (negative value)"""
    invalid_item = {
        "customer": "Invalid Customer",
        "product": "Invalid Product",
        "length1": -10.0  # Invalid negative value
    }
    response = client.post("/api/data/bulk/", json={"items": [invalid_item]})
    assert response.status_code == 422  # Unprocessable Entity


def test_create_empty_data():
    """Test creating empty data"""
    empty_item = {}
    response = client.post("/api/data/bulk/", json={"items": [empty_item]})
    assert response.status_code == 400  # Bad Request
    assert "must have at least one non-null field" in response.json()["detail"].lower()


# Clean up the database after all tests
# Run this after all tests to clean up
@pytest.fixture(autouse=True, scope="module")
def cleanup():
    # This code runs before the tests
    yield
    # This code runs after all tests in the module have completed
    db = next(override_get_db())
    try:
        # Delete all records from the Data table
        db.query(Data).delete()
        # Commit the transaction to save the changes
        db.commit()
    except Exception as e:
        # If an error occurs, rollback the transaction
        db.rollback()
        print(f"An error occurred during cleanup: {e}")
    finally:
        # Always close the database session
        db.close()