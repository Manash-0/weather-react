import useWeather from './hooks/useWeather';
import useMood from './hooks/useMood';
import WeatherScene from './components/WeatherScene';
import MoodOverlay from './components/MoodOverlay';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastStrip from './components/ForecastStrip';
import ChatAssistant from './components/ChatAssistant';
import './index.css';
import './styles/components.css';

function App() {
  const { current, condition, forecast, locationName, loading, error, searchByCity, autoLocate } = useWeather();
  const mood = useMood(condition);

  return (
    <div className="app-root" style={{ '--text-color': mood?.textColor || '#c0c0e0' }}>
      {/* 3D Background Scene */}
      <WeatherScene mood={mood} />

      {/* Atmospheric color overlay */}
      <MoodOverlay mood={mood} />

      {/* UI Layer — floating over the 3D scene */}
      <div className="ui-layer">
        {/* Header */}
        <header className="app-header">
          <div className="app-logo">
            <span className="material-symbols-outlined logo-icon">thunderstorm</span>
            <h1 className="app-title">STORMFRONT</h1>
          </div>
          <SearchBar onSearch={searchByCity} onAutoLocate={autoLocate} mood={mood} loading={loading} />
        </header>

        {/* Error display */}
        {error && (
          <div className="error-toast glass-panel">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Main content */}
        <main className="main-content">
          <CurrentWeather current={current} locationName={locationName} mood={mood} />
          <ForecastStrip forecast={forecast} mood={mood} />
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <span>STORMFRONT</span>
          <span className="footer-divider">·</span>
          <span>Live 3D Weather</span>
        </footer>
      </div>

      {/* Chat assistant — floats independently */}
      <ChatAssistant mood={mood} />
    </div>
  );
}

export default App;
