# 🧪 Week 3 Endpoints Testing Guide

**Date:** December 2024  
**Systems:** Placement, Timetable, Resource  
**Total New Endpoints:** 33

---

## 🎯 PLACEMENT DRIVE SYSTEM (11 Endpoints)

### Base URL: `http://localhost:5000/api/placements`

### 1. Create Placement Drive
**POST** `/api/placements`  
**Auth:** Required (Super Admin, Academic Admin)

```json
{
  "eventId": "EVENT_ID_HERE",
  "company": {
    "name": "Tech Corp",
    "website": "https://techcorp.com",
    "logo": "https://logo-url.com",
    "industry": "IT Services"
  },
  "jobDetails": {
    "role": "Software Engineer",
    "description": "Full-stack development role",
    "type": "Full-time",
    "workMode": "Hybrid",
    "location": "Bangalore"
  },
  "package": {
    "ctc": 1200000,
    "base": 1000000,
    "variable": 150000,
    "joiningBonus": 50000
  },
  "eligibility": {
    "departments": ["DEPT_ID_1", "DEPT_ID_2"],
    "minCGPA": 7.5,
    "maxBacklogs": 2
  },
  "importantDates": {
    "applicationDeadline": "2024-12-31",
    "assessmentDate": "2025-01-10",
    "interviewDates": {
      "technical": "2025-01-15",
      "hr": "2025-01-20"
    }
  }
}
```

### 2. Get All Placement Drives
**GET** `/api/placements`  
**Auth:** Public

**Query Parameters:**
- `status` - Active, Completed, Cancelled
- `jobType` - Full-time, Internship, Contract
- `workMode` - On-site, Remote, Hybrid
- `industry` - IT Services, Finance, etc.
- `minCTC` - Minimum CTC (e.g., 500000)
- `maxCTC` - Maximum CTC (e.g., 2000000)
- `department` - Department ID
- `search` - Search in company name, role, description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:** `GET /api/placements?minCTC=1000000&jobType=Full-time&page=1&limit=10`

### 3. Get Single Placement Drive
**GET** `/api/placements/:id`  
**Auth:** Public

### 4. Update Placement Drive
**PUT** `/api/placements/:id`  
**Auth:** Required (Super Admin, Academic Admin)

```json
{
  "status": "Active",
  "company": {
    "name": "Updated Company Name"
  }
}
```

### 5. Delete Placement Drive
**DELETE** `/api/placements/:id`  
**Auth:** Required (Super Admin, Academic Admin)

### 6. Student Registration
**POST** `/api/placements/:id/register`  
**Auth:** Required (Student)

No body required - student profile auto-checked for eligibility

### 7. Update Application Status
**PUT** `/api/placements/:id/applications/:studentId`  
**Auth:** Required (Super Admin, Academic Admin)

```json
{
  "status": "shortlisted",
  "roundNumber": 1,
  "remarks": "Passed aptitude test"
}
```

**Status options:** `shortlisted`, `selected`, `rejected`

### 8. Record Round
**POST** `/api/placements/:id/rounds`  
**Auth:** Required (Super Admin, Academic Admin)

```json
{
  "roundType": "Technical",
  "roundNumber": 2,
  "venue": "VENUE_ID",
  "date": "2025-01-15T10:00:00Z",
  "selectedStudents": ["STUDENT_ID_1", "STUDENT_ID_2"],
  "remarks": "45 students selected for technical round"
}
```

**Round types:** `Aptitude`, `Technical`, `HR`, `Group Discussion`, `Other`

### 9. Record Offer
**POST** `/api/placements/:id/offers/:studentId`  
**Auth:** Required (Super Admin, Academic Admin)

```json
{
  "ctc": 1200000,
  "designation": "Software Engineer",
  "joiningDate": "2025-07-01",
  "location": "Bangalore",
  "offerStatus": "Offered",
  "remarks": "Joining bonus included"
}
```

**Offer status:** `Offered`, `Accepted`, `Rejected`, `Joined`

### 10. Get Placement Statistics
**GET** `/api/placements/stats/overview`  
**Auth:** Required (Super Admin, Academic Admin, Non-Academic Admin)

**Query Parameters:**
- `academicYear` - Filter by academic year
- `department` - Filter by department ID

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": {
      "totalDrives": 25,
      "totalApplications": 450,
      "totalShortlisted": 180,
      "totalSelected": 75,
      "totalRejected": 95,
      "avgCTC": 1150000,
      "maxCTC": 2500000,
      "minCTC": 600000
    },
    "offersByStatus": [
      { "_id": "Offered", "count": 75, "avgCTC": 1150000 },
      { "_id": "Accepted", "count": 60, "avgCTC": 1200000 }
    ],
    "topCompanies": [
      { "_id": "Tech Corp", "drives": 3, "selected": 15, "avgCTC": 1300000 }
    ]
  }
}
```

### 11. Get Student Placements
**GET** `/api/placements/my/placements`  
**Auth:** Required (Student)

---

## 🗓️ TIMETABLE SYSTEM (13 Endpoints)

### Base URL: `http://localhost:5000/api/timetables`

### 1. Create Timetable
**POST** `/api/timetables`  
**Auth:** Required (Super Admin, Academic Admin)

```json
{
  "title": "CSE 5th Semester - Odd 2024",
  "description": "Computer Science timetable for 5th semester",
  "type": "Academic",
  "department": "DEPT_ID",
  "semester": 5,
  "academicYear": "2024-25",
  "schedule": [
    {
      "day": "Monday",
      "slots": [
        {
          "startTime": "09:00",
          "endTime": "10:00",
          "event": "EVENT_ID",
          "venue": "VENUE_ID",
          "faculty": "FACULTY_ID",
          "type": "Lecture"
        }
      ]
    }
  ],
  "breakTimings": {
    "lunch": { "start": "13:00", "end": "14:00" }
  }
}
```

**Types:** `Academic`, `Event`, `Sports`, `Mixed`

### 2. Get All Timetables
**GET** `/api/timetables`  
**Auth:** Required

**Query Parameters:**
- `type` - Academic, Event, Sports, Mixed
- `department` - Department ID
- `semester` - Semester number
- `academicYear` - Academic year
- `status` - Draft, Active, Archived
- `search` - Search in title, description
- `page` - Page number
- `limit` - Items per page

### 3. Get Single Timetable
**GET** `/api/timetables/:id`  
**Auth:** Required

### 4. Update Timetable
**PUT** `/api/timetables/:id`  
**Auth:** Required (Super Admin, Academic Admin)

```json
{
  "title": "Updated Timetable",
  "status": "Active"
}
```

### 5. Delete Timetable
**DELETE** `/api/timetables/:id`  
**Auth:** Required (Super Admin, Academic Admin)

Note: Active timetables are archived instead of deleted

### 6. Add Event to Timetable
**POST** `/api/timetables/:id/events`  
**Auth:** Required (Super Admin, Academic Admin)

```json
{
  "eventId": "EVENT_ID",
  "day": "Monday",
  "startTime": "10:00",
  "endTime": "11:00",
  "venue": "VENUE_ID",
  "faculty": "FACULTY_ID",
  "type": "Lecture"
}
```

### 7. Remove Event from Timetable
**DELETE** `/api/timetables/:id/events/:slotId`  
**Auth:** Required (Super Admin, Academic Admin)

### 8. Detect Conflicts
**GET** `/api/timetables/:id/conflicts`  
**Auth:** Required (Super Admin, Academic Admin)

**Response:**
```json
{
  "success": true,
  "conflictCount": 2,
  "data": [
    {
      "type": "venue",
      "severity": "High",
      "event": { "title": "Math Lecture" },
      "venue": { "name": "Room 101" },
      "day": "Monday",
      "time": "10:00 - 11:00",
      "isResolved": false
    }
  ]
}
```

### 9. Resolve Conflict
**PUT** `/api/timetables/:id/conflicts/:conflictId`  
**Auth:** Required (Super Admin, Academic Admin)

```json
{
  "resolution": "Changed venue to Room 202"
}
```

### 10. Publish Timetable
**PUT** `/api/timetables/:id/publish`  
**Auth:** Required (Super Admin, Academic Admin)

Note: Cannot publish if unresolved conflicts exist

### 11. Archive Timetable
**PUT** `/api/timetables/:id/archive`  
**Auth:** Required (Super Admin, Academic Admin)

### 12. Check Venue Availability
**GET** `/api/timetables/check-venue`  
**Auth:** Required

**Query Parameters:**
- `venueId` - Venue ID (required)
- `day` - Day of week (required)
- `startTime` - Start time (required)
- `endTime` - End time (required)
- `timetableId` - Exclude specific timetable

**Example:** `GET /api/timetables/check-venue?venueId=VENUE_ID&day=Monday&startTime=10:00&endTime=11:00`

### 13. Check Faculty Availability
**GET** `/api/timetables/check-faculty`  
**Auth:** Required

**Query Parameters:**
- `facultyId` - Faculty ID (required)
- `day` - Day of week (required)
- `startTime` - Start time (required)
- `endTime` - End time (required)
- `timetableId` - Exclude specific timetable

---

## 📚 RESOURCE MANAGEMENT SYSTEM (9 Endpoints)

### Base URL: `http://localhost:5000/api/resources`

### 1. Upload Resource
**POST** `/api/resources`  
**Auth:** Required (Super Admin, Academic Admin, Faculty, Trainer)

```json
{
  "eventId": "EVENT_ID",
  "title": "Lecture Slides - Introduction to AI",
  "description": "Comprehensive slides covering AI fundamentals",
  "type": "Presentation",
  "fileUrl": "https://cloudinary.com/file-url",
  "fileSize": 2048576,
  "mimeType": "application/pdf",
  "visibility": "Registered Only",
  "accessibleTo": ["USER_ID_1", "USER_ID_2"],
  "tags": ["AI", "Machine Learning", "Introduction"]
}
```

**Types:** `Presentation`, `Document`, `Video`, `Audio`, `Image`, `PDF`, `Link`, `Code`, `Other`  
**Visibility:** `Public`, `Registered Only`, `Attended Only`, `Private`

### 2. Get All Resources
**GET** `/api/resources`  
**Auth:** Required

**Query Parameters:**
- `eventId` - Filter by event
- `type` - Filter by file type
- `visibility` - Filter by visibility (Admin only)
- `search` - Search in title, description, tags
- `tags` - Comma-separated tags
- `page` - Page number
- `limit` - Items per page

**Example:** `GET /api/resources?eventId=EVENT_ID&type=PDF&tags=AI,ML`

Note: Access control is automatically applied based on user role and registration/attendance

### 3. Get Single Resource
**GET** `/api/resources/:id`  
**Auth:** Required

Note: Access permission checked based on visibility

### 4. Update Resource
**PUT** `/api/resources/:id`  
**Auth:** Required (Owner or Admin)

```json
{
  "title": "Updated Resource Title",
  "visibility": "Public"
}
```

### 5. Delete Resource
**DELETE** `/api/resources/:id`  
**Auth:** Required (Owner or Admin)

Note: Soft delete (sets isActive = false)

### 6. Download Resource
**GET** `/api/resources/:id/download`  
**Auth:** Required

**Response:**
```json
{
  "success": true,
  "message": "Download recorded",
  "data": {
    "fileUrl": "https://cloudinary.com/file-url",
    "fileName": "Lecture Slides",
    "mimeType": "application/pdf"
  }
}
```

Note: Download counter incremented automatically

### 7. Rate Resource
**POST** `/api/resources/:id/rate`  
**Auth:** Required

```json
{
  "rating": 5,
  "review": "Excellent resource, very helpful!"
}
```

**Rating:** 1-5 (required)

### 8. Comment on Resource
**POST** `/api/resources/:id/comment`  
**Auth:** Required

```json
{
  "text": "Great content! Looking forward to more such resources."
}
```

### 9. Delete Comment
**DELETE** `/api/resources/:id/comment/:commentId`  
**Auth:** Required (Comment owner or Admin)

---

## 🔐 AUTHENTICATION

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Getting Token:
**POST** `http://localhost:5000/api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

---

## 🧪 TESTING CHECKLIST

### Placement System
- [ ] Create placement drive
- [ ] Get all drives (public access)
- [ ] Get single drive details
- [ ] Update drive details (admin)
- [ ] Student registration with eligibility check
- [ ] Update student status (shortlist/select/reject)
- [ ] Record round results
- [ ] Record offer details
- [ ] Get overall statistics
- [ ] Get student's placement history
- [ ] Delete drive (validation check)

### Timetable System
- [ ] Create timetable
- [ ] Get all timetables (department filter for faculty)
- [ ] Get single timetable with full details
- [ ] Add event to timetable
- [ ] Remove event from timetable
- [ ] Auto-detect conflicts
- [ ] Resolve conflict
- [ ] Check venue availability
- [ ] Check faculty availability
- [ ] Publish timetable (conflict check)
- [ ] Archive timetable
- [ ] Update timetable
- [ ] Delete timetable

### Resource System
- [ ] Upload resource (faculty/trainer)
- [ ] Get all resources (access control)
- [ ] Get single resource (permission check)
- [ ] Download resource (counter increment)
- [ ] Rate resource (1-5 stars)
- [ ] Add comment
- [ ] Delete comment (owner/admin)
- [ ] Update resource (owner/admin)
- [ ] Delete resource (soft delete)

---

## 📊 EXPECTED RESULTS

### Success Response Format:
```json
{
  "success": true,
  "data": { ... },
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5
}
```

### Error Response Format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 🎉 TESTING COMPLETE

Once all checkboxes are marked:
- ✅ All 33 endpoints tested
- ✅ Access control verified
- ✅ Edge cases handled
- ✅ 100% backend operational

**Status:** Ready for frontend integration! 🚀
