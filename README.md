# Demo Table Application (Backend)

This project implements the backend for an Excel-like table application using FastAPI and SQLAlchemy with PostgreSQL.

## Features

- RESTful API for data operations
- PostgreSQL database for data storage
- Statistical calculations (average, standard deviation)

## Project Structure
Demo/
│
├── .venv/                 # Virtual environment (not tracked by git)
├── alembic/               # Database migration files
│   └── versions/          # Migration version files
├── api/
│   └── endpoints.py       # API route definitions
├── db/
│   └── database.py        # Database connection and session management
├── models/
│   └── models.py          # SQLAlchemy ORM models
├── schemas/
│   └── schemas.py         # Pydantic models for request/response validation
├── alembic.ini            # Alembic configuration file
├── main.py                # FastAPI application entry point
├── requirements.txt       # Project dependencies
└── test_api.py         # pytest tests for the API

## Setup

1. Clone the repository: 
  ```
   git clone 
  ```
2. Navigate to the project directory: 
  ```
   cd Demo
  ```
3. Create a virtual environment:
  ```
   python -m venv venv
  ```
4. Activate the virtual environment:
- On Windows: 
  ```
  venv\Scripts\activate
  ```
- On macOS and Linux: 
  ```
  source venv/bin/activate
  ```
5. Install dependencies:
  ```
  pip install -r requirements.txt
  ```
6. Set up PostgreSQL:
- Configure your database connection URL in `alembic.ini` and `db/database.py`
- Run database migrations:
  ```
  alembic upgrade head
  ```
7. Run the application:
  ```
  uvicorn main:app --reload
  ```

The server will start at `http://localhost:8000`.

## API Documentation

Once the server is running, you can access the automatic API documentation:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing

You can use the `test_api.py` file to test the API endpoints. This file is compatible with REST Client extensions in various IDEs.
you can run the tests with:
  ```
  pytest test_api.py
  ```


## License

This project is licensed under the [MIT License](LICENSE).
