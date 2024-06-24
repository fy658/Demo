import React, { useState, useEffect, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import { fetchData, saveData, fetchStats } from '../services/api';
import StatisticsDisplay from './StatisticsDisplay';
import './SpreadsheetComponent.css';

registerAllModules();

const SpreadsheetComponent = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const hotRef = useRef(null);

  useEffect(() => {
    loadData();
    loadStats();
  }, []);

  const loadData = async () => {
    const fetchedData = await fetchData();
    setData(fetchedData.length > 0 ? fetchedData : [createEmptyRow()]);
  };

  const loadStats = async () => {
    const fetchedStats = await fetchStats();
    setStats(fetchedStats);
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

  const handleAfterChange = async (changes, source) => {
    if (source === 'loadData') return;
  
    if (changes) {
      const updatedData = [...data];
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (!updatedData[row]) {
          updatedData[row] = { ...createEmptyRow(), id: null }; // 使用 null 作为新行的 id
        }
        updatedData[row][prop] = newValue;
      });
  
      setData(updatedData);
      await saveData(changes, updatedData);
      loadStats();
    }
  };

  const numericValidator = (value, callback) => {
    if (value === null || value === '') {
      callback(true);
    } else {
      callback(!isNaN(parseFloat(value)) && value >= 0);
    }
  };

  const hotSettings = {
    data: data,
    columns: columns,
    colHeaders: ['Customer', 'Product', 'Length1', 'Length2', 'Length3', 'Width1', 'Width2', 'Width3'],
    rowHeaders: true,
    width: '100%',
    height: 400,
    afterChange: handleAfterChange,
    licenseKey: 'non-commercial-and-evaluation',
    contextMenu: true,
    copyPaste: true,
    minSpareRows: 1,
    autoWrapRow: true,
    fillHandle: true,
    cells: function(row, col) {
      const cellProperties = {};
      if (col > 1) {
        cellProperties.validator = numericValidator;
      }
      return cellProperties;
    }
  };

  return (
    <div className="spreadsheet-container">
      <HotTable settings={hotSettings} ref={hotRef} />
      <StatisticsDisplay stats={stats} />
    </div>
  );
};

export default SpreadsheetComponent;