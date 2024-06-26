# Demo Table App Frontend

This is the frontend for the Excel-like Demo application, built with React, Handsontable and powered by HyperFormula for calculations.

## Project Structure
```
frontend/
│
├── src/: Source files
│   └── components/: React components
│       └── SpreadsheetComponent.js: Main spreadsheet component
├── services/: API services
│       └──  api.js: Functions for API calls
├── App.js: Main App component
├── index.js: Entry point
```
## Features:

1. **Spreadsheet Interface**: Uses HandsonTable to create a familiar Excel-like grid.
2. **Formula Support**: Integrates HyperFormula to enable Excel-style formulas (e.g., `=AVERAGE(C1:C5)` as shown in the image).
3. **Data Types**: Supports various data types including text, numbers, and formulas.
4. **Calculations**: Performs real-time calculations, including averages and standard deviations.

## How to Use:

1. Enter data into cells just like in Excel.
2. Use formulas by starting with an equals sign (=). For example:
   - `=AVERAGE(C1:C5)` calculates the average of cells C1 through C5.
   - `=STDEV(C1:C5)` calculates the standard deviation (as seen in row 7).
3. The app will automatically recalculate results when data or formulas change.

## Technical Details:

- HandsonTable provides the interactive grid interface.
- HyperFormula powers the calculation engine, allowing for complex formula evaluations.
- The combination offers a lightweight, web-based alternative to traditional spreadsheet applications.

For more information on implementation and advanced features, please refer to the HandsonTable and HyperFormula documentation.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production

## Dependencies

- React
- Handsontable
- Axios

Make sure the backend server is running at `http://localhost:8000` before starting the frontend application.