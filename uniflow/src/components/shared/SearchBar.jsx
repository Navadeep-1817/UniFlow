import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Search...', suggestions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={placeholder}
        onFocus={() => setShowSuggestions(searchTerm.length > 0)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      <button className="search-button">🔍</button>
      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-item" onClick={() => onSearch(suggestion)}>
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
