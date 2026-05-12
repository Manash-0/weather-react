# 🚀 Deployment Guide: Vercel (Frontend) + Render (Backend)

Since STORMFRONT is a full-stack application, the best approach for free deployment is to host the **React/Vite Frontend on Vercel** and the **Node.js/Express Backend on Render**.

Follow these step-by-step instructions to get your app live.

---

## Part 1: Prepare the Repository

Before deploying, make sure your code is pushed to a GitHub repository.

1. Initialize git (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub and push your code.

---

## Part 2: Deploy Backend to Render

Render is a great free platform for hosting Node.js servers.

1. Go to [Render.com](https://render.com/) and sign in with GitHub.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your STORMFRONT repository.
4. Fill in the following details:
   * **Name**: `stormfront-backend` (or whatever you prefer)
   * **Root Directory**: `.` (leave blank or specify if your backend is in a specific folder. Since `server.js` is in `server/`, leave it as root if `package.json` is in the root)
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm run server` (or `node server/server.js`)
   * **Instance Type**: Free
5. **Environment Variables**:
   Scroll down to the "Environment Variables" section and add:
   * `WEATHER_API_KEY` = `15cb882494382c6a063e8a6f2a60f9f5` (Your OpenWeather API Key)
   * `GEMINI_API_KEY` = `AIzaSyDmTH4gyBjoh6B2CNnRvOlTRykJwlvJsY8` (Your Gemini API Key)
   * `NODE_ENV` = `production`
6. Click **Create Web Service**.
7. Wait for the build to finish. Once it's live, copy the Render URL (e.g., `https://stormfront-backend.onrender.com`).

---

## Part 3: Deploy Frontend to Vercel

Vercel is the easiest platform for React/Vite apps. Because your frontend uses `/api/...` to talk to the backend, we will configure Vercel to route those API requests to your new Render backend.

### Step 3.1: Create `vercel.json`
To make the frontend talk to your Render backend, create a file named `vercel.json` inside your `client` folder with the following content:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "YOUR_RENDER_URL/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
*(Replace `YOUR_RENDER_URL` with the URL you got from Render in Part 2, e.g., `https://stormfront-backend.onrender.com`)*

### Step 3.2: Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New Project**.
3. Import your STORMFRONT GitHub repository.
4. In the configuration screen, change the **Root Directory** to `client`.
5. Vercel will automatically detect that it's a Vite project:
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
6. Click **Deploy**.

---

## 🎉 You're Live!

Once Vercel finishes building, it will give you a live URL for your frontend (e.g., `https://stormfront.vercel.app`). 

* **Frontend** is served globally via Vercel's Edge Network.
* **Backend** handles the secure API keys and AI requests on Render.
* **API calls** to `/api/weather` automatically route from Vercel to Render thanks to the `vercel.json` rewrite.

### Note on Render's Free Tier
Render spins down free web services after 15 minutes of inactivity. When you visit your Vercel site after a break, the first search or chat might take 30-50 seconds while the Render backend "wakes up". Subsequent requests will be instant.
