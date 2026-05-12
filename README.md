# 🌩️ STORMFRONT | Immersive 3D Weather Experience

=>[link](https://weather-react-ebon.vercel.app/)

STORMFRONT is a full-stack, real-time weather application that transforms basic meteorological data into an immersive 3D cinematic experience right in your browser. 

Powered by React, Three.js, and Google Gemini AI, it dynamically renders particle systems, volumetric clouds, and procedural lightning based on real live weather data from OpenWeatherMap.

![STORMFRONT Showcase](https://raw.githubusercontent.com/Manash-0/weather-react/main/client/public/vite.svg) *(Replace with actual screenshot)*

## Technology Stack

**Frontend:**
* React 19 + Vite
* Three.js + React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
* Post-processing (`@react-three/postprocessing`)
* Framer Motion (Micro-animations)
* Vanilla CSS (CSS Custom Properties + Glassmorphism)

**Backend:**
* Node.js + Express.js
* Axios (HTTP Client)
* `@google/genai` (Gemini AI SDK)

**APIs:**
* OpenWeatherMap API (Current weather, 12-hour forecast, and Geocoding)
* Google Gemini 2.5 Flash API

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/Manash-0/weather-react.git
cd weather-react

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
WEATHER_API_KEY=your_openweathermap_api_key
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3000
NODE_ENV=development
```

### 3. Run the App
We use `concurrently` to run both the Node backend and the Vite frontend simultaneously.
```bash
npm run dev
```
* **Frontend:** `http://localhost:5173`
* **Backend:** `http://localhost:3000`

---

## 🌍 Deployment

STORMFRONT is ready for production and is actively deployed using:
* **Frontend:** Vercel
* **Backend:** Render (Docker Environment)
