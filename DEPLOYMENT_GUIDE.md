# 🚀 UniFlow Deployment Guide

## Overview
This guide will help you deploy your UniFlow application:
- **Frontend**: Vercel (https://uni-flow-phi.vercel.app)
- **Backend**: Render.com (https://uniflow4895.onrender.com)

---

## 📋 Pre-Deployment Checklist

### ✅ Completed
- [x] CORS configured for Vercel frontend
- [x] Cookie settings for cross-origin (sameSite: 'none', secure: true)
- [x] Frontend .env configured with backend URL
- [x] Backend .env configured with frontend URL
- [x] .gitignore properly excludes .env files
- [x] vercel.json created with SPA routing
- [x] Health check endpoints added

### 🔄 Pending
- [ ] Deploy backend to Render.com
- [ ] Set environment variables on Render.com
- [ ] Deploy frontend to Vercel
- [ ] Set environment variables on Vercel
- [ ] Test production deployment

---

## 🔧 Backend Deployment (Render.com)

### Step 1: Create Web Service on Render.com

1. Go to [Render.com Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Navadeep-1817/UniFlow`
4. Configure the service:
   - **Name**: `uniflow-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `master`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node server.js`)
   - **Plan**: Free (or your preferred plan)

### Step 2: Set Environment Variables on Render.com

Click on **"Environment"** tab and add these variables:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://uni-flow-phi.vercel.app

# MongoDB
MONGO_URI=mongodb+srv://navadeep:n6KxTkBVJ5wGaWy@cluster1.q11okfz.mongodb.net/uniflow?retryWrites=true&w=majority&appName=Cluster1

# JWT (CHANGE THIS!)
JWT_SECRET=<generate_new_secret_see_below>
JWT_EXPIRE=90d
JWT_COOKIE_EXPIRE=7

# Super Admin
SUPER_ADMIN_KEY=vignan2025

# Cloudinary (Add your credentials)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (Add your credentials)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=UniFlow System <noreply@uniflow.com>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf
```

#### 🔐 Generate Strong JWT Secret

Run this command in your terminal to generate a secure JWT secret:

**PowerShell:**
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

### Step 3: MongoDB Atlas Configuration

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster → **Network Access**
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add specific Render.com IPs if you prefer
5. Save

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Check deployment logs for any errors
4. Your backend will be available at: `https://uniflow4895.onrender.com`

### Step 5: Test Backend

Test these endpoints to verify deployment:

```bash
# Health check
https://uniflow4895.onrender.com/health

# API health check
https://uniflow4895.onrender.com/api/health

# Universities endpoint
https://uniflow4895.onrender.com/api/setup/universities
```

You should see JSON responses. If you get 404, check:
- Root Directory is set to `backend`
- Start command is correct
- Environment variables are set
- Check deployment logs for errors

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

You likely already have this deployed since you have the URL. If not:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository: `Navadeep-1817/UniFlow`
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `uniflow`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables on Vercel

1. Go to your project → **Settings** → **Environment Variables**
2. Add this variable:

```env
VITE_API_URL=https://uniflow4895.onrender.com/api
```

3. Make sure it's enabled for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### Step 3: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **"..."** menu → **"Redeploy"**

Or push a new commit to trigger redeployment.

### Step 4: Test Frontend

Visit your frontend URL and test:
- [ ] Page loads correctly
- [ ] Registration form loads universities dropdown
- [ ] Login works
- [ ] Cookies are set (check browser DevTools → Application → Cookies)
- [ ] All routes work (refresh pages with routes)
- [ ] No CORS errors in console

---

## 🐛 Troubleshooting

### Issue: 404 on /api/setup/universities

**Symptoms:**
```
Failed to load resource: the server responded with a status of 404 ()
uniflow4895.onrender.com/setup/universities
```

**Possible Causes & Solutions:**

1. **Backend not deployed yet**
   - Solution: Complete backend deployment steps above

2. **Backend service is sleeping (Free tier)**
   - Solution: Make a request to wake it up (first request takes 30-60 seconds)
   - Test: Visit `https://uniflow4895.onrender.com/health`

3. **Wrong root directory on Render**
   - Solution: Check Render.com settings → Root Directory should be `backend`

4. **Environment variables not set**
   - Solution: Add all environment variables in Render.com dashboard

5. **Build failed**
   - Solution: Check Render.com deployment logs for errors

### Issue: CORS Errors

**Symptoms:**
```
Access to fetch at 'https://uniflow4895.onrender.com/api/...' from origin 'https://uni-flow-phi.vercel.app' has been blocked by CORS policy
```

**Solution:**
1. Verify `FRONTEND_URL=https://uni-flow-phi.vercel.app` is set on Render.com
2. Verify `NODE_ENV=production` is set on Render.com
3. Check Render.com deployment logs for CORS messages

### Issue: Cookies Not Set

**Symptoms:**
- Login succeeds but user is not authenticated
- Token not saved

**Solution:**
1. Verify `NODE_ENV=production` on Render.com (enables secure cookies)
2. Check browser DevTools → Application → Cookies
3. Ensure HTTPS is enabled on both frontend and backend

### Issue: MongoDB Connection Failed

**Symptoms:**
```
MongoServerError: bad auth : authentication failed
```

**Solution:**
1. Verify `MONGO_URI` is correctly set on Render.com
2. Check MongoDB Atlas → Network Access → Allow 0.0.0.0/0
3. Verify username/password in connection string

### Issue: Express Rate Limit Validation Error

**Symptoms:**
```
ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false
```

**Solution:**
✅ **FIXED** - Added `app.set('trust proxy', 1)` to server.js. This is required for Render.com which uses a reverse proxy.

### Issue: CORS Blocked for Vercel Preview Deployments

**Symptoms:**
```
⚠️ CORS blocked for origin: https://uni-flow-a37m5ij5d-navadeeps-projects-59d64c51.vercel.app
```

**Solution:**
✅ **FIXED** - Updated CORS to allow all `*.vercel.app` domains (preview deployments).

### Issue: AuditLog Duplicate Key Error

**Symptoms:**
```
E11000 duplicate key error collection: uniflow.auditlogs index: logId_1 dup key: { logId: null }
```

**Solution:**
Run this command on your backend server (after deployment):

**Via Render Shell:**
1. Go to Render Dashboard → Your Service → Shell
2. Run: `npm run migrate:fix-auditlog`

**Or manually connect to MongoDB:**
```javascript
// In MongoDB Atlas or Compass
db.auditlogs.dropIndex('logId_1')
```

This removes the old index that's no longer needed.

---

## 📊 Post-Deployment Verification

### Backend Tests

```bash
# 1. Health check
curl https://uniflow4895.onrender.com/health

# 2. API health check
curl https://uniflow4895.onrender.com/api/health

# 3. Universities endpoint
curl https://uniflow4895.onrender.com/api/setup/universities

# 4. Departments endpoint
curl https://uniflow4895.onrender.com/api/setup/departments
```

### Frontend Tests

Visit your Vercel URL and test:

1. **Homepage** - Should load without errors
2. **Registration** 
   - Universities dropdown should populate
   - Form submission should work
3. **Login**
   - Credentials should work
   - Cookie should be set
   - Redirect to dashboard
4. **Protected Routes**
   - Should require authentication
   - Redirect to login if not authenticated
5. **Routing**
   - All routes should work
   - Refresh should not show 404

### Console Checks

Open browser DevTools (F12) and check:

1. **Console Tab**
   - No CORS errors
   - No 404 errors
   - No authentication errors

2. **Network Tab**
   - API calls go to `https://uniflow4895.onrender.com/api/...`
   - Status codes are 200 (success) or appropriate
   - Response times are reasonable

3. **Application Tab → Cookies**
   - Cookie named `token` (or your cookie name) is present
   - `Secure` flag is set
   - `SameSite` is set to `None`
   - `HttpOnly` flag is set

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

Both Vercel and Render.com support auto-deployment:

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin master
   ```

2. **Automatic deployment**:
   - Vercel will automatically deploy frontend changes
   - Render.com will automatically deploy backend changes

3. **Check deployment status**:
   - Vercel: Dashboard → Deployments
   - Render.com: Dashboard → Events

---

## 📝 Important Notes

### Free Tier Limitations

**Render.com Free Tier:**
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free (enough for one service)

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared cluster
- Good for development/small projects

**Vercel Free Tier:**
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless functions included

### Security Best Practices

1. **Never commit .env files** - Already in .gitignore ✅
2. **Use strong JWT secrets** - Generate new one for production
3. **Change default passwords** - Update SUPER_ADMIN_KEY
4. **Enable HTTPS only** - Both Vercel and Render use HTTPS by default ✅
5. **Review CORS origins** - Only allow trusted domains ✅

### Performance Tips

1. **Keep backend awake** - Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 5 minutes
2. **Optimize images** - Use Cloudinary for image optimization
3. **Enable caching** - Add cache headers for static assets
4. **Monitor errors** - Check Render.com and Vercel logs regularly

---

## 📞 Support

If you encounter issues:

1. **Check Render.com Logs**:
   - Dashboard → Your Service → Logs
   - Look for error messages

2. **Check Vercel Logs**:
   - Dashboard → Your Project → Deployments → Function Logs

3. **Check Browser Console**:
   - F12 → Console tab
   - Look for network errors

4. **Database Issues**:
   - MongoDB Atlas → Metrics
   - Check connection statistics

---

## ✅ Deployment Complete!

Once everything is working:

- ✅ Backend is accessible at: `https://uniflow4895.onrender.com`
- ✅ Frontend is accessible at: `https://uni-flow-phi.vercel.app`
- ✅ All API calls work
- ✅ CORS is configured correctly
- ✅ Cookies are set properly
- ✅ All routes work correctly

**Your UniFlow application is now live! 🎉**

---

## 📌 Quick Reference

### Environment Variables Checklist

**Render.com (Backend):**
- [x] NODE_ENV=production
- [x] PORT=5000
- [x] FRONTEND_URL
- [x] MONGO_URI
- [x] JWT_SECRET
- [x] JWT_EXPIRE
- [x] JWT_COOKIE_EXPIRE
- [x] SUPER_ADMIN_KEY
- [ ] CLOUDINARY credentials (if using uploads)
- [ ] EMAIL credentials (if using emails)

**Vercel (Frontend):**
- [x] VITE_API_URL=https://uniflow4895.onrender.com/api

### Important URLs

- **Backend Health**: https://uniflow4895.onrender.com/health
- **API Health**: https://uniflow4895.onrender.com/api/health
- **Universities API**: https://uniflow4895.onrender.com/api/setup/universities
- **Frontend**: https://uni-flow-phi.vercel.app
- **Render Dashboard**: https://dashboard.render.com/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com/

---

**Last Updated**: November 8, 2025
