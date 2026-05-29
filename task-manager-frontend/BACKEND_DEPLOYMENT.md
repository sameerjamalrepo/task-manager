# Backend Deployment Options for Task Manager

Your frontend is ready for Vercel. Now you need to deploy the backend first.

## Quick Comparison

| Service | Cost | Effort | Database | Auto-Deploy | Recommendation |
|---------|------|--------|----------|-------------|-----------------|
| **Railway** | Free tier + pay per use | ⭐ Easiest | Built-in PostgreSQL | ✅ Yes | 🎯 **Best for beginners** |
| **Render** | Free tier available | ⭐⭐ Easy | Free PostgreSQL | ✅ Yes | ✅ Good alternative |
| **Fly.io** | Free tier | ⭐⭐ Medium | Separate DB needed | ✅ Yes | ✅ Good for scaling |
| **DigitalOcean** | $5/month | ⭐⭐⭐ Moderate | App Platform + DB | ✅ Yes | ✅ Affordable |
| **Heroku** | Paid only | ⭐ Easy | PostgreSQL add-on | ✅ Yes | ⚠️ No free tier |

---

## 🎯 Recommended: Railway

### Why Railway?
- ✅ Simplest setup (2 clicks)
- ✅ Free tier with $5/month credit
- ✅ PostgreSQL included
- ✅ Auto-deploys from GitHub
- ✅ Perfect for learning/small projects

### Railway Setup (15 minutes)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Authorize GitHub access

2. **Create New Project**
   - Click "Create New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend Service**
   - Select `task-manager-backend` directory (or specify in deployment)
   - Railway will detect Node.js app
   - Add environment variables:

```
DB_HOST=your-pg-host     (from PostgreSQL plugin)
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=*****        (from PostgreSQL plugin)
NODE_ENV=production
JWT_SECRET=your-secret-key-here
PORT=3000
RESEND_API_KEY=your-key  (if using email)
```

4. **Add PostgreSQL Database**
   - In Railway dashboard, click "Add Service"
   - Select "PostgreSQL"
   - It auto-creates DB variables
   - Copy DB credentials to backend env vars

5. **Deploy**
   - Railway auto-deploys on git push
   - Watch deployment logs
   - Get your Railway URL (e.g., `https://api-xxxxx.railway.app`)

6. **Test Backend API**
   - Visit `https://api-xxxxx.railway.app/health`
   - Should see `{"status":"Server is running"}`

---

## Alternative: Render

### Render Setup (20 minutes)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub
   - Select your repository
   - Set start command: `npm start`
   - Set build command: `npm install`

3. **Add Environment Variables**
```
DB_HOST=your-postgres-url
DB_PORT=5432
DB_NAME=taskmanagerdb
DB_USER=postgres
DB_PASSWORD=*****
NODE_ENV=production
JWT_SECRET=your-secret-key
```

4. **Attach PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Render auto-provides connection details
   - Copy to environment variables

5. **Deploy** - Takes 5-10 minutes

---

## Environment Variables Needed

Copy `task-manager-backend/.env.example` to your deployment service:

```
# Database
DB_HOST=               # PostgreSQL host
DB_PORT=5432           # PostgreSQL port
DB_NAME=task_manager   # Database name
DB_USER=postgres       # PostgreSQL user
DB_PASSWORD=           # PostgreSQL password

# Server
PORT=3000              # Auto-detected on Railway/Render
NODE_ENV=production    # Set to production

# Authentication
JWT_SECRET=            # Generate a strong random secret
JWT_EXPIRE=7d          # Token expiration

# Email (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=            # Your email
EMAIL_PASSWORD=        # App-specific password
EMAIL_FROM=            # Sender email
RESEND_API_KEY=        # If using Resend
```

---

## Next Steps After Backend Deploy

1. **Get Backend URL**
   - Railway: Domain shown in project settings
   - Render: Custom domain or render.app domain
   - Example: `https://api-xxxxx.railway.app`

2. **Test Backend Endpoints**
   ```bash
   curl https://api-xxxxx.railway.app/health
   ```

3. **Update Frontend**
   - In Vercel dashboard: Add `EXPO_PUBLIC_API_URL` = `https://api-xxxxx.railway.app/api`

4. **Update Backend CORS**
   - Edit `task-manager-backend/src/index.js`
   - Add Vercel URL to CORS origins
   - Redeploy

---

## CORS Configuration Update

After frontend and backend are deployed, update backend:

```javascript
// In src/index.js
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',  // Your Vercel URL
    'http://localhost:3000'               // Local dev
  ],
  credentials: true
}));
```

Then redeploy backend.

---

## Verification Checklist

After backend deployment:
- [ ] Backend URL is accessible
- [ ] `/health` endpoint returns success
- [ ] Database is connected (check logs)
- [ ] All environment variables set
- [ ] CORS allows frontend domain (after frontend deployed)

---

## Common Issues

**Database connection fails?**
- Check DB credentials in environment variables
- Ensure PostgreSQL is running
- Verify network access is allowed

**Deployment fails?**
- Check logs in Railway/Render dashboard
- Verify package.json scripts are correct
- Ensure Node version is compatible

**Need more help?**
- Railway docs: https://docs.railway.app
- Render docs: https://render.com/docs
- Your backend README: `../task-manager-backend/README.md`
