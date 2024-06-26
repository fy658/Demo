import React, { useState, useEffect, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import { HyperFormula } from 'hyperformula';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import { fetchData, saveData } from '../services/api';

registerAllModules();

const SpreadsheetComponent = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const hotRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const fetchedData = await fetchData();
    setData(fetchedData.length > 0 ? fetchedData : [createEmptyRow()]);
    setOriginalData(fetchedData.length > 0 ? JSON.parse(JSON.stringify(fetchedData)) : []);
  };

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

  const validateData = () => {
  const hot = hotRef.current.hotInstance;
  const errors = [];

  data.forEach((row, rowIndex) => {
    columns.forEach((column, columnIndex) => {
      // Only validate non-empty numeric fields
      if (column.type === 'numeric' && row[column.data] !== null && row[column.data] !== '') {
        const value = parseFloat(row[column.data]);
        if (isNaN(value) || value < 0) {
          errors.push(`Invalid value at row ${rowIndex + 1}, column ${column.data}`);
          hot.setCellMeta(rowIndex, columnIndex, 'className', 'htInvalid');
        } else {
          hot.setCellMeta(rowIndex, columnIndex, 'className', '');
        }
      }
    });
  });

  // Render the table to reflect the validation changes
  hot.render();
  return errors;
};

  const handleSave = async () => {
  const errors = validateData();
  if (errors.length > 0) {
    alert(`Invalid data entries:\n${errors.join('\n')}`);
  } else {
    try {
      const changedData = data
        .filter((row, index) => {
          // Check if the row is completely empty
          const isRowCompletelyEmpty = Object.values(row).every(value => value === '' || value === null);
          // Check if the row has any changes compared to the original data
          const hasChanges = index >= originalData.length ||
            Object.keys(row).some(key => row[key] !== originalData[index]?.[key]);

          // Keep rows that are not completely empty and have changes
          return !isRowCompletelyEmpty && hasChanges;
        })
        .map(row => {
          // Create a new object, keeping all non-undefined values, including empty strings and null
          const cleanRow = Object.fromEntries(
            Object.entries(row).filter(([_, value]) => value !== undefined)
          );

          // Convert numeric fields to number type, but only for non-empty values
          ['length1', 'length2', 'length3', 'width1', 'width2', 'width3'].forEach(field => {
            if (field in cleanRow && cleanRow[field] !== '' && cleanRow[field] !== null) {
              cleanRow[field] = parseFloat(cleanRow[field]);
            }
          });

          return cleanRow;
        });

      if (changedData.length > 0) {
        console.log("Data to be sent:", { items: changedData });
        // Send the changed data to the server
        await saveData({ items: changedData });
        alert('Data saved successfully');
        // Update the original data to reflect the current state
        setOriginalData(JSON.parse(JSON.stringify(data)));
      } else {
        alert('No changes to save');
      }
    } catch (error) {
      alert('Error saving data');
      console.error('Error saving data:', error);
    }
  }
};

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