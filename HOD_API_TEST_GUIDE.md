# HOD Department APIs - Quick Test Guide

## ✅ Frontend Error Fixed

**Issue:** Unclosed `<tr>` tag and orphaned delete button in StudentManagement.jsx
**Status:** FIXED ✅

**Changes Made:**
1. Removed orphaned delete button that was outside the action buttons div
2. Added missing fields (`eventsParticipated`, `performanceMetrics`) to prevent undefined errors
3. Added missing fields (`workload`, `eventsAssigned`) to FacultyManagement.jsx

## 🧪 Postman Test Collection

### Import Instructions:
1. Open Postman
2. Click "Import" button
3. Select the file: `POSTMAN_HOD_TESTS.json`
4. The collection "HOD Department APIs" will be imported with 7 requests

### Setup Environment Variables:
1. Create a new environment in Postman (optional)
2. After running "1. Login as HOD", the token will be auto-saved to environment variable `hod_token`
3. All subsequent requests will use this token automatically

---

## 📋 Test Requests

### 1️⃣ Login as HOD
**Method:** POST  
**URL:** `http://localhost:5000/api/auth/login`  
**Body:**
```json
{
  "email": "hod.cse@tui.edu.in",
  "password": "hod123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "...",
      "lastName": "...",
      "email": "hod.cse@tui.edu.in",
      "role": "academic_admin_hod",
      "department": { ... }
    }
  }
}
```

---

### 2️⃣ Get Department Faculty
**Method:** GET  
**URL:** `http://localhost:5000/api/hod/faculty`  
**Headers:**
```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

**Expected Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "673e1234567890abcdef1234",
      "firstName": "Priya",
      "lastName": "Menon",
      "email": "priya.menon@tui.edu.in",
      "phone": "+91-9876543210",
      "role": "faculty",
      "department": {
        "_id": "...",
        "name": "Computer Science & Engineering"
      },
      "specialization": "Artificial Intelligence",
      "qualification": "Ph.D in Computer Science",
      "experience": "10 years",
      "isApproved": true,
      "profilePicture": null
    }
    // ... more faculty members
  ]
}
```

**What to Check:**
- ✅ Status code: 200
- ✅ `success: true`
- ✅ `data` is an array
- ✅ Each faculty member has required fields
- ✅ All faculty belong to HOD's department (Computer Science)

---

### 3️⃣ Get Department Students
**Method:** GET  
**URL:** `http://localhost:5000/api/hod/students`  
**Headers:**
```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

**Expected Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "673e1234567890abcdef5678",
      "firstName": "Rahul",
      "lastName": "Kumar",
      "email": "student1@tui.edu.in",
      "rollNumber": "21CS001",
      "phone": "+91-9876543211",
      "role": "student",
      "department": {
        "_id": "...",
        "name": "Computer Science & Engineering"
      },
      "year": 2,
      "section": "A",
      "cgpa": 8.5,
      "isApproved": true,
      "profilePicture": null
    }
    // ... more students
  ]
}
```

**What to Check:**
- ✅ Status code: 200
- ✅ `success: true`
- ✅ `data` is an array
- ✅ Each student has required fields (rollNumber, year, section, cgpa)
- ✅ All students belong to HOD's department (Computer Science)

---

### 4️⃣ Filter Students by Year
**Method:** GET  
**URL:** `http://localhost:5000/api/hod/students?year=1`  

**Query Parameters:**
- `year` - Filter by year (1, 2, 3, or 4)

**Expected:** Returns only students from specified year

---

### 5️⃣ Filter Students by Section
**Method:** GET  
**URL:** `http://localhost:5000/api/hod/students?section=A`  

**Query Parameters:**
- `section` - Filter by section (A, B, C, etc.)

**Expected:** Returns only students from specified section

---

### 6️⃣ Search Students
**Method:** GET  
**URL:** `http://localhost:5000/api/hod/students?search=rahul`  

**Query Parameters:**
- `search` - Search by name, email, or roll number

**Expected:** Returns students matching the search query

---

### 7️⃣ Get Dashboard Stats
**Method:** GET  
**URL:** `http://localhost:5000/api/hod/dashboard-stats`  

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalFaculty": 5,
    "totalStudents": 10,
    "totalEvents": 3,
    "ongoingEvents": 1,
    "upcomingEvents": 2
  }
}
```

---

## 🔍 Troubleshooting

### Error: "Department not found for this HOD"
**Solution:** The HOD user needs to have a department assigned
```javascript
// In MongoDB
db.users.updateOne(
  { email: "hod.cse@tui.edu.in" },
  { $set: { department: ObjectId("your_department_id") } }
)
```

### Error: "Authentication required" / 401 Unauthorized
**Solution:** 
1. Make sure you logged in first (Request #1)
2. Copy the token from the response
3. Add it to Authorization header: `Bearer <token>`
4. Or use Postman environment variable: `{{hod_token}}`

### Error: No faculty/students returned (empty array)
**Possible Reasons:**
1. No users with role `faculty` or `student` in the database
2. Users don't have `department` field set
3. Department ID doesn't match HOD's department
4. Users have `isApproved: false`

**Check Database:**
```javascript
// Find all faculty
db.users.find({ role: "faculty", isApproved: true })

// Find all students  
db.users.find({ role: "student", isApproved: true })

// Check HOD's department
db.users.findOne({ email: "hod.cse@tui.edu.in" }, { department: 1 })
```

---

## 📊 Expected Data Flow

1. **HOD logs in** → Receives JWT token
2. **Frontend calls `/api/hod/faculty`** → Backend:
   - Verifies JWT token
   - Gets HOD user from token
   - Finds HOD's department
   - Queries all users with:
     - `role: 'faculty'`
     - `department: <HOD's department>`
     - `isApproved: true`
   - Returns filtered faculty list
3. **Frontend displays** faculty in table with View Details button

Same flow for students!

---

## 🎯 Success Criteria

✅ All 7 Postman requests return 200 status  
✅ Faculty endpoint returns only CS department faculty  
✅ Students endpoint returns only CS department students  
✅ Filters and search work correctly  
✅ Frontend displays data without errors  
✅ No JSX compilation errors  
✅ No console errors in browser  

---

## 🚀 Quick Start

1. **Import Collection**: Import `POSTMAN_HOD_TESTS.json` to Postman
2. **Start Backend**: `cd backend && npm start`
3. **Start Frontend**: `cd uniflow && npm run dev`
4. **Run Request #1**: Login as HOD → Save token
5. **Run Request #2**: Get Faculty → Verify response
6. **Run Request #3**: Get Students → Verify response
7. **Open Browser**: Navigate to Faculty Management page
8. **Verify**: Faculty list auto-loads from API

Done! 🎉
