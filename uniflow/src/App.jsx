import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import PendingApproval from './components/auth/PendingApproval';
import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
import AdminApprovalQueue from './components/superadmin/AdminApprovalQueue';
import GlobalAnalytics from './components/superadmin/GlobalAnalytics';
import GlobalEventCalendar from './components/superadmin/GlobalEventCalendar';
import GlobalUserManagement from './components/superadmin/GlobalUserManagement';
import StudentDashboard from './components/student/StudentDashboard';
import BrowseEvents from './components/student/BrowseEvents';
import EventDetails from './components/student/EventDetails';
import MyRegistrations from './components/student/MyRegistrations';
import MyTeams from './components/student/MyTeams';
import AttendanceHistory from './components/student/AttendanceHistory';
import DownloadCertificates from './components/student/DownloadCertificates';
import MyProfile from './components/student/MyProfile';
import Notifications from './components/student/Notifications';
import PlacementProfile from './components/student/PlacementProfile';
import RegisterEvent from './components/student/RegisterEvent';
import StudentBodyMembership from './components/student/StudentBodyMembership';
import StudentAnalytics from './components/student/StudentAnalytics';
import { 
  FacultyDashboard,
  MyAssignedEvents,
  SessionManagement,
  AttendanceMarking,
  AttendanceSheet,
  UploadMaterials,
  StudentProgress,
  EventFeedback,
  GenerateReport,
  LeaveRequest,
  NotificationCenter,
  FacultyAnalytics
} from './components/faculty';
import HODDashboard from './components/academic/hod/HODDashboard';
import DepartmentEvents from './components/academic/hod/DepartmentEvents';
import FacultyManagement from './components/academic/hod/FacultyManagement';
import StudentManagement from './components/academic/hod/StudentManagement';
import FacultyAllocation from './components/academic/hod/FacultyAllocation';
import VenueBooking from './components/academic/hod/VenueBooking';
import TrainerRequest from './components/academic/hod/TrainerRequest';
import DepartmentAnalytics from './components/academic/hod/DepartmentAnalytics';
import DepartmentAttendance from './components/academic/hod/DepartmentAttendance';
import ResourceManagement from './components/academic/hod/ResourceManagement';
import TimetableManagement from './components/academic/hod/TimetableManagement';
import CompanyManagement from './components/academic/placement/CompanyManagement';
import CRTSessionManagement from './components/academic/placement/CRTSessionManagement';
import TPDashboard from './components/academic/placement/TPDashboard';
import PlacementDrives from './components/academic/placement/PlacementDrives';
import InterviewScheduling from './components/academic/placement/InterviewScheduling';
import OfferManagement from './components/academic/placement/OfferManagement';
import EligibilityCriteria from './components/academic/placement/EligibilityCriteria';
import StudentPlacementStatus from './components/academic/placement/StudentPlacementStatus';
import PlacementAnalytics from './components/academic/placement/PlacementAnalytics';
import PlacementReports from './components/academic/placement/PlacementReports';
import SportsDashboard from './components/nonacademic/sports/SportsDashboard';
import AthleticsReport from './components/nonacademic/sports/AthleticsReport';
import ResultsManagement from './components/nonacademic/sports/ResultsManagement';
import FixtureScheduling from './components/nonacademic/sports/FixtureScheduling';
import FacultyHeadDashboard from './components/nonacademic/studentbody/facultyhead/FacultyHeadDashboard';
import BudgetManagement from './components/nonacademic/studentbody/facultyhead/BudgetManagement';
import EventApproval from './components/nonacademic/studentbody/facultyhead/EventApproval';
import StudentBodyEvents from './components/nonacademic/studentbody/facultyhead/StudentBodyEvents';
import TeamManagement from './components/nonacademic/studentbody/facultyhead/TeamManagement';
import TeamPerformanceReview from './components/nonacademic/studentbody/facultyhead/TeamPerformanceReview';
import VenueApproval from './components/nonacademic/studentbody/facultyhead/VenueApproval';
import { 
  TeamRepDashboard,
  ProposeEvent,
  ManageTeamMembers,
  EventExecution,
  AttendanceTracking,
  FeedbackCollection,
  ActivityReport,
  ResourceRequest
} from './components/nonacademic/studentbody/teamrep';

// Analytics Components - Global Access
import AttendanceReport from './components/analytics/AttendanceReport';
import ComparativeAnalytics from './components/analytics/ComparativeAnalytics';
import EventAnalytics from './components/analytics/EventAnalytics';
import ExportReport from './components/analytics/ExportReport';
import FeedbackReport from './components/analytics/FeedbackReport';
import StudentBodyAnalytics from './components/analytics/StudentBodyAnalytics';
import StudentPerformanceReport from './components/analytics/StudentPerformanceReport';
import SuperAdminAnalytics from './components/analytics/SuperAdminAnalytics';
import UniversityAnalytics from './components/analytics/UniversityAnalytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        
        {/* Dashboard routes for different roles */}
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/approval-queue" element={<AdminApprovalQueue />} />
        <Route path="/superadmin/global-analytics" element={<GlobalAnalytics />} />
        <Route path="/superadmin/event-calendar" element={<GlobalEventCalendar />} />
        <Route path="/superadmin/user-management" element={<GlobalUserManagement />} />
        
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/browse-events" element={<BrowseEvents />} />
        <Route path="/student/event/:eventId" element={<EventDetails />} />
        <Route path="/student/register-event/:eventId" element={<RegisterEvent />} />
        <Route path="/student/my-registrations" element={<MyRegistrations />} />
        <Route path="/student/my-teams" element={<MyTeams />} />
        <Route path="/student/attendance" element={<AttendanceHistory />} />
        <Route path="/student/certificates" element={<DownloadCertificates />} />
        <Route path="/student/profile" element={<MyProfile />} />
        <Route path="/student/notifications" element={<Notifications />} />
        <Route path="/student/placement-profile" element={<PlacementProfile />} />
        <Route path="/student/memberships" element={<StudentBodyMembership />} />
        <Route path="/student/analytics" element={<StudentAnalytics />} />
        
        {/* Faculty Routes */}
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/my-events" element={<MyAssignedEvents />} />
        <Route path="/faculty/sessions" element={<SessionManagement />} />
        <Route path="/faculty/attendance" element={<AttendanceMarking />} />
        <Route path="/faculty/attendance-sheet" element={<AttendanceSheet />} />
        <Route path="/faculty/upload-materials" element={<UploadMaterials />} />
        <Route path="/faculty/student-progress" element={<StudentProgress />} />
        <Route path="/faculty/feedback" element={<EventFeedback />} />
        <Route path="/faculty/reports" element={<GenerateReport />} />
        <Route path="/faculty/leave-request" element={<LeaveRequest />} />
        <Route path="/faculty/notifications" element={<NotificationCenter />} />
        <Route path="/faculty/analytics" element={<FacultyAnalytics />} />
        {/* HOD Routes */}
        <Route path="/hod/dashboard" element={<HODDashboard />} />
        <Route path="/hod/faculty" element={<FacultyManagement />} />
        <Route path="/hod/students" element={<StudentManagement />} />
        <Route path="/hod/events" element={<DepartmentEvents />} />
        <Route path="/hod/allocation" element={<FacultyAllocation />} />
        <Route path="/hod/venue" element={<VenueBooking />} />
        <Route path="/hod/trainers" element={<TrainerRequest />} />
        <Route path="/hod/analytics" element={<DepartmentAnalytics />} />
        <Route path="/hod/attendance" element={<DepartmentAttendance />} />
        <Route path="/hod/resources" element={<ResourceManagement />} />
        <Route path="/hod/timetable" element={<TimetableManagement />} />
        
        {/* Placement Routes */}
        <Route path="/placement/dashboard" element={<TPDashboard />} />
        <Route path="/placement/companies" element={<CompanyManagement />} />
        <Route path="/placement/crt-sessions" element={<CRTSessionManagement />} />
        <Route path="/placement/drives" element={<PlacementDrives />} />
        <Route path="/placement/interviews" element={<InterviewScheduling />} />
        <Route path="/placement/offers" element={<OfferManagement />} />
        <Route path="/placement/eligibility" element={<EligibilityCriteria />} />
        <Route path="/placement/student-status" element={<StudentPlacementStatus />} />
        <Route path="/placement/analytics" element={<PlacementAnalytics />} />
        <Route path="/placement/reports" element={<PlacementReports />} />
        
        {/* Student Body Routes */}
        {/* Faculty Head Routes */}
        <Route path="/student-body/faculty-head/dashboard" element={<FacultyHeadDashboard />} />
        <Route path="/student-body/faculty-head/budget-management" element={<BudgetManagement />} />
        <Route path="/student-body/faculty-head/event-approval" element={<EventApproval />} />
        <Route path="/student-body/faculty-head/events" element={<StudentBodyEvents />} />
        <Route path="/student-body/faculty-head/team-management" element={<TeamManagement />} />
        <Route path="/student-body/faculty-head/performance-review" element={<TeamPerformanceReview />} />
        <Route path="/student-body/faculty-head/venue-approval" element={<VenueApproval />} />
        
        {/* Legacy redirect for old student_body role */}
        <Route path="/student-body/dashboard" element={<Navigate to="/teamrep/dashboard" replace />} />
        
        {/* Team Rep Routes */}
        <Route path="/teamrep/dashboard" element={<TeamRepDashboard />} />
        <Route path="/teamrep/propose-event" element={<ProposeEvent />} />
        <Route path="/teamrep/manage-members" element={<ManageTeamMembers />} />
        <Route path="/teamrep/event-execution" element={<EventExecution />} />
        <Route path="/teamrep/activity-report" element={<ActivityReport />} />
        <Route path="/teamrep/attendance" element={<AttendanceTracking />} />
        <Route path="/teamrep/feedback" element={<FeedbackCollection />} />
        <Route path="/teamrep/resource-request" element={<ResourceRequest />} />
        
        {/* Legacy route - redirect to new path */}
        <Route path="/student-body/team-rep/dashboard" element={<Navigate to="/teamrep/dashboard" replace />} />
        
        {/* Sports Routes */}
        <Route path="/sports/dashboard" element={<SportsDashboard />} />
        <Route path="/sports/athletics-report" element={<AthleticsReport />} />
        <Route path="/sports/results-management" element={<ResultsManagement />} />
        <Route path="/sports/fixture-scheduling" element={<FixtureScheduling />} />
        
        {/* Global Analytics Routes - Accessible by all roles */}
        <Route path="/analytics/attendance" element={<AttendanceReport />} />
        <Route path="/analytics/comparative" element={<ComparativeAnalytics />} />
        <Route path="/analytics/events" element={<EventAnalytics />} />
        <Route path="/analytics/export" element={<ExportReport />} />
        <Route path="/analytics/feedback" element={<FeedbackReport />} />
        <Route path="/analytics/student-body" element={<StudentBodyAnalytics />} />
        <Route path="/analytics/student-performance" element={<StudentPerformanceReport />} />
        <Route path="/analytics/superadmin" element={<SuperAdminAnalytics />} />
        <Route path="/analytics/university" element={<UniversityAnalytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
