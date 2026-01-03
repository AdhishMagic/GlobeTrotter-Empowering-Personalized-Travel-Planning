import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';


const SearchBar = ({ onSearch, suggestions = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery?.length > 0) {
      const filtered = suggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered?.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon name="Search" size={20} color="var(--color-muted-foreground)" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e?.target?.value)}
          placeholder="Search activities, restaurants, attractions..."
          className="w-full pl-12 pr-12 py-3 md:py-4 bg-background border border-border rounded-lg text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-ring focus:border-ring transition-base"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted transition-base focus-ring"
            aria-label="Clear search"
          >
            <Icon name="X" size={18} color="var(--color-muted-foreground)" />
          </button>
        )}
      </div>
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50 animate-slide-down">
          {filteredSuggestions?.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted transition-base flex items-center space-x-3 focus-ring"
            >
              <Icon name="Search" size={16} color="var(--color-muted-foreground)" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;