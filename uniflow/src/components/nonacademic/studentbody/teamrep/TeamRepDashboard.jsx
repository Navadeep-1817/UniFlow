import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { 
  FiHome, FiCalendar, FiUsers, FiFileText, FiCheckCircle, 
  FiClock, FiXCircle, FiTrendingUp, FiSettings, FiBell,
  FiAlertCircle, FiActivity, FiMessageSquare
} from 'react-icons/fi';

const TeamRepDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [teamRepInfo, setTeamRepInfo] = useState({
    name: '',
    rollNumber: '',
    studentBody: '',
    university: ''
  });
  
  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: 0,
    pendingApprovals: 0,
    activeMembers: 0,
    upcomingEvents: 0
  });

  // Initialize with empty arrays - will be fetched from API
  const [proposedEvents, setProposedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Load Team Rep data from user context
    if (user) {
      setTeamRepInfo({
        name: user.name || 'Team Representative',
        rollNumber: user.rollNumber || 'N/A',
        studentBody: user.studentBody?.name || user.studentBody || 'N/A',
        university: user.university?.name || user.university || 'N/A'
      });
    }
  }, [user]);

  useEffect(() => {
    // Fetch real data from API
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // TODO: Implement backend API endpoints
        // GET /api/teamrep/stats
        // GET /api/teamrep/events/proposed
        // GET /api/teamrep/events/upcoming
        // GET /api/teamrep/announcements
        console.log('Team Rep Dashboard ready for API integration');
      } catch (error) {
        console.error('Error fetching Team Rep dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Old mock data - REMOVED
  // const [proposedEvents, setProposedEvents] = useState([
  //   { id: 1, name: 'Tech Talk Series', status: 'approved', date: '2024-12-15', budget: 5000 },
  //   { id: 2, name: 'Cultural Fest', status: 'pending', date: '2024-12-20', budget: 15000 },
  //   ...
  // ]);
  // const [upcomingEvents, setUpcomingEvents] = useState([...]);
  // const [announcements, setAnnouncements] = useState([...]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <FiCheckCircle size={16} />;
      case 'pending': return <FiClock size={16} />;
      case 'rejected': return <FiXCircle size={16} />;
      default: return null;
    }
  };

  const getAnnouncementIcon = (type) => {
    switch(type) {
      case 'warning': return <FiAlertCircle size={20} color="#F59E0B" />;
      case 'success': return <FiCheckCircle size={20} color="#10B981" />;
      case 'info': return <FiBell size={20} color="#3B82F6" />;
      default: return <FiBell size={20} />;
    }
  };

  const quickActions = [
    { title: 'Propose Event', icon: <FiCalendar size={24} />, path: '/teamrep/propose-event', color: '#4F46E5' },
    { title: 'Manage Team', icon: <FiUsers size={24} />, path: '/teamrep/manage-members', color: '#10B981' },
    { title: 'Event Execution', icon: <FiActivity size={24} />, path: '/teamrep/event-execution', color: '#F59E0B' },
    { title: 'Activity Report', icon: <FiFileText size={24} />, path: '/teamrep/activity-report', color: '#EF4444' },
    { title: 'Attendance', icon: <FiCheckCircle size={24} />, path: '/teamrep/attendance', color: '#8B5CF6' },
    { title: 'Feedback', icon: <FiMessageSquare size={24} />, path: '/teamrep/feedback', color: '#EC4899' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Top Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 40px',
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        <button 
          onClick={() => navigate('/teamrep/dashboard')} 
          style={{
            padding: '14px 16px', 
            backgroundColor: 'transparent', 
            border: 'none', 
            borderBottom: '3px solid #4F46E5', 
            fontSize: '13px', 
            fontWeight: '600', 
            color: '#4F46E5', 
            cursor: 'pointer', 
            whiteSpace: 'nowrap', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px'
          }}
        >
          <FiHome size={16} /> Dashboard
        </button>
        <button 
          onClick={() => navigate('/teamrep/propose-event')} 
          style={{
            padding: '14px 16px', 
            backgroundColor: 'transparent', 
            border: 'none', 
            borderBottom: '3px solid transparent', 
            fontSize: '13px', 
            fontWeight: '600', 
            color: '#6B7280', 
            cursor: 'pointer', 
            whiteSpace: 'nowrap', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px'
          }} 
          onMouseOver={(e) => { 
            e.currentTarget.style.color = '#4F46E5'; 
            e.currentTarget.style.borderBottomColor = '#4F46E5'; 
          }} 
          onMouseOut={(e) => { 
            e.currentTarget.style.color = '#6B7280'; 
            e.currentTarget.style.borderBottomColor = 'transparent'; 
          }}
        >
          <FiCalendar size={14} /> Propose Event
        </button>
        <button 
          onClick={() => navigate('/teamrep/manage-members')} 
          style={{
            padding: '14px 16px', 
            backgroundColor: 'transparent', 
            border: 'none', 
            borderBottom: '3px solid transparent', 
            fontSize: '13px', 
            fontWeight: '600', 
            color: '#6B7280', 
            cursor: 'pointer', 
            whiteSpace: 'nowrap', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px'
          }} 
          onMouseOver={(e) => { 
            e.currentTarget.style.color = '#4F46E5'; 
            e.currentTarget.style.borderBottomColor = '#4F46E5'; 
          }} 
          onMouseOut={(e) => { 
            e.currentTarget.style.color = '#6B7280'; 
            e.currentTarget.style.borderBottomColor = 'transparent'; 
          }}
        >
          <FiUsers size={14} /> Team Members
        </button>
        <button 
          onClick={() => navigate('/teamrep/activity-report')} 
          style={{
            padding: '14px 16px', 
            backgroundColor: 'transparent', 
            border: 'none', 
            borderBottom: '3px solid transparent', 
            fontSize: '13px', 
            fontWeight: '600', 
            color: '#6B7280', 
            cursor: 'pointer', 
            whiteSpace: 'nowrap', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px'
          }} 
          onMouseOver={(e) => { 
            e.currentTarget.style.color = '#4F46E5'; 
            e.currentTarget.style.borderBottomColor = '#4F46E5'; 
          }} 
          onMouseOut={(e) => { 
            e.currentTarget.style.color = '#6B7280'; 
            e.currentTarget.style.borderBottomColor = 'transparent'; 
          }}
        >
          <FiFileText size={14} /> Reports
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px 40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Team Representative Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            Welcome back! Here's an overview of your team activities and events
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          {[
            { label: 'Total Events', value: dashboardStats.totalEvents, icon: <FiCalendar size={24} />, color: '#4F46E5' },
            { label: 'Pending Approvals', value: dashboardStats.pendingApprovals, icon: <FiClock size={24} />, color: '#F59E0B' },
            { label: 'Active Members', value: dashboardStats.activeMembers, icon: <FiUsers size={24} />, color: '#10B981' },
            { label: 'Upcoming Events', value: dashboardStats.upcomingEvents, icon: <FiTrendingUp size={24} />, color: '#EF4444' }
          ].map((stat, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                border: '1px solid #E5E7EB'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px', fontWeight: '500' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: `${stat.color}15`, 
                  padding: '12px', 
                  borderRadius: '10px',
                  color: stat.color
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
            Quick Actions
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '16px' 
          }}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = action.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
              >
                <div style={{ color: action.color }}>
                  {action.icon}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid - Events and Announcements */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
          
          {/* Proposed Events Status */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Event Proposals Status
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {proposedEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    padding: '16px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                    e.currentTarget.style.borderColor = getStatusColor(event.status);
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                      {event.name}
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      backgroundColor: `${getStatusColor(event.status)}15`,
                      color: getStatusColor(event.status),
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {getStatusIcon(event.status)}
                      <span style={{ textTransform: 'capitalize' }}>{event.status}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B7280' }}>
                    <span>📅 {event.date}</span>
                    <span>💰 ₹{event.budget.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Upcoming Events
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    padding: '16px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    {event.name}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#6B7280' }}>
                    <span>📅 {event.date} • 🕒 {event.time}</span>
                    <span>📍 {event.venue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB',
            gridColumn: 'span 1'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiBell size={20} /> Announcements
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  style={{
                    padding: '16px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.08)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flexShrink: 0 }}>
                      {getAnnouncementIcon(announcement.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                        {announcement.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                        {announcement.message}
                      </p>
                      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                        {announcement.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeamRepDashboard;
