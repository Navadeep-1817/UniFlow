import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiLayers, 
  FiAward, 
  FiFilm, 
  FiBookOpen, 
  FiCalendar, 
  FiMic, 
  FiHome, 
  FiCheckCircle, 
  FiBell, 
  FiTarget, 
  FiZap, 
  FiClipboard, 
  FiCalendar as FiCalendarAlt,
  FiClock,
  FiMapPin,
  FiUsers,
  FiUser,
  FiMessageSquare,
  FiFileText,
  FiChevronRight,
  FiSearch,
  FiBriefcase,
  FiBarChart2
} from 'react-icons/fi';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    rollNumber: '',
    department: '',
    university: ''
  });

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Load user data from auth context
    if (user) {
      setStudentInfo({
        name: user.name || 'Student',
        rollNumber: user.rollNumber || 'N/A',
        department: user.department?.name || user.department || 'N/A',
        university: user.university?.name || user.university || 'N/A'
      });
    }
  }, [user]);

  useEffect(() => {
    // TODO: Fetch data from API
    // fetchUpcomingEvents();
    // fetchRegisteredEvents();
    // fetchNotifications();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleRegister = (eventId) => {
    showToast('Successfully registered for the event!');
    // Move event from upcoming to registered
    const event = upcomingEvents.find(e => e.id === eventId);
    if (event) {
      setRegisteredEvents([...registeredEvents, { ...event, status: 'confirmed', registrationDate: new Date().toISOString().split('T')[0] }]);
      setUpcomingEvents(upcomingEvents.filter(e => e.id !== eventId));
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      technical: { bg: '#DBEAFE', color: '#1E40AF', icon: <FiLayers size={16} /> },
      sports: { bg: '#FEF3C7', color: '#92400E', icon: <FiAward size={16} /> },
      cultural: { bg: '#FCE7F3', color: '#9F1239', icon: <FiFilm size={16} /> },
      workshop: { bg: '#E0E7FF', color: '#3730A3', icon: <FiBookOpen size={16} /> },
      seminar: { bg: '#F3E8FF', color: '#6B21A8', icon: <FiMic size={16} /> }
    };
    return colors[type] || { bg: '#F3F4F6', color: '#374151', icon: <FiCalendar size={16} /> };
  };

  const stats = {
    upcomingEvents: upcomingEvents.length,
    registeredEvents: registeredEvents.length,
    unreadNotifications: notifications.filter(n => !n.read).length,
    totalEvents: upcomingEvents.length + registeredEvents.length
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #E5E7EB',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    welcomeText: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937'
    },
    studentInfo: {
      fontSize: '13px',
      color: '#6B7280',
      marginTop: '2px'
    },
    logoutBtn: {
      padding: '10px 20px',
      backgroundColor: 'white',
      color: '#4F46E5',
      border: '2px solid #4F46E5',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    content: {
      padding: '40px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    statIcon: {
      fontSize: '32px',
      marginBottom: '8px'
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#4F46E5',
      margin: '8px 0'
    },
    statLabel: {
      fontSize: '13px',
      color: '#6B7280',
      margin: 0
    },
    quickActions: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px',
      border: '1px solid #E5E7EB'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '20px'
    },
    actionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '16px'
    },
    actionCard: {
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#F9FAFB',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: '2px solid transparent'
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
      marginBottom: '24px'
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #E5E7EB'
    },
    eventCard: {
      backgroundColor: '#F9FAFB',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '16px',
      border: '1px solid #E5E7EB',
      transition: 'all 0.3s'
    },
    eventHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    eventTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F2937',
      margin: 0
    },
    badge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block'
    },
    eventDetails: {
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '12px',
      lineHeight: '1.6'
    },
    eventMeta: {
      display: 'flex',
      gap: '16px',
      fontSize: '13px',
      color: '#6B7280',
      marginTop: '12px',
      flexWrap: 'wrap'
    },
    registerBtn: {
      marginTop: '12px',
      width: '100%',
      padding: '10px',
      backgroundColor: '#4F46E5',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    notificationCard: {
      padding: '16px',
      backgroundColor: '#F9FAFB',
      borderRadius: '8px',
      marginBottom: '12px',
      borderLeft: '3px solid #4F46E5'
    },
    notificationTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '4px'
    },
    notificationMessage: {
      fontSize: '13px',
      color: '#6B7280',
      marginBottom: '4px'
    },
    notificationTime: {
      fontSize: '12px',
      color: '#9CA3AF'
    },
    toast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#10B981',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 2000,
      fontSize: '14px',
      fontWeight: '600'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#6B7280'
    }
  };

  return (
    <div style={styles.container}>
      {toast.show && (
        <div style={{...styles.toast, backgroundColor: toast.type === 'error' ? '#EF4444' : '#10B981'}}>
          {toast.message}
        </div>
      )}

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>UniFlow</div>
          <div>
            <div style={styles.welcomeText}>Welcome back, {studentInfo.name}! <span style={{marginLeft: '4px'}}>👋</span></div>
            <div style={styles.studentInfo}>
              {studentInfo.rollNumber} • {studentInfo.department} • {studentInfo.university}
            </div>
          </div>
        </div>
        <button 
          style={styles.logoutBtn}
          onClick={handleLogout}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#4F46E5';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.color = '#4F46E5';
          }}
        >
          Logout
        </button>
      </div>

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
        <button onClick={() => navigate('/student/dashboard')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid #4F46E5', fontSize: '13px', fontWeight: '600', color: '#4F46E5', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px'}}><FiHome size={16} /> Dashboard</button>
        <button onClick={() => navigate('/student/browse-events')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiSearch size={14} /> Browse Events</button>
        <button onClick={() => navigate('/student/my-registrations')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiClipboard size={14} /> My Registrations</button>
        <button onClick={() => navigate('/student/my-teams')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiUsers size={14} /> My Teams</button>
        <button onClick={() => navigate('/student/attendance')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiCheckCircle size={14} /> Attendance</button>
        <button onClick={() => navigate('/student/certificates')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiAward size={14} /> Certificates</button>
        <button onClick={() => navigate('/student/notifications')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiBell size={14} /> Notifications</button>
        <button onClick={() => navigate('/student/placement-profile')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiBriefcase size={14} /> Placement</button>
        <button onClick={() => navigate('/student/analytics')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiBarChart2 size={14} /> Analytics</button>
        <button onClick={() => navigate('/student/profile')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiUser size={14} /> My Profile</button>
      </div>

      <div style={styles.content}>
        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><FiCalendar size={20} /></div>
            <h2 style={styles.statNumber}>{stats.upcomingEvents}</h2>
            <p style={styles.statLabel}>Upcoming Events</p>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><FiCheckCircle size={20} /></div>
            <h2 style={styles.statNumber}>{stats.registeredEvents}</h2>
            <p style={styles.statLabel}>My Registrations</p>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><FiBell size={20} /></div>
            <h2 style={styles.statNumber}>{stats.unreadNotifications}</h2>
            <p style={styles.statLabel}>Unread Notifications</p>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}><FiTarget size={20} /></div>
            <h2 style={styles.statNumber}>{stats.totalEvents}</h2>
            <p style={styles.statLabel}>Total Events</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <h3 style={styles.sectionTitle}><FiZap size={18} style={{marginRight: '8px'}} /> Quick Actions</h3>
          <div style={styles.actionsGrid}>
            {[
              { icon: <FiClipboard size={20} />, label: 'My Events', color: '#4F46E5' },
              { icon: <FiCalendarAlt size={20} />, label: 'Register Event', color: '#10B981' },
              { icon: <FiUser size={20} />, label: 'My Profile', color: '#8B5CF6' },
              { icon: <FiCheckCircle size={20} />, label: 'Attendance', color: '#EC4899' },
              { icon: <FiBookOpen size={20} />, label: 'Resources', color: '#06B6D4' }
            ].map((action, index) => (
              <div
                key={index}
                style={styles.actionCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = action.color;
                  e.currentTarget.style.backgroundColor = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
              >
                <div style={{fontSize: '32px', marginBottom: '8px'}}>{action.icon}</div>
                <div style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>{action.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={styles.mainGrid}>
          {/* Left Column - Events */}
          <div>
            {/* Upcoming Events */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}><FiCalendar size={18} style={{marginRight: '8px'}} /> Upcoming Events</h3>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => {
                  const typeColors = getEventTypeColor(event.type);
                  return (
                    <div
                      key={event.id}
                      style={styles.eventCard}
                      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div style={styles.eventHeader}>
                        <h4 style={styles.eventTitle}>{typeColors.icon} {event.name}</h4>
                        <span style={{...styles.badge, backgroundColor: typeColors.bg, color: typeColors.color}}>
                          {event.type.toUpperCase()}
                        </span>
                      </div>
                      <p style={styles.eventDetails}>{event.description}</p>
                      <div style={styles.eventMeta}>
                        <span><FiCalendar size={14} style={{marginRight: '4px'}} /> {new Date(event.date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                        <span><FiClock size={14} style={{marginRight: '4px'}} /> {event.time}</span>
                        <span><FiMapPin size={14} style={{marginRight: '4px'}} /> {event.venue}</span>
                        <span><FiUsers size={14} style={{marginRight: '4px'}} /> {event.spotsLeft} spots left</span>
                      </div>
                      <div style={styles.eventMeta}>
                        <span><FiTarget size={14} style={{marginRight: '4px'}} /> Organized by: {event.organizer}</span>
                        <span><FiClock size={14} style={{marginRight: '4px'}} /> Deadline: {new Date(event.registrationDeadline).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'})}</span>
                      </div>
                      <button
                        style={styles.registerBtn}
                        onClick={() => handleRegister(event.id)}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#4338CA'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#4F46E5'}
                      >
                        <FiCalendarAlt size={16} style={{marginRight: '6px'}} /> Register Now
                      </button>
                    </div>
                  );
                })
              ) : (
                <div style={styles.emptyState}>
                  <div style={{fontSize: '48px', marginBottom: '12px'}}><FiCalendar size={48} /></div>
                  <p>No upcoming events available</p>
                </div>
              )}
            </div>

            {/* My Registrations */}
            <div style={{...styles.section, marginTop: '24px'}}>
              <h3 style={styles.sectionTitle}><FiCheckCircle size={18} style={{marginRight: '8px'}} /> My Registered Events</h3>
              {registeredEvents.length > 0 ? (
                registeredEvents.map(event => {
                  const typeColors = getEventTypeColor(event.type);
                  return (
                    <div key={event.id} style={styles.eventCard}>
                      <div style={styles.eventHeader}>
                        <h4 style={styles.eventTitle}>{typeColors.icon} {event.name}</h4>
                        <span style={{...styles.badge, backgroundColor: '#D1FAE5', color: '#065F46'}}>
                          {event.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={styles.eventMeta}>
                        <span>📅 {new Date(event.date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                        <span>⏰ {event.time}</span>
                        <span>📍 {event.venue}</span>
                      </div>
                      <div style={styles.eventMeta}>
                        <span><FiCheckCircle size={14} style={{marginRight: '4px'}} /> Registered on: {new Date(event.registrationDate).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={styles.emptyState}>
                  <div style={{fontSize: '48px', marginBottom: '12px'}}><FiCalendarAlt size={48} /></div>
                  <p>You haven't registered for any events yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Notifications */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}><FiBell size={18} style={{marginRight: '8px'}} /> Recent Notifications</h3>
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    ...styles.notificationCard,
                    opacity: notification.read ? 0.6 : 1
                  }}
                >
                  <div style={styles.notificationTitle}>{notification.title}</div>
                  <div style={styles.notificationMessage}>{notification.message}</div>
                  <div style={styles.notificationTime}>{notification.time}</div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <div style={{fontSize: '48px', marginBottom: '12px'}}><FiBell size={48} /></div>
                <p>No notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
