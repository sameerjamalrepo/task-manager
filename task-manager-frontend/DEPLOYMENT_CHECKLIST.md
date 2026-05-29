# Vercel Deployment Checklist

## Pre-Deployment ✅

### Frontend Setup
- [ ] Install dependencies: `npm install`
- [ ] Test build locally: `npm run build`
- [ ] Verify `.env.local` has correct API URL
- [ ] Check `vercel.json` configuration
- [ ] Ensure all screens and components work
- [ ] Test storage utilities for web platform

### Backend Requirements  
- [ ] Deploy backend first (Railway/Render/Heroku)
- [ ] Set up PostgreSQL database
- [ ] Configure all environment variables on backend
- [ ] Test backend API endpoints
- [ ] Note the backend URL (e.g., https://api.example.com)

## Deployment Steps

### 1. Connect GitHub Repository
```bash
# In Vercel Dashboard
# Select your GitHub repo
# Import project
```

### 2. Configure Environment Variables in Vercel
```
EXPO_PUBLIC_API_URL = https://your-backend-domain.com/api
```

### 3. Deploy
```bash
# Option A: Auto-deploy from GitHub (recommended)
# Push to main branch → Vercel auto-deploys

# Option B: Manual deployment
cd task-manager-frontend
vercel --prod
```

### 4. Update Backend CORS
After frontend URL is deployed, update backend:

```javascript
// In task-manager-backend/src/index.js
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Then redeploy backend.

## Post-Deployment Testing
- [ ] Frontend loads on Vercel URL
- [ ] Login/OTP flow works
- [ ] Projects can be created
- [ ] Tasks can be managed
- [ ] No CORS errors in browser console
- [ ] All API calls successful

## Troubleshooting

**CORS Errors?**
- Update backend CORS settings
- Ensure exact Vercel domain is allowed

**Build Fails?**
- Check `npm run build` works locally
- Verify Node version compatibility
- Check all imports are correct

**API Not Connecting?**
- Verify EXPO_PUBLIC_API_URL is set in Vercel
- Check backend is running
- Test API directly in browser
