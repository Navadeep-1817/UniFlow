import React, { useState, useEffect } from 'react';
import FacultyHeadTopNav from './FacultyHeadTopNav';
import { styles } from './EventApprovalStyles';
import { FiCalendar, FiUser, FiMapPin, FiDollarSign, FiClock, FiUsers, FiFileText, FiCheck, FiX, FiEdit3, FiFilter } from 'react-icons/fi';

// Mock data
const mockPendingEvents = [
  {
    id: 1,
    name: 'Tech Innovation Summit 2024',
    proposedBy: 'Rahul Sharma',
    teamName: 'Tech Club',
    date: '2024-02-15',
    time: '10:00 AM - 4:00 PM',
    venue: 'Main Auditorium',
    budget: 75000,
    expectedParticipants: 200,
    category: 'Technical',
    description: 'A full-day summit featuring keynote speakers from leading tech companies, panel discussions on emerging technologies, and networking opportunities for students interested in technology careers.',
    objectives: 'To inspire students about latest tech trends, provide networking opportunities, and showcase student projects.',
    submittedDate: '2024-01-20',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 2,
    name: 'Annual Cultural Fest - Rang Manch',
    proposedBy: 'Priya Patel',
    teamName: 'Cultural Committee',
    date: '2024-03-10',
    time: '6:00 PM - 10:00 PM',
    venue: 'Open Air Theatre',
    budget: 120000,
    expectedParticipants: 500,
    category: 'Cultural',
    description: 'Annual cultural festival featuring dance performances, music concerts, drama competitions, and art exhibitions. The event will showcase diverse cultural traditions and student talents.',
    objectives: 'Celebrate cultural diversity, provide platform for student performers, and foster community engagement.',
    submittedDate: '2024-01-18',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 3,
    name: 'Sports Day Championship',
    proposedBy: 'Amit Kumar',
    teamName: 'Sports Council',
    date: '2024-02-25',
    time: '8:00 AM - 5:00 PM',
    venue: 'Sports Complex',
    budget: 50000,
    expectedParticipants: 300,
    category: 'Sports',
    description: 'Inter-department sports competition including athletics, cricket, football, basketball, and indoor games. Awards ceremony at the end of the day.',
    objectives: 'Promote physical fitness, team spirit, and healthy competition among students.',
    submittedDate: '2024-01-22',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 4,
    name: 'Entrepreneurship Workshop Series',
    proposedBy: 'Sneha Reddy',
    teamName: 'E-Cell',
    date: '2024-02-20',
    time: '2:00 PM - 5:00 PM',
    venue: 'Seminar Hall B',
    budget: 30000,
    expectedParticipants: 100,
    category: 'Workshop',
    description: 'Three-day workshop series on entrepreneurship fundamentals, startup funding, and business planning. Industry experts will conduct interactive sessions.',
    objectives: 'Develop entrepreneurial mindset, provide practical business knowledge, and connect students with mentors.',
    submittedDate: '2024-01-25',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 5,
    name: 'Blood Donation Camp',
    proposedBy: 'Vikram Singh',
    teamName: 'NSS Unit',
    date: '2024-02-18',
    time: '9:00 AM - 3:00 PM',
    venue: 'Medical Center',
    budget: 15000,
    expectedParticipants: 150,
    category: 'Social Service',
    description: 'Blood donation drive in collaboration with local blood bank. Medical staff will be present for safe donation process.',
    objectives: 'Save lives through blood donation, create awareness about importance of blood donation.',
    submittedDate: '2024-01-23',
    status: 'pending',
    priority: 'low'
  }
];

const EventApproval = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setPendingEvents(mockPendingEvents);
        setIsLoading(false);
      }, 800);
    };
    fetchData();
  }, []);

  const handleApproval = (eventId, status, feedbackText) => {
    setPendingEvents(pendingEvents.filter(event => event.id !== eventId));
    alert(`Event ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'sent back for modifications'} successfully!`);
    setShowFeedbackModal(false);
    setShowDetailsModal(false);
    setFeedback('');
  };

  const openFeedbackModal = (event, action) => {
    setSelectedEvent(event);
    setActionType(action);
    setShowFeedbackModal(true);
  };

  const filteredEvents = pendingEvents.filter(event => {
    const categoryMatch = filterCategory === 'All' || event.category === filterCategory;
    const priorityMatch = filterPriority === 'All' || event.priority === filterPriority;
    return categoryMatch && priorityMatch;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Technical': return '💻';
      case 'Cultural': return '🎭';
      case 'Sports': return '⚽';
      case 'Workshop': return '📚';
      case 'Social Service': return '🤝';
      default: return '📅';
    }
  };

  if (isLoading) {
    return (
      <>
        <FacultyHeadTopNav />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading event requests...</p>
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
            <h2 style={styles.title}>Event Approval Queue</h2>
            <p style={styles.subtitle}>{filteredEvents.length} pending requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📋</div>
            <div>
              <p style={styles.statLabel}>Total Pending</p>
              <p style={styles.statValue}>{pendingEvents.length}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#FEE2E2' }}>🔴</div>
            <div>
              <p style={styles.statLabel}>High Priority</p>
              <p style={styles.statValue}>{pendingEvents.filter(e => e.priority === 'high').length}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#FEF3C7' }}>🟡</div>
            <div>
              <p style={styles.statLabel}>Medium Priority</p>
              <p style={styles.statValue}>{pendingEvents.filter(e => e.priority === 'medium').length}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: '#D1FAE5' }}>🟢</div>
            <div>
              <p style={styles.statLabel}>Low Priority</p>
              <p style={styles.statValue}>{pendingEvents.filter(e => e.priority === 'low').length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersContainer}>
          <div style={styles.filterGroup}>
            <FiFilter size={16} style={{ color: '#6B7280' }} />
            <label style={styles.filterLabel}>Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={styles.select}
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Workshop">Workshop</option>
              <option value="Social Service">Social Service</option>
            </select>
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Priority:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={styles.select}
            >
              <option value="All">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Event Cards */}
        {filteredEvents.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>✅</div>
            <h3 style={styles.emptyTitle}>All Caught Up!</h3>
            <p style={styles.emptyText}>No pending event requests at the moment.</p>
          </div>
        ) : (
          <div style={styles.eventsGrid}>
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  ...styles.eventCard,
                  ...(hoveredCard === event.id ? styles.eventCardHover : {})
                }}
                onMouseEnter={() => setHoveredCard(event.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{
                  ...styles.priorityBadge,
                  backgroundColor: getPriorityColor(event.priority),
                }}>
                  {event.priority.toUpperCase()}
                </div>

                <div style={styles.categoryBadge}>
                  <span style={styles.categoryIcon}>{getCategoryIcon(event.category)}</span>
                  <span style={styles.categoryText}>{event.category}</span>
                </div>

                <h3 style={styles.eventTitle}>{event.name}</h3>

                <div style={styles.eventInfoGrid}>
                  <div style={styles.infoItem}>
                    <FiUser size={14} style={{ color: '#6B7280' }} />
                    <span style={styles.infoText}>{event.proposedBy}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <FiUsers size={14} style={{ color: '#6B7280' }} />
                    <span style={styles.infoText}>{event.teamName}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <FiCalendar size={14} style={{ color: '#6B7280' }} />
                    <span style={styles.infoText}>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <FiClock size={14} style={{ color: '#6B7280' }} />
                    <span style={styles.infoText}>{event.time}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <FiMapPin size={14} style={{ color: '#6B7280' }} />
                    <span style={styles.infoText}>{event.venue}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <FiDollarSign size={14} style={{ color: '#6B7280' }} />
                    <span style={styles.infoText}>₹{event.budget.toLocaleString()}</span>
                  </div>
                </div>

                <p style={styles.description}>
                  {event.description.substring(0, 120)}...
                </p>

                <div style={styles.participantsTag}>
                  <FiUsers size={14} />
                  <span>{event.expectedParticipants} expected participants</span>
                </div>

                <div style={styles.actionButtons}>
                  <button
                    style={styles.viewDetailsBtn}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowDetailsModal(true);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#3730A3';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#4F46E5';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FiFileText size={16} />
                    View Details
                  </button>
                  <button
                    style={styles.approveBtn}
                    onClick={() => openFeedbackModal(event, 'approve')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10B981';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <FiCheck size={16} />
                    Approve
                  </button>
                  <button
                    style={styles.rejectBtn}
                    onClick={() => openFeedbackModal(event, 'reject')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#B91C1C';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#DC2626';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <FiX size={16} />
                    Reject
                  </button>
                  <button
                    style={styles.modifyBtn}
                    onClick={() => openFeedbackModal(event, 'modify')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D97706';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F59E0B';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <FiEdit3 size={16} />
                    Request Changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedEvent && (
          <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
            <div style={styles.detailsModal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>{selectedEvent.name}</h3>
                  <p style={styles.modalSubtitle}>Proposed by {selectedEvent.proposedBy} ({selectedEvent.teamName})</p>
                </div>
                <button
                  style={styles.closeButton}
                  onClick={() => setShowDetailsModal(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#111827';
                    e.currentTarget.style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6B7280';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  ×
                </button>
              </div>

              <div style={styles.modalContent}>
                <div style={styles.detailsGrid}>
                  <div style={styles.detailItem}>
                    <FiCalendar size={18} style={{ color: '#4F46E5' }} />
                    <div>
                      <p style={styles.detailLabel}>Date & Time</p>
                      <p style={styles.detailValue}>{new Date(selectedEvent.date).toLocaleDateString()}</p>
                      <p style={styles.detailValue}>{selectedEvent.time}</p>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <FiMapPin size={18} style={{ color: '#4F46E5' }} />
                    <div>
                      <p style={styles.detailLabel}>Venue</p>
                      <p style={styles.detailValue}>{selectedEvent.venue}</p>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <FiDollarSign size={18} style={{ color: '#4F46E5' }} />
                    <div>
                      <p style={styles.detailLabel}>Budget Required</p>
                      <p style={styles.detailValue}>₹{selectedEvent.budget.toLocaleString()}</p>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <FiUsers size={18} style={{ color: '#4F46E5' }} />
                    <div>
                      <p style={styles.detailLabel}>Expected Participants</p>
                      <p style={styles.detailValue}>{selectedEvent.expectedParticipants}</p>
                    </div>
                  </div>
                </div>

                <div style={styles.section}>
                  <h4 style={styles.sectionTitle}>Description</h4>
                  <p style={styles.sectionText}>{selectedEvent.description}</p>
                </div>

                <div style={styles.section}>
                  <h4 style={styles.sectionTitle}>Objectives</h4>
                  <p style={styles.sectionText}>{selectedEvent.objectives}</p>
                </div>

                <div style={styles.submissionInfo}>
                  <p style={styles.submissionText}>
                    Submitted on: {new Date(selectedEvent.submittedDate).toLocaleDateString()}
                  </p>
                  <span style={{
                    ...styles.priorityTag,
                    backgroundColor: getPriorityColor(selectedEvent.priority) + '20',
                    color: getPriorityColor(selectedEvent.priority)
                  }}>
                    {selectedEvent.priority.toUpperCase()} PRIORITY
                  </span>
                </div>

                <div style={styles.modalActions}>
                  <button
                    style={styles.modalApproveBtn}
                    onClick={() => openFeedbackModal(selectedEvent, 'approve')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10B981';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FiCheck size={18} />
                    Approve Event
                  </button>
                  <button
                    style={styles.modalRejectBtn}
                    onClick={() => openFeedbackModal(selectedEvent, 'reject')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#B91C1C';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#DC2626';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FiX size={18} />
                    Reject Event
                  </button>
                  <button
                    style={styles.modalModifyBtn}
                    onClick={() => openFeedbackModal(selectedEvent, 'modify')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D97706';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F59E0B';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FiEdit3 size={18} />
                    Request Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && selectedEvent && (
          <div style={styles.modalOverlay} onClick={() => setShowFeedbackModal(false)}>
            <div style={styles.feedbackModal} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>
                {actionType === 'approve' && 'Approve Event'}
                {actionType === 'reject' && 'Reject Event'}
                {actionType === 'modify' && 'Request Modifications'}
              </h3>
              <p style={styles.feedbackSubtitle}>Event: {selectedEvent.name}</p>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  {actionType === 'approve' && 'Approval Comments (Optional)'}
                  {actionType === 'reject' && 'Reason for Rejection *'}
                  {actionType === 'modify' && 'Suggested Modifications *'}
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  style={styles.textarea}
                  rows={5}
                  placeholder={
                    actionType === 'approve' 
                      ? 'Add any comments or instructions...'
                      : actionType === 'reject'
                        ? 'Please provide a clear reason for rejection...'
                        : 'Specify what changes are needed...'
                  }
                />
              </div>

              <div style={styles.feedbackActions}>
                <button
                  style={{
                    ...styles.confirmBtn,
                    backgroundColor: 
                      actionType === 'approve' ? '#10B981' :
                      actionType === 'reject' ? '#DC2626' : '#F59E0B'
                  }}
                  onClick={() => handleApproval(selectedEvent.id, actionType === 'approve' ? 'approved' : actionType === 'reject' ? 'rejected' : 'modification_requested', feedback)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Confirm {actionType === 'approve' ? 'Approval' : actionType === 'reject' ? 'Rejection' : 'Request'}
                </button>
                <button
                  style={styles.cancelBtn}
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setFeedback('');
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D1D5DB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default EventApproval;
