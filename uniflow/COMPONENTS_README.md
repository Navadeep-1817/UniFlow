# UniFlow Frontend Components Structure

## 📁 Complete Component Hierarchy

### 1. Authentication & Authorization (7 components)
Located: `src/components/auth/`
- **Login.jsx** - Universal login with role detection
- **Register.jsx** - Multi-step registration (Student/Faculty/Admin)
- **RoleSelection.jsx** - Choose role after login
- **ForgotPassword.jsx** - Password recovery
- **PrivateRoute.jsx** - Protected routes wrapper
- **RoleBasedRoute.jsx** - Hierarchical access control
- **PendingApproval.jsx** - Waiting screen for unapproved users

### 2. Super Admin Dashboard (9 components)
Located: `src/components/superadmin/`
- **SuperAdminDashboard.jsx** - Master control panel with all university stats
- **UniversityManagement.jsx** - Add/edit/delete universities
- **AdminApprovalQueue.jsx** - Approve/reject admin requests
- **GlobalUserManagement.jsx** - View all users across universities
- **GlobalEventCalendar.jsx** - See all events across universities
- **SystemLogs.jsx** - Audit trail of all activities
- **GlobalAnalytics.jsx** - Cross-university analytics
- **RoleAssignment.jsx** - Assign/revoke admin privileges
- **SystemConfiguration.jsx** - Platform-wide settings

### 3. Academic Admin - HOD Dashboard (11 components)
Located: `src/components/academic/hod/`
- **HODDashboard.jsx** - Department overview
- **DepartmentEvents.jsx** - Create/manage department events (FDP, SDP, CRT)
- **FacultyManagement.jsx** - Add/remove faculty
- **StudentManagement.jsx** - View students enrolled
- **DepartmentAttendance.jsx** - Department-wide attendance reports
- **FacultyAllocation.jsx** - Assign faculty to events
- **DepartmentAnalytics.jsx** - Performance metrics
- **ResourceManagement.jsx** - Manage department resources
- **TrainerRequest.jsx** - Request external trainers
- **VenueBooking.jsx** - Book rooms/labs for events
- **TimetableManagement.jsx** - Department timetable

### 4. Academic Admin - Training & Placement Head (10 components)
Located: `src/components/academic/placement/`
- **TPDashboard.jsx** - Placement overview
- **PlacementDrives.jsx** - Create/manage campus recruitment
- **CompanyManagement.jsx** - Maintain company database
- **CRTSessionManagement.jsx** - Organize CRT sessions
- **StudentPlacementStatus.jsx** - Track student placement records
- **PlacementReports.jsx** - Generate placement statistics
- **InterviewScheduling.jsx** - Schedule interview rounds
- **EligibilityCriteria.jsx** - Set company-wise eligibility
- **OfferManagement.jsx** - Track offers and acceptances
- **PlacementAnalytics.jsx** - Year-wise placement trends

### 5. Non-Academic Admin - Faculty Head (7 components)
Located: `src/components/nonacademic/studentbody/facultyhead/`
- **FacultyHeadDashboard.jsx** - Student body overview
- **StudentBodyEvents.jsx** - Create cultural/technical/sports events
- **TeamManagement.jsx** - Manage team representative and members
- **EventApproval.jsx** - Approve events proposed by team rep
- **BudgetManagement.jsx** - Allocate budget for events
- **VenueApproval.jsx** - Approve venue requests
- **TeamPerformanceReview.jsx** - Evaluate team activities

### 6. Non-Academic Admin - Team Representative (7 components)
Located: `src/components/nonacademic/studentbody/teamrep/`
- **TeamRepDashboard.jsx** - Personal team dashboard
- **ProposeEvent.jsx** - Create event proposal
- **ManageTeamMembers.jsx** - Add/remove team members
- **EventExecution.jsx** - Execute approved events
- **AttendanceTracking.jsx** - Mark attendance for body events
- **FeedbackCollection.jsx** - Collect post-event feedback
- **ActivityReport.jsx** - Submit monthly activity reports
- **ResourceRequest.jsx** - Request resources/budget

### 7. Non-Academic Admin - Sports Department (7 components)
Located: `src/components/nonacademic/sports/`
- **SportsDashboard.jsx** - Sports events overview
- **SportsEventManagement.jsx** - Organize tournaments
- **TeamSelection.jsx** - Select players for teams
- **FixtureScheduling.jsx** - Match schedules and brackets
- **ResultsManagement.jsx** - Record match results
- **SportsVenueBooking.jsx** - Book stadiums/grounds
- **AthleticsReport.jsx** - Performance tracking

### 8. Faculty Dashboard (11 components)
Located: `src/components/faculty/`
- **FacultyDashboard.jsx** - Personal schedule and assigned events
- **MyAssignedEvents.jsx** - Events assigned by HOD/Placement
- **SessionManagement.jsx** - Manage individual sessions
- **AttendanceMarking.jsx** - Mark student attendance
- **AttendanceSheet.jsx** - View/export attendance records
- **UploadMaterials.jsx** - Upload session notes/PPTs
- **StudentProgress.jsx** - Track student participation
- **EventFeedback.jsx** - View feedback received
- **GenerateReport.jsx** - Create post-event reports
- **LeaveRequest.jsx** - Request substitution if unavailable
- **NotificationCenter.jsx** - View event updates

### 9. Student Dashboard (14 components)
Located: `src/components/student/`
- **StudentDashboard.jsx** - Personalized event feed
- **EventCalendar.jsx** - Monthly/weekly calendar view
- **BrowseEvents.jsx** - Filter events by type
- **EventDetails.jsx** - Detailed event page
- **RegisterEvent.jsx** - One-click registration
- **MyRegistrations.jsx** - View registered events
- **AttendanceHistory.jsx** - Academic + Non-Academic attendance
- **SubmitFeedback.jsx** - Post-event feedback form
- **DownloadCertificates.jsx** - Download participation certificates
- **PlacementProfile.jsx** - Update profile for placements
- **StudentBodyMembership.jsx** - Join student bodies
- **MyTeams.jsx** - View joined student bodies
- **Notifications.jsx** - Event reminders and updates
- **MyProfile.jsx** - Student profile management

### 10. Shared Components (25 components)
Located: `src/components/shared/`
- **Navbar.jsx** - Dynamic navbar based on role
- **Sidebar.jsx** - Hierarchical menu (role-specific)
- **EventCard.jsx** - Universal event display card
- **StatsCard.jsx** - Dashboard statistics widget
- **Table.jsx** - Sortable, filterable data table
- **Modal.jsx** - Generic modal component
- **Loader.jsx** - Loading spinner
- **SearchBar.jsx** - Global search across events
- **FilterPanel.jsx** - Multi-level filters
- **DateTimePicker.jsx** - Date/time selector
- **FileUpload.jsx** - Drag-drop file uploader
- **NotificationBell.jsx** - Real-time notifications dropdown
- **ExportButton.jsx** - Export reports (PDF/Excel)
- **ApprovalStatus.jsx** - Visual status indicator
- **QRScanner.jsx** - QR attendance scanner
- **Pagination.jsx** - Table pagination
- **ConfirmDialog.jsx** - Confirmation popups
- **Toast.jsx** - Success/error notifications
- **BreadcrumbNav.jsx** - Hierarchical navigation
- **UserAvatar.jsx** - Profile picture component
- **RoleTag.jsx** - Display user role badge
- **EventTypeTag.jsx** - Academic/Non-Academic tag
- **EmptyState.jsx** - Empty state placeholder
- **ErrorBoundary.jsx** - Error handling wrapper
- **ProgressBar.jsx** - Progress indicator

### 11. Analytics & Reports (11 components)
Located: `src/components/analytics/`
- **SuperAdminAnalytics.jsx** - Cross-university insights
- **UniversityAnalytics.jsx** - Single university analytics
- **DepartmentAnalytics.jsx** - Department-wise reports
- **StudentBodyAnalytics.jsx** - SAC/E-Cell/NSS activity reports
- **EventAnalytics.jsx** - Single event detailed analysis
- **AttendanceReport.jsx** - Attendance trends
- **FeedbackReport.jsx** - Aggregated feedback analysis
- **StudentPerformanceReport.jsx** - Individual student analytics
- **ComparativeAnalytics.jsx** - Compare departments/bodies
- **ExportReport.jsx** - Downloadable comprehensive reports
- **PlacementAnalytics.jsx** - (in placement folder) Placement statistics

## 📊 Component Count Summary

| Category | Component Count |
|----------|----------------|
| Authentication & Authorization | 7 |
| Super Admin Dashboard | 9 |
| HOD Dashboard | 11 |
| Training & Placement | 10 |
| Faculty Head (Student Body) | 7 |
| Team Representative | 7 |
| Sports Department | 7 |
| Faculty Dashboard | 11 |
| Student Dashboard | 14 |
| Shared Components | 25 |
| Analytics & Reports | 11 |
| **TOTAL** | **119** |

## 🚀 Import Usage

All components have index.js files for clean imports:

```javascript
// Auth components
import { Login, Register, PrivateRoute } from './components/auth';

// Super Admin components
import { SuperAdminDashboard, UniversityManagement } from './components/superadmin';

// HOD components
import { HODDashboard, DepartmentEvents } from './components/academic/hod';

// Placement components
import { TPDashboard, PlacementDrives } from './components/academic/placement';

// Faculty components
import { FacultyDashboard, AttendanceMarking } from './components/faculty';

// Student components
import { StudentDashboard, BrowseEvents } from './components/student';

// Shared components
import { Navbar, Sidebar, Modal, Table } from './components/shared';

// Analytics components
import { UniversityAnalytics, EventAnalytics } from './components/analytics';
```

## 📝 Notes

- All components are functional React components using hooks
- Components are ready for API integration
- Responsive design considerations included
- Role-based access control implemented
- Reusable shared components for consistency
- All 119 components created as specified
