import { motion, AnimatePresence } from 'framer-motion';

// Current weather display — large temperature, condition, location, and details
export default function CurrentWeather({ current, locationName, mood }) {
  if (!current) {
    return (
      <motion.div
        className="current-weather-card glass-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ '--accent': mood?.uiAccent, '--glow': mood?.uiGlow }}
      >
        <div className="cw-empty">
          <span className="cw-empty-icon material-symbols-outlined">cloud_off</span>
          <p>Search a city to see weather</p>
        </div>
      </motion.div>
    );
  }

  const temp = Math.round(current.main.temp);
  const feelsLike = Math.round(current.main.feels_like);
  const description = current.weather[0].description;
  const humidity = current.main.humidity;
  const windSpeed = Math.round(current.wind.speed * 3.6); // m/s → km/h
  const pressure = current.main.pressure;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={locationName}
        className="current-weather-card glass-panel"
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ '--accent': mood?.uiAccent, '--glow': mood?.uiGlow }}
      >
        {/* Location */}
        <div className="cw-location">
          <span className="material-symbols-outlined">location_on</span>
          <span>{locationName}</span>
        </div>

        {/* Main temperature */}
        <div className="cw-temp-row">
          <div className="cw-temp">
            <span className="cw-temp-value">{temp}</span>
            <span className="cw-temp-unit">°C</span>
          </div>
          <div className="cw-mood-emoji">{mood?.emoji || '🌍'}</div>
        </div>

        {/* Condition */}
        <div className="cw-description">{description}</div>

        {/* Details grid */}
        <div className="cw-details">
          <div className="cw-detail-item">
            <span className="material-symbols-outlined">thermostat</span>
            <span className="cw-detail-label">Feels like</span>
            <span className="cw-detail-value">{feelsLike}°C</span>
          </div>
          <div className="cw-detail-item">
            <span className="material-symbols-outlined">humidity_percentage</span>
            <span className="cw-detail-label">Humidity</span>
            <span className="cw-detail-value">{humidity}%</span>
          </div>
          <div className="cw-detail-item">
            <span className="material-symbols-outlined">air</span>
            <span className="cw-detail-label">Wind</span>
            <span className="cw-detail-value">{windSpeed} km/h</span>
          </div>
          <div className="cw-detail-item">
            <span className="material-symbols-outlined">compress</span>
            <span className="cw-detail-label">Pressure</span>
            <span className="cw-detail-value">{pressure} hPa</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
