import React, { useState, useEffect, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import { HyperFormula } from 'hyperformula';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import { fetchData, saveData } from '../services/api';

// Register all Handsontable modules
registerAllModules();

const SpreadsheetComponent = () => {
  // State for storing the current data and the original data for comparison
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  // Ref for accessing the Handsontable instance
  const hotRef = useRef(null);

  // Load data when the component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Function to fetch data from the API
  const loadData = async () => {
    const fetchedData = await fetchData();
    setData(fetchedData.length > 0 ? fetchedData : [createEmptyRow()]);
    setOriginalData(fetchedData.length > 0 ? JSON.parse(JSON.stringify(fetchedData)) : []);
  };

  // Function to create an empty row
  const createEmptyRow = () => ({
    customer: '',
    product: '',
    length1: null,
    length2: null,
    length3: null,
    width1: null,
    width2: null,
    width3: null,
  });

  // Column definitions for the table
  const columns = [
    { data: 'customer', type: 'text' },
    { data: 'product', type: 'text' },
    { data: 'length1', type: 'numeric', numericFormat: { pattern: '0,0.00' } },
    { data: 'length2', type: 'numeric', numericFormat: { pattern: '0,0.00' } },
    { data: 'length3', type: 'numeric', numericFormat: { pattern: '0,0.00' } },
    { data: 'width1', type: 'numeric', numericFormat: { pattern: '0,0.00' } },
    { data: 'width2', type: 'numeric', numericFormat: { pattern: '0,0.00' } },
    { data: 'width3', type: 'numeric', numericFormat: { pattern: '0,0.00' } },
  ];

  // Handler for changes in the table
  const handleAfterChange = (changes, source) => {
    if (source === 'loadData') return;

    if (changes) {
      const updatedData = [...data];
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (!updatedData[row]) {
          updatedData[row] = createEmptyRow();
        }
        updatedData[row][prop] = newValue;
      });

      setData(updatedData);
    }
  };

  // Function to validate the data
  const validateData = () => {
    const hot = hotRef.current.hotInstance;
    const errors = [];

    data.forEach((row, rowIndex) => {
      columns.forEach((column, columnIndex) => {
        const cellValue = hot.getDataAtCell(rowIndex, columnIndex);
        const isFormula = typeof cellValue === 'string' && cellValue.startsWith('=');

        if (column.type === 'numeric') {
          let valueToValidate = cellValue;
          if (isFormula) {
            // Get the calculated value for formula cells
            valueToValidate = hot.getSourceDataAtCell(rowIndex, columnIndex);
          }

          if (valueToValidate !== null && valueToValidate !== '') {
            const numValue = parseFloat(valueToValidate);
            if (isNaN(numValue) || numValue < 0) {
              errors.push(`Invalid value at row ${rowIndex + 1}, column ${column.data}`);
              hot.setCellMeta(rowIndex, columnIndex, 'className', 'htInvalid');
            } else {
              hot.setCellMeta(rowIndex, columnIndex, 'className', '');
            }
          }
        }
      });
    });

    hot.render();
    return errors;
  };

  // Handler for saving data
  const handleSave = async () => {
    const hot = hotRef.current.hotInstance;
    const errors = validateData();

    if (errors.length > 0) {
      alert(`Invalid data entries:\n${errors.join('\n')}`);
    } else {
      try {
        // Prepare data for saving, including calculated values from formulas
        const dataToSave = data.map((row, rowIndex) => {
          const updatedRow = { ...row };
          columns.forEach((column, columnIndex) => {
            const cellValue = hot.getDataAtCell(rowIndex, columnIndex);
            const isFormula = typeof cellValue === 'string' && cellValue.startsWith('=');
            if (isFormula) {
              // Get the calculated value for formula cells
              updatedRow[column.data] = hot.getSourceDataAtCell(rowIndex, columnIndex);
            } else {
              updatedRow[column.data] = cellValue;
            }
          });
          return updatedRow;
        });

        // Filter out unchanged and empty rows
        const changedData = dataToSave.filter((row, index) => {
          const isRowCompletelyEmpty = Object.values(row).every(value => value === '' || value === null);
          const hasChanges = index >= originalData.length ||
            JSON.stringify(row) !== JSON.stringify(originalData[index]);
          return !isRowCompletelyEmpty && hasChanges;
        });

        if (changedData.length > 0) {
          console.log("Data to be sent:", { items: changedData });
          await saveData({ items: changedData });
          alert('Data saved successfully');
          setOriginalData(JSON.parse(JSON.stringify(dataToSave)));
          setData(dataToSave);
        } else {
          alert('No changes to save');
        }
      } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data');
      }
    }
  };

  // Settings for the Handsontable instance
  const hotSettings = {
    data: data,
    columns: columns,
    colHeaders: ['Customer', 'Product', 'Length1', 'Length2', 'Length3', 'Width1', 'Width2', 'Width3'],
    rowHeaders: true,
    afterChange: handleAfterChange,
    licenseKey: 'non-commercial-and-evaluation',
    contextMenu: true,
    copyPaste: true,
    minSpareRows: 1,
    autoWrapRow: true,
    fillHandle: true,
  };

  // Render the component
  return (
    <div className="spreadsheet-container">
      <HotTable
        formulas={{
          engine: HyperFormula,
        }}
        stretchH="all"
        height={500}
        autoWrapRow={true}
        autoWrapCol={true}
        settings={hotSettings}
        ref={hotRef}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default SpreadsheetComponent;