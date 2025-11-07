# Event Creation Testing Guide

## Bugs Fixed

### 1. Backend - HOD Controller (✅ FIXED)
**File**: `backend/controllers/hodController.js`

**Issues Fixed**:
- ✅ Removed duplicate `require('../models/Venue')` statement (line ~56)
- ✅ Added input validation for required fields (name, description, startDate, endDate)
- ✅ Improved error handling and console logging

### 2. Frontend - Department Events (✅ UPDATED)
**File**: `uniflow/src/components/academic/hod/DepartmentEvents.jsx`

**Current State**:
- ✅ Using correct API endpoint: `/api/hod/events`
- ✅ Sending proper payload structure
- ✅ Error handling in place

## Testing Steps

### Step 1: Verify HOD User Setup
```bash
# In MongoDB or via API, check that HOD user has:
# 1. role: "academic_admin_hod"
# 2. department: <valid Department ObjectId>
# 3. university: <valid University ObjectId>
# 4. isApproved: true
```

### Step 2: Test Event Creation via API (Postman/Thunder Client)

**Endpoint**: `POST http://localhost:5000/api/hod/events`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your_hod_token_here>"
}
```

**Payload** (Minimal Required):
```json
{
  "name": "Test FDP Event",
  "type": "FDP",
  "description": "This is a test FDP event for debugging",
  "startDate": "2024-12-01",
  "endDate": "2024-12-05"
}
```

**Expected Response** (Success):
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Test FDP Event",
    "type": "Academic",
    "subType": "FDP",
    "status": "Pending",
    ...
  }
}
```

**Expected Response** (Error - No Department):
```json
{
  "success": false,
  "message": "Department not found for this HOD. Please contact administrator to assign department."
}
```

### Step 3: Check Server Console Logs

The backend now logs detailed information:
```
=== Create Event Request ===
User ID: 67xxxxx
Request Body: { name: '...', type: 'FDP', ... }
HOD Found: true
HOD Department: { _id: '...', name: 'CSE' }
HOD University: { _id: '...', name: 'Test University' }
Looking for venue with university: 67xxxxx
Default venue found: true
Event Data to Create: { title: '...', ... }
```

### Step 4: Common Errors & Solutions

#### Error: "Department not found for this HOD"
**Solution**: 
```javascript
// Update user in MongoDB
db.users.updateOne(
  { email: "hod.cse@tui.edu.in" },
  { 
    $set: { 
      department: ObjectId("your_department_id"),
      university: ObjectId("your_university_id")
    } 
  }
)
```

#### Error: "Event validation failed: venue: Path `venue` is required"
**Solution**: Already handled - HOD controller now auto-creates "TBD" venue if missing

#### Error: "Not authorized"
**Solution**: Check that user role is exactly "academic_admin_hod" (case-sensitive)

#### Error: "Failed to create default venue"
**Solution**: Check that university ID is valid and exists in database

### Step 5: Frontend Testing

1. Login as HOD user
2. Navigate to Department Events page
3. Click "Create Event" button
4. Fill in the form:
   - Event Name: "Test Event"
   - Event Type: Select FDP/SDP/CRT
   - Start Date: Future date
   - End Date: After start date
   - Description: At least 10 characters
5. Click "Create Event"
6. Check browser console for errors
7. Check Network tab for API response

## Debugging Checklist

- [ ] Backend server is running (port 5000)
- [ ] MongoDB connection is successful
- [ ] HOD user exists in database
- [ ] HOD user has `department` field populated
- [ ] HOD user has `university` field populated
- [ ] HOD user `role` is "academic_admin_hod"
- [ ] HOD user `isApproved` is true
- [ ] JWT token is valid and not expired
- [ ] Frontend is making request to correct URL
- [ ] CORS is enabled for frontend origin

## Quick Database Query

```javascript
// Find HOD user and check fields
db.users.findOne(
  { role: "academic_admin_hod" },
  { 
    email: 1, 
    role: 1, 
    department: 1, 
    university: 1, 
    isApproved: 1 
  }
).populate('department').populate('university')
```

## Expected Database State After Successful Creation

**Events Collection**:
```json
{
  "_id": ObjectId("..."),
  "title": "Test FDP Event",
  "description": "This is a test FDP event",
  "type": "Academic",
  "subType": "FDP",
  "category": "Internal",
  "university": ObjectId("..."),
  "organizer": ObjectId("..."), // Department ID
  "organizerModel": "Department",
  "coordinators": [ObjectId("...")], // HOD user ID
  "date": {
    "startDate": ISODate("2024-12-01T00:00:00.000Z"),
    "endDate": ISODate("2024-12-05T00:00:00.000Z")
  },
  "time": {
    "startTime": "09:00",
    "endTime": "17:00"
  },
  "venue": ObjectId("..."), // Auto-created TBD venue
  "mode": "Offline",
  "status": "Pending",
  "createdBy": ObjectId("..."), // HOD user ID
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hod/events` | Get all department events |
| POST | `/api/hod/events` | Create new department event |
| PUT | `/api/hod/events/:id` | Update existing event |
| DELETE | `/api/hod/events/:id` | Delete event |
| GET | `/api/hod/events/:id/participants` | Get event participants |
| PUT | `/api/hod/events/:id/allocate-trainer` | Allocate trainer to event |
| GET | `/api/hod/faculty` | Get department faculty |
| GET | `/api/hod/students` | Get department students |
| GET | `/api/hod/dashboard-stats` | Get dashboard statistics |

## Files Modified

1. `backend/controllers/hodController.js` - Fixed duplicate require, added validation
2. `uniflow/src/components/academic/hod/DepartmentEvents.jsx` - Already using correct API
3. `backend/routes/hodRoutes.js` - No changes needed (already correct)
4. `backend/server.js` - No changes needed (already correct)
5. `backend/models/Event.js` - No changes needed (schema is correct)

## Next Steps

If event creation still fails after these fixes:

1. Share the exact error message from browser console
2. Share the exact error message from server console
3. Share the HOD user document from database
4. Share the network request/response from browser DevTools

