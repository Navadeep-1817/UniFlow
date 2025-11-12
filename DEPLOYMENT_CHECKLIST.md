# ✅ UniFlow Deployment Checklist

**Quick Reference - Complete these steps in order**

---

## 🚨 CRITICAL - MUST DO NOW (5 minutes)

### ☐ Step 1: Add Environment Variable to Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click on project: **uni-flow-phi**
3. Click: **Settings** → **Environment Variables**
4. Click: **Add New**
5. Enter:
   ```
   Key: VITE_API_URL
   Value: https://uniflow4895.onrender.com/api
   ```
6. Check all environments: ✓ Production ✓ Preview ✓ Development
7. Click: **Save**

### ☐ Step 2: Redeploy Vercel Frontend

1. Go to: **Deployments** tab
2. Find latest deployment
3. Click: **...** (three dots)
4. Click: **Redeploy**
5. Wait for: Build complete (~2-5 minutes)

---

## ⚙️ IMPORTANT - VERIFY BACKEND (10 minutes)

### ☐ Step 3: Check Render Environment Variables

1. Go to: https://dashboard.render.com
2. Select service: **uniflow4895**
3. Click: **Environment** → **Environment Variables**
4. Verify these exist:

```bash
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://uni-flow-phi.vercel.app
MONGO_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

5. If missing or wrong, click: **Add** or **Edit**
6. Click: **Save Changes**
7. If changed, click: **Manual Deploy** → **Deploy latest commit**

---

## 🗄️ CRITICAL - MONGODB ATLAS (5 minutes)

### ☐ Step 4: Configure MongoDB Network Access

1. Go to: https://cloud.mongodb.com
2. Click: **Network Access** (left sidebar)
3. Check if `0.0.0.0/0` is in the list
4. If NOT, click: **Add IP Address**
5. Click: **Allow Access from Anywhere**
6. Enter: `0.0.0.0/0`
7. Click: **Confirm**

### ☐ Step 5: Verify Database User

1. Click: **Database Access** (left sidebar)
2. Check user has: **Read and write to any database**
3. If NOT, click: **Edit** → Change role → **Save**

---

## ✅ VERIFICATION - TEST DEPLOYMENT (10 minutes)

### ☐ Step 6: Test Backend Health

Open these URLs in your browser:

```
✅ https://uniflow4895.onrender.com/health
   Expected: {"success": true, "message": "Server is running"}

✅ https://uniflow4895.onrender.com/api/health
   Expected: {"success": true, "message": "API endpoint is working!"}

✅ https://uniflow4895.onrender.com/api/setup/universities
   Expected: {"success": true, "data": {"universities": [...]}}
```

### ☐ Step 7: Test Frontend

1. Open: https://uni-flow-phi.vercel.app
2. Open browser console: **F12** or **Right-click → Inspect**
3. Look for:
   ```
   ✅ 🚀 Axios API initialized with baseURL: https://uniflow4895.onrender.com/api
   ```
4. Check for:
   ```
   ❌ NO CORS errors
   ❌ NO 404 errors
   ❌ NO Network errors
   ```

### ☐ Step 8: Test Login Flow

1. Go to: https://uni-flow-phi.vercel.app/login
2. Enter test credentials
3. Click: **Login**
4. Expected: Redirects to dashboard
5. Check console: No errors

### ☐ Step 9: Check Render Logs

1. Go to: Render Dashboard → Your Service → **Logs**
2. Look for:
   ```
   ✅ ✅ MongoDB Connected: ...
   ✅ 🚀 UniFlow Server Running
   ✅ 🔒 Allowed CORS Origins: [... includes uni-flow-phi.vercel.app]
   ```
3. Should NOT see:
   ```
   ❌ ⚠️ CORS blocked for origin
   ❌ GET /setup/universities 404
   ❌ ❌ MongoDB connection failed
   ```

---

## 🎯 OPTIONAL - RECOMMENDED (15 minutes)

### ☐ Step 10: Commit Changes to GitHub

```bash
cd e:\AA-MernStack\React\UniFlow
git add .
git commit -m "Fix deployment: add env vars, favicon, update docs"
git push origin master
```

This triggers automatic redeployment on both Vercel and Render.

### ☐ Step 11: Add Favicon (Optional)

- Already configured to use `/vite.svg`
- To add custom favicon:
  1. Create/download a favicon.ico file
  2. Place in: `uniflow/public/favicon.ico`
  3. Update `index.html`: `<link rel="icon" type="image/x-icon" href="/favicon.ico" />`

### ☐ Step 12: Generate Secure JWT Secret

```bash
# In terminal or command prompt:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy output and update `JWT_SECRET` in Render environment variables.

---

## 🐛 TROUBLESHOOTING

### If you see CORS errors:

1. Check `FRONTEND_URL` in Render env vars
2. Should be: `https://uni-flow-phi.vercel.app`
3. No trailing slash!
4. Redeploy Render if changed

### If you see 404 errors:

1. Check `VITE_API_URL` in Vercel Dashboard
2. Should be: `https://uniflow4895.onrender.com/api`
3. Must include `/api` at the end!
4. Redeploy Vercel if changed

### If backend doesn't respond:

1. Render free tier sleeps after 15 min
2. Visit backend URL to wake it up
3. Check Render logs for errors
4. Verify MongoDB connection string

### If frontend is blank:

1. Check Vercel deployment logs
2. Look for build errors
3. Check browser console
4. Clear cache and reload

---

## 📚 DOCUMENTATION

For detailed information, see:
- **DEPLOYMENT_SUMMARY.md** - Complete overview
- **DEPLOYMENT_ANALYSIS_AND_FIXES.md** - Technical deep dive
- **DEPLOYMENT_QUICK_START.md** - Step-by-step guide

---

## ✅ COMPLETION CHECKLIST

Mark each as complete:

- [ ] Added `VITE_API_URL` to Vercel Dashboard
- [ ] Redeployed Vercel frontend
- [ ] Verified Render environment variables
- [ ] Configured MongoDB Atlas network access
- [ ] Tested backend health endpoints
- [ ] Tested frontend loading
- [ ] Tested login flow
- [ ] Checked Render logs
- [ ] No CORS errors
- [ ] No 404 errors
- [ ] All features working

---

## 🎉 SUCCESS!

When all items are checked:
- ✅ Your app is deployed
- ✅ Frontend and backend connected
- ✅ Database operational
- ✅ Ready for users!

**Frontend:** https://uni-flow-phi.vercel.app  
**Backend:** https://uniflow4895.onrender.com  
**Status:** 🚀 LIVE

---

**Estimated Time:** 30 minutes total  
**Last Updated:** November 12, 2025
