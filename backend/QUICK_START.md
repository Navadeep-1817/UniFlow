# UniFlow Backend - Quick Start Guide

## 🚀 Getting Started with Registration & Login

This guide will help you set up the system and test registration/login functionality.

---

## Step 1: Initialize the System

Before you can register users, you need to create a University and Super Admin in the database.

### Using PowerShell:
```powershell
# Initialize system (creates Test University and Super Admin)
Invoke-RestMethod -Uri "http://localhost:5000/api/setup/init" -Method Post
```

### Using curl:
```bash
curl -X POST http://localhost:5000/api/setup/init
```

**Expected Response:**
```json
{
  "success": true,
  "message": "System initialized successfully! Use these IDs for registration.",
  "data": {
    "university": {
      "id": "673b1234567890abcdef1234",
      "name": "Test University",
      "code": "TEST_UNI"
    },
    "superAdmin": {
      "id": "673b1234567890abcdef5678",
      "email": "superadmin@uniflow.com",
      "note": "Default password: admin123"
    },
    "nextSteps": [
      "1. Use this university ID in registration",
      "2. Create departments using /api/setup/department",
      "3. Register users with proper IDs"
    ]
  }
}
```

**⚠️ IMPORTANT:** Save the `university.id` - you'll need it for registration!

---

## Step 2: Create a Department (Optional for Students)

### Using PowerShell:
```powershell
$body = @{
    name = "Computer Science"
    code = "CS"
    universityId = "YOUR_UNIVERSITY_ID_FROM_STEP_1"
    description = "Department of Computer Science & Engineering"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/setup/department" -Method Post -Body $body -ContentType "application/json"
```

### Using curl:
```bash
curl -X POST http://localhost:5000/api/setup/department \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Computer Science",
    "code": "CS",
    "universityId": "YOUR_UNIVERSITY_ID_FROM_STEP_1",
    "description": "Department of Computer Science & Engineering"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "department": {
      "id": "673b1234567890abcdef9012",
      "name": "Computer Science",
      "code": "CS",
      "university": "Test University"
    }
  }
}
```

---

## Step 3: Register a Student (EASIEST METHOD)

### Method A: Quick Register (No IDs needed!)

**Using PowerShell:**
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
    phone = "1234567890"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/setup/quick-register" -Method Post -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 5
$token = $response.token
Write-Host "✅ Token saved: $token"
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/setup/quick-register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Quick registration successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "673b1234567890abcdef3456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "student": {
      "id": "673b1234567890abcdef7890",
      "rollNumber": "STU1699264800000"
    }
  }
}
```

### Method B: Full Register (With University/Department IDs)

**Using PowerShell:**
```powershell
$body = @{
    name = "Jane Smith"
    email = "jane@example.com"
    password = "password123"
    phone = "9876543210"
    role = "student"
    university = "YOUR_UNIVERSITY_ID"
    department = "YOUR_DEPARTMENT_ID"
    rollNumber = "2024CS001"
    year = "2024"
    batch = "2024-2028"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

---

## Step 4: Login

**Using PowerShell:**
```powershell
$body = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 5
$token = $response.token
Write-Host "✅ Login successful! Token: $token"
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "673b1234567890abcdef3456",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "student",
      "isApproved": true,
      "isActive": true
    }
  }
}
```

---

## Step 5: Test Protected Route

Use the token from login to access protected routes:

**Using PowerShell:**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
```

**Using curl:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 Complete PowerShell Test Script

Copy and run this entire script to test everything:

```powershell
# Step 1: Initialize System
Write-Host "🚀 Step 1: Initializing system..." -ForegroundColor Cyan
$init = Invoke-RestMethod -Uri "http://localhost:5000/api/setup/init" -Method Post
$universityId = $init.data.university.id
Write-Host "✅ University ID: $universityId" -ForegroundColor Green

# Step 2: Create Department
Write-Host "`n🏫 Step 2: Creating department..." -ForegroundColor Cyan
$deptBody = @{
    name = "Computer Science"
    code = "CS"
    universityId = $universityId
} | ConvertTo-Json

$dept = Invoke-RestMethod -Uri "http://localhost:5000/api/setup/department" -Method Post -Body $deptBody -ContentType "application/json"
$departmentId = $dept.data.department.id
Write-Host "✅ Department ID: $departmentId" -ForegroundColor Green

# Step 3: Quick Register
Write-Host "`n👤 Step 3: Quick registering user..." -ForegroundColor Cyan
$registerBody = @{
    name = "Test Student"
    email = "test@example.com"
    password = "password123"
    phone = "1234567890"
} | ConvertTo-Json

$register = Invoke-RestMethod -Uri "http://localhost:5000/api/setup/quick-register" -Method Post -Body $registerBody -ContentType "application/json"
Write-Host "✅ Registration successful!" -ForegroundColor Green
Write-Host "User ID: $($register.data.user.id)"
Write-Host "Student ID: $($register.data.student.id)"

# Step 4: Login
Write-Host "`n🔐 Step 4: Logging in..." -ForegroundColor Cyan
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $login.token
Write-Host "✅ Login successful!" -ForegroundColor Green
Write-Host "Token: $token"

# Step 5: Get Current User
Write-Host "`n📄 Step 5: Getting user profile..." -ForegroundColor Cyan
$headers = @{
    Authorization = "Bearer $token"
}

$me = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
Write-Host "✅ Profile retrieved!" -ForegroundColor Green
$me.data.user | Format-List

Write-Host "`n🎉 All tests passed! Backend is working correctly!" -ForegroundColor Green
```

---

## 🛠️ Useful Helper Endpoints

### Get All Universities
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/setup/universities" -Method Get
```

### Get All Departments
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/setup/departments" -Method Get
```

### Login as Super Admin
```powershell
$body = @{
    email = "superadmin@uniflow.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

---

## ❌ Troubleshooting

### Error: "System already initialized"
The database already has a university. You can:
1. Get the university ID: `Invoke-RestMethod -Uri "http://localhost:5000/api/setup/universities" -Method Get`
2. Use that ID for registration

### Error: "User already exists"
The email is already registered. Try:
1. Use a different email
2. Or login with existing credentials

### Error: "Cast to ObjectId failed"
You're using invalid IDs. Make sure to:
1. Run `/api/setup/init` first
2. Copy the actual IDs from the response
3. Use those IDs in your registration request

### Error: "Route not found"
Make sure:
1. Server is running
2. You're using the correct URL
3. Setup routes are enabled in server.js

---

## 🎯 Quick Commands Reference

```powershell
# Initialize
Invoke-RestMethod -Uri "http://localhost:5000/api/setup/init" -Method Post

# Quick Register
$body = @{ name="Test"; email="test@test.com"; password="pass123"; phone="1234567890" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/setup/quick-register" -Method Post -Body $body -ContentType "application/json"

# Login
$body = @{ email="test@test.com"; password="pass123" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.token

# Get Profile
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers @{ Authorization="Bearer $token" }
```

---

## 📚 Next Steps

1. ✅ Registration & Login working
2. Try other auth endpoints (update profile, change password, etc.)
3. Create more users with different roles
4. Test admin approval workflow
5. Implement other controllers (events, attendance, etc.)

---

## 🔒 Security Notes

**⚠️ IMPORTANT: Remove setup routes in production!**

The `/api/setup/*` endpoints should be disabled or removed before deploying to production. They are only for development/testing purposes.

To disable, comment out this line in `server.js`:
```javascript
// app.use('/api/setup', require('./routes/setupRoutes'));
```

---

Happy coding! 🎉
