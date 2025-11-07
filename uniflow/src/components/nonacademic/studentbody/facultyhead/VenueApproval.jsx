import React, { useState, useEffect } from 'react';
import FacultyHeadTopNav from './FacultyHeadTopNav';
import { styles } from './VenueApprovalStyles';
import { FiMapPin, FiCalendar, FiClock, FiUsers, FiAlertTriangle, FiCheck, FiX, FiEye, FiSearch, FiFilter } from 'react-icons/fi';

const mockVenueRequests = [
  {
    id: 1, venueName: 'Main Auditorium', eventName: 'Tech Innovation Summit', requestedBy: 'Rahul Sharma', teamName: 'Tech Club',
    date: '2024-02-15', time: '10:00 AM - 4:00 PM', duration: 6, capacity: 500, expectedAttendees: 200,
    purpose: 'Annual technical summit with keynote speakers and panel discussions', priority: 'high',
    hasConflict: false, conflictDetails: null, submittedDate: '2024-01-20', status: 'pending'
  },
  {
    id: 2, venueName: 'Open Air Theatre', eventName: 'Cultural Fest - Rang Manch', requestedBy: 'Priya Patel', teamName: 'Cultural Committee',
    date: '2024-03-10', time: '6:00 PM - 10:00 PM', duration: 4, capacity: 800, expectedAttendees: 500,
    purpose: 'Annual cultural festival with dance, music, and drama performances', priority: 'high',
    hasConflict: true, conflictDetails: 'Sports practice scheduled 5:00 PM - 6:30 PM', submittedDate: '2024-01-18', status: 'pending'
  },
  {
    id: 3, venueName: 'Seminar Hall B', eventName: 'Entrepreneurship Workshop', requestedBy: 'Sneha Reddy', teamName: 'E-Cell',
    date: '2024-02-20', time: '2:00 PM - 5:00 PM', duration: 3, capacity: 150, expectedAttendees: 100,
    purpose: 'Workshop on startup fundamentals and business planning', priority: 'medium',
    hasConflict: false, conflictDetails: null, submittedDate: '2024-01-25', status: 'pending'
  },
  {
    id: 4, venueName: 'Sports Complex', eventName: 'Inter-Department Tournament', requestedBy: 'Amit Kumar', teamName: 'Sports Council',
    date: '2024-02-25', time: '8:00 AM - 5:00 PM', duration: 9, capacity: 1000, expectedAttendees: 300,
    purpose: 'Annual sports championship with multiple events', priority: 'medium',
    hasConflict: false, conflictDetails: null, submittedDate: '2024-01-22', status: 'pending'
  },
  {
    id: 5, venueName: 'Conference Room A', eventName: 'Team Strategy Meeting', requestedBy: 'Vikram Singh', teamName: 'NSS Unit',
    date: '2024-02-18', time: '3:00 PM - 5:00 PM', duration: 2, capacity: 50, expectedAttendees: 25,
    purpose: 'Planning meeting for upcoming community service events', priority: 'low',
    hasConflict: true, conflictDetails: 'Faculty meeting scheduled 4:00 PM - 5:30 PM', submittedDate: '2024-01-23', status: 'pending'
  }
];

const VenueApproval = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVenue, setFilterVenue] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setTimeout(() => { setRequests(mockVenueRequests); setIsLoading(false); }, 800);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApproval = (request, action) => {
    const updatedRequests = requests.filter(r => r.id !== request.id);
    setRequests(updatedRequests);
    setShowFeedbackModal(false);
    setFeedback('');
    
    const actionText = action === 'approve' ? 'approved' : 'rejected';
    showNotification(`✓ Venue request for ${request.venueName} has been ${actionText}!`, 'success');
  };

  const openFeedbackModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowFeedbackModal(true);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return { bg: '#FEE2E2', text: '#991B1B' };
      case 'medium': return { bg: '#FEF3C7', text: '#92400E' };
      case 'low': return { bg: '#D1FAE5', text: '#065F46' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const getVenueGradient = (venueName) => {
    if (venueName.includes('Auditorium')) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (venueName.includes('Theatre')) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    if (venueName.includes('Sports')) return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    if (venueName.includes('Seminar') || venueName.includes('Conference')) return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const filteredRequests = requests.filter(request => {
    const venueMatch = filterVenue === 'All' || request.venueName === filterVenue;
    const priorityMatch = filterPriority === 'All' || request.priority === filterPriority;
    const searchMatch = request.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       request.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       request.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return venueMatch && priorityMatch && searchMatch;
  });

  const stats = {
    totalPending: requests.length,
    withConflicts: requests.filter(r => r.hasConflict).length,
    highPriority: requests.filter(r => r.priority === 'high').length,
    noConflicts: requests.filter(r => !r.hasConflict).length
  };

  if (isLoading) {
    return (
      <>
        <FacultyHeadTopNav />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading venue requests...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <FacultyHeadTopNav />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Venue Approval Requests</h2>
            <p style={styles.subtitle}>{filteredRequests.length} pending requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          {[
            { icon: <FiMapPin size={24} />, label: 'Total Pending', value: stats.totalPending, color: '#4F46E5' },
            { icon: <FiAlertTriangle size={24} />, label: 'With Conflicts', value: stats.withConflicts, color: '#F59E0B' },
            { icon: <FiCheck size={24} />, label: 'No Conflicts', value: stats.noConflicts, color: '#10B981' },
            { icon: <FiClock size={24} />, label: 'High Priority', value: stats.highPriority, color: '#DC2626' }
          ].map((stat, index) => (
            <div key={index} style={{ ...styles.statCard, ...(hoveredStat === index ? styles.statCardHover : {}) }} onMouseEnter={() => setHoveredStat(index)} onMouseLeave={() => setHoveredStat(null)}>
              <div style={{ ...styles.statIcon, backgroundColor: stat.color + '20', color: stat.color }}>{stat.icon}</div>
              <div>
                <p style={styles.statLabel}>{stat.label}</p>
                <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.filtersContainer}>
          <div style={styles.searchWrapper}>
            <FiSearch size={16} style={styles.searchIcon} />
            <input type="text" placeholder="Search venues, events, or requesters..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.filterGroup}>
            <FiFilter size={16} style={{ color: '#6B7280' }} />
            <label style={styles.filterLabel}>Venue:</label>
            <select value={filterVenue} onChange={(e) => setFilterVenue(e.target.value)} style={styles.select}>
              <option value="All">All Venues</option>
              <option value="Main Auditorium">Main Auditorium</option>
              <option value="Open Air Theatre">Open Air Theatre</option>
              <option value="Seminar Hall B">Seminar Hall B</option>
              <option value="Sports Complex">Sports Complex</option>
              <option value="Conference Room A">Conference Room A</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Priority:</label>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={styles.select}>
              <option value="All">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}><FiMapPin size={64} /></div>
            <h3 style={styles.emptyTitle}>No Venue Requests Found</h3>
            <p style={styles.emptyText}>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div style={styles.requestsGrid}>
            {filteredRequests.map((request) => {
              const priorityColors = getPriorityColor(request.priority);
              const capacityPercent = (request.expectedAttendees / request.capacity) * 100;
              return (
                <div key={request.id} style={{ ...styles.requestCard, ...(hoveredCard === request.id ? styles.requestCardHover : {}) }} onMouseEnter={() => setHoveredCard(request.id)} onMouseLeave={() => setHoveredCard(null)}>
                  <div style={{ ...styles.requestHeader, background: getVenueGradient(request.venueName) }}>
                    <div style={{ ...styles.priorityBadge, backgroundColor: priorityColors.bg, color: priorityColors.text }}>
                      {request.priority.toUpperCase()}
                    </div>
                    <h3 style={styles.venueName}>{request.venueName}</h3>
                    <p style={styles.eventName}><FiCalendar size={14} /> {request.eventName}</p>
                  </div>

                  <div style={styles.requestBody}>
                    <div style={styles.infoGrid}>
                      <div style={styles.infoItem}>
                        <FiUsers size={16} style={{ ...styles.infoIcon, color: '#6B7280' }} />
                        <div style={styles.infoContent}>
                          <p style={styles.infoLabel}>Requested By</p>
                          <p style={styles.infoValue}>{request.requestedBy}</p>
                        </div>
                      </div>
                      <div style={styles.infoItem}>
                        <FiCalendar size={16} style={{ ...styles.infoIcon, color: '#6B7280' }} />
                        <div style={styles.infoContent}>
                          <p style={styles.infoLabel}>Date</p>
                          <p style={styles.infoValue}>{new Date(request.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div style={styles.infoItem}>
                        <FiClock size={16} style={{ ...styles.infoIcon, color: '#6B7280' }} />
                        <div style={styles.infoContent}>
                          <p style={styles.infoLabel}>Time</p>
                          <p style={styles.infoValue}>{request.time}</p>
                        </div>
                      </div>
                      <div style={styles.infoItem}>
                        <FiUsers size={16} style={{ ...styles.infoIcon, color: '#6B7280' }} />
                        <div style={styles.infoContent}>
                          <p style={styles.infoLabel}>Attendees</p>
                          <p style={styles.infoValue}>{request.expectedAttendees}/{request.capacity}</p>
                        </div>
                      </div>
                    </div>

                    {request.hasConflict && (
                      <div style={styles.conflictWarning}>
                        <FiAlertTriangle size={20} color="#F59E0B" />
                        <div>
                          <p style={styles.conflictText}>Scheduling Conflict</p>
                          <p style={{ fontSize: '12px', color: '#92400E', marginTop: '4px' }}>{request.conflictDetails}</p>
                        </div>
                      </div>
                    )}

                    <div style={styles.capacitySection}>
                      <div style={styles.capacityLabel}>
                        <span>Capacity Utilization</span>
                        <span style={{ fontWeight: '600' }}>{capacityPercent.toFixed(0)}%</span>
                      </div>
                      <div style={styles.progressBar}>
                        <div style={{ ...styles.progressFill, width: `${capacityPercent}%`, backgroundColor: capacityPercent > 80 ? '#DC2626' : capacityPercent > 60 ? '#F59E0B' : '#10B981' }} />
                      </div>
                    </div>

                    <div style={styles.actionButtons}>
                      <button style={{ ...styles.actionButton, ...styles.viewButton }} onClick={() => { setSelectedRequest(request); setShowDetailsModal(true); }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                        <FiEye size={16} /> Details
                      </button>
                      <button style={{ ...styles.actionButton, ...styles.approveButton }} onClick={() => openFeedbackModal(request, 'approve')} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#10B981'; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <FiCheck size={16} /> Approve
                      </button>
                      <button style={{ ...styles.actionButton, ...styles.rejectButton }} onClick={() => openFeedbackModal(request, 'reject')} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B91C1C'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#DC2626'; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <FiX size={16} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedRequest && (
          <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>{selectedRequest.venueName}</h3>
                  <p style={styles.modalSubtitle}>{selectedRequest.eventName} • Requested by {selectedRequest.requestedBy}</p>
                </div>
                <button style={styles.closeButton} onClick={() => setShowDetailsModal(false)} onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.transform = 'rotate(90deg)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.transform = 'rotate(0deg)'; }}>×</button>
              </div>

              <div style={styles.detailsGrid}>
                <div style={styles.detailCard}>
                  <p style={styles.detailLabel}>Date & Time</p>
                  <p style={styles.detailValue}>{new Date(selectedRequest.date).toLocaleDateString()}</p>
                  <p style={styles.detailValue}>{selectedRequest.time}</p>
                </div>
                <div style={styles.detailCard}>
                  <p style={styles.detailLabel}>Duration</p>
                  <p style={styles.detailValue}>{selectedRequest.duration} hours</p>
                </div>
                <div style={styles.detailCard}>
                  <p style={styles.detailLabel}>Capacity</p>
                  <p style={styles.detailValue}>{selectedRequest.capacity} people</p>
                </div>
                <div style={styles.detailCard}>
                  <p style={styles.detailLabel}>Expected Attendees</p>
                  <p style={styles.detailValue}>{selectedRequest.expectedAttendees}</p>
                </div>
              </div>

              <div style={styles.section}>
                <h4 style={styles.sectionTitle}>Purpose</h4>
                <p style={styles.sectionText}>{selectedRequest.purpose}</p>
              </div>

              {selectedRequest.hasConflict && (
                <div style={styles.conflictWarning}>
                  <FiAlertTriangle size={24} color="#F59E0B" />
                  <div>
                    <p style={{ ...styles.conflictText, fontSize: '14px' }}>Scheduling Conflict Detected</p>
                    <p style={{ fontSize: '13px', color: '#92400E', marginTop: '4px' }}>{selectedRequest.conflictDetails}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && selectedRequest && (
          <div style={styles.modalOverlay} onClick={() => setShowFeedbackModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>{actionType === 'approve' ? 'Approve' : 'Reject'} Venue Request</h3>
              <p style={styles.modalSubtitle}>{selectedRequest.venueName} for {selectedRequest.eventName}</p>

              <div style={styles.formGroup}>
                <label style={styles.label}>{actionType === 'approve' ? 'Approval Comments (Optional)' : 'Reason for Rejection *'}</label>
                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} style={styles.textarea} rows={4} placeholder={actionType === 'approve' ? 'Add any comments or instructions...' : 'Please provide a reason for rejection...'} />
              </div>

              <div style={styles.modalActions}>
                <button style={{ ...styles.submitButton, backgroundColor: actionType === 'approve' ? '#10B981' : '#DC2626', color: '#FFFFFF' }} onClick={() => handleApproval(selectedRequest, actionType)} onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
                </button>
                <button style={styles.cancelButton} onClick={() => { setShowFeedbackModal(false); setFeedback(''); }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D1D5DB'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Toast */}
        {notification && (
          <div style={{
            position: 'fixed', top: '24px', right: '24px', backgroundColor: notification.type === 'success' ? '#10B981' : '#DC2626',
            color: '#FFFFFF', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 9999, display: 'flex', alignItems: 'center', gap: '12px', minWidth: '300px', maxWidth: '500px',
            animation: 'slideInRight 0.3s ease-out'
          }}>
            <div style={{ fontSize: '20px' }}>{notification.type === 'success' ? '✓' : '✕'}</div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>{notification.message}</div>
            <button onClick={() => setNotification(null)} style={{ backgroundColor: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '20px', cursor: 'pointer', padding: '0', lineHeight: 1 }}>×</button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </>
  );
};

export default VenueApproval;
