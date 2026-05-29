# Quick Vercel Deployment Guide

## Frontend Ready for Deployment ✅

Your Task Manager frontend is now configured for Vercel deployment.

### What's Been Set Up:
- ✅ `vercel.json` - Configured for Vercel build settings
- ✅ `.env.local` - Local development environment variables
- ✅ `.env.example` - Shows required environment variables
- ✅ Build script - `npm run build` exports web bundle to `dist/`
- ✅ Rewrite rules - SPA routing configured

### One-Time Setup: Deploy Backend First

Before deploying frontend, you must deploy the backend. Choose one:

#### Option 1: Railway (Recommended - Simplest)
1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select `task-manager-backend` directory
4. Configure PostgreSQL addon
5. Set environment variables (DB_*, JWT_SECRET, etc.)
6. Get your Railway backend URL

#### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service from GitHub
3. Select repository and `task-manager-backend`
4. Set build & start commands
5. Add PostgreSQL database
6. Get your Render backend URL

#### Option 3: Heroku (Paid)
Similar setup to above services

### Deploy Frontend to Vercel

#### Method 1: GitHub Auto-Deploy (Easiest)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Select `task-manager-frontend` directory
5. Add Environment Variable:
   - Name: `EXPO_PUBLIC_API_URL`
   - Value: `https://your-backend-url.com/api`
6. Click Deploy

#### Method 2: Vercel CLI
```bash
cd task-manager-frontend
npm i -g vercel
vercel --prod
# Follow prompts to connect GitHub and set environment variables
```

### After Both Deployed

Update backend CORS to allow your Vercel domain:

```javascript
// In task-manager-backend/src/index.js
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',  // Your Vercel URL
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Then redeploy backend.

### File Structure
```
task-manager-frontend/
├── vercel.json                 ← Vercel config
├── .env.local                  ← Local env vars
├── .env.example                ← Template
├── VERCEL_DEPLOYMENT.md        ← Detailed guide
├── DEPLOYMENT_CHECKLIST.md     ← Checklist
├── package.json
└── src/
    └── (your app code)
```

### Environment Variables Reference
| Variable | Example | Where |
|----------|---------|-------|
| `EXPO_PUBLIC_API_URL` | `https://api.railway.app/api` | Vercel Environment |

### Common Issues & Fixes

**Build fails locally?**
```bash
cd task-manager-frontend
npm install
npm run build
```

**CORS errors?**
- Update backend's `cors()` middleware
- Ensure exact Vercel domain is in allowed origins
- Redeploy backend

**API calls not working?**
- Check `EXPO_PUBLIC_API_URL` is set in Vercel
- Verify backend is running
- Check browser network tab for 404s

### Status
- Frontend: ✅ Ready for Vercel
- Backend: ⏳ Deploy to Railway/Render first
- Database: ⏳ Configure in backend deployment

Need help? See `VERCEL_DEPLOYMENT.md` for detailed steps.
