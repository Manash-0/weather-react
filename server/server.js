require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const axios = require('axios');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

// Initialize AI only if API key is available
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
  console.warn('WARNING: GEMINI_API_KEY not found. AI chat will be disabled.');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// API Routes
app.post('/api/weather', async (req, res) => {
  const { city } = req.body;
  const apiKey = process.env.WEATHER_API_KEY;

  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const geoRes = await axios.get(geoUrl);

    if (!geoRes.data.length) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { lat, lon, name, country } = geoRes.data[0];
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastRes = await axios.get(forecastUrl);

    if (forecastRes.data.cod !== "200") {
      return res.status(400).json({ error: 'Weather data not available' });
    }

    const result = { ...forecastRes.data, locationName: `${name}, ${country}` };
    res.json(result);
  } catch (err) {
    console.error('API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Server error or invalid API response' });
  }
});

app.post('/api/weather-by-coords', async (req, res) => {
  const { lat, lon } = req.body;
  const apiKey = process.env.WEATHER_API_KEY;

  try {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastRes = await axios.get(forecastUrl);

    if (forecastRes.data.cod !== "200") {
      return res.status(400).json({ error: 'Weather data not available' });
    }

    const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    const geoRes = await axios.get(reverseGeoUrl);
    const locationName = geoRes.data[0] ? `${geoRes.data[0].name}, ${geoRes.data[0].country}` : 'Current Location';
    
    const result = { ...forecastRes.data, locationName };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching location data' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!ai) {
    return res.status(503).json({ error: 'AI chat is not configured. Please add GEMINI_API_KEY to your .env file.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: `You are a friendly weather assistant. The user says: ${message}` }] }],
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error('Generative AI error:', err);
    res.status(500).json({ error: 'The AI is currently unavailable.' });
  }
});

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  if (!process.env.WEATHER_API_KEY) {
    console.warn('WARNING: WEATHER_API_KEY not found. Weather features will not work.');
    console.log('Create a .env file in the root directory with your API keys.');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ ERROR: Port ${PORT} is already in use.`);
    console.error(`This usually means another instance of the server is already running in the background.`);
    console.error(`Please kill the existing process or change the PORT in your .env file.\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

// Keep the process alive and handle errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});