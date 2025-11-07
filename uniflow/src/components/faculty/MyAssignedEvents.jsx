import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiCheckCircle,
  FiAlertCircle,
  FiEdit,
  FiEye,
  FiFilter,
  FiX,
  FiBookOpen,
  FiHome,
  FiLayers,
  FiClipboard,
  FiUploadCloud,
  FiTrendingUp,
  FiMessageSquare,
  FiFileText,
  FiSend,
  FiBell
} from 'react-icons/fi';

const MyAssignedEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Mock data - Replace with API call
    const mockEvents = [
      {
        id: 1,
        name: 'Faculty Development Program - AI & ML',
        type: 'FDP',
        category: 'Technical',
        startDate: '2024-11-15',
        endDate: '2024-11-17',
        venue: 'Conference Hall A',
        assignedBy: 'Dr. Ramesh Kumar (HOD)',
        role: 'Resource Person',
        status: 'upcoming',
        totalSessions: 6,
        completedSessions: 0,
        participants: 45,
        description: 'A comprehensive program on Artificial Intelligence and Machine Learning fundamentals.',
        sessions: [
          { id: 1, title: 'Introduction to AI', date: '2024-11-15', time: '10:00 AM - 12:00 PM', status: 'pending' },
          { id: 2, title: 'ML Algorithms', date: '2024-11-15', time: '02:00 PM - 04:00 PM', status: 'pending' },
          { id: 3, title: 'Deep Learning Basics', date: '2024-11-16', time: '10:00 AM - 12:00 PM', status: 'pending' },
          { id: 4, title: 'Neural Networks', date: '2024-11-16', time: '02:00 PM - 04:00 PM', status: 'pending' },
          { id: 5, title: 'Practical Applications', date: '2024-11-17', time: '10:00 AM - 12:00 PM', status: 'pending' },
          { id: 6, title: 'Project Presentations', date: '2024-11-17', time: '02:00 PM - 04:00 PM', status: 'pending' }
        ]
      },
      {
        id: 2,
        name: 'Skill Development Program - Web Technologies',
        type: 'SDP',
        category: 'Technical',
        startDate: '2024-11-20',
        endDate: '2024-11-22',
        venue: 'Lab 301',
        assignedBy: 'Dr. Priya Singh (HOD)',
        role: 'Coordinator',
        status: 'upcoming',
        totalSessions: 4,
        completedSessions: 0,
        participants: 30,
        description: 'Hands-on skill development in modern web technologies.',
        sessions: [
          { id: 1, title: 'HTML5 & CSS3', date: '2024-11-20', time: '10:00 AM - 01:00 PM', status: 'pending' },
          { id: 2, title: 'JavaScript ES6+', date: '2024-11-21', time: '10:00 AM - 01:00 PM', status: 'pending' },
          { id: 3, title: 'React Framework', date: '2024-11-22', time: '10:00 AM - 01:00 PM', status: 'pending' },
          { id: 4, title: 'Final Project', date: '2024-11-22', time: '02:00 PM - 05:00 PM', status: 'pending' }
        ]
      },
      {
        id: 3,
        name: 'Campus Recruitment Training - Aptitude',
        type: 'CRT',
        category: 'Placement',
        startDate: '2024-11-10',
        endDate: '2024-11-12',
        venue: 'Auditorium',
        assignedBy: 'Mr. Anil Verma (Placement Head)',
        role: 'Trainer',
        status: 'ongoing',
        totalSessions: 3,
        completedSessions: 2,
        participants: 120,
        description: 'Training students for campus recruitment aptitude tests.',
        sessions: [
          { id: 1, title: 'Quantitative Aptitude', date: '2024-11-10', time: '09:00 AM - 12:00 PM', status: 'completed' },
          { id: 2, title: 'Logical Reasoning', date: '2024-11-11', time: '09:00 AM - 12:00 PM', status: 'completed' },
          { id: 3, title: 'Verbal Ability', date: '2024-11-12', time: '09:00 AM - 12:00 PM', status: 'pending' }
        ]
      }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  const applyFilters = () => {
    let filtered = events;

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filterType, filterStatus, events]);

  const handleSessionStatusUpdate = (sessionId, newStatus) => {
    const updatedEvents = events.map(event => {
      if (event.id === selectedEvent.id) {
        const updatedSessions = event.sessions.map(session => 
          session.id === sessionId ? { ...session, status: newStatus } : session
        );
        const completedCount = updatedSessions.filter(s => s.status === 'completed').length;
        return { ...event, sessions: updatedSessions, completedSessions: completedCount };
      }
      return event;
    });
    setEvents(updatedEvents);
    setSelectedEvent(updatedEvents.find(e => e.id === selectedEvent.id));
    showToast('Session status updated successfully!', 'success');
  };

  const handleMarkAttendance = () => {
    showToast('Attendance marked successfully!', 'success');
    setShowAttendanceModal(false);
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
          <button onClick={() => navigate('/faculty/dashboard')} style={styles.navBtn}><FiHome size={16} /> Dashboard</button>
          <button onClick={() => navigate('/faculty/my-events')} style={{...styles.navBtn, backgroundColor: '#4F46E5', color: '#FFFFFF', border: 'none'}}><FiCalendar size={16} /> My Events</button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>My Assigned Events</h1>
            <p style={styles.pageSubtitle}>Manage your FDP, SDP, and CRT sessions</p>
          </div>
        </div>

        {/* Filters Section */}
        <div style={styles.filtersSection}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
            <FiFilter size={20} color="#4F46E5" />
            <h3 style={{margin: 0, fontSize: '18px', fontWeight: '600', color: '#1F2937'}}>Filters</h3>
          </div>
          <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
            <div style={{flex: '1', minWidth: '200px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Event Type</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                style={styles.select}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
              >
                <option value="all">All Types</option>
                <option value="FDP">FDP (Faculty Development)</option>
                <option value="SDP">SDP (Skill Development)</option>
                <option value="CRT">CRT (Campus Recruitment)</option>
              </select>
            </div>
            <div style={{flex: '1', minWidth: '200px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                style={styles.select}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: '8px'}}>
              <button 
                onClick={() => { setFilterType('all'); setFilterStatus('all'); }}
                style={styles.resetBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = '#9CA3AF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
              >
                <FiX size={16} /> Reset
              </button>
            </div>
          </div>
          <div style={{marginTop: '16px', padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '8px', fontSize: '14px', color: '#6B7280'}}>
            Showing <strong style={{color: '#1F2937'}}>{filteredEvents.length}</strong> of <strong style={{color: '#1F2937'}}>{events.length}</strong> events
          </div>
        </div>

        {/* Events Grid */}
        <div style={styles.eventsGrid}>
          {filteredEvents.length === 0 ? (
            <div style={styles.emptyState}>
              <FiCalendar size={48} color="#9CA3AF" />
              <h3 style={{color: '#6B7280', fontSize: '18px', marginTop: '16px'}}>No events found</h3>
              <p style={{color: '#9CA3AF', fontSize: '14px'}}>Try adjusting your filters</p>
            </div>
          ) : (
            filteredEvents.map(event => {
              const progress = (event.completedSessions / event.totalSessions) * 100;
              const statusColors = {
                upcoming: { bg: '#DBEAFE', color: '#1E40AF' },
                ongoing: { bg: '#FEF3C7', color: '#92400E' },
                completed: { bg: '#D1FAE5', color: '#065F46' }
              };
              const typeColors = {
                FDP: { bg: '#E0E7FF', color: '#3730A3' },
                SDP: { bg: '#FCE7F3', color: '#9F1239' },
                CRT: { bg: '#DBEAFE', color: '#1E40AF' }
              };

              return (
                <div 
                  key={event.id} 
                  style={styles.eventCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                    e.currentTarget.style.borderColor = '#E0E7FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px'}}>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                        <h3 style={{margin: 0, fontSize: '20px', fontWeight: '600', color: '#1F2937'}}>{event.name}</h3>
                      </div>
                      <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: typeColors[event.type].bg,
                          color: typeColors[event.type].color
                        }}>
                          {event.type}
                        </span>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: statusColors[event.status].bg,
                          color: statusColors[event.status].color
                        }}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                        <span style={{...styles.badge, backgroundColor: '#F3F4F6', color: '#6B7280'}}>
                          {event.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p style={{color: '#6B7280', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5'}}>
                    {event.description}
                  </p>

                  <div style={styles.eventDetails}>
                    <div style={styles.eventDetailItem}>
                      <FiCalendar size={16} color="#6B7280" />
                      <span>{event.startDate} to {event.endDate}</span>
                    </div>
                    <div style={styles.eventDetailItem}>
                      <FiMapPin size={16} color="#6B7280" />
                      <span>{event.venue}</span>
                    </div>
                    <div style={styles.eventDetailItem}>
                      <FiUsers size={16} color="#6B7280" />
                      <span>{event.participants} Participants</span>
                    </div>
                    <div style={styles.eventDetailItem}>
                      <FiLayers size={16} color="#6B7280" />
                      <span>{event.completedSessions}/{event.totalSessions} Sessions</span>
                    </div>
                  </div>

                  <div style={{marginTop: '16px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B7280', marginBottom: '8px'}}>
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={{
                        ...styles.progressFill,
                        width: `${progress}%`,
                        backgroundColor: event.status === 'completed' ? '#10B981' : event.status === 'ongoing' ? '#F59E0B' : '#4F46E5'
                      }}></div>
                    </div>
                  </div>

                  <div style={{display: 'flex', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E5E7EB'}}>
                    <button 
                      onClick={() => { setSelectedEvent(event); setShowDetailsModal(true); }}
                      style={styles.actionBtn}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E5E7EB';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F3F4F6';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FiEye size={16} /> View Details
                    </button>
                    <button 
                      onClick={() => { setSelectedEvent(event); setShowSessionModal(true); }}
                      style={{...styles.actionBtn, backgroundColor: '#EEF2FF', color: '#4F46E5'}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#C7D2FE';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#EEF2FF';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FiEdit size={16} /> Manage Sessions
                    </button>
                    <button 
                      onClick={() => { setSelectedEvent(event); setShowAttendanceModal(true); }}
                      style={{...styles.actionBtn, backgroundColor: '#D1FAE5', color: '#065F46'}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#A7F3D0';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#D1FAE5';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FiCheckCircle size={16} /> Mark Attendance
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedEvent && (
          <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600', color: '#1F2937'}}>Event Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)} 
                  style={styles.closeBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                    e.currentTarget.style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  <FiX size={24} />
                </button>
              </div>
              <div style={styles.modalBody}>
                <h3 style={{fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '16px'}}>{selectedEvent.name}</h3>
                <div style={{display: 'grid', gap: '16px'}}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Event Type:</span>
                    <span style={styles.detailValue}>{selectedEvent.type}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Category:</span>
                    <span style={styles.detailValue}>{selectedEvent.category}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Status:</span>
                    <span style={styles.detailValue}>{selectedEvent.status}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Your Role:</span>
                    <span style={styles.detailValue}>{selectedEvent.role}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Duration:</span>
                    <span style={styles.detailValue}>{selectedEvent.startDate} to {selectedEvent.endDate}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Venue:</span>
                    <span style={styles.detailValue}>{selectedEvent.venue}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Participants:</span>
                    <span style={styles.detailValue}>{selectedEvent.participants}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Assigned By:</span>
                    <span style={styles.detailValue}>{selectedEvent.assignedBy}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Description:</span>
                    <span style={styles.detailValue}>{selectedEvent.description}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session Management Modal */}
        {showSessionModal && selectedEvent && (
          <div style={styles.modalOverlay} onClick={() => setShowSessionModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600', color: '#1F2937'}}>Manage Sessions</h2>
                <button 
                  onClick={() => setShowSessionModal(false)} 
                  style={styles.closeBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                    e.currentTarget.style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  <FiX size={24} />
                </button>
              </div>
              <div style={styles.modalBody}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px'}}>{selectedEvent.name}</h3>
                <div style={{display: 'grid', gap: '12px'}}>
                  {selectedEvent.sessions.map((session, index) => {
                    const sessionStatusColors = {
                      pending: { bg: '#FEF3C7', color: '#92400E' },
                      completed: { bg: '#D1FAE5', color: '#065F46' },
                      cancelled: { bg: '#FEE2E2', color: '#991B1B' }
                    };
                    return (
                      <div key={session.id} style={styles.sessionItem}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px'}}>
                          <div>
                            <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1F2937'}}>Session {index + 1}: {session.title}</h4>
                            <div style={{display: 'flex', gap: '16px', marginTop: '8px', fontSize: '13px', color: '#6B7280'}}>
                              <span><FiCalendar size={14} style={{verticalAlign: 'middle', marginRight: '4px'}} />{session.date}</span>
                              <span><FiClock size={14} style={{verticalAlign: 'middle', marginRight: '4px'}} />{session.time}</span>
                            </div>
                          </div>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: sessionStatusColors[session.status].bg,
                            color: sessionStatusColors[session.status].color
                          }}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </div>
                        <div style={{display: 'flex', gap: '8px'}}>
                          {session.status !== 'completed' && (
                            <button 
                              onClick={() => handleSessionStatusUpdate(session.id, 'completed')}
                              style={{...styles.smallBtn, backgroundColor: '#D1FAE5', color: '#065F46'}}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#A7F3D0';
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(6, 95, 70, 0.2)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#D1FAE5';
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <FiCheckCircle size={14} /> Mark Complete
                            </button>
                          )}
                          {session.status === 'completed' && (
                            <button 
                              onClick={() => handleSessionStatusUpdate(session.id, 'pending')}
                              style={{...styles.smallBtn, backgroundColor: '#FEF3C7', color: '#92400E'}}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#FDE68A';
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(146, 64, 14, 0.2)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#FEF3C7';
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              Mark Pending
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Modal */}
        {showAttendanceModal && selectedEvent && (
          <div style={styles.modalOverlay} onClick={() => setShowAttendanceModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600', color: '#1F2937'}}>Mark Attendance</h2>
                <button 
                  onClick={() => setShowAttendanceModal(false)} 
                  style={styles.closeBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                    e.currentTarget.style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  <FiX size={24} />
                </button>
              </div>
              <div style={styles.modalBody}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '8px'}}>{selectedEvent.name}</h3>
                <p style={{color: '#6B7280', fontSize: '14px', marginBottom: '24px'}}>Select a session to mark attendance</p>
                <div style={{display: 'grid', gap: '12px', marginBottom: '24px'}}>
                  {selectedEvent.sessions.map((session, index) => (
                    <div key={session.id} style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: '2px solid #E5E7EB',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                    onClick={() => navigate('/faculty/attendance', { state: { event: selectedEvent, session } })}
                    >
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                          <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1F2937'}}>Session {index + 1}: {session.title}</h4>
                          <div style={{display: 'flex', gap: '16px', marginTop: '6px', fontSize: '13px', color: '#6B7280'}}>
                            <span><FiCalendar size={14} style={{verticalAlign: 'middle', marginRight: '4px'}} />{session.date}</span>
                            <span><FiClock size={14} style={{verticalAlign: 'middle', marginRight: '4px'}} />{session.time}</span>
                          </div>
                        </div>
                        <FiCheckCircle size={20} color="#4F46E5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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
    transition: 'all 0.2s'
  },
  logoutBtn: {
    padding: '10px 16px',
    backgroundColor: '#FEE2E2',
    border: 'none',
    borderRadius: '8px',
    color: '#DC2626',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
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
    alignItems: 'center'
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
  filtersSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  eventsGrid: {
    display: 'grid',
    gap: '20px'
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
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease'
  },
  resetBtn: {
    padding: '10px 16px',
    backgroundColor: '#F3F4F6',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
    border: '1px solid transparent'
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  eventDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px'
  },
  eventDetailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6B7280'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '4px'
  },
  actionBtn: {
    padding: '10px 16px',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '8px',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    flex: 1,
    justifyContent: 'center'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    animation: 'fadeIn 0.2s ease-out'
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 10
  },
  modalBody: {
    padding: '24px'
  },
  closeBtn: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#6B7280',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  detailRow: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px'
  },
  detailLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6B7280'
  },
  detailValue: {
    fontSize: '14px',
    color: '#1F2937',
    fontWeight: '500'
  },
  sessionItem: {
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    border: '1px solid #E5E7EB'
  },
  smallBtn: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    boxShadow: 'none'
  }
};

export default MyAssignedEvents;
