/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useGeocoding } from '../hooks/useGeocoding';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { locations, loading, searchLocations } = useGeocoding();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchLocations(query);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectLocation = (location: string) => {
    setQuery(location);
    onSearch(location);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onFocus={() => query.trim() && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <FiSearch className="absolute left-3 top-2.5 text-white/70" size={20} />
        
        {showSuggestions && (
          <div className="absolute z-10 mt-1 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-2 text-center text-white/70">Loading...</div>
            ) : locations.length > 0 ? (
              locations.map((location, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-white/20 cursor-pointer"
                  onMouseDown={() => handleSelectLocation(`${location.name}, ${location.country}`)}
                >
                  {location.name}, {location.country} {location.state ? `, ${location.state}` : ''}
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-white/70">No locations found</div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}