import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiStar,
  FiMessageSquare,
  FiUsers,
  FiTrendingUp,
  FiBookOpen,
  FiHome,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiThumbsUp,
  FiThumbsDown,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';

const EventFeedback = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // TODO: Fetch events from API
    // fetchEvents();
  }, []);

  const loadFeedback = (eventId) => {
    // TODO: Fetch feedback from API
    // fetchFeedback(eventId);
    setFeedbackList([]);
    setFilteredFeedback([]);
  };

  useEffect(() => {
    let filtered = feedbackList;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(f =>
        f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.session.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Rating filter
    if (filterRating !== 'all') {
      const rating = parseInt(filterRating);
      filtered = filtered.filter(f => f.rating === rating);
    }

    setFilteredFeedback(filtered);
  }, [searchQuery, filterRating, feedbackList]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  const handleEventChange = (eventId) => {
    const event = events.find(e => e.id === parseInt(eventId));
    setSelectedEvent(event);
    if (event) {
      loadFeedback(event.id);
    } else {
      setFeedbackList([]);
      setFilteredFeedback([]);
    }
  };

  const calculateStats = () => {
    if (feedbackList.length === 0) {
      return { avgRating: 0, totalResponses: 0, responseRate: 0, distribution: {} };
    }

    const totalRating = feedbackList.reduce((sum, f) => sum + f.rating, 0);
    const avgRating = (totalRating / feedbackList.length).toFixed(2);
    const responseRate = ((feedbackList.length / (selectedEvent?.totalStudents || 1)) * 100).toFixed(1);

    // Rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbackList.forEach(f => {
      distribution[f.rating] = (distribution[f.rating] || 0) + 1;
    });

    // Category averages
    const categoryTotals = { content: 0, delivery: 0, materials: 0, engagement: 0 };
    feedbackList.forEach(f => {
      Object.keys(categoryTotals).forEach(key => {
        categoryTotals[key] += f.categories[key];
      });
    });

    const categoryAvgs = {};
    Object.keys(categoryTotals).forEach(key => {
      categoryAvgs[key] = (categoryTotals[key] / feedbackList.length).toFixed(2);
    });

    return { avgRating, totalResponses: feedbackList.length, responseRate, distribution, categoryAvgs };
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return { bg: '#D1FAE5', color: '#065F46' };
    if (rating >= 3.5) return { bg: '#DBEAFE', color: '#1E40AF' };
    if (rating >= 2.5) return { bg: '#FEF3C7', color: '#92400E' };
    return { bg: '#FEE2E2', color: '#991B1B' };
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={16}
        fill={i < rating ? '#F59E0B' : 'none'}
        color={i < rating ? '#F59E0B' : '#D1D5DB'}
      />
    ));
  };

  const stats = calculateStats();
  const ratingStyle = getRatingColor(parseFloat(stats.avgRating));

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
            onClick={() => navigate('/faculty/feedback')} 
            style={{...styles.navBtn, backgroundColor: '#4F46E5', color: '#FFFFFF', border: 'none'}}
          >
            <FiMessageSquare size={16} /> Feedback
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Event Feedback</h1>
            <p style={styles.pageSubtitle}>View and analyze student feedback for your events</p>
          </div>
        </div>

        {/* Event Selection */}
        <div style={styles.eventSelector}>
          <label style={styles.selectorLabel}>Select Event:</label>
          <select 
            value={selectedEvent?.id || ''} 
            onChange={(e) => handleEventChange(e.target.value)}
            style={styles.select}
            onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
          >
            <option value="">Choose an event...</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name} ({event.startDate} to {event.endDate})
              </option>
            ))}
          </select>
        </div>

        {/* Feedback Content */}
        {selectedEvent && feedbackList.length > 0 && (
          <div style={{animation: 'fadeIn 0.3s ease-out'}}>
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={{...styles.statCard, borderLeft: '4px solid #F59E0B'}}>
                <FiStar size={28} color="#F59E0B" />
                <div>
                  <div style={{...styles.statNumber, ...ratingStyle}}>{stats.avgRating}/5</div>
                  <div style={styles.statLabel}>Average Rating</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #4F46E5'}}>
                <FiMessageSquare size={28} color="#4F46E5" />
                <div>
                  <div style={styles.statNumber}>{stats.totalResponses}</div>
                  <div style={styles.statLabel}>Total Responses</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #10B981'}}>
                <FiTrendingUp size={28} color="#10B981" />
                <div>
                  <div style={styles.statNumber}>{stats.responseRate}%</div>
                  <div style={styles.statLabel}>Response Rate</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #3B82F6'}}>
                <FiUsers size={28} color="#3B82F6" />
                <div>
                  <div style={styles.statNumber}>{selectedEvent.totalStudents}</div>
                  <div style={styles.statLabel}>Total Students</div>
                </div>
              </div>
            </div>

            {/* Rating Distribution & Category Analysis */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px'}}>
              <div style={styles.analysisCard}>
                <h3 style={styles.analysisTitle}><FiBarChart2 size={20} /> Rating Distribution</h3>
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = stats.distribution[rating] || 0;
                  const percentage = feedbackList.length > 0 ? (count / feedbackList.length) * 100 : 0;
                  return (
                    <div key={rating} style={styles.distributionItem}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', minWidth: '80px'}}>
                        {renderStars(rating)}
                      </div>
                      <div style={styles.progressBarContainer}>
                        <div style={{...styles.progressBarFill, width: `${percentage}%`, backgroundColor: rating >= 4 ? '#10B981' : rating === 3 ? '#F59E0B' : '#EF4444'}}></div>
                      </div>
                      <span style={{fontSize: '13px', color: '#6B7280', minWidth: '40px', textAlign: 'right'}}>{count}</span>
                    </div>
                  );
                })}
              </div>

              <div style={styles.analysisCard}>
                <h3 style={styles.analysisTitle}><FiPieChart size={20} /> Category Ratings</h3>
                {Object.entries(stats.categoryAvgs || {}).map(([category, avg]) => (
                  <div key={category} style={styles.categoryItem}>
                    <span style={{fontSize: '14px', color: '#374151', textTransform: 'capitalize'}}>{category}</span>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <div style={styles.miniProgressBar}>
                        <div style={{...styles.miniProgressFill, width: `${(avg/5)*100}%`}}></div>
                      </div>
                      <span style={{fontSize: '14px', fontWeight: '600', color: '#1F2937'}}>{avg}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search & Filter */}
            <div style={styles.controlsBar}>
              <div style={styles.searchBox}>
                <FiSearch size={18} color="#6B7280" />
                <input
                  type="text"
                  placeholder="Search by student, session, or comment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
              <div style={styles.filterGroup}>
                <FiFilter size={16} color="#6B7280" />
                <select 
                  value={filterRating} 
                  onChange={(e) => setFilterRating(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            {/* Feedback List */}
            <div style={styles.feedbackSection}>
              <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px'}}>
                Student Feedback ({filteredFeedback.length})
              </h3>
              {filteredFeedback.map(feedback => (
                <div 
                  key={feedback.id} 
                  style={styles.feedbackCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={styles.feedbackHeader}>
                    <div>
                      <h4 style={styles.studentName}>{feedback.studentName}</h4>
                      <p style={styles.studentMeta}>{feedback.rollNo} • {feedback.session}</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <div style={{display: 'flex', gap: '2px'}}>
                        {renderStars(feedback.rating)}
                      </div>
                      <span style={{fontSize: '16px', fontWeight: '600', color: '#1F2937'}}>{feedback.rating}.0</span>
                    </div>
                  </div>
                  <p style={styles.comment}>{feedback.comment}</p>
                  <div style={styles.feedbackFooter}>
                    <FiCalendar size={14} color="#6B7280" />
                    <span style={{fontSize: '13px', color: '#6B7280'}}>{feedback.date}</span>
                  </div>
                </div>
              ))}
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
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  mainContent: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  pageHeader: {
    marginBottom: '24px'
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
  eventSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flexWrap: 'wrap'
  },
  selectorLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151'
  },
  select: {
    flex: 1,
    minWidth: '300px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease'
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
  statsGrid: {
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
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s'
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
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  analysisTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  distributionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  progressBarContainer: {
    flex: 1,
    height: '8px',
    backgroundColor: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '4px'
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #F3F4F6'
  },
  miniProgressBar: {
    width: '80px',
    height: '6px',
    backgroundColor: '#E5E7EB',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    transition: 'width 0.3s ease',
    borderRadius: '3px'
  },
  controlsBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flexWrap: 'wrap'
  },
  searchBox: {
    flex: 1,
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '14px',
    color: '#1F2937'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    outline: 'none'
  },
  feedbackSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  feedbackCard: {
    padding: '20px',
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid #E5E7EB',
    transition: 'all 0.2s ease'
  },
  feedbackHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px'
  },
  studentName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937'
  },
  studentMeta: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#6B7280'
  },
  comment: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.6'
  },
  feedbackFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    paddingTop: '12px',
    borderTop: '1px solid #E5E7EB'
  }
};

export default EventFeedback;
