import React, { useState } from 'react';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filter-panel">
      <h3>Filters</h3>
      {filters.map((filter) => (
        <div key={filter.key} className="filter-group">
          <label>{filter.label}</label>
          {filter.type === 'select' && (
            <select onChange={(e) => handleFilterChange(filter.key, e.target.value)}>
              <option value="">All</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {filter.type === 'date' && (
            <input
              type="date"
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            />
          )}
        </div>
      ))}
      <button onClick={() => setActiveFilters({})}>Clear Filters</button>
    </div>
  );
};

export default FilterPanel;
