# Trainer Registration & Management System - Complete Working Flow

## 🎯 Overview
This document describes the complete end-to-end flow for trainers to register, login, manage their profile, view assigned events, and for HODs to allocate trainers to events.

---

## 📋 Table of Contents
1. [Trainer Registration Flow](#trainer-registration-flow)
2. [Trainer Login Flow](#trainer-login-flow)
3. [Trainer Dashboard](#trainer-dashboard)
4. [HOD Trainer Allocation](#hod-trainer-allocation)
5. [API Endpoints](#api-endpoints)
6. [Testing Guide](#testing-guide)

---

## 1. Trainer Registration Flow

### Step 1: Access Registration Page
- **URL**: `http://localhost:5173/trainer/register`
- **Action**: Navigate to trainer registration page

### Step 2: Fill Registration Form
Required fields:
- **Name**: Full name of the trainer
- **Email**: Unique email address (will be used for login)
- **Password**: Minimum 6 characters
- **Phone**: 10-digit phone number
- **Type**: Select from:
  - External (default)
  - Internal (requires University & Department selection)
  - Guest
- **Organization**: Company/Institution name
- **Designation**: Job title/position
- **Experience**: Years of experience (number)
- **Qualification**: Educational qualifications

Optional fields:
- Expertise domains and skills
- Specialization areas
- Bio/description

### Step 3: Submit Registration
- **API Call**: `POST /api/trainers/register`
- **Response**: 
  - Success: Registration successful, account pending verification
  - Token is generated and stored
  - Status: `isVerified: false`

### Step 4: Await Verification
- Trainer can login but will see "Pending Verification" badge
- HOD/Admin must verify the trainer account
- Once verified, trainer gets full access

---

## 2. Trainer Login Flow

### Step 1: Access Login Page
- **URL**: `http://localhost:5173/trainer/login`

### Step 2: Enter Credentials
- Email
- Password

### Step 3: Authentication
- **API Call**: `POST /api/trainers/login`
- **Validation**:
  - Email & password match
  - Account is active
- **Response**:
  - JWT token stored in `localStorage` as `trainerToken`
  - Trainer data stored as `trainerData`
  - Redirect to `/trainer/dashboard`

---

## 3. Trainer Dashboard

### Features:
1. **Welcome Card**
   - Trainer name
   - Designation & Organization
   - Verification status badge
   - Average rating display

2. **Statistics Cards**
   - Total Events
   - Completed Events
   - Upcoming Events
   - Ongoing Events

3. **Quick Actions**
   - View Profile
   - My Events
   - Schedule

4. **Ongoing Events Section**
   - Shows currently happening events
   - Event title, dates, venue
   - Status badge

5. **Upcoming Events Section**
   - Next 5 upcoming events
   - Full event details
   - Click to view more

### Data Flow:
```javascript
// On Dashboard Load
GET /api/trainers/statistics  → Stats
GET /api/trainers/profile     → Trainer Info
GET /api/trainers/events      → Categorized Events
```

---

## 4. HOD Trainer Allocation

### Step 1: HOD Views Events
- Navigate to `/hod/events`
- View department events list

### Step 2: Select Event for Trainer Allocation
- Click on event
- Click "Allocate Trainer" button

### Step 3: View Available Trainers
- **API Call**: `GET /api/hod/trainers?search=&expertise=`
- **Returns**: All verified trainers
  - Sorted by rating (highest first)
  - Includes: name, email, organization, experience, expertise
  - Filters available: search, expertise domain

### Step 4: Select & Allocate Trainer
- **API Call**: `PUT /api/hod/events/:eventId/allocate-trainer`
- **Body**: `{ trainerId: "trainer_id" }`
- **Validation**:
  - Trainer must exist
  - Trainer must be verified
  - Event belongs to HOD's department

### Step 5: Trainer Gets Notified
- Event appears in trainer's dashboard
- Visible in "Upcoming Events" or "Ongoing Events"
- Trainer can view full event details

---

## 5. API Endpoints

### Trainer Auth Routes
```
POST   /api/trainers/register          - Register new trainer (Public)
POST   /api/trainers/login             - Login trainer (Public)
GET    /api/trainers/profile           - Get trainer profile (Protected)
PUT    /api/trainers/profile           - Update trainer profile (Protected)
PUT    /api/trainers/update-password   - Change password (Protected)
```

### Trainer Portal Routes
```
GET    /api/trainers/statistics        - Get dashboard stats (Protected)
GET    /api/trainers/events            - Get assigned events (Protected, Verified)
GET    /api/trainers/schedule          - Get calendar schedule (Protected, Verified)
PUT    /api/trainers/availability      - Update availability (Protected)
```

### HOD Routes
```
GET    /api/hod/trainers               - Get all verified trainers (Protected, HOD)
PUT    /api/hod/events/:id/allocate-trainer  - Allocate trainer to event (Protected, HOD)
```

### Admin Routes (for managing trainers)
```
GET    /api/trainers/admin/all         - Get all trainers (Protected, Admin)
POST   /api/trainers/admin/create      - Create trainer manually (Protected, Admin)
PUT    /api/trainers/admin/:id         - Update trainer (Protected, Admin)
DELETE /api/trainers/admin/:id         - Delete trainer (Protected, SuperAdmin)
```

---

## 6. Testing Guide

### Test 1: Trainer Registration
```bash
# Using Postman or cURL
POST http://localhost:5000/api/trainers/register
Content-Type: application/json

{
  "name": "Dr. John Smith",
  "email": "john.smith@example.com",
  "password": "trainer123",
  "phone": "9876543210",
  "type": "External",
  "organization": "Tech Solutions Inc.",
  "designation": "Senior Consultant",
  "experience": 10,
  "qualification": "Ph.D. in Computer Science",
  "expertise": [
    {
      "domain": "Machine Learning",
      "skills": ["Python", "TensorFlow", "Deep Learning"],
      "yearsOfExperience": 8
    }
  ],
  "bio": "Experienced trainer in AI and ML with 10+ years of industry experience."
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Registration successful! Please wait for admin verification.",
  "data": {
    "_id": "...",
    "name": "Dr. John Smith",
    "email": "john.smith@example.com",
    "type": "External",
    "isVerified": false,
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Test 2: Trainer Login
```bash
POST http://localhost:5000/api/trainers/login
Content-Type: application/json

{
  "email": "john.smith@example.com",
  "password": "trainer123"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Dr. John Smith",
    "email": "john.smith@example.com",
    "type": "External",
    "isVerified": false,
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Test 3: Get Trainer Profile
```bash
GET http://localhost:5000/api/trainers/profile
Authorization: Bearer <trainer_token>
```

### Test 4: HOD Get Verified Trainers
```bash
GET http://localhost:5000/api/hod/trainers?search=john
Authorization: Bearer <hod_token>
```

### Test 5: HOD Allocate Trainer to Event
```bash
PUT http://localhost:5000/api/hod/events/event_id_here/allocate-trainer
Authorization: Bearer <hod_token>
Content-Type: application/json

{
  "trainerId": "trainer_id_here"
}
```

---

## 📊 Database Schema Updates

### Trainer Model Enhancements
```javascript
{
  // Authentication (NEW)
  email: String (unique, required),
  password: String (hashed, required),
  
  // University Association (NEW - for Internal trainers)
  university: ObjectId → University,
  department: ObjectId → Department,
  
  // Auth Tracking (NEW)
  lastLogin: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Existing fields
  name, phone, type, organization, designation,
  qualification, experience, expertise, bio,
  ratings, eventsDelivered, isActive, isVerified
}
```

---

## 🔐 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Separate token for trainers
3. **Protected Routes**: Middleware validation
4. **Verification Required**: Some routes need admin verification
5. **Active Status Check**: Deactivated trainers cannot login

---

## 🎨 Frontend Routes

```javascript
// Add to App.jsx or routing configuration
/trainer/register          → TrainerRegister component
/trainer/login             → TrainerLogin component
/trainer/dashboard         → TrainerDashboard component
/trainer/profile           → TrainerProfile component
/trainer/events            → TrainerEvents component
/trainer/schedule          → TrainerSchedule component
```

---

## ✅ Success Criteria

- [x] Trainer can register with email/password
- [x] Trainer can login and access dashboard
- [x] Trainer sees their profile information
- [x] Trainer views assigned events (upcoming, ongoing, completed)
- [x] HOD can view all verified trainers
- [x] HOD can allocate trainers to department events
- [x] System validates trainer verification status
- [x] Separate authentication for trainers (not mixed with users)

---

## 🚀 Next Steps

1. **Verify Trainer**: HOD/Admin must manually verify registered trainers
2. **Allocate to Events**: HOD assigns trainers to department events
3. **Trainer Dashboard**: Trainer sees assigned events and statistics
4. **Feedback System**: Collect ratings after event completion
5. **Payment Integration**: Track trainer charges and payments

---

## 📞 Support

For issues or questions:
1. Check backend logs: `cd backend && npm run dev`
2. Check frontend console: Browser DevTools → Console
3. Verify MongoDB connection
4. Ensure all routes are registered in `server.js`

---

**Last Updated**: November 8, 2025  
**Version**: 1.0.0
