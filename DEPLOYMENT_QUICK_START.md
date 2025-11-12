# 🚀 UniFlow Deployment Quick Start Guide

## 📋 **Pre-Deployment Checklist**

Before deploying, ensure you have:
- ✅ GitHub repository with latest code
- ✅ MongoDB Atlas account and cluster
- ✅ Vercel account (for frontend)
- ✅ Render account (for backend)
- ✅ Cloudinary account (optional, for file uploads)

---

## 🎯 **Quick Deployment Steps**

### **Step 1: Deploy Backend to Render** ⚙️

1. **Go to Render Dashboard:** https://dashboard.render.com

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `UniFlow`
   - Root Directory: `backend`

3. **Configure Service:**
   ```
   Name: uniflow4895 (or your preferred name)
   Region: Choose closest to you
   Branch: master (or main)
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free (or paid)
   ```

4. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable" → Add these:

   ```bash
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://uni-flow-phi.vercel.app
   
   # MongoDB Atlas - Get from MongoDB Atlas Dashboard
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/uniflow?retryWrites=true&w=majority
   
   # JWT - Generate secure secret
   JWT_SECRET=your_secure_random_64_character_string_here
   JWT_EXPIRES_IN=7d
   JWT_COOKIE_EXPIRES_IN=7
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=1000
   
   # Cloudinary (Optional - for file uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email (Optional - for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=noreply@uniflow.com
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://uniflow4895.onrender.com`

6. **Verify Backend:**
   - Visit: `https://uniflow4895.onrender.com/health`
   - Should show: `{"success": true, "message": "Server is running"}`

---

### **Step 2: Deploy Frontend to Vercel** 🌐

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `UniFlow`
   - Root Directory: `uniflow`
   - Framework Preset: Vite (auto-detected)

3. **Configure Build Settings:**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add:
     ```
     Key: VITE_API_URL
     Value: https://uniflow4895.onrender.com/api
     
     Environments: ✓ Production ✓ Preview ✓ Development
     ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Note your frontend URL: `https://uni-flow-phi.vercel.app`

6. **Verify Frontend:**
   - Visit: `https://uni-flow-phi.vercel.app`
   - Open browser console (F12)
   - Should see: `🚀 Axios API initialized with baseURL: https://uniflow4895.onrender.com/api`
   - No CORS errors or 404s

---

### **Step 3: Update Backend with Frontend URL** 🔄

1. **Go back to Render Dashboard**

2. **Update FRONTEND_URL:**
   - Select your web service
   - Environment → Edit
   - Update `FRONTEND_URL` to: `https://uni-flow-phi.vercel.app`
   - Save Changes

3. **Redeploy Backend:**
   - Manual Deploy → Deploy latest commit
   - Wait for redeployment

---

### **Step 4: Configure MongoDB Atlas** 🗄️

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com

2. **Network Access:**
   - Click "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" → `0.0.0.0/0`
   - Or add Render's specific IP addresses
   - Click "Confirm"

3. **Database User:**
   - Click "Database Access"
   - Ensure user has "Read and write to any database" permission
   - Note username and password

4. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your actual password
   - Use this in Render's `MONGO_URI` environment variable

---

## ✅ **Post-Deployment Verification**

### **Test Backend:**

```bash
# Health check
curl https://uniflow4895.onrender.com/health

# API health check
curl https://uniflow4895.onrender.com/api/health

# Universities endpoint
curl https://uniflow4895.onrender.com/api/setup/universities
```

### **Test Frontend:**

1. Open: https://uni-flow-phi.vercel.app
2. Open browser console (F12)
3. Check for:
   - ✅ No CORS errors
   - ✅ No 404 errors
   - ✅ API calls going to correct backend URL
4. Try login functionality
5. Check that redirects work properly

### **Check Render Logs:**

1. Go to Render Dashboard → Your Service → Logs
2. Should see:
   ```
   ✅ MongoDB Connected: ...
   🚀 UniFlow Server Running
   🔒 Allowed CORS Origins: [...includes uni-flow-phi.vercel.app...]
   ```
3. Should NOT see:
   ```
   ⚠️ CORS blocked for origin
   ❌ MongoDB connection failed
   GET /setup/universities 404
   ```

---

## 🐛 **Troubleshooting Common Issues**

### Issue 1: "CORS Error" in browser console

**Solution:**
1. Verify `FRONTEND_URL` in Render environment variables is: `https://uni-flow-phi.vercel.app`
2. Check Render logs for CORS messages
3. Ensure no trailing slash in URLs
4. Redeploy backend after env var changes

### Issue 2: "404 Not Found" for API calls

**Solution:**
1. Verify `VITE_API_URL` in Vercel is: `https://uniflow4895.onrender.com/api`
2. Note the `/api` at the end is required!
3. Redeploy frontend after env var changes
4. Clear browser cache

### Issue 3: "Network Error" or no response

**Solution:**
1. Check if Render backend is awake (free tier sleeps after 15 min inactivity)
2. Visit backend URL directly to wake it up
3. Check Render logs for startup errors
4. Verify MongoDB connection string is correct

### Issue 4: MongoDB connection fails

**Solution:**
1. Verify `MONGO_URI` format is correct
2. Check password doesn't have special characters (URL encode if needed)
3. Verify Network Access in MongoDB Atlas allows `0.0.0.0/0`
4. Check database user has correct permissions

### Issue 5: Blank page on Vercel

**Solution:**
1. Check Vercel deployment logs for build errors
2. Verify `dist/` folder was created
3. Check browser console for JavaScript errors
4. Verify all dependencies are installed

---

## 🔄 **Continuous Deployment Setup**

### **Automatic Deployments:**

**Vercel (Frontend):**
- Automatically deploys on every push to `master` branch
- Preview deployments for pull requests
- No action needed - already configured

**Render (Backend):**
- Automatically deploys on every push to `master` branch
- Can configure branch name in Render settings
- Already configured if you connected GitHub repo

### **Manual Redeployment:**

**Vercel:**
1. Dashboard → Deployments
2. Click "..." → "Redeploy"

**Render:**
1. Dashboard → Your Service
2. Click "Manual Deploy" → "Deploy latest commit"

---

## 🔐 **Security Best Practices**

### **Before Going to Production:**

1. **Change JWT_SECRET:**
   ```bash
   # Generate secure secret:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Restrict MongoDB Access:**
   - Instead of `0.0.0.0/0`, add specific Render IP addresses
   - Check Render documentation for IP ranges

3. **Enable Rate Limiting:**
   - Already configured: 1000 requests per 15 minutes
   - Adjust in environment variables if needed

4. **Review CORS Origins:**
   - Remove unnecessary development origins
   - Keep only production URLs

5. **Set Secure Cookies:**
   - Already configured with `httpOnly`
   - Cookies only sent over HTTPS in production

---

## 📊 **Monitoring & Logs**

### **Vercel:**
- Dashboard → Project → Deployments → Click deployment → "View Function Logs"
- Real-time logs: `vercel logs`

### **Render:**
- Dashboard → Your Service → Logs tab
- Real-time logs shown automatically
- Can filter by date/time

### **MongoDB Atlas:**
- Database → Metrics
- Monitor connection count, operations per second
- Set up alerts for issues

---

## 💰 **Cost Optimization**

### **Free Tier Limitations:**

**Vercel Free:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ⚠️ Limited to 1 concurrent build

**Render Free:**
- ✅ 750 hours/month (enough for 1 service)
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ Slower cold starts
- ⚠️ 512MB RAM

**MongoDB Atlas Free (M0):**
- ✅ 512MB storage
- ✅ Shared RAM
- ⚠️ Limited to 100 connections
- ⚠️ No backups

### **Upgrade Recommendations:**

1. **Start with Free Tier** - Good for development/testing
2. **Upgrade Render** ($7/mo) - If you need:
   - No sleep time
   - Faster response times
   - More RAM
3. **Upgrade MongoDB** ($9/mo) - If you need:
   - More storage
   - Automated backups
   - Better performance
4. **Vercel Pro** ($20/mo) - Usually not needed unless:
   - High bandwidth usage
   - Need more concurrent builds

---

## 📞 **Support & Resources**

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/
- **Express.js:** https://expressjs.com/
- **React + Vite:** https://vitejs.dev/

---

## ✨ **Success Criteria**

Your deployment is successful when:

1. ✅ Backend health check returns 200 OK
2. ✅ Frontend loads without errors
3. ✅ No CORS errors in browser console
4. ✅ Login functionality works end-to-end
5. ✅ Database operations work (create/read/update)
6. ✅ Render logs show successful MongoDB connection
7. ✅ API calls complete successfully

---

## 🎉 **You're Done!**

Your UniFlow application is now deployed and accessible worldwide:
- **Frontend:** https://uni-flow-phi.vercel.app
- **Backend:** https://uniflow4895.onrender.com
- **Database:** MongoDB Atlas

**Next Steps:**
- Add real users and test thoroughly
- Monitor logs for any issues
- Set up error tracking (optional: Sentry)
- Configure custom domain (optional)
- Set up CI/CD tests (optional)

---

**Last Updated:** November 12, 2025  
**Status:** ✅ Ready for deployment
