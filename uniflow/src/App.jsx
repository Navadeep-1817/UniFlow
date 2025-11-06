import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard routes for different roles */}
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/approval-queue" element={<AdminApprovalQueue />} />
        <Route path="/superadmin/global-analytics" element={<GlobalAnalytics />} />
        <Route path="/superadmin/event-calendar" element={<GlobalEventCalendar />} />
        <Route path="/superadmin/user-management" element={<GlobalUserManagement />} />
        
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/browse-events" element={<BrowseEvents />} />
        <Route path="/student/event/:eventId" element={<EventDetails />} />
        <Route path="/student/my-registrations" element={<MyRegistrations />} />
        <Route path="/student/my-teams" element={<MyTeams />} />
        <Route path="/student/attendance" element={<AttendanceHistory />} />
        <Route path="/student/certificates" element={<DownloadCertificates />} />
        <Route path="/faculty/dashboard" element={<div style={{padding: '40px', textAlign: 'center', fontFamily: 'system-ui'}}><h1 style={{color: '#4F46E5'}}>Faculty Dashboard</h1><p>Welcome, Faculty Member!</p></div>} />
        <Route path="/hod/dashboard" element={<div style={{padding: '40px', textAlign: 'center', fontFamily: 'system-ui'}}><h1 style={{color: '#4F46E5'}}>HOD Dashboard</h1><p>Welcome, Head of Department!</p></div>} />
        <Route path="/placement/dashboard" element={<div style={{padding: '40px', textAlign: 'center', fontFamily: 'system-ui'}}><h1 style={{color: '#4F46E5'}}>Training & Placement Dashboard</h1><p>Welcome, T&P Head!</p></div>} />
        <Route path="/student-body/dashboard" element={<div style={{padding: '40px', textAlign: 'center', fontFamily: 'system-ui'}}><h1 style={{color: '#4F46E5'}}>Student Body Dashboard</h1><p>Welcome, Student Representative!</p></div>} />
        <Route path="/sports/dashboard" element={<div style={{padding: '40px', textAlign: 'center', fontFamily: 'system-ui'}}><h1 style={{color: '#4F46E5'}}>Sports Dashboard</h1><p>Welcome, Sports Administrator!</p></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
