import { useState } from 'react';
import { motion } from 'framer-motion';

// Glassmorphic search bar with city input and auto-locate
export default function SearchBar({ onSearch, onAutoLocate, mood, loading }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      className="search-bar-container"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="search-bar glass-panel" style={{ '--accent': mood?.uiAccent || '#6a6aaa', '--glow': mood?.uiGlow || 'rgba(106,106,170,0.3)' }}>
        <div className="search-input-wrapper">
          <span className="search-icon material-symbols-outlined">search</span>
          <input
            id="city-search-input"
            type="text"
            placeholder="Search any city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
            autoComplete="off"
          />
        </div>

        <button
          id="auto-locate-btn"
          className="icon-btn locate-btn"
          onClick={onAutoLocate}
          title="Detect my location"
          disabled={loading}
        >
          <span className="material-symbols-outlined">{loading ? 'progress_activity' : 'my_location'}</span>
        </button>

        <button
          id="search-submit-btn"
          className="search-submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>
    </motion.div>
  );
}
