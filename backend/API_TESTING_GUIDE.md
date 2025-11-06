# UniFlow Authentication API - Testing Guide

## Server Status
✅ Server is running on http://localhost:5000
✅ MongoDB connected successfully
✅ All authentication routes are configured

## Available API Endpoints

### Public Routes (No Authentication Required)

#### 1. Register a New User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "student",
  "university": "UNIVERSITY_ID",
  "department": "DEPARTMENT_ID",
  "rollNumber": "2024CS001",
  "year": "2024",
  "batch": "2024-2028"
}
```

**Roles Available:**
- `student` - Auto-approved
- `faculty` - Requires admin approval
- `academic_admin_hod` - Requires approval
- `academic_admin_tp` - Requires approval
- `non_academic_faculty_head` - Requires approval
- `non_academic_team_rep` - Requires approval
- `superadmin` - Cannot register through this endpoint

#### 2. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response includes:**
- JWT token
- User data
- Cookie with token

#### 3. Forgot Password
```http
POST http://localhost:5000/api/auth/forgotpassword
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### 4. Reset Password
```http
PUT http://localhost:5000/api/auth/resetpassword/:resettoken
Content-Type: application/json

{
  "password": "newpassword123"
}
```

### Protected Routes (Authentication Required)
**Add header:** `Authorization: Bearer YOUR_JWT_TOKEN`

#### 5. Get Current User
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 6. Logout
```http
POST http://localhost:5000/api/auth/logout
Authorization: Bearer YOUR_JWT_TOKEN
```

#### 7. Update User Details
```http
PUT http://localhost:5000/api/auth/updatedetails
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543210"
}
```

#### 8. Update Password
```http
PUT http://localhost:5000/api/auth/updatepassword
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

#### 9. Update Role-Specific Profile
```http
PUT http://localhost:5000/api/auth/update-profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "cgpa": 8.5,
  "skills": ["JavaScript", "React"]
}
```

### Admin Only Routes
**Requires admin roles:** superadmin, academic_admin_hod, academic_admin_tp, non_academic_faculty_head

#### 10. Get Pending Approvals
```http
GET http://localhost:5000/api/auth/pending-approvals
Authorization: Bearer ADMIN_JWT_TOKEN
```

#### 11. Approve User
```http
PUT http://localhost:5000/api/auth/approve/:userId
Authorization: Bearer ADMIN_JWT_TOKEN
```

#### 12. Reject User
```http
PUT http://localhost:5000/api/auth/reject/:userId
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "reason": "Invalid credentials"
}
```

#### 13. Deactivate User
**Requires:** superadmin or academic_admin_hod
```http
PUT http://localhost:5000/api/auth/deactivate/:userId
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "reason": "Policy violation"
}
```

#### 14. Activate User
**Requires:** superadmin or academic_admin_hod
```http
PUT http://localhost:5000/api/auth/activate/:userId
Authorization: Bearer ADMIN_JWT_TOKEN
```

## Testing with cURL

### Register Example
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "student",
    "university": "673b12345678901234567890",
    "department": "673b12345678901234567891",
    "rollNumber": "2024CS999",
    "year": "2024",
    "batch": "2024-2028"
  }'
```

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Current User Example
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing with PowerShell

### Register Example
```powershell
$body = @{
    name = "Test Student"
    email = "test@example.com"
    password = "password123"
    phone = "1234567890"
    role = "student"
    university = "673b12345678901234567890"
    department = "673b12345678901234567891"
    rollNumber = "2024CS999"
    year = "2024"
    batch = "2024-2028"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### Login Example
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.token
```

### Get Current User Example
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "token": "jwt_token_here",
  "data": {
    "user": { ... }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Important Notes

1. **Students are auto-approved** - They can login immediately after registration
2. **Other roles need approval** - Admins must approve them before they can login
3. **JWT Token Validity** - Default is 7 days
4. **Password Requirements** - Minimum 6 characters
5. **Phone Format** - Must be 10 digits
6. **Super Admin** - Cannot be created through the registration endpoint

## Next Steps

1. Create University and Department documents in MongoDB first
2. Register a student account (auto-approved)
3. Use the token to test protected routes
4. Create a super admin manually in MongoDB to test admin routes

## Troubleshooting

- **401 Unauthorized**: Check if token is valid and included in headers
- **403 Forbidden**: User doesn't have permission or account not approved
- **400 Bad Request**: Check request body format and required fields
- **500 Server Error**: Check server logs and MongoDB connection
