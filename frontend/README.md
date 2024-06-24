# Excel-like App Frontend

This is the frontend for the Excel-like Demo application, built with React and Handsontable.

## Setup

1. Install dependencies:
    npm install
2. Start the development server:
    npm start
The application will be running at `http://localhost:3000`.

## Project Structure

- `src/`: Source files
- `components/`: React components
 - `SpreadsheetComponent.js`: Main spreadsheet component
 - `SpreadsheetComponent.css`: Main spreadsheet component css
 - `StatisticsDisplay.js`: Component to display statistics
- `services/`: API services
 - `api.js`: Functions for API calls
- `App.js`: Main App component
- `index.js`: Entry point

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production

## Dependencies

- React
- Handsontable
- Axios

Make sure the backend server is running at `http://localhost:8000` before starting the frontend application.