# 🚀 Deployment Guide: STORMFRONT

This guide covers two different ways to deploy the STORMFRONT 3D Weather App:
1. **Cloud Hosting (Vercel + Render)** — Best for free, zero-maintenance hosting.
2. **Docker Containers** — Best for self-hosting on a VPS (AWS, DigitalOcean, etc.).

---

## Method 1: Cloud Hosting (Vercel Frontend + Render Backend)

Since STORMFRONT is a full-stack application, the best approach for free deployment is to host the **React/Vite Frontend on Vercel** and the **Node.js/Express Backend on Render**.

### Step 1.1: Deploy Backend to Render

Render is a great free platform for hosting Node.js servers.

1. Go to [Render.com](https://render.com/) and sign in with GitHub.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your `weather-react` repository.
4. Fill in the following details:
   * **Name**: `stormfront-backend`
   * **Root Directory**: `.` (leave blank)
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm run server`
   * **Instance Type**: Free
5. **Environment Variables**:
   Scroll down to the "Environment Variables" section and add:
   * `WEATHER_API_KEY` = `Your_OpenWeather_API_Key`
   * `GEMINI_API_KEY` = `Your_Gemini_API_Key`
   * `NODE_ENV` = `production`
6. Click **Create Web Service**.
7. Wait for the build to finish. Once it's live, copy the Render URL (e.g., `https://stormfront-backend.onrender.com`).

### Step 1.2: Configure Vercel Routing
Vercel needs to know where your Render backend is. Open the `client/vercel.json` file in this repository and replace `YOUR_RENDER_URL` with the URL you just copied from Render. Commit and push this change to GitHub.

### Step 1.3: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New Project**.
3. Import your `weather-react` GitHub repository.
4. In the configuration screen, change the **Root Directory** to `client`.
5. Vercel will automatically detect that it's a Vite project:
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
6. Click **Deploy**.

> **Note on Render's Free Tier**: Render spins down free web services after 15 minutes of inactivity. When you visit your Vercel site after a break, the first search or chat might take 30-50 seconds while the backend "wakes up". Subsequent requests will be instant.

---

## Method 2: Docker Deployment

If you prefer to self-host the application on a VPS (like DigitalOcean, AWS EC2, or a local home server), you can use the included multi-stage `Dockerfile`.

This method builds both the frontend and backend into a single, optimized production container.

### Prerequisites
* Docker installed on your host machine.

### Step 2.1: Build the Image
Open a terminal in the root of the repository and run:
```bash
docker build -t stormfront-app .
```

### Step 2.2: Run the Container
Run the container, passing in your API keys as environment variables. The container exposes port `3000`.

```bash
docker run -d \
  -p 3000:3000 \
  -e WEATHER_API_KEY="your_openweather_key" \
  -e GEMINI_API_KEY="your_gemini_key" \
  --name stormfront \
  stormfront-app
```

Your full-stack application will now be running at `http://localhost:3000`. The Express server will handle the API routes and automatically serve the built static React frontend for all other routes.
