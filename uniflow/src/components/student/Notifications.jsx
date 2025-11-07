import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCalendar, FiBriefcase, FiCheckCircle, FiAlertCircle, FiInfo, FiTrash2, FiCheck, FiFilter, FiMail, FiAward, FiUsers, FiX, FiArrowLeft } from 'react-icons/fi';
import { colors, commonStyles, hoverEffects } from '../../styles/globalStyles';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Mock notifications data
    setNotifications([
      { id: 1, type: 'placement', category: 'placement', title: 'TCS Placement Drive Tomorrow', 
        message: 'TCS campus drive scheduled for tomorrow at 9:00 AM in Auditorium. Please be on time with your resume.',
        time: '2 hours ago', read: false, priority: 'high' },
      { id: 2, type: 'event', category: 'event', title: 'Tech Fest Registration Approved', 
        message: 'Your registration for Annual Tech Fest 2024 has been approved. Event starts on Nov 15, 2024.',
        time: '5 hours ago', read: false, priority: 'medium' },
      { id: 3, type: 'placement', category: 'placement', title: 'Interview Scheduled - Amazon', 
        message: 'Your technical interview with Amazon is scheduled for Nov 8, 2024 at 2:00 PM. Check your email for details.',
        time: '1 day ago', read: false, priority: 'high' },
      { id: 4, type: 'reminder', category: 'event', title: 'Workshop Reminder: AI & ML', 
        message: 'Workshop on AI & Machine Learning starts in 2 days. Venue: Lab 301. Duration: 3 hours.',
        time: '1 day ago', read: true, priority: 'medium' },
      { id: 5, type: 'approval', category: 'approval', title: 'Leave Application Approved', 
        message: 'Your leave application for Nov 12-14 has been approved by the HOD.',
        time: '2 days ago', read: true, priority: 'low' },
      { id: 6, type: 'placement', category: 'placement', title: 'Offer Letter Received - Infosys', 
        message: 'Congratulations! You have received an offer letter from Infosys. Package: ₹6.5 LPA. Please check your email.',
        time: '3 days ago', read: false, priority: 'high' },
      { id: 7, type: 'event', category: 'event', title: 'Hackathon Team Formation', 
        message: 'Your team "Code Warriors" has been successfully formed for the upcoming hackathon.',
        time: '3 days ago', read: true, priority: 'low' },
      { id: 8, type: 'system', category: 'system', title: 'Profile Update Required', 
        message: 'Please update your profile with your latest contact details and project information.',
        time: '5 days ago', read: true, priority: 'medium' },
      { id: 9, type: 'event', category: 'event', title: 'Certificate Available', 
        message: 'Your participation certificate for Python Workshop is now available for download.',
        time: '1 week ago', read: true, priority: 'low' }
    ]);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    showToast('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    showToast('Notification deleted');
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all read notifications?')) {
      setNotifications(notifications.filter(n => !n.read));
      showToast('Read notifications cleared');
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.category === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'placement': return <FiBriefcase size={20} />;
      case 'event': return <FiCalendar size={20} />;
      case 'reminder': return <FiBell size={20} />;
      case 'approval': return <FiCheckCircle size={20} />;
      case 'system': return <FiInfo size={20} />;
      default: return <FiBell size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'placement': return { bg: colors.primaryLight, color: colors.primary };
      case 'event': return { bg: colors.successLight, color: colors.success };
      case 'reminder': return { bg: colors.warningLight, color: colors.warning };
      case 'approval': return { bg: colors.infoLight, color: colors.info };
      case 'system': return { bg: colors.gray200, color: colors.gray600 };
      default: return { bg: colors.gray100, color: colors.gray500 };
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: { bg: colors.errorLight, color: colors.error, text: 'High Priority' },
      medium: { bg: colors.warningLight, color: colors.warning, text: 'Medium' },
      low: { bg: colors.gray200, color: colors.gray600, text: 'Low' }
    };
    return styles[priority] || styles.low;
  };

  const stats = {
    total: notifications.length,
    unread: unreadCount,
    placement: notifications.filter(n => n.category === 'placement').length,
    events: notifications.filter(n => n.category === 'event').length
  };

  return (
    <div style={commonStyles.container}>
      {toast.show && (
        <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>
          {toast.message}
        </div>
      )}

      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/student/dashboard')} style={{ ...commonStyles.secondaryBtn, padding: '10px 12px' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray200; e.currentTarget.style.transform = 'translateX(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'translateX(0)'; }}>
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h1 style={commonStyles.pageTitle}>Notifications</h1>
              <p style={commonStyles.pageSubtitle}>Stay updated with all your alerts and reminders</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleClearAll} style={commonStyles.secondaryBtn}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray200; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'scale(1)'; }}>
              <FiTrash2 size={16} /> Clear Read
            </button>
            <button onClick={handleMarkAllAsRead} style={commonStyles.primaryBtn} 
              onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
              <FiCheck size={16} /> Mark All Read
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <FiBell size={24} />, value: stats.total, label: 'Total Notifications', bg: colors.primaryLight, color: colors.primary },
            { icon: <FiMail size={24} />, value: stats.unread, label: 'Unread', bg: colors.errorLight, color: colors.error },
            { icon: <FiBriefcase size={24} />, value: stats.placement, label: 'Placement Updates', bg: colors.warningLight, color: colors.warning },
            { icon: <FiCalendar size={24} />, value: stats.events, label: 'Event Notifications', bg: colors.successLight, color: colors.success }
          ].map((stat, i) => (
            <div key={i} style={commonStyles.statCard} onMouseEnter={hoverEffects.statCardHover} onMouseLeave={hoverEffects.statCardLeave}>
              <div style={{...commonStyles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div>
              <div style={commonStyles.statContent}>
                <div style={commonStyles.statValue}>{stat.value}</div>
                <div style={commonStyles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={commonStyles.card}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', paddingBottom: '20px', borderBottom: `1px solid ${colors.gray200}` }}>
            {[
              { value: 'all', label: 'All', icon: <FiBell size={16} /> },
              { value: 'unread', label: 'Unread', icon: <FiMail size={16} /> },
              { value: 'placement', label: 'Placement', icon: <FiBriefcase size={16} /> },
              { value: 'event', label: 'Events', icon: <FiCalendar size={16} /> },
              { value: 'approval', label: 'Approvals', icon: <FiCheckCircle size={16} /> },
              { value: 'system', label: 'System', icon: <FiInfo size={16} /> }
            ].map((filterOption) => (
              <button key={filterOption.value} onClick={() => setFilter(filterOption.value)}
                style={{ padding: '10px 16px', backgroundColor: filter === filterOption.value ? colors.primary : colors.gray100,
                  color: filter === filterOption.value ? colors.white : colors.gray700, border: 'none', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onMouseEnter={(e) => { if (filter !== filterOption.value) { e.currentTarget.style.backgroundColor = colors.gray200; e.currentTarget.style.transform = 'translateY(-2px)'; }}}
                onMouseLeave={(e) => { if (filter !== filterOption.value) { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'translateY(0)'; }}}>
                {filterOption.icon} {filterOption.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <FiBell size={48} color={colors.gray400} />
                <p style={{ color: colors.gray500, marginTop: '16px', fontSize: '16px' }}>No notifications found</p>
              </div>
            ) : filteredNotifications.map((notification) => {
              const iconConfig = getNotificationColor(notification.type);
              const priorityConfig = getPriorityBadge(notification.priority);
              
              return (
                <div key={notification.id} 
                  style={{ padding: '20px', backgroundColor: notification.read ? colors.white : colors.primaryLight + '15',
                    border: `1px solid ${notification.read ? colors.gray200 : colors.primary + '40'}`, borderRadius: '10px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
                    borderLeft: `4px solid ${notification.read ? colors.gray300 : colors.primary}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${colors.gray300}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                    <div style={{ padding: '12px', backgroundColor: iconConfig.bg, borderRadius: '10px', flexShrink: 0 }}>
                      {React.cloneElement(getNotificationIcon(notification.type), { color: iconConfig.color })}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.gray800, margin: 0 }}>
                          {notification.title}
                          {!notification.read && (
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: colors.error,
                              borderRadius: '50%', marginLeft: '8px' }} />
                          )}
                        </h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {notification.priority === 'high' && (
                            <span style={{ ...commonStyles.badge, backgroundColor: priorityConfig.bg, color: priorityConfig.color, fontSize: '11px' }}>
                              {priorityConfig.text}
                            </span>
                          )}
                          <span style={{ fontSize: '12px', color: colors.gray500, whiteSpace: 'nowrap' }}>{notification.time}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: '14px', color: colors.gray600, margin: '0 0 12px 0', lineHeight: '1.5' }}>
                        {notification.message}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: `1px solid ${colors.gray200}` }}>
                        <span style={{ ...commonStyles.badge, backgroundColor: iconConfig.bg, color: iconConfig.color, textTransform: 'capitalize' }}>
                          {notification.type}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!notification.read && (
                            <button onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                              style={{ padding: '6px 12px', backgroundColor: colors.successLight, border: 'none', borderRadius: '6px',
                                color: colors.success, cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px',
                                transition: 'all 0.2s ease' }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.success; e.currentTarget.style.color = colors.white; e.currentTarget.style.transform = 'scale(1.05)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.successLight; e.currentTarget.style.color = colors.success; e.currentTarget.style.transform = 'scale(1)'; }}>
                              <FiCheck size={14} /> Mark Read
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                            style={{ padding: '6px 12px', backgroundColor: colors.errorLight, border: 'none', borderRadius: '6px',
                              color: colors.error, cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px',
                              transition: 'all 0.2s ease' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.error; e.currentTarget.style.color = colors.white; e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.errorLight; e.currentTarget.style.color = colors.error; e.currentTarget.style.transform = 'scale(1)'; }}>
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
