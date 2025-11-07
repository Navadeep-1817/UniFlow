# 🧪 UniFlow Testing Guide - Register & Login Integration

## Quick Test Instructions

### Prerequisites
```bash
# Ensure both servers are running

# Terminal 1 - Backend
cd backend
npm run dev
# Should see: "🚀 UniFlow Server Running on Port: 5000"

# Terminal 2 - Frontend
cd uniflow
npm run dev
# Should see: "Local: http://localhost:5173"
```

---

## Test Scenario 1: Student Registration (Auto-Approved) ✅

### Steps:
1. Open browser: `http://localhost:5173`
2. You'll be redirected to `/register`
3. **Step 1 - Role Selection**:
   - Select: **Student**
   - Click "Next"

4. **Step 2 - Personal Info**:
   - Full Name: `John Doe`
   - Email: `john.student@university.edu`
   - Phone: `9876543210`
   - Password: `student123`
   - Confirm Password: `student123`
   - Click "Next"

5. **Step 3 - Organization Info**:
   - University: Select from dropdown (loaded from database)
   - Department: Select from dropdown (filtered by university)
   - Roll Number: `CS21001`
   - Click "Create Account"

### Expected Result:
- ✅ Success toast: "Registration successful! Redirecting to dashboard..."
- ✅ Auto-redirect to: `/student/dashboard`
- ✅ User is logged in (token stored)
- ✅ Can see student dashboard

### Verify in Browser DevTools:
```javascript
// Open Console and check:
localStorage.getItem('token')  // Should show JWT token
localStorage.getItem('user')   // Should show user object
```

---

## Test Scenario 2: Faculty Registration (Requires Approval) ⏳

### Steps:
1. Navigate to: `http://localhost:5173/register`
2. **Step 1 - Role Selection**:
   - Select: **Faculty**
   - Click "Next"

3. **Step 2 - Personal Info**:
   - Full Name: `Dr. Sarah Wilson`
   - Email: `sarah.faculty@university.edu`
   - Phone: `9876543211`
   - Password: `faculty123`
   - Confirm Password: `faculty123`
   - Click "Next"

4. **Step 3 - Organization Info**:
   - University: Select from dropdown
   - Department: Select from dropdown
   - Employee ID: `FAC12345`
   - Click "Create Account"

### Expected Result:
- ✅ Success toast: "Registration successful! Awaiting admin approval."
- ✅ Redirect to: `/pending-approval`
- ✅ Pending approval page shows:
  - User email: sarah.faculty@university.edu
  - Role: Faculty
  - Registration date
  - Approval timeline
  - "Check Status" button

### Test Pending Approval Features:
1. Click **"Check Status"** button
   - Should show: "Your account is still pending approval."
   
2. Click **"Logout"** button
   - Should redirect to `/login`
   - Auth data cleared

---

## Test Scenario 3: Login Flow 🔐

### Test 3A: Login as Student (Approved)
1. Navigate to: `http://localhost:5173/login`
2. **Fill in login form**:
   - Email: `john.student@university.edu`
   - Password: `student123`
   - Role: **Student** (IMPORTANT: Must match registered role)
   - Check "Remember me" (optional)
3. Click "Sign in"

### Expected Result:
- ✅ Success toast: "Login successful! Redirecting..."
- ✅ Redirect to: `/student/dashboard`
- ✅ Token stored in localStorage (if "Remember me" checked) or sessionStorage

---

### Test 3B: Login as Faculty (Unapproved)
1. Navigate to: `http://localhost:5173/login`
2. **Fill in login form**:
   - Email: `sarah.faculty@university.edu`
   - Password: `faculty123`
   - Role: **Faculty**
3. Click "Sign in"

### Expected Result:
- ❌ Error toast: "Your account is pending approval from an administrator."
- ⏳ Cannot login until approved

---

### Test 3C: Wrong Role Selected
1. Navigate to: `http://localhost:5173/login`
2. **Fill in login form**:
   - Email: `john.student@university.edu` (registered as student)
   - Password: `student123`
   - Role: **Faculty** (wrong role!)
3. Click "Sign in"

### Expected Result:
- ❌ Error toast: "Invalid credentials"
- ❌ Login fails

---

### Test 3D: Wrong Password
1. Navigate to: `http://localhost:5173/login`
2. **Fill in login form**:
   - Email: `john.student@university.edu`
   - Password: `wrongpassword`
   - Role: **Student**
3. Click "Sign in"

### Expected Result:
- ❌ Error toast: "Invalid credentials"
- ❌ Login fails

---

## Test Scenario 4: Role-Based Routing 🛣️

### Test Each Role Registration:

#### 4A: HOD (Head of Department)
**Register:**
- Role: **Head of Department (HOD)**
- Email: `hod@university.edu`
- Phone: `9876543212`
- Password: `hod123`
- University: Select from dropdown
- Department: Select from dropdown
- Employee ID: `HOD001`

**Expected:** Redirect to `/pending-approval`

---

#### 4B: Training & Placement Head
**Register:**
- Role: **Training & Placement Head**
- Email: `placement@university.edu`
- Phone: `9876543213`
- Password: `placement123`
- University: Select from dropdown
- Department: Select from dropdown

**Expected:** Redirect to `/pending-approval`

---

#### 4C: Student Body - Faculty Head
**Register:**
- Role: **Student Body - Faculty Head**
- Email: `facultyhead@university.edu`
- Phone: `9876543214`
- Password: `faculty123`
- University: Select from dropdown
- Student Body: Select from dropdown (different from department!)

**Expected:** Redirect to `/pending-approval`

---

#### 4D: Team Representative
**Register:**
- Role: **Student Body - Team Representative**
- Email: `teamrep@university.edu`
- Phone: `9876543215`
- Password: `teamrep123`
- University: Select from dropdown
- Student Body: Select from dropdown

**Expected:** Redirect to `/pending-approval`

---

## Test Scenario 5: Data Validation ✔️

### Test 5A: Email Validation
**Try invalid emails:**
- `notanemail` ❌
- `test@` ❌
- `@university.edu` ❌
- `test.university.edu` ❌
- `test@university.edu` ✅

### Test 5B: Phone Validation
**Try invalid phones:**
- `123` ❌ (too short)
- `abcdefghij` ❌ (not digits)
- `12345678901` ❌ (11 digits)
- `9876543210` ✅ (exactly 10 digits)

### Test 5C: Password Validation
**Try weak passwords:**
- `pass` ❌ (less than 6 characters)
- `12345` ❌ (less than 6 characters)
- `password123` ✅ (6+ characters)

### Test 5D: Password Confirmation
**Try mismatched passwords:**
- Password: `password123`
- Confirm: `password124` ❌
- Should show error: "Passwords do not match"

---

## Test Scenario 6: Dynamic Data Loading 🔄

### Test 6A: Universities Load
1. Navigate to Register Step 3
2. Click University dropdown
3. **Expected:** List of universities from MongoDB
4. **Verify:** Not hardcoded values

### Test 6B: Departments Load
1. Select a University first
2. Click Department dropdown
3. **Expected:** 
   - Departments filtered by selected university
   - Only departments belonging to that university shown
4. Change university selection
5. **Verify:** Department list updates

### Test 6C: Student Bodies Load
1. Register as "Faculty Head" or "Team Rep" role
2. Select a University
3. Click Student Body dropdown
4. **Expected:** Student bodies for that university
5. **Note:** Different from departments!

---

## Test Scenario 7: Session Persistence 💾

### Test 7A: Page Refresh (Remember Me = ON)
1. Login with "Remember me" checked
2. Close browser or refresh page
3. Check DevTools:
   ```javascript
   localStorage.getItem('token')  // Should still exist
   localStorage.getItem('user')   // Should still exist
   ```
4. Navigate to dashboard route
5. **Expected:** Still logged in

### Test 7B: Page Refresh (Remember Me = OFF)
1. Login WITHOUT "Remember me"
2. Refresh page
3. Check DevTools:
   ```javascript
   sessionStorage.getItem('token')  // Should exist
   localStorage.getItem('token')    // Should NOT exist
   ```
4. Close browser tab completely
5. Open new tab and navigate to dashboard
6. **Expected:** Logged out (sessionStorage cleared)

---

## Test Scenario 8: Logout 🚪

### Test Logout Flow:
1. Login as any user
2. Navigate to dashboard
3. Click "Logout" button (if implemented) or:
   - Go to `/pending-approval` page
   - Click "Logout"
4. **Expected:**
   - Redirect to `/login`
   - Token cleared from storage
   - Cannot access protected routes
   - Must login again

### Verify Logout:
```javascript
// Check in DevTools Console:
localStorage.getItem('token')     // Should be null
sessionStorage.getItem('token')   // Should be null
```

---

## Debugging Tools 🔧

### Browser DevTools Console Commands:

```javascript
// Check current auth status
localStorage.getItem('token')
localStorage.getItem('user')

// Parse user data
JSON.parse(localStorage.getItem('user'))

// Check API base URL
import.meta.env.VITE_API_URL

// Clear all auth data
localStorage.clear()
sessionStorage.clear()
```

### Network Tab Inspection:
1. Open DevTools → Network tab
2. Filter by "XHR" or "Fetch"
3. Look for:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `GET /api/setup/universities`
   - `GET /api/setup/departments`

4. Check request headers:
   - `Authorization: Bearer <token>`
   - `Content-Type: application/json`

5. Check response:
   - Status: 200/201 for success
   - Response body has `success: true`
   - Token returned on login

---

## Common Errors & Solutions 🚨

### Error: "Failed to load universities"
**Cause:** Backend not running or database not connected
**Solution:** 
```bash
cd backend
npm run dev
# Check: "🚀 UniFlow Server Running"
```

### Error: "Network Error"
**Cause:** Backend URL incorrect or CORS issue
**Solution:** 
1. Check `.env` file: `VITE_API_URL=http://localhost:5000/api`
2. Verify backend CORS allows frontend URL

### Error: "Invalid credentials"
**Causes:**
1. Wrong email/password
2. Wrong role selected
3. Account not approved
4. Account deactivated

**Solution:** Check each condition

### Error: "User with this email already exists"
**Cause:** Trying to register same email twice
**Solution:** Use different email or login with existing account

---

## Success Criteria ✅

Your integration is working correctly if:

- [x] Universities load dynamically from database
- [x] Departments filter by selected university
- [x] Student registration auto-approves and logs in
- [x] Faculty/Admin registration redirects to pending approval
- [x] Login validates role matching
- [x] Wrong role login fails
- [x] Wrong password login fails
- [x] Approved users can login
- [x] Unapproved users cannot login
- [x] Token stored on successful login
- [x] User redirected to correct dashboard
- [x] Session persists on page refresh (if Remember Me)
- [x] Logout clears auth data
- [x] Form validation works (email, phone, password)
- [x] Error messages display correctly

---

## Performance Checks ⚡

### Measure Load Times:
1. Open DevTools → Performance tab
2. Record while:
   - Loading register page
   - Submitting registration
   - Loading login page
   - Submitting login

### Expected Times:
- Page load: < 1 second
- API calls: < 500ms (local)
- Universities fetch: < 200ms
- Departments fetch: < 200ms
- Registration: < 1 second
- Login: < 500ms

---

## Load Testing (Optional) 🔥

### Simple Load Test with curl:

```bash
# Test registration endpoint
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"User$i\",
      \"email\": \"user$i@test.edu\",
      \"password\": \"test123\",
      \"phone\": \"987654321$i\",
      \"role\": \"student\",
      \"university\": \"<university_id>\",
      \"department\": \"<department_id>\",
      \"rollNumber\": \"CS2100$i\",
      \"year\": \"1\",
      \"batch\": \"2024\"
    }" &
done
```

---

## Final Verification Checklist ✅

Before considering testing complete:

- [ ] Can register student and login immediately
- [ ] Can register faculty (gets pending approval)
- [ ] Can register all role types
- [ ] Login works with correct credentials
- [ ] Login fails with wrong credentials
- [ ] Login fails with wrong role selected
- [ ] Universities load from database
- [ ] Departments filter by university
- [ ] Student bodies load for non-academic roles
- [ ] Form validation catches errors
- [ ] Error messages are user-friendly
- [ ] Success messages display correctly
- [ ] Token stored on login
- [ ] User data cached correctly
- [ ] Logout clears all data
- [ ] Session persists with "Remember Me"
- [ ] Session expires without "Remember Me"
- [ ] Role-based routing works
- [ ] Network requests succeed (check DevTools)
- [ ] No console errors
- [ ] No memory leaks

---

## 🎉 All Tests Passed?

**Congratulations!** Your UniFlow authentication system is fully functional and ready for production! 🚀

Move on to testing other features:
- Dashboard components
- Event management
- Faculty allocation
- Student registrations
- Certificates
- Analytics

---

## Need Help? 🆘

If tests fail:
1. Check Backend logs in terminal
2. Check Browser console for errors
3. Check Network tab for failed requests
4. Verify MongoDB connection
5. Ensure all dependencies installed
6. Clear browser cache and try again

**Happy Testing!** 🎊
