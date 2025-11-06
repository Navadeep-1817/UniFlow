# UniFlow Frontend Project Structure

```
uniflow/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/                          # Authentication & Authorization (7)
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RoleSelection.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── RoleBasedRoute.jsx
│   │   │   ├── PendingApproval.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── superadmin/                    # Super Admin Dashboard (9)
│   │   │   ├── SuperAdminDashboard.jsx
│   │   │   ├── UniversityManagement.jsx
│   │   │   ├── AdminApprovalQueue.jsx
│   │   │   ├── GlobalUserManagement.jsx
│   │   │   ├── GlobalEventCalendar.jsx
│   │   │   ├── SystemLogs.jsx
│   │   │   ├── GlobalAnalytics.jsx
│   │   │   ├── RoleAssignment.jsx
│   │   │   ├── SystemConfiguration.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── academic/
│   │   │   ├── hod/                       # HOD Dashboard (11)
│   │   │   │   ├── HODDashboard.jsx
│   │   │   │   ├── DepartmentEvents.jsx
│   │   │   │   ├── FacultyManagement.jsx
│   │   │   │   ├── StudentManagement.jsx
│   │   │   │   ├── DepartmentAttendance.jsx
│   │   │   │   ├── FacultyAllocation.jsx
│   │   │   │   ├── DepartmentAnalytics.jsx
│   │   │   │   ├── ResourceManagement.jsx
│   │   │   │   ├── TrainerRequest.jsx
│   │   │   │   ├── VenueBooking.jsx
│   │   │   │   ├── TimetableManagement.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── placement/                 # Training & Placement (10)
│   │   │       ├── TPDashboard.jsx
│   │   │       ├── PlacementDrives.jsx
│   │   │       ├── CompanyManagement.jsx
│   │   │       ├── CRTSessionManagement.jsx
│   │   │       ├── StudentPlacementStatus.jsx
│   │   │       ├── PlacementReports.jsx
│   │   │       ├── InterviewScheduling.jsx
│   │   │       ├── EligibilityCriteria.jsx
│   │   │       ├── OfferManagement.jsx
│   │   │       ├── PlacementAnalytics.jsx
│   │   │       └── index.js
│   │   │
│   │   ├── nonacademic/
│   │   │   ├── studentbody/
│   │   │   │   ├── facultyhead/          # Student Body Faculty Head (7)
│   │   │   │   │   ├── FacultyHeadDashboard.jsx
│   │   │   │   │   ├── StudentBodyEvents.jsx
│   │   │   │   │   ├── TeamManagement.jsx
│   │   │   │   │   ├── EventApproval.jsx
│   │   │   │   │   ├── BudgetManagement.jsx
│   │   │   │   │   ├── VenueApproval.jsx
│   │   │   │   │   ├── TeamPerformanceReview.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   └── teamrep/              # Team Representative (7)
│   │   │   │       ├── TeamRepDashboard.jsx
│   │   │   │       ├── ProposeEvent.jsx
│   │   │   │       ├── ManageTeamMembers.jsx
│   │   │   │       ├── EventExecution.jsx
│   │   │   │       ├── AttendanceTracking.jsx
│   │   │   │       ├── FeedbackCollection.jsx
│   │   │   │       ├── ActivityReport.jsx
│   │   │   │       ├── ResourceRequest.jsx
│   │   │   │       └── index.js
│   │   │   │
│   │   │   └── sports/                    # Sports Department (7)
│   │   │       ├── SportsDashboard.jsx
│   │   │       ├── SportsEventManagement.jsx
│   │   │       ├── TeamSelection.jsx
│   │   │       ├── FixtureScheduling.jsx
│   │   │       ├── ResultsManagement.jsx
│   │   │       ├── SportsVenueBooking.jsx
│   │   │       ├── AthleticsReport.jsx
│   │   │       └── index.js
│   │   │
│   │   ├── faculty/                       # Faculty Dashboard (11)
│   │   │   ├── FacultyDashboard.jsx
│   │   │   ├── MyAssignedEvents.jsx
│   │   │   ├── SessionManagement.jsx
│   │   │   ├── AttendanceMarking.jsx
│   │   │   ├── AttendanceSheet.jsx
│   │   │   ├── UploadMaterials.jsx
│   │   │   ├── StudentProgress.jsx
│   │   │   ├── EventFeedback.jsx
│   │   │   ├── GenerateReport.jsx
│   │   │   ├── LeaveRequest.jsx
│   │   │   ├── NotificationCenter.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── student/                       # Student Dashboard (14)
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── EventCalendar.jsx
│   │   │   ├── BrowseEvents.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── RegisterEvent.jsx
│   │   │   ├── MyRegistrations.jsx
│   │   │   ├── AttendanceHistory.jsx
│   │   │   ├── SubmitFeedback.jsx
│   │   │   ├── DownloadCertificates.jsx
│   │   │   ├── PlacementProfile.jsx
│   │   │   ├── StudentBodyMembership.jsx
│   │   │   ├── MyTeams.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── MyProfile.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── shared/                        # Shared Components (25)
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── DateTimePicker.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── ExportButton.jsx
│   │   │   ├── ApprovalStatus.jsx
│   │   │   ├── QRScanner.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── BreadcrumbNav.jsx
│   │   │   ├── UserAvatar.jsx
│   │   │   ├── RoleTag.jsx
│   │   │   ├── EventTypeTag.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── index.js
│   │   │
│   │   └── analytics/                     # Analytics & Reports (11)
│   │       ├── SuperAdminAnalytics.jsx
│   │       ├── UniversityAnalytics.jsx
│   │       ├── DepartmentAnalytics.jsx
│   │       ├── StudentBodyAnalytics.jsx
│   │       ├── EventAnalytics.jsx
│   │       ├── AttendanceReport.jsx
│   │       ├── FeedbackReport.jsx
│   │       ├── StudentPerformanceReport.jsx
│   │       ├── ComparativeAnalytics.jsx
│   │       ├── ExportReport.jsx
│   │       └── index.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
├── COMPONENTS_README.md           # Component documentation
└── PROJECT_STRUCTURE.md            # This file

```

## 📈 Statistics

- **Total Components**: 119
- **Total Index Files**: 11
- **Total Folders**: 11 major component categories
- **Lines of Code**: ~15,000+ (estimated)

## 🎯 Key Features

### Role-Based Structure
- **Super Admin**: University-level management
- **Academic Admin**: HOD and Training & Placement
- **Non-Academic Admin**: Student bodies and Sports
- **Faculty**: Event management and attendance
- **Students**: Event participation and feedback

### Modular Architecture
- Each role has its own dedicated folder
- Shared components for reusability
- Index files for clean imports
- Consistent naming conventions

### Component Types
1. **Dashboard Components**: Overview and statistics
2. **Management Components**: CRUD operations
3. **Analytics Components**: Reports and insights
4. **Shared Components**: Reusable UI elements
5. **Authentication Components**: Security and access control

## 🚀 Next Steps

1. **API Integration**: Connect components to backend
2. **State Management**: Implement Redux/Context API
3. **Routing**: Set up React Router
4. **Styling**: Add CSS/SCSS or UI library (Tailwind, Material-UI)
5. **Testing**: Add unit and integration tests
6. **Optimization**: Code splitting and lazy loading

## 📚 Documentation

- See `COMPONENTS_README.md` for detailed component descriptions
- Each component has inline comments for functionality
- Import/export structure documented in index files
