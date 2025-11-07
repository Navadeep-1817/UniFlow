# Analytics Routes - Global Access

All analytics pages are now globally accessible across all user roles through the `/analytics` path.

## Available Analytics Routes

### 1. **Attendance Report**
- **URL**: `/analytics/attendance`
- **Access**: All roles (Super Admin, Faculty Head, HOD, Faculty)
- **Features**: 
  - Overall attendance statistics
  - Department-wise breakdown
  - Monthly trends
  - Event-wise detailed report
  - Export functionality

### 2. **Comparative Analytics**
- **URL**: `/analytics/comparative`
- **Access**: All roles
- **Features**: Compare metrics across departments, events, or time periods

### 3. **Event Analytics**
- **URL**: `/analytics/events`
- **Access**: All roles
- **Features**: Event performance metrics, registration trends, attendance patterns

### 4. **Export Report**
- **URL**: `/analytics/export`
- **Access**: All roles
- **Features**: Export analytics data in various formats (PDF, Excel, CSV)

### 5. **Feedback Report**
- **URL**: `/analytics/feedback`
- **Access**: All roles
- **Features**: Consolidated feedback analysis from events

### 6. **Student Body Analytics**
- **URL**: `/analytics/student-body`
- **Access**: All roles
- **Features**: Student body performance, engagement metrics

### 7. **Student Performance Report**
- **URL**: `/analytics/student-performance`
- **Access**: All roles
- **Features**: Individual and aggregate student performance tracking

### 8. **Super Admin Analytics**
- **URL**: `/analytics/superadmin`
- **Access**: Super Admin (but accessible to all for viewing)
- **Features**: System-wide analytics and insights

### 9. **University Analytics**
- **URL**: `/analytics/university`
- **Access**: All roles
- **Features**: University-level statistics and trends

## How to Access

### From Any Dashboard:
You can navigate to analytics pages by:

1. **Direct URL Navigation**:
   ```
   http://localhost:5173/analytics/attendance
   http://localhost:5173/analytics/events
   http://localhost:5173/analytics/feedback
   ```

2. **Add Navigation Links in Your Dashboard**:
   ```javascript
   <button onClick={() => navigate('/analytics/attendance')}>
     View Attendance Report
   </button>
   ```

3. **Create Analytics Menu**:
   Add an "Analytics" section in your navigation bar with dropdown:
   ```javascript
   <div className="analytics-menu">
     <button>Analytics</button>
     <div className="dropdown">
       <a href="/analytics/attendance">Attendance</a>
       <a href="/analytics/events">Events</a>
       <a href="/analytics/feedback">Feedback</a>
       <a href="/analytics/student-performance">Performance</a>
     </div>
   </div>
   ```

## Role-Based Features

While all analytics pages are accessible to all roles, the **data displayed** is filtered based on user role:

- **Super Admin**: Sees all universities, all departments
- **Faculty Head**: Sees all departments within their university
- **HOD**: Sees only their department
- **Faculty**: Sees only their assigned events/students
- **Student**: Sees only their personal analytics

## Implementation Notes

✅ All analytics components imported in `App.jsx`
✅ Global routes created under `/analytics/*` path
✅ No role-based route restrictions (data filtering done in components)
✅ Ready for navigation from any dashboard

## Next Steps

To make analytics visible in your dashboards:

1. Add "Analytics" button/link in navigation bars
2. Create analytics dropdown menu
3. Add analytics cards on dashboard home pages
4. Link specific analytics from relevant pages (e.g., "View Attendance Report" from Attendance page)
