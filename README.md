# 🌩️ STORMFRONT | Immersive 3D Weather Experience

STORMFRONT is a full-stack, real-time weather application that transforms basic meteorological data into an immersive 3D cinematic experience right in your browser. 

Powered by React, Three.js, and Google Gemini AI, it dynamically renders particle systems, volumetric clouds, and procedural lightning based on real live weather data from OpenWeatherMap.

![STORMFRONT Showcase](https://raw.githubusercontent.com/Manash-0/weather-react/main/client/public/vite.svg) *(Replace with actual screenshot)*

## ✨ Features

* **Real-time 3D Climates:** The background canvas dynamically shifts between 6 distinct atmospheric scenes:
  * **Thunderstorms:** Procedural branching lightning bolts, screen shake physics, and heavy instanced rain.
  * **Rain/Drizzle:** Steady particle rainfall with moody overcast lighting.
  * **Snow:** Floating particle snowflakes with icy blue ambient lighting and additive blending.
  * **Clear:** Glowing animated sun with warm god rays and drifting fair-weather clouds.
  * **Clouds/Fog:** Volumetric cloud layers with dense ground fog.
* **Glassmorphic UI:** A sleek, frosted-glass interface that floats above the 3D scene.
* **Mood Engine:** Translates raw weather data into carefully curated color palettes, post-processing effects (bloom, vignette, chromatic aberration), and particle physics settings.
* **AI Weather Assistant:** A built-in Gemini-powered chat assistant that can answer questions about the weather, climate, or anything else you ask it.
* **Auto-Location:** Instantly detects your location and fetches local weather coordinates.

## 🛠️ Technology Stack

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

STORMFRONT is ready for production. You can deploy it using modern cloud platforms (Vercel + Render) or via the included Docker container. 

Please refer to the **[DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)** file for a comprehensive, step-by-step guide on how to get the application live on the internet for free.
