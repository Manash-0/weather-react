import { motion } from 'framer-motion';
import { getWeatherIcon } from '../utils/weatherIcons';

// Horizontal scrollable forecast strip with glassmorphic cards
export default function ForecastStrip({ forecast, mood }) {
  if (!forecast.length) return null;

  // Color-code temperature: cold → cool → warm → hot
  const getTempColor = (temp) => {
    if (temp <= 0) return '#7eb8d8';
    if (temp <= 10) return '#8ecae6';
    if (temp <= 20) return '#a8dadc';
    if (temp <= 30) return '#f4a261';
    return '#e76f51';
  };

  return (
    <motion.div
      className="forecast-strip glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ '--accent': mood?.uiAccent, '--glow': mood?.uiGlow }}
    >
      <h2 className="forecast-title">
        <span className="material-symbols-outlined">schedule</span>
        Hourly Forecast
      </h2>

      <div className="forecast-scroll">
        {forecast.map((item, idx) => {
          const time = new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          const temp = Math.round(item.main.temp);
          const condition = item.weather[0].main;
          const icon = getWeatherIcon(condition);

          return (
            <motion.div
              key={idx}
              className="forecast-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * idx, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="fc-time">{time}</div>
              <span className="material-symbols-outlined fc-icon">{icon}</span>
              <div className="fc-temp" style={{ color: getTempColor(temp) }}>
                {temp}°
              </div>
              <div className="fc-condition">{condition}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
