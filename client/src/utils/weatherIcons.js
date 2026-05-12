// Weather icon mapping — Material Symbols names for each OpenWeatherMap condition
const iconMap = {
  Clear: 'sunny',
  Clouds: 'cloud',
  Rain: 'rainy',
  Drizzle: 'rainy_light',
  Thunderstorm: 'thunderstorm',
  Snow: 'ac_unit',
  Mist: 'foggy',
  Haze: 'dehaze',
  Fog: 'foggy',
  Smoke: 'blur_on',
  Dust: 'blur_on',
  Sand: 'blur_on',
  Ash: 'blur_on',
  Squall: 'air',
  Tornado: 'tornado',
};

export function getWeatherIcon(condition) {
  return iconMap[condition] || 'device_unknown';
}

export default iconMap;
