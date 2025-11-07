# 🔍 Registration & Login Debug Checklist

## Current Status
- ✅ Backend running on port 5000
- ✅ MongoDB connected
- ✅ CORS fixed for Vite (port 5173)
- ⏳ Frontend starting...

---

## Step-by-Step Debugging

### 1. ✅ Verify Backend is Running

Open browser: `http://localhost:5000/health`

**Expected response:**
```json
{
  "success": true,
  "message": "Server is running",
  "database": "Connected"
}
```

### 2. ✅ Check Universities Endpoint

Open browser: `http://localhost:5000/api/setup/universities`

**Expected:**
- List of universities from MongoDB
- **If empty array `[]`**: You need to seed universities first!

**To seed universities:**
```bash
cd backend
node seedUniversities.js
```

---

### 3. 🔍 Test Frontend (Browser Console)

1. Open your browser at frontend URL (likely `http://localhost:5173` or `http://localhost:5174`)
2. Open DevTools (F12)
3. Go to **Console** tab
4. Navigate to Register page

**Check for errors:**
- ❌ CORS errors → Backend CORS issue (FIXED)
- ❌ "Failed to load universities" → Backend not running or no data
- ✅ No errors → Good!

---

### 4. 🧪 Test Registration Flow

#### Register a Student:

1. Go to Register page
2. **Step 1 - Select Role**: Student
3. **Step 2 - Personal Info**:
   - Name: `Test Student`
   - Email: `test@university.edu`
   - Phone: `9876543210`
   - Password: `test123`
   - Confirm: `test123`

4. **Step 3 - Organization**:
   - University: Select from dropdown
   - Department: Select from dropdown
   - Roll Number: `CS21001`

5. Click "Create Account"

**Expected in Console (F12):**
```
POST http://localhost:5000/api/auth/register
Status: 201 Created
Response: {
  success: true,
  token: "eyJhbGc...",
  data: {
    user: {
      _id: "...",
      name: "Test Student",
      email: "test@university.edu",
      role: "student",
      isApproved: true
    }
  }
}
```

**What to watch:**
- ✅ API call succeeds (status 200/201)
- ✅ Token returned
- ✅ User object has `isApproved: true` (for students)
- ✅ Redirects to `/student/dashboard`

---

### 5. 🗄️ Verify Data in MongoDB

**Option A: MongoDB Atlas Dashboard**
1. Go to https://cloud.mongodb.com
2. Browse Collections
3. Open `uniflow` database
4. Check `users` collection
5. You should see your registered user

**Option B: Backend API**
```bash
# Test with curl or browser
GET http://localhost:5000/api/auth/me
Headers: {
  Authorization: Bearer <your_token>
}
```

---

### 6. 🐛 Common Issues & Fixes

#### Issue: "Universities dropdown is empty"
**Cause:** No universities in database  
**Fix:**
```bash
cd backend
node seedUniversities.js
```

#### Issue: "Registration succeeds but no redirect"
**Cause:** Frontend navigation issue  
**Check:**
- Console for JavaScript errors
- Network tab for API response
- Token was actually stored: `localStorage.getItem('token')`

#### Issue: "Data not saving to MongoDB"
**Cause:** API call failing  
**Check:**
- Backend logs in terminal
- Network tab shows POST request status
- Response body for error message

#### Issue: "Still showing fake data in dashboard"
**Cause:** Dashboard component using placeholder data  
**Note:** Dashboard integration is separate - this issue is about register/login only

---

### 7. 🔐 Test Login Flow

1. Go to Login page: `http://localhost:5173/login`
2. Enter credentials:
   - Email: `test@university.edu`
   - Password: `test123`
   - **Role: Student** (must match!)
3. Click "Sign in"

**Expected in Console:**
```
POST http://localhost:5000/api/auth/login
Status: 200 OK
Response: {
  success: true,
  token: "...",
  data: {
    user: {...}
  }
}
```

**What to watch:**
- ✅ Login API succeeds
- ✅ Token stored in localStorage
- ✅ Redirects to `/student/dashboard`

---

### 8. 🔍 Check Network Tab

1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. During registration/login, you should see:

**Registration:**
```
POST /api/setup/universities
POST /api/setup/departments
POST /api/auth/register
```

**Login:**
```
POST /api/auth/login
```

**Each should have:**
- Status: 200 or 201
- Response body with `success: true`

---

### 9. ✅ Success Criteria

Registration is working correctly if:

- [x] Universities load in dropdown (from MongoDB)
- [x] Departments load in dropdown (from MongoDB)
- [x] POST request to `/api/auth/register` succeeds
- [x] Response has `success: true`
- [x] Token is returned and stored
- [x] User data visible in MongoDB Atlas
- [x] Redirects to appropriate dashboard
- [x] Can login with same credentials

---

### 10. 🚨 If Still Not Working

**Check these in order:**

1. **Backend logs** (in backend terminal):
   - Look for any error messages
   - Check if requests are reaching the server

2. **Browser Console** (F12):
   - Any red errors?
   - Any failed network requests?

3. **Network Tab**:
   - Is the request being sent?
   - What's the status code?
   - What's in the response body?

4. **MongoDB Atlas**:
   - Is database accessible?
   - Do universities exist?
   - Can you see user data after registration?

5. **Environment Variables**:
   - Frontend `.env`: `VITE_API_URL=http://localhost:5000/api`
   - Backend `.env`: MongoDB URI is correct

---

## 📝 Quick Test Script

Copy this into browser console on Register page:

```javascript
// Check if API service is configured
console.log('API Base URL:', import.meta.env.VITE_API_URL);

// Check if AuthContext is available
console.log('AuthContext loaded:', typeof useAuth !== 'undefined');

// Test API connection
fetch('http://localhost:5000/api/setup/universities')
  .then(res => res.json())
  .then(data => console.log('Universities:', data))
  .catch(err => console.error('API Error:', err));
```

---

## 🎯 Next Steps

1. ✅ Ensure backend is running: `npm run dev` in backend folder
2. ✅ Ensure frontend is running: `npm run dev` in uniflow folder
3. 🔍 Open browser DevTools (F12)
4. 📝 Try registering a student
5. 👀 Watch Console and Network tabs
6. ✅ Verify data in MongoDB Atlas

**Report back with:**
- Any console errors
- Network request status codes
- Whether data appears in MongoDB
