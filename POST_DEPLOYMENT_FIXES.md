# Post-Deployment Fixes

After deploying your backend to Render.com, run these commands to fix database issues.

## 1. Fix AuditLog Index Error

**Error:**
```
E11000 duplicate key error collection: uniflow.auditlogs index: logId_1 dup key: { logId: null }
```

**Fix via Render Shell:**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your backend service
3. Click **"Shell"** tab
4. Run:
   ```bash
   npm run migrate:fix-auditlog
   ```

**Or fix via MongoDB Compass/Atlas:**

1. Connect to your MongoDB database
2. Select `uniflow` database
3. Select `auditlogs` collection
4. Go to "Indexes" tab
5. Delete the `logId_1` index

**Or via MongoDB Shell:**
```javascript
use uniflow
db.auditlogs.dropIndex('logId_1')
```

## 2. Verify All Issues Are Fixed

After running the migration, check your Render logs:

1. Go to Render Dashboard → Your Service → Logs
2. You should see:
   - ✅ No more "duplicate key error" messages
   - ✅ No more "trust proxy" validation errors
   - ✅ CORS working for all Vercel deployments (including preview URLs)

## 3. Test Your Application

1. Visit your frontend: https://uni-flow-phi.vercel.app
2. Try logging in
3. Check browser console - no errors
4. Check Render logs - clean logs with successful requests

---

## Summary of Fixes

✅ **Trust Proxy** - Added `app.set('trust proxy', 1)` for Render.com
✅ **CORS** - Now allows all `*.vercel.app` domains (preview deployments)
✅ **AuditLog** - Migration script to remove problematic index

All fixes are already in the code. Just need to:
1. Push to GitHub
2. Render will auto-deploy
3. Run the migration command via Render Shell
