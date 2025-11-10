# 🚀 Vercel Production Deployment Fix Guide

## 🔴 Problem Identified

**Issue**: Frontend can't reach backend in production
- **Render Logs Show**: `GET /setup/universities 404` (missing `/api` prefix)
- **Expected**: `GET /api/setup/universities 200`
- **Root Cause**: Environment variable `VITE_API_URL` not loaded in Vercel production

## ✅ Solution Applied

### 1. **Code Changes Made** ✔️

Created centralized API configuration with production fallback:
- `uniflow/src/config/api.config.js` - Centralized API config with fallback
- Updated `api.js` - Uses centralized config
- Updated `ProtectedRoute.jsx` - Uses centralized config
- Updated `TrainerRegister.jsx` - Uses centralized config
- Created `.env.production` - Production environment variables

### 2. **Critical Next Steps** (YOU MUST DO THIS)

#### Step 1: Set Environment Variable in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **uni-flow-phi**
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add the following variable:
   ```
   Key: VITE_API_URL
   Value: https://uniflow4895.onrender.com/api
   ```
6. **Important**: Select all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

7. Click **Save**

#### Step 2: Redeploy the Application

Option A - Automatic (Recommended):
```bash
# In uniflow directory
git add .
git commit -m "fix: Add production API configuration with fallback"
git push origin main
```

Option B - Manual:
1. Go to **Deployments** tab in Vercel
2. Find latest deployment
3. Click **⋮** menu → **Redeploy**
4. Select **Use existing Build Cache** (unchecked for clean build)
5. Click **Redeploy**

#### Step 3: Verify Production Fix

1. **Check Vercel Build Logs**:
   - Look for: `🔧 API Configuration: { BASE_URL: 'https://uniflow4895.onrender.com/api' }`
   - Confirm build succeeds

2. **Test API Connectivity**:
   ```javascript
   // Open browser console on https://uni-flow-phi.vercel.app
   console.log('API URL:', import.meta.env.VITE_API_URL);
   // Should show: https://uniflow4895.onrender.com/api
   ```

3. **Check Network Tab**:
   - Open Developer Tools → Network
   - Try to register/login
   - Verify requests go to: `https://uniflow4895.onrender.com/api/auth/login`
   - Should see **200 OK** instead of 404

4. **Check Render Logs**:
   ```
   ✅ BEFORE: GET /setup/universities 404
   ✅ AFTER:  GET /api/setup/universities 200
   ```

## 📋 What Was Fixed

### Before (❌ Broken)
```javascript
// .env file not deployed to Vercel
VITE_API_URL=https://uniflow4895.onrender.com/api

// Code fallback to localhost
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
// Result: undefined in production → fallback to localhost → 404
```

### After (✅ Fixed)
```javascript
// Centralized config with production check
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 
            (import.meta.env.PROD ? 'https://uniflow4895.onrender.com/api' : 'http://localhost:5000/api')
};

// All API calls use this config
import API_CONFIG from '../config/api.config';
const api = axios.create({ baseURL: API_CONFIG.BASE_URL });
```

### Fallback Strategy (3 Levels)
1. **First**: Try `VITE_API_URL` from Vercel Dashboard ← PRIMARY
2. **Second**: If production mode → Use hardcoded Render URL ← FALLBACK
3. **Third**: If development mode → Use localhost ← DEV ONLY

## 🧪 Testing Checklist

After deployment, test these scenarios:

### Authentication Tests
- [ ] Login with SuperAdmin credentials
- [ ] Login with Student credentials
- [ ] Login with Faculty credentials
- [ ] Logout and verify token cleared
- [ ] Access protected route without login → redirect to login

### API Tests
- [ ] Trainer registration (uses `/api/setup/universities`)
- [ ] Fetch timetables
- [ ] Upload resources
- [ ] Create attendance records
- [ ] Submit feedback

### Console Checks
- [ ] No CORS errors in browser console
- [ ] No 404 errors in browser console
- [ ] No "Network Error" messages
- [ ] API configuration logs show correct URL (dev mode only)

## 🔍 Troubleshooting

### If Still Getting 404 Errors

1. **Check Environment Variable in Vercel**:
   ```bash
   # In Vercel deployment logs, search for:
   VITE_API_URL=https://uniflow4895.onrender.com/api
   ```

2. **Verify Build Output**:
   - In Vercel build logs, ensure no errors during `npm run build`
   - Check for: "✓ built in XXXms"

3. **Test API Config Fallback**:
   ```javascript
   // In browser console on production site
   console.log('Prod Mode:', import.meta.env.PROD); // Should be true
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

4. **Check Network Request URLs**:
   - Open Network tab → Filter by "Fetch/XHR"
   - Click any API request
   - Verify URL starts with: `https://uniflow4895.onrender.com/api/`

### If Environment Variable Not Loading

1. **Clear Build Cache**:
   - Vercel Dashboard → Deployments
   - Redeploy with "Use existing Build Cache" **UNCHECKED**

2. **Verify `.env.production` in Git**:
   ```bash
   git status
   git add uniflow/.env.production
   git commit -m "Add production env file"
   git push
   ```

3. **Check `.gitignore`**:
   - Ensure `.env` is ignored but `.env.production` is NOT:
   ```
   .env           ← Ignored (local only)
   .env.local     ← Ignored
   .env.production ← NOT IGNORED (needs to be committed)
   ```

## 🎯 Expected Results

After completing all steps:

### Render Backend Logs
```
✅ GET /api/auth/verify 200
✅ POST /api/auth/login 200
✅ GET /api/setup/universities 200
✅ GET /api/timetables 200
```

### Vercel Frontend
```
✅ Login redirects to correct dashboard
✅ Protected routes work properly
✅ API calls succeed with 200 status
✅ No CORS errors
✅ No authentication loops
```

### Browser Console (Production)
```javascript
// Should see these logs (development mode only):
🚀 Axios API initialized with baseURL: https://uniflow4895.onrender.com/api
🔧 API Configuration: {
  BASE_URL: 'https://uniflow4895.onrender.com/api',
  ENV_VAR: 'https://uniflow4895.onrender.com/api',
  MODE: 'production',
  PROD: true
}
```

## 📚 Additional Information

### Why `.env` Files Don't Work in Vercel

- `.env` files are typically in `.gitignore`
- Vercel doesn't have access to gitignored files
- `vercel.json` env vars only work at build time
- Solution: Set environment variables in Vercel Dashboard

### Vite Environment Variables

- Must start with `VITE_` prefix
- Available as `import.meta.env.VITE_*`
- `import.meta.env.PROD` = true in production builds
- `import.meta.env.DEV` = true in development

### API Configuration Best Practices

1. ✅ Use centralized config file
2. ✅ Provide production fallback
3. ✅ Set env vars in deployment platform
4. ✅ Log config in development only
5. ✅ Never hardcode URLs directly in components

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Frontend loads at https://uni-flow-phi.vercel.app
2. ✅ Login works and redirects to correct dashboard
3. ✅ All API calls show 200 status in Network tab
4. ✅ Render logs show requests with `/api` prefix
5. ✅ Protected routes require authentication
6. ✅ No CORS errors in browser console
7. ✅ No authentication redirect loops

---

## 🆘 Need Help?

If issues persist after following this guide:

1. Check Vercel deployment logs for build errors
2. Check Render logs for backend errors
3. Share browser console errors
4. Share Network tab screenshot showing failed requests
5. Verify environment variable is set correctly in Vercel Dashboard
