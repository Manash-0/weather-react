import { useState, useCallback, useEffect } from 'react';

export default function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processResponse = useCallback(async (response) => {
    const data = await response.json();
    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }
    setWeatherData(data);
    setLocationName(data.locationName || 'Unknown');
    setError(null);
    setLoading(false);
  }, []);

  const searchByCity = useCallback(async (city) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });
      await processResponse(res);
    } catch (err) {
      setError('Failed to fetch weather data');
      setLoading(false);
    }
  }, [processResponse]);

  const searchByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/weather-by-coords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon }),
      });
      await processResponse(res);
    } catch (err) {
      setError('Failed to fetch location weather');
      setLoading(false);
    }
  }, [processResponse]);

  const autoLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    setLocationName('Detecting location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => searchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => {
        setError('Location access denied');
        setLoading(false);
      }
    );
  }, [searchByCoords]);

  // Auto-locate on mount
  useEffect(() => {
    autoLocate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = weatherData?.list?.[0] || null;
  const condition = current?.weather?.[0]?.main || null;
  const forecast = weatherData?.list?.slice(0, 12) || [];

  return {
    weatherData,
    current,
    condition,
    forecast,
    locationName,
    loading,
    error,
    searchByCity,
    searchByCoords,
    autoLocate,
  };
}
