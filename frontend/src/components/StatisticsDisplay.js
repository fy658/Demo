import React from 'react';

const StatisticsDisplay = ({ stats }) => {
  return (
    <div className="statistics-display">
      <h3>Statistics</h3>
      <table>
        <tbody>
          <tr>
            <td>Average:</td>
            <td>{stats.average ? stats.average.toFixed(2) : 'N/A'}</td>
          </tr>
          <tr>
            <td>Standard Deviation:</td>
            <td>{stats.standardDeviation ? stats.standardDeviation.toFixed(2) : 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsDisplay;