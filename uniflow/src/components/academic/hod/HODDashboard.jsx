import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import HODTopNav from './HODTopNav';
import { 
  FiUsers,
  FiCalendar,
  FiTrendingUp,
  FiSettings,
  FiClipboard,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiUserCheck,
  FiMapPin,
  FiBarChart,
  FiGrid,
  FiActivity,
  FiAward
} from 'react-icons/fi';

const HODDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [quickStats, setQuickStats] = useState({});
  const [hodInfo, setHodInfo] = useState({
    name: '',
    employeeId: '',
    department: '',
    university: ''
  });

  useEffect(() => {
    // Load HOD data from user context
    if (user) {
      setHodInfo({
        name: user.name || 'HOD',
        employeeId: user.employeeId || 'N/A',
        department: user.department?.name || user.department || 'N/A',
        university: user.university?.name || user.university || 'N/A'
      });
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    if (!token) return;

    try {
      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_BASE_URL}/hod/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats({
          totalFaculty: data.data.totalFaculty || 0,
          totalStudents: data.data.totalStudents || 0,
          ongoingEvents: data.data.ongoingEvents || 0,
          upcomingEvents: data.data.upcomingEvents || 0,
          completedEvents: data.data.totalEvents - data.data.ongoingEvents - data.data.upcomingEvents || 0,
          pendingApprovals: 0,
          resourceUtilization: 0,
          attendanceRate: 0
        });
        setQuickStats({
          todayEvents: 0,
          pendingLeaves: 0,
          venueBookings: 0,
          trainerRequests: 0
        });
      }

      // Fetch department events for recent activities
      const eventsResponse = await fetch(`${API_BASE_URL}/hod/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        
        // Transform events into recent activities
        const activities = eventsData.data.slice(0, 5).map((event, index) => {
          const eventDate = new Date(event.date?.startDate || event.createdAt);
          const now = new Date();
          const diffTime = Math.abs(now - eventDate);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
          
          let timeAgo;
          if (diffDays === 0) {
            if (diffHours === 0) {
              timeAgo = 'Just now';
            } else if (diffHours === 1) {
              timeAgo = '1 hour ago';
            } else {
              timeAgo = `${diffHours} hours ago`;
            }
          } else if (diffDays === 1) {
            timeAgo = 'Yesterday';
          } else {
            timeAgo = `${diffDays} days ago`;
          }

          let activityType = 'event';
          let activityTitle = '';
          let activityDesc = '';

          if (event.status === 'Pending') {
            activityType = 'approval';
            activityTitle = 'Event Created';
            activityDesc = `${event.title} is pending approval`;
          } else if (event.status === 'Approved') {
            activityType = 'event';
            activityTitle = 'Event Approved';
            activityDesc = `${event.title} has been approved`;
          } else if (event.status === 'Ongoing') {
            activityType = 'event';
            activityTitle = 'Event Ongoing';
            activityDesc = `${event.title} is currently happening`;
          } else if (event.status === 'Completed') {
            activityType = 'event';
            activityTitle = 'Event Completed';
            activityDesc = `${event.title} has been completed`;
          } else {
            activityType = 'event';
            activityTitle = 'Event Update';
            activityDesc = event.title;
          }

          // Add trainer allocation activity
          if (event.trainer) {
            activityType = 'faculty';
            activityTitle = 'Trainer Allocated';
            activityDesc = `Trainer assigned to ${event.title}`;
          }

          return {
            id: event._id || index,
            type: activityType,
            title: activityTitle,
            description: activityDesc,
            timestamp: timeAgo,
            eventData: event
          };
        });

        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('Error fetching HOD dashboard data:', error);
      // Set default zero values on error
      setStats({
        totalFaculty: 0,
        totalStudents: 0,
        ongoingEvents: 0,
        upcomingEvents: 0,
        completedEvents: 0,
        pendingApprovals: 0,
        resourceUtilization: 0,
        attendanceRate: 0
      });
    }
  };


  const getActivityIcon = (type) => {
    const icons = {
      event: <FiCalendar size={18} color="#4F46E5" />,
      approval: <FiCheckCircle size={18} color="#10B981" />,
      resource: <FiMapPin size={18} color="#F59E0B" />,
      faculty: <FiUserCheck size={18} color="#3B82F6" />,
      alert: <FiAlertCircle size={18} color="#EF4444" />
    };
    return icons[type] || <FiActivity size={18} color="#6B7280" />;
  };

  const modules = [
    { name: 'Faculty Management', icon: <FiUsers size={20} />, route: '/hod/faculty', color: '#4F46E5', desc: 'Manage faculty members' },
    { name: 'Student Management', icon: <FiUserCheck size={20} />, route: '/hod/students', color: '#10B981', desc: 'View student records' },
    { name: 'Department Events', icon: <FiCalendar size={20} />, route: '/hod/events', color: '#F59E0B', desc: 'Manage events' },
    { name: 'Faculty Allocation', icon: <FiGrid size={20} />, route: '/hod/allocation', color: '#3B82F6', desc: 'Assign faculty to events' },
    { name: 'Trainer Requests', icon: <FiAward size={20} />, route: '/hod/trainers', color: '#EC4899', desc: 'Manage trainer requests' },
    { name: 'Analytics', icon: <FiBarChart size={20} />, route: '/hod/analytics', color: '#06B6D4', desc: 'View department analytics' },
    { name: 'Attendance', icon: <FiCheckCircle size={20} />, route: '/hod/attendance', color: '#84CC16', desc: 'Track attendance' }
  ];

  return (
    <div style={styles.container}>
      <HODTopNav />

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>HOD Dashboard</h1>
            <p style={styles.pageSubtitle}>Department of Computer Science & Engineering</p>
          </div>
          <div style={styles.dateTime}>
            <FiClock size={16} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={{...styles.statIconContainer, backgroundColor: '#EEF2FF'}}>
              <FiUsers size={28} color="#4F46E5" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Faculty</div>
              <div style={styles.statNumber}>{stats.totalFaculty}</div>
              <div style={styles.statSubtext}>Active members</div>
            </div>
          </div>
          <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={{...styles.statIconContainer, backgroundColor: '#D1FAE5'}}>
              <FiUserCheck size={28} color="#10B981" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Students</div>
              <div style={styles.statNumber}>{stats.totalStudents}</div>
              <div style={styles.statSubtext}>Enrolled this semester</div>
            </div>
          </div>
          <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={{...styles.statIconContainer, backgroundColor: '#FEF3C7'}}>
              <FiCalendar size={28} color="#F59E0B" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Ongoing Events</div>
              <div style={styles.statNumber}>{stats.ongoingEvents}</div>
              <div style={styles.statSubtext}>{stats.upcomingEvents} upcoming</div>
            </div>
          </div>
          <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={{...styles.statIconContainer, backgroundColor: '#DBEAFE'}}>
              <FiTrendingUp size={28} color="#3B82F6" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Resource Usage</div>
              <div style={styles.statNumber}>{stats.resourceUtilization}%</div>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${stats.resourceUtilization}%`, backgroundColor: '#3B82F6'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={styles.quickStatsRow}>
          <div style={styles.quickStatCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <FiCalendar size={20} color="#4F46E5" />
            <div>
              <div style={styles.quickStatNumber}>{quickStats.todayEvents}</div>
              <div style={styles.quickStatLabel}>Today's Events</div>
            </div>
          </div>
          <div style={styles.quickStatCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <FiClipboard size={20} color="#F59E0B" />
            <div>
              <div style={styles.quickStatNumber}>{quickStats.pendingLeaves}</div>
              <div style={styles.quickStatLabel}>Pending Leaves</div>
            </div>
          </div>
          <div style={styles.quickStatCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <FiMapPin size={20} color="#10B981" />
            <div>
              <div style={styles.quickStatNumber}>{quickStats.venueBookings}</div>
              <div style={styles.quickStatLabel}>Venue Bookings</div>
            </div>
          </div>
          <div style={styles.quickStatCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <FiUserCheck size={20} color="#EF4444" />
            <div>
              <div style={styles.quickStatNumber}>{quickStats.trainerRequests}</div>
              <div style={styles.quickStatLabel}>Trainer Requests</div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={styles.twoColumnLayout}>
          {/* Navigation Modules */}
          <div style={styles.modulesSection}>
            <h3 style={styles.sectionTitle}>Quick Access Modules</h3>
            <div style={styles.modulesGrid}>
              {modules.map((module, index) => (
                <div
                  key={index}
                  style={styles.moduleCard}
                  onClick={() => navigate(module.route)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                    e.currentTarget.style.borderColor = module.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <div style={{...styles.moduleIcon, color: module.color}}>
                    {module.icon}
                  </div>
                  <div style={styles.moduleContent}>
                    <div style={styles.moduleName}>{module.name}</div>
                    <div style={styles.moduleDesc}>{module.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div style={styles.activitiesSection}>
            <h3 style={styles.sectionTitle}>Recent Activities</h3>
            {recentActivities.length > 0 ? (
              <>
                <div style={styles.activitiesList}>
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      style={styles.activityItem}
                      onClick={() => navigate('/hod/events')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={styles.activityIcon}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div style={styles.activityContent}>
                        <div style={styles.activityTitle}>{activity.title}</div>
                        <div style={styles.activityDesc}>{activity.description}</div>
                        <div style={styles.activityTime}>
                          <FiClock size={12} />
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  style={styles.viewAllBtn}
                  onClick={() => navigate('/hod/events')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4338CA';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4F46E5';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  View All Activities
                </button>
              </>
            ) : (
              <div style={styles.emptyState}>
                <FiActivity size={48} color="#D1D5DB" />
                <p style={styles.emptyStateText}>No recent activities</p>
                <p style={styles.emptyStateSubtext}>Events and updates will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  mainContent: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  pageHeader: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1F2937',
    margin: 0
  },
  pageSubtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: '8px 0 0 0'
  },
  dateTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6B7280',
    padding: '10px 16px',
    backgroundColor: '#F3F4F6',
    borderRadius: '8px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  quickStatsSection: {
    marginBottom: '24px'
  },
  twoColumnLayout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px'
  },
  modulesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  activitiesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default'
  },
  statIconContainer: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  statContent: {
    flex: 1
  },
  statLabel: {
    fontSize: '14px',
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: '8px'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 1
  },
  statSubtext: {
    fontSize: '13px',
    color: '#9CA3AF',
    marginTop: '6px'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#E5E7EB',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '8px'
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.5s ease'
  },
  quickStatsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  quickStatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer'
  },
  quickStatNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937'
  },
  quickStatLabel: {
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '2px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid #E5E7EB'
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px'
  },
  moduleCard: {
    padding: '16px',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  moduleIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  moduleContent: {
    flex: 1
  },
  moduleName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '2px'
  },
  moduleDesc: {
    fontSize: '12px',
    color: '#6B7280'
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px'
  },
  activityItem: {
    padding: '12px',
    borderRadius: '8px',
    display: 'flex',
    gap: '12px',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  activityIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  activityContent: {
    flex: 1
  },
  activityTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '4px'
  },
  activityDesc: {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '6px'
  },
  activityTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#9CA3AF'
  },
  viewAllBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center'
  },
  emptyStateText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#6B7280',
    margin: '16px 0 8px 0'
  },
  emptyStateSubtext: {
    fontSize: '14px',
    color: '#9CA3AF',
    margin: 0
  }
};

export default HODDashboard;
