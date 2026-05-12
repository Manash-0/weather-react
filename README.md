# Weather App Architecture & React/Vite Migration Guide

This document outlines the current core architecture of the Weather App and provides a comprehensive, step-by-step guide to migrating the frontend from Vanilla JS + EJS to a modern React + Vite stack.

---

## 🏗️ Current Core Techniques & Architecture Flow

The current application is built as a monolithic Node.js/Express application utilizing server-side rendering for the initial HTML and client-side JavaScript for dynamic interactivity.

### Tech Stack
*   **Backend:** Node.js, Express.js
*   **Frontend:** EJS (Embedded JavaScript templates), Vanilla JavaScript, Tailwind CSS (via CDN)
*   **APIs Used:** 
    *   OpenWeatherMap API (Geocoding & Forecast data)
    *   Google Gemini API (Generative AI Chat Assistant)
*   **HTTP Client:** Axios (Backend), Fetch API (Frontend)

### Architecture Flow

1.  **Initial Load:**
    *   The user navigates to `/`.
    *   Express serves the `views/index.ejs` template.
    *   The browser downloads the Tailwind CSS CDN script and custom `public/scripts/scripts.js`.

2.  **Weather Search Flow (`/weather` & `/weather-by-coords`):**
    *   User inputs a city or clicks "Detect Location".
    *   `scripts.js` sends a POST request with the city name or coordinates to the Express backend.
    *   The Express backend receives the request and makes secure external API calls (using Axios) to OpenWeatherMap.
    *   The backend parses and formats the weather data and sends it back as JSON.
    *   `scripts.js` dynamically updates the DOM elements (temperature, icon, forecast cards) without reloading the page.

3.  **AI Chat Flow (`/chat`):**
    *   User types a message to the AI assistant.
    *   `scripts.js` sends a POST request to `/chat`.
    *   The Express backend uses the `@google/genai` SDK to prompt the `gemini-2.5-flash` model.
    *   The AI's response is returned to the frontend and appended to the chat window.

---

## 🚀 Steps to Migrate to React + Vite

Migrating to React + Vite will separate your concerns (decoupling the frontend from the backend), improve developer experience with Hot Module Replacement (HMR), and allow you to build reusable UI components.

### Phase 1: Initialize the React Frontend

1.  **Create the Vite Project:**
    Open a terminal in your project root (`weather-app-updated`) and run:
    ```bash
    npm create vite@latest client -- --template react
    ```
    *(This creates a new folder named `client` for your React code.)*

2.  **Install Dependencies:**
    Navigate into the `client` directory and install standard dependencies:
    ```bash
    cd client
    npm install
    ```

3.  **Setup Tailwind CSS for Vite:**
    Install Tailwind and its peer dependencies:
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
    Configure `tailwind.config.js`:
    ```javascript
    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```
    Add Tailwind directives to your `src/index.css`:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

### Phase 2: Refactor UI into React Components

Break down your `index.ejs` into modular React components inside the `client/src` directory.

1.  **App Component (`App.jsx`):** 
    Will hold the main layout (Header, Main, Footer) and global state (current weather data, forecast data).
2.  **SearchBar Component:** 
    Handles the input field, "Search" button, and "Auto Location" button.
3.  **CurrentWeather Component:** 
    Displays the current temperature, city name, feels-like, and icon.
4.  **ForecastList Component:** 
    Iterates over the 12-hour forecast data and renders individual `ForecastCard` components.
5.  **ChatAssistant Component:** 
    Maintains the state of the chat history and the input field for interacting with the Gemini AI.

*Tip: Move `getWeatherIcon` logic into a utility file (e.g., `src/utils/helpers.js`).*

### Phase 3: Setup Frontend-Backend Communication

Since your React app (running on e.g., `localhost:5173`) and your Express app (`localhost:3000`) will be on different ports during development, you need to configure Vite to proxy API requests.

1.  **Configure Vite Proxy (`client/vite.config.js`):**
    ```javascript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    export default defineConfig({
      plugins: [react()],
      server: {
        proxy: {
          '/weather': 'http://localhost:3000',
          '/weather-by-coords': 'http://localhost:3000',
          '/chat': 'http://localhost:3000'
        }
      }
    })
    ```

2.  **Migrate `fetch` Calls:**
    Move the logic from `scripts.js` into React `useEffect` hooks or event handler functions within your components. Use `fetch` or install `axios` in the React app to make the exact same calls.

### Phase 4: Refactor the Express Backend (API Only)

Now that React is handling the UI, Express no longer needs to serve HTML or handle views.

1.  **Remove EJS:**
    In `server.js`, remove:
    ```javascript
    // Remove these lines
    app.set('view engine', 'ejs');
    
    app.get('/', (req, res) => {
      res.render('index');
    });
    ```
2.  **Serve Static React Build (Production Only):**
    Update your static file serving to point to the Vite build output (`client/dist`):
    ```javascript
    // Change this line
    // app.use(express.static(path.join(__dirname, 'public')));
    
    // To this (optional: only needed for production deployment)
    app.use(express.static(path.join(__dirname, 'client/dist')));
    
    // Fallback for React Router (if you add routing later)
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client/dist/index.html'));
    });
    ```
3.  **Uninstall Unused Packages:**
    ```bash
    npm uninstall ejs
    ```
    You can also safely delete the `views/` and `public/` folders once the migration is fully functional.

### Phase 5: Run & Test

1.  **Start the Backend:** In the root folder, run `node server.js` (runs on port 3000).
2.  **Start the Frontend:** In the `client/` folder, run `npm run dev` (runs on port 5173).
3.  Visit `http://localhost:5173` to view and interact with your new React + Vite Weather App!
