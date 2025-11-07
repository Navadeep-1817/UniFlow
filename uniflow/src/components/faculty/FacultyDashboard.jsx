import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, 
  FiUsers, 
  FiBookOpen, 
  FiBell, 
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
  FiHome,
  FiClipboard,
  FiAward,
  FiBarChart,
  FiSettings,
  FiUser,
  FiZap,
  FiLayers,
  FiFilm,
  FiMic,
  FiTarget,
  FiUploadCloud,
  FiTrendingUp,
  FiMessageSquare,
  FiFileText,
  FiSend,
  FiBarChart2
} from 'react-icons/fi';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [facultyInfo, setFacultyInfo] = useState({
    name: 'Dr. Priya Sharma',
    employeeId: 'FAC2024',
    department: 'Computer Science',
    designation: 'Associate Professor',
    university: 'JNTU Hyderabad'
  });

  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Mock data - Replace with API calls
    const mockUpcomingSessions = [
      {
        id: 1,
        eventName: 'Web Development Workshop',
        date: '2024-11-08',
        time: '10:00 AM - 12:00 PM',
        venue: 'Lab 201',
        participants: 45,
        status: 'scheduled'
      },
      {
        id: 2,
        eventName: 'AI Seminar - Session 2',
        date: '2024-11-09',
        time: '02:00 PM - 04:00 PM',
        venue: 'Auditorium',
        participants: 120,
        status: 'scheduled'
      },
      {
        id: 3,
        eventName: 'Hackathon Mentoring',
        date: '2024-11-10',
        time: '09:00 AM - 05:00 PM',
        venue: 'Innovation Hub',
        participants: 30,
        status: 'confirmed'
      }
    ];

    const mockAssignedEvents = [
      {
        id: 1,
        name: 'Tech Fest 2024',
        role: 'Chief Coordinator',
        type: 'technical',
        startDate: '2024-11-15',
        endDate: '2024-11-17',
        totalSessions: 8,
        completedSessions: 3
      },
      {
        id: 2,
        name: 'Data Science Workshop Series',
        role: 'Resource Person',
        type: 'workshop',
        startDate: '2024-11-20',
        endDate: '2024-11-22',
        totalSessions: 5,
        completedSessions: 0
      }
    ];

    const mockTrainingPrograms = [
      {
        id: 1,
        title: 'Pedagogy Enhancement Program',
        date: '2024-11-12',
        duration: '3 hours',
        mode: 'Online',
        status: 'upcoming',
        organizer: 'AICTE'
      },
      {
        id: 2,
        title: 'Research Methodology Workshop',
        date: '2024-11-18',
        duration: '2 days',
        mode: 'Hybrid',
        status: 'registered',
        organizer: 'University'
      }
    ];

    const mockNotifications = [
      {
        id: 1,
        message: 'New student registered for your workshop',
        time: '10 minutes ago',
        type: 'info',
        read: false
      },
      {
        id: 2,
        message: 'Attendance submission deadline: Nov 8, 2024',
        time: '1 hour ago',
        type: 'warning',
        read: false
      },
      {
        id: 3,
        message: 'Event "Tech Fest 2024" schedule updated',
        time: '3 hours ago',
        type: 'info',
        read: true
      },
      {
        id: 4,
        message: 'Training session reminder: Tomorrow at 10 AM',
        time: '1 day ago',
        type: 'reminder',
        read: true
      }
    ];

    setUpcomingSessions(mockUpcomingSessions);
    setAssignedEvents(mockAssignedEvents);
    setTrainingPrograms(mockTrainingPrograms);
    setNotifications(mockNotifications);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const NavButton = ({ icon: Icon, label, path, active = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <button 
        onClick={() => navigate(path)} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: '10px 16px', 
          backgroundColor: active ? '#4F46E5' : isHovered ? '#F3F4F6' : 'transparent', 
          border: active ? 'none' : '1px solid #E5E7EB', 
          borderRadius: '8px', 
          color: active ? '#FFFFFF' : isHovered ? '#4F46E5' : '#6B7280', 
          cursor: 'pointer', 
          fontSize: '14px', 
          fontWeight: '500', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          transition: 'all 0.2s ease',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        <Icon size={16} />
        {label}
      </button>
    );
  };

  const getEventTypeColor = (type) => {
    const colors = {
      technical: { bg: '#DBEAFE', color: '#1E40AF', icon: <FiLayers size={14} /> },
      workshop: { bg: '#E0E7FF', color: '#3730A3', icon: <FiBookOpen size={14} /> },
      cultural: { bg: '#FCE7F3', color: '#9F1239', icon: <FiFilm size={14} /> },
      seminar: { bg: '#F3E8FF', color: '#6B21A8', icon: <FiMic size={14} /> }
    };
    return colors[type] || { bg: '#F3F4F6', color: '#374151', icon: <FiCalendar size={14} /> };
  };

  const stats = {
    upcomingSessions: upcomingSessions.length,
    assignedEvents: assignedEvents.length,
    totalParticipants: upcomingSessions.reduce((sum, session) => sum + session.participants, 0),
    unreadNotifications: notifications.filter(n => !n.read).length
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    logo: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#4F46E5',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    nav: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    welcomeSection: {
      padding: '24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#FFFFFF'
    },
    welcomeText: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '8px'
    },
    facultyInfo: {
      fontSize: '14px',
      opacity: 0.9,
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      marginTop: '8px'
    },
    logoutBtn: {
      padding: '8px 16px',
      backgroundColor: 'rgba(255,255,255,0.2)',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: '8px',
      color: '#FFFFFF',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s'
    },
    mainContent: {
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1F2937',
      margin: 0
    },
    statLabel: {
      fontSize: '14px',
      color: '#6B7280',
      margin: '4px 0 0 0'
    },
    quickActions: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center'
    },
    actionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px'
    },
    actionCard: {
      padding: '16px',
      borderRadius: '10px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: '2px solid transparent'
    },
    twoColumnGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '24px',
      marginBottom: '24px'
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    sessionCard: {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      marginBottom: '12px',
      transition: 'all 0.2s'
    },
    eventCard: {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      marginBottom: '12px'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500'
    },
    notification: {
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'start',
      gap: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    toast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '8px',
      color: '#FFFFFF',
      fontWeight: '500',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'success' ? '#10B981' : toast.type === 'error' ? '#EF4444' : '#3B82F6'
        }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <FiBookOpen size={28} />
          UniFlow Faculty
        </div>
        <div style={styles.nav}>
          <NavButton icon={FiHome} label="Dashboard" path="/faculty/dashboard" active={true} />
          <NavButton icon={FiCalendar} label="My Events" path="/faculty/my-events" />
          <NavButton icon={FiLayers} label="Sessions" path="/faculty/sessions" />
          <NavButton icon={FiCheckCircle} label="Attendance" path="/faculty/attendance" />
          <NavButton icon={FiClipboard} label="Sheet" path="/faculty/attendance-sheet" />
          <NavButton icon={FiUploadCloud} label="Materials" path="/faculty/upload-materials" />
          <NavButton icon={FiTrendingUp} label="Progress" path="/faculty/student-progress" />
          <NavButton icon={FiFileText} label="Reports" path="/faculty/reports" />
          <NavButton icon={FiSend} label="Leave" path="/faculty/leave-request" />
          <NavButton icon={FiBell} label="Notifications" path="/faculty/notifications" />
          <NavButton icon={FiBarChart2} label="Analytics" path="/faculty/analytics" />
          <button onClick={handleLogout} style={{padding: '10px 16px', backgroundColor: '#FEE2E2', border: 'none', borderRadius: '8px', color: '#DC2626', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s ease'}} onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(220, 38, 38, 0.2)';}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}>Logout</button>
        </div>
      </div>

      {/* Welcome Section */}
      <div style={styles.welcomeSection}>
        <div style={styles.welcomeText}>Welcome back, {facultyInfo.name}! 👋</div>
        <div style={styles.facultyInfo}>
          <span><FiUser size={14} style={{marginRight: '4px', verticalAlign: 'middle'}} /> {facultyInfo.employeeId}</span>
          <span><FiBookOpen size={14} style={{marginRight: '4px', verticalAlign: 'middle'}} /> {facultyInfo.department}</span>
          <span><FiAward size={14} style={{marginRight: '4px', verticalAlign: 'middle'}} /> {facultyInfo.designation}</span>
          <span><FiTarget size={14} style={{marginRight: '4px', verticalAlign: 'middle'}} /> {facultyInfo.university}</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: '#EEF2FF', color: '#4F46E5'}}><FiClock size={24} /></div>
            <div style={{flex: 1}}>
              <h2 style={styles.statNumber}>{stats.upcomingSessions}</h2>
              <p style={stats.statLabel}>Upcoming Sessions</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: '#FEF3C7', color: '#D97706'}}><FiClipboard size={24} /></div>
            <div style={{flex: 1}}>
              <h2 style={styles.statNumber}>{stats.assignedEvents}</h2>
              <p style={stats.statLabel}>Assigned Events</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: '#DBEAFE', color: '#2563EB'}}><FiUsers size={24} /></div>
            <div style={{flex: 1}}>
              <h2 style={styles.statNumber}>{stats.totalParticipants}</h2>
              <p style={stats.statLabel}>Total Participants</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: '#FEE2E2', color: '#DC2626'}}><FiBell size={24} /></div>
            <div style={{flex: 1}}>
              <h2 style={styles.statNumber}>{stats.unreadNotifications}</h2>
              <p style={stats.statLabel}>Unread Notifications</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <h3 style={styles.sectionTitle}><FiZap size={18} style={{marginRight: '8px'}} /> Quick Actions</h3>
          <div style={styles.actionsGrid}>
            {[
              { icon: <FiCheckCircle size={20} />, label: 'Mark Attendance', color: '#4F46E5' },
              { icon: <FiCalendar size={20} />, label: 'View Schedule', color: '#10B981' },
              { icon: <FiClipboard size={20} />, label: 'Session Report', color: '#F59E0B' },
              { icon: <FiUsers size={20} />, label: 'Participants', color: '#8B5CF6' },
              { icon: <FiBarChart size={20} />, label: 'Analytics', color: '#EC4899' },
              { icon: <FiSettings size={20} />, label: 'Settings', color: '#06B6D4' }
            ].map((action, index) => (
              <div
                key={index}
                style={{...styles.actionCard, backgroundColor: `${action.color}15`}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = action.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{color: action.color, marginBottom: '8px'}}>{action.icon}</div>
                <div style={{fontSize: '13px', fontWeight: '500', color: '#374151'}}>{action.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={styles.twoColumnGrid}>
          {/* Upcoming Sessions */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}><FiClock size={18} style={{marginRight: '8px'}} /> Upcoming Sessions</h3>
            {upcomingSessions.map(session => (
              <div 
                key={session.id} 
                style={styles.sessionCard}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px'}}>
                  <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1F2937'}}>{session.eventName}</h4>
                  <span style={{...styles.badge, backgroundColor: session.status === 'confirmed' ? '#D1FAE5' : '#DBEAFE', color: session.status === 'confirmed' ? '#065F46' : '#1E40AF'}}>
                    {session.status}
                  </span>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#6B7280'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <FiCalendar size={14} />
                    <span>{session.date}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <FiClock size={14} />
                    <span>{session.time}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <FiMapPin size={14} />
                    <span>{session.venue}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <FiUsers size={14} />
                    <span>{session.participants} Participants</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Assigned Events */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}><FiClipboard size={18} style={{marginRight: '8px'}} /> Assigned Events</h3>
            {assignedEvents.map(event => {
              const typeStyle = getEventTypeColor(event.type);
              const progress = (event.completedSessions / event.totalSessions) * 100;
              return (
                <div key={event.id} style={styles.eventCard}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px'}}>
                    <div>
                      <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '4px'}}>{event.name}</h4>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{...styles.badge, backgroundColor: typeStyle.bg, color: typeStyle.color, display: 'flex', alignItems: 'center', gap: '4px'}}>
                          {typeStyle.icon}
                          {event.type}
                        </span>
                        <span style={{fontSize: '12px', color: '#6B7280'}}>{event.role}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{fontSize: '13px', color: '#6B7280', marginBottom: '12px'}}>
                    <div style={{marginBottom: '4px'}}>
                      <FiCalendar size={14} style={{marginRight: '6px', verticalAlign: 'middle'}} />
                      {event.startDate} to {event.endDate}
                    </div>
                  </div>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginBottom: '6px'}}>
                      <span>Progress</span>
                      <span>{event.completedSessions}/{event.totalSessions} sessions</span>
                    </div>
                    <div style={{width: '100%', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden'}}>
                      <div style={{width: `${progress}%`, height: '100%', backgroundColor: '#4F46E5', transition: 'width 0.3s'}}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout - Training & Notifications */}
        <div style={styles.twoColumnGrid}>
          {/* Faculty Training Programs */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}><FiBookOpen size={18} style={{marginRight: '8px'}} /> Faculty Training Programs</h3>
            {trainingPrograms.map(program => (
              <div key={program.id} style={styles.sessionCard}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px'}}>
                  <h4 style={{margin: 0, fontSize: '15px', fontWeight: '600', color: '#1F2937'}}>{program.title}</h4>
                  <span style={{...styles.badge, backgroundColor: program.status === 'upcoming' ? '#FEF3C7' : '#DBEAFE', color: program.status === 'upcoming' ? '#92400E' : '#1E40AF'}}>
                    {program.status}
                  </span>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#6B7280'}}>
                  <div><FiCalendar size={14} style={{marginRight: '6px', verticalAlign: 'middle'}} />{program.date}</div>
                  <div><FiClock size={14} style={{marginRight: '6px', verticalAlign: 'middle'}} />{program.duration}</div>
                  <div><FiMapPin size={14} style={{marginRight: '6px', verticalAlign: 'middle'}} />{program.mode}</div>
                  <div style={{fontSize: '12px', color: '#9CA3AF'}}>Organized by: {program.organizer}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Notifications */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}><FiBell size={18} style={{marginRight: '8px'}} /> Recent Notifications</h3>
            {notifications.map(notif => (
              <div
                key={notif.id}
                style={{
                  ...styles.notification,
                  backgroundColor: notif.read ? 'transparent' : '#F0F9FF'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : '#F0F9FF'}
              >
                <div style={{
                  color: notif.type === 'warning' ? '#F59E0B' : notif.type === 'reminder' ? '#8B5CF6' : '#3B82F6'
                }}>
                  {notif.type === 'warning' ? <FiAlertCircle size={18} /> : <FiBell size={18} />}
                </div>
                <div style={{flex: 1}}>
                  <p style={{margin: 0, fontSize: '14px', color: '#1F2937', fontWeight: notif.read ? '400' : '500'}}>{notif.message}</p>
                  <p style={{margin: '4px 0 0 0', fontSize: '12px', color: '#9CA3AF'}}>{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
