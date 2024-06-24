import React from 'react';
import './App.css';
import SpreadsheetComponent from './components/SpreadsheetComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Excel-like App</h1>
      </header>
      <main>
        <SpreadsheetComponent />
      </main>
    </div>
  );
}

export default App;