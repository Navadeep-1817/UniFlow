import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiBookOpen,
  FiHome,
  FiFilter,
  FiCheck,
  FiTrash2,
  FiClock,
  FiMessageSquare,
  FiFile,
  FiUsers
} from 'react-icons/fi';

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Mock notifications data
    const mockNotifications = [
      {
        id: 1,
        type: 'approval',
        category: 'leave',
        title: 'Leave Request Approved',
        message: 'Your leave request for Nov 20, 2024 has been approved by HOD.',
        timestamp: '2024-11-18 10:30 AM',
        read: false,
        priority: 'high',
        actionable: false
      },
      {
        id: 2,
        type: 'event',
        category: 'schedule',
        title: 'Session Rescheduled',
        message: 'AI & ML Workshop - Session 3 has been rescheduled to Nov 22, 2024 at 2:00 PM.',
        timestamp: '2024-11-17 03:45 PM',
        read: false,
        priority: 'high',
        actionable: true,
        action: 'View Event'
      },
      {
        id: 3,
        type: 'info',
        category: 'material',
        title: 'Materials Uploaded',
        message: 'New study materials have been added to Web Development SDP - Session 4.',
        timestamp: '2024-11-17 11:20 AM',
        read: true,
        priority: 'medium',
        actionable: false
      },
      {
        id: 4,
        type: 'alert',
        category: 'attendance',
        title: 'Low Attendance Alert',
        message: 'Attendance for CRT Training - Session 5 is below 75%. Current: 68%',
        timestamp: '2024-11-16 04:00 PM',
        read: false,
        priority: 'high',
        actionable: true,
        action: 'View Details'
      },
      {
        id: 5,
        type: 'approval',
        category: 'leave',
        title: 'Substitution Request Pending',
        message: 'Your substitution request for Nov 25, 2024 is pending HOD approval.',
        timestamp: '2024-11-16 09:15 AM',
        read: true,
        priority: 'medium',
        actionable: false
      },
      {
        id: 6,
        type: 'info',
        category: 'feedback',
        title: 'New Feedback Received',
        message: '5 students have submitted feedback for AI & ML Workshop.',
        timestamp: '2024-11-15 05:30 PM',
        read: true,
        priority: 'low',
        actionable: true,
        action: 'View Feedback'
      },
      {
        id: 7,
        type: 'event',
        category: 'assignment',
        title: 'Event Assignment',
        message: 'You have been assigned as faculty coordinator for Data Science Workshop (Dec 1-3).',
        timestamp: '2024-11-15 10:00 AM',
        read: false,
        priority: 'high',
        actionable: true,
        action: 'View Event'
      },
      {
        id: 8,
        type: 'alert',
        category: 'deadline',
        title: 'Report Submission Reminder',
        message: 'Event report for AI & ML Workshop is due on Nov 20, 2024.',
        timestamp: '2024-11-14 02:00 PM',
        read: true,
        priority: 'medium',
        actionable: true,
        action: 'Submit Report'
      }
    ];

    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
  }, []);

  useEffect(() => {
    let filtered = notifications;

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }

    // Status filter
    if (filterStatus === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filterStatus === 'read') {
      filtered = filtered.filter(n => n.read);
    }

    setFilteredNotifications(filtered);
  }, [filterType, filterStatus, notifications]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
    showToast('Marked as read', 'success');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const handleDelete = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    showToast('Notification deleted', 'success');
  };

  const getNotificationIcon = (type) => {
    const icons = {
      approval: <FiCheckCircle size={20} color="#10B981" />,
      event: <FiCalendar size={20} color="#4F46E5" />,
      info: <FiInfo size={20} color="#3B82F6" />,
      alert: <FiAlertCircle size={20} color="#F59E0B" />
    };
    return icons[type] || <FiBell size={20} color="#6B7280" />;
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      high: { bg: '#FEE2E2', color: '#991B1B', border: '#EF4444' },
      medium: { bg: '#FEF3C7', color: '#92400E', border: '#F59E0B' },
      low: { bg: '#DBEAFE', color: '#1E40AF', border: '#3B82F6' }
    };
    return styles[priority] || styles.low;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={styles.container}>
      {/* Toast */}
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
          <button onClick={() => navigate('/faculty/dashboard')} style={styles.navBtn}>
            <FiHome size={16} /> Dashboard
          </button>
          <button 
            onClick={() => navigate('/faculty/notifications')} 
            style={{...styles.navBtn, backgroundColor: '#4F46E5', color: '#FFFFFF', border: 'none'}}
          >
            <FiBell size={16} /> Notifications
            {unreadCount > 0 && (
              <span style={styles.badge}>{unreadCount}</span>
            )}
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Notification Center</h1>
            <p style={styles.pageSubtitle}>Stay updated with real-time alerts and updates</p>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              style={styles.markAllBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4338CA';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4F46E5';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FiCheck size={16} /> Mark All as Read
            </button>
          )}
        </div>

        {/* Stats & Filters */}
        <div style={styles.statsSection}>
          <div style={styles.statCard}>
            <FiBell size={24} color="#4F46E5" />
            <div>
              <div style={styles.statNumber}>{notifications.length}</div>
              <div style={styles.statLabel}>Total</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <FiAlertCircle size={24} color="#F59E0B" />
            <div>
              <div style={styles.statNumber}>{unreadCount}</div>
              <div style={styles.statLabel}>Unread</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <FiCheckCircle size={24} color="#10B981" />
            <div>
              <div style={styles.statNumber}>{notifications.length - unreadCount}</div>
              <div style={styles.statLabel}>Read</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersBar}>
          <div style={styles.filterGroup}>
            <FiFilter size={16} color="#6B7280" />
            <span style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>Type:</span>
            <div style={styles.filterButtons}>
              {['all', 'approval', 'event', 'info', 'alert'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    ...styles.filterBtn,
                    backgroundColor: filterType === type ? '#4F46E5' : '#FFFFFF',
                    color: filterType === type ? '#FFFFFF' : '#6B7280',
                    border: filterType === type ? 'none' : '1px solid #E5E7EB'
                  }}
                  onMouseEnter={(e) => {
                    if (filterType !== type) {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filterType !== type) {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.filterGroup}>
            <span style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>Status:</span>
            <div style={styles.filterButtons}>
              {['all', 'unread', 'read'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    ...styles.filterBtn,
                    backgroundColor: filterStatus === status ? '#4F46E5' : '#FFFFFF',
                    color: filterStatus === status ? '#FFFFFF' : '#6B7280',
                    border: filterStatus === status ? 'none' : '1px solid #E5E7EB'
                  }}
                  onMouseEnter={(e) => {
                    if (filterStatus !== status) {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filterStatus !== status) {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div style={styles.notificationsSection}>
          <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px'}}>Notifications ({filteredNotifications.length})</h3>
          {filteredNotifications.length === 0 ? (
            <div style={styles.emptyState}>
              <FiBell size={48} color="#9CA3AF" />
              <p style={{margin: '16px 0 0 0', fontSize: '16px', color: '#6B7280'}}>No notifications found</p>
              <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#9CA3AF'}}>All caught up!</p>
            </div>
          ) : (
            <div style={styles.notificationsList}>
              {filteredNotifications.map(notification => {
                const priorityStyle = getPriorityStyle(notification.priority);
                return (
                  <div
                    key={notification.id}
                    style={{
                      ...styles.notificationCard,
                      backgroundColor: notification.read ? '#FFFFFF' : '#F0F9FF',
                      borderLeft: `4px solid ${priorityStyle.border}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={styles.notificationHeader}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div style={styles.iconContainer}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <h4 style={styles.notificationTitle}>{notification.title}</h4>
                          <div style={styles.notificationMeta}>
                            <FiClock size={14} color="#6B7280" />
                            <span>{notification.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{...styles.priorityBadge, backgroundColor: priorityStyle.bg, color: priorityStyle.color}}>
                        {notification.priority.toUpperCase()}
                      </div>
                    </div>
                    <p style={styles.notificationMessage}>{notification.message}</p>
                    <div style={styles.notificationActions}>
                      <div style={{display: 'flex', gap: '8px'}}>
                        {notification.actionable && (
                          <button
                            style={styles.actionBtn}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#E0E7FF';
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#EEF2FF';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            {notification.action}
                          </button>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            style={styles.readBtn}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#D1FAE5';
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#ECFDF5';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <FiCheck size={14} /> Mark Read
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        style={styles.deleteBtn}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FCA5A5';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
    gap: '12px',
    alignItems: 'center'
  },
  navBtn: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center'
  },
  logoutBtn: {
    padding: '10px 16px',
    backgroundColor: '#FEE2E2',
    border: 'none',
    borderRadius: '8px',
    color: '#DC2626',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  mainContent: {
    padding: '24px',
    maxWidth: '1200px',
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
  markAllBtn: {
    padding: '12px 24px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '10px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)'
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6B7280',
    marginTop: '4px'
  },
  filtersBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  notificationsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    animation: 'slideInRight 0.3s ease-out'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  notificationCard: {
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px',
    gap: '16px'
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  notificationTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937'
  },
  notificationMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '4px'
  },
  priorityBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    flexShrink: 0
  },
  notificationMessage: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.6'
  },
  notificationActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #F3F4F6'
  },
  actionBtn: {
    padding: '8px 16px',
    backgroundColor: '#EEF2FF',
    border: 'none',
    borderRadius: '8px',
    color: '#4F46E5',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  readBtn: {
    padding: '8px 16px',
    backgroundColor: '#ECFDF5',
    border: 'none',
    borderRadius: '8px',
    color: '#065F46',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  deleteBtn: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#DC2626',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

export default NotificationCenter;
