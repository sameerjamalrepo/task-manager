# Vercel Deployment Guide

## Prerequisites
- Vercel CLI installed (`npm i -g vercel`)
- Project pushed to GitHub
- Backend deployed (Railway, Render, Heroku, etc.)

## Step 1: Update Environment Variables
Before deploying, you need to set your backend API URL.

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add: `EXPO_PUBLIC_API_URL` = `https://your-backend-domain.com/api`

## Step 2: Deploy Frontend
```bash
cd task-manager-frontend
vercel --prod
```

Or simply push to GitHub and connect to Vercel for auto-deployment.

## Step 3: Configure Backend
You need to deploy your backend separately. Options:
- **Railway**: Great for Node.js apps (free tier available)
- **Render**: Also good for Node.js (auto-deploys from GitHub)
- **Heroku**: Traditional choice (now paid)

Backend should be deployed first with PostgreSQL database configured.

## Important Notes
- Frontend will be deployed to Vercel
- Backend must be deployed elsewhere
- Update EXPO_PUBLIC_API_URL after backend is live
- Ensure backend CORS is configured to allow Vercel domain

## After Deployment
1. Update backend CORS in `task-manager-backend/src/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-vercel-domain.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

2. Redeploy backend with updated CORS settings
