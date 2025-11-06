import React, { useState } from 'react';

const Table = ({ columns, data, sortable = true, filterable = true }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterText, setFilterText] = useState('');

  const handleSort = (key) => {
    if (!sortable) return;
    
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getFilteredData = () => {
    const sorted = getSortedData();
    if (!filterText) return sorted;
    
    return sorted.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  };

  return (
    <div className="table-container">
      {filterable && (
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="table-filter"
        />
      )}
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} onClick={() => handleSort(column.key)}>
                {column.label}
                {sortable && sortConfig.key === column.key && (
                  <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getFilteredData().map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
