import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiFileText,
  FiDownload,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiStar,
  FiFile,
  FiBookOpen,
  FiHome,
  FiPrinter,
  FiTrendingUp,
  FiBarChart,
  FiPieChart,
  FiActivity,
  FiAlertCircle
} from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GenerateReport = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_BASE_URL}/faculty/my-events`, config);
      
      console.log('Fetched events:', response.data);
      
      // Transform events data - calculate real-time status like MyAssignedEvents does
      const allEvents = response.data.data || response.data.events || [];
      console.log('All events:', allEvents);
      console.log('Total events count:', allEvents.length);
      
      const eventsData = allEvents.map(event => {
        // Calculate real-time status based on dates (same logic as MyAssignedEvents)
        const now = new Date();
        const startDate = new Date(event.date?.startDate);
        const endDate = new Date(event.date?.endDate);
        
        let calculatedStatus = 'Upcoming';
        if (event.status === 'Completed' || now > endDate) {
          calculatedStatus = 'Completed';
        } else if (event.status === 'Ongoing' || (now >= startDate && now <= endDate)) {
          calculatedStatus = 'Ongoing';
        } else if (now < startDate) {
          calculatedStatus = 'Upcoming';
        }
        
        console.log('Event:', event.title, 'DB Status:', event.status, 'Calculated:', calculatedStatus);
        
        return {
          id: event._id,
          name: event.title,
          startDate: new Date(event.date.startDate).toISOString().split('T')[0],
          endDate: new Date(event.date.endDate).toISOString().split('T')[0],
          type: event.type || 'Academic',
          subType: event.subType || 'Event',
          status: calculatedStatus,
          venue: event.venue?.name || 'TBD'
        };
      }).filter(event => {
        // Only show Completed and Ongoing events for reports
        const isValid = event.status === 'Completed' || event.status === 'Ongoing';
        console.log('Event:', event.name, 'Status:', event.status, 'Valid for report:', isValid);
        return isValid;
      });
      
      console.log('Filtered events for reports:', eventsData);
      setEvents(eventsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to load events');
      setLoading(false);
    }
  };

  const generateReportData = (eventId) => {
    // Generate mock report data (in production, this would fetch from API)
    const event = events.find(e => e.id === parseInt(eventId) || e.id === eventId);
    if (!event) return null;

    return {
      event: event,
      overview: {
        totalSessions: 5,
        totalStudents: 45,
        averageAttendance: 87,
        averageFeedback: 4.3,
        completionRate: 91,
        totalMaterials: 12
      },
      attendance: {
        sessionWise: [
          { session: 'Session 1', date: event.startDate, present: 42, absent: 3, percentage: 93 },
          { session: 'Session 2', date: event.startDate, present: 40, absent: 5, percentage: 89 },
          { session: 'Session 3', date: event.startDate, present: 38, absent: 7, percentage: 84 },
          { session: 'Session 4', date: event.startDate, present: 41, absent: 4, percentage: 91 },
          { session: 'Session 5', date: event.endDate, present: 39, absent: 6, percentage: 87 }
        ]
      },
      feedback: {
        totalResponses: 40,
        distribution: { 5: 18, 4: 15, 3: 5, 2: 2, 1: 0 },
        categories: {
          content: 4.5,
          delivery: 4.2,
          relevance: 4.4,
          materials: 4.1
        }
      },
      summary: {
        strengths: [
          'High student engagement and participation',
          'Well-structured content delivery',
          'Comprehensive learning materials provided'
        ],
        improvements: [
          'More interactive sessions needed',
          'Additional practice exercises required',
          'Better time management for Q&A sessions'
        ],
        outcomes: [
          'Successfully completed all planned sessions',
          'Achieved target attendance rate',
          'Positive feedback from majority of participants'
        ]
      }
    };
  };

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
    setReportData(null);
  };

  const handleGenerateReport = () => {
    if (!selectedEvent) return;

    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      const report = generateReportData(selectedEvent.id);
      setReportData(report);
      setIsGenerating(false);
      showToast('Report generated successfully!', 'success');
    }, 1500);
  };

  const handleExport = (format) => {
    showToast(`Exporting report as ${format.toUpperCase()}...`, 'success');
    // Export logic would go here
  };

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
            onClick={() => navigate('/faculty/reports')} 
            style={{...styles.navBtn, backgroundColor: '#4F46E5', color: '#FFFFFF', border: 'none'}}
          >
            <FiFileText size={16} /> Reports
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Generate Event Report</h1>
            <p style={styles.pageSubtitle}>Create comprehensive reports for completed events</p>
          </div>
        </div>

        {/* Event Selection & Generate Button */}
        <div style={styles.controlSection}>
          {loading ? (
            <div style={{textAlign: 'center', padding: '20px'}}>
              <div style={{fontSize: '14px', color: '#6B7280'}}>Loading events...</div>
            </div>
          ) : error ? (
            <div style={{padding: '16px', backgroundColor: '#FEE2E2', borderRadius: '8px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <FiAlertCircle size={20} />
              <span>{error}</span>
            </div>
          ) : events.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <FiCalendar size={48} color="#9CA3AF" style={{marginBottom: '16px'}} />
              <p style={{fontSize: '16px', color: '#6B7280', margin: 0}}>No completed or ongoing events found</p>
              <p style={{fontSize: '14px', color: '#9CA3AF', marginTop: '8px'}}>Events assigned to you will appear here once completed</p>
            </div>
          ) : (
            <>
              <div style={styles.eventSelector}>
                <label style={styles.selectorLabel}>
                  Select Completed/Ongoing Event ({events.length} available):
                </label>
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
                      {event.name} - {event.subType} ({event.startDate} to {event.endDate})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {!loading && !error && selectedEvent && !reportData && (
            <button 
              onClick={handleGenerateReport}
              disabled={isGenerating}
              style={{
                ...styles.generateBtn,
                opacity: isGenerating ? 0.6 : 1,
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isGenerating) {
                  e.currentTarget.style.backgroundColor = '#4338CA';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isGenerating) {
                  e.currentTarget.style.backgroundColor = '#4F46E5';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <FiBarChart size={18} /> {isGenerating ? 'Generating Report...' : 'Generate Report'}
            </button>
          )}
        </div>

        {/* Generated Report */}
        {reportData && (
          <div style={{animation: 'fadeIn 0.3s ease-out'}}>
            {/* Export Actions */}
            <div style={styles.exportActions}>
              <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600', color: '#1F2937'}}>Event Report</h2>
              <div style={{display: 'flex', gap: '12px'}}>
                <button 
                  onClick={() => handleExport('pdf')}
                  style={styles.exportBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FCA5A5';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FiDownload size={16} /> Export PDF
                </button>
                <button 
                  onClick={() => handleExport('excel')}
                  style={{...styles.exportBtn, backgroundColor: '#D1FAE5', color: '#065F46'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#A7F3D0';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#D1FAE5';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FiDownload size={16} /> Export Excel
                </button>
                <button 
                  onClick={() => window.print()}
                  style={{...styles.exportBtn, backgroundColor: '#DBEAFE', color: '#1E40AF'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#BFDBFE';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#DBEAFE';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FiPrinter size={16} /> Print
                </button>
              </div>
            </div>

            {/* Event Info */}
            <div style={styles.reportSection}>
              <h3 style={styles.sectionTitle}><FiCalendar size={20} /> Event Information</h3>
              <div style={styles.infoGrid}>
                <div><strong>Event Name:</strong> {reportData.event.name}</div>
                <div><strong>Duration:</strong> {reportData.event.startDate} to {reportData.event.endDate}</div>
                <div><strong>Total Sessions:</strong> {reportData.overview.totalSessions}</div>
                <div><strong>Total Students:</strong> {reportData.overview.totalStudents}</div>
              </div>
            </div>

            {/* Overview Stats */}
            <div style={styles.reportSection}>
              <h3 style={styles.sectionTitle}><FiTrendingUp size={20} /> Overview Statistics</h3>
              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <div style={styles.statIcon}><FiCheckCircle size={24} color="#10B981" /></div>
                  <div style={styles.statValue}>{reportData.overview.averageAttendance}%</div>
                  <div style={styles.statLabel}>Avg Attendance</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statIcon}><FiStar size={24} color="#F59E0B" /></div>
                  <div style={styles.statValue}>{reportData.overview.averageFeedback}/5</div>
                  <div style={styles.statLabel}>Avg Feedback</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statIcon}><FiActivity size={24} color="#4F46E5" /></div>
                  <div style={styles.statValue}>{reportData.overview.completionRate}%</div>
                  <div style={styles.statLabel}>Completion Rate</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statIcon}><FiFile size={24} color="#3B82F6" /></div>
                  <div style={styles.statValue}>{reportData.overview.totalMaterials}</div>
                  <div style={styles.statLabel}>Materials</div>
                </div>
              </div>
            </div>

            {/* Attendance Details */}
            <div style={styles.reportSection}>
              <h3 style={styles.sectionTitle}><FiUsers size={20} /> Attendance Analysis</h3>
              <div style={styles.dataTable}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Session</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Present</th>
                      <th style={styles.th}>Absent</th>
                      <th style={styles.th}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.attendance.sessionWise.map((session, idx) => (
                      <tr key={idx} style={styles.tr}>
                        <td style={styles.td}>{session.session}</td>
                        <td style={styles.td}>{session.date}</td>
                        <td style={{...styles.td, color: '#10B981', fontWeight: '600'}}>{session.present}</td>
                        <td style={{...styles.td, color: '#EF4444', fontWeight: '600'}}>{session.absent}</td>
                        <td style={styles.td}>
                          <span style={{...styles.percentBadge, backgroundColor: session.percentage >= 90 ? '#D1FAE5' : '#FEF3C7', color: session.percentage >= 90 ? '#065F46' : '#92400E'}}>
                            {session.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Feedback Summary */}
            <div style={styles.reportSection}>
              <h3 style={styles.sectionTitle}><FiStar size={20} /> Feedback Summary</h3>
              <div style={styles.feedbackGrid}>
                <div>
                  <h4 style={styles.subTitle}>Rating Distribution</h4>
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = reportData.feedback.distribution[rating];
                    const percentage = (count / reportData.feedback.totalResponses) * 100;
                    return (
                      <div key={rating} style={styles.ratingRow}>
                        <span>{rating} ⭐</span>
                        <div style={styles.ratingBar}>
                          <div style={{...styles.ratingFill, width: `${percentage}%`}}></div>
                        </div>
                        <span>{count}</span>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <h4 style={styles.subTitle}>Category Ratings</h4>
                  {Object.entries(reportData.feedback.categories).map(([category, rating]) => (
                    <div key={category} style={styles.categoryRow}>
                      <span style={{textTransform: 'capitalize'}}>{category}</span>
                      <span style={{fontWeight: '600'}}>{rating}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={styles.reportSection}>
              <h3 style={styles.sectionTitle}><FiPieChart size={20} /> Event Summary</h3>
              <div style={styles.summaryGrid}>
                <div>
                  <h4 style={styles.subTitle}>Strengths</h4>
                  <ul style={styles.list}>
                    {reportData.summary.strengths.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={styles.subTitle}>Areas for Improvement</h4>
                  <ul style={styles.list}>
                    {reportData.summary.improvements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={styles.subTitle}>Key Outcomes</h4>
                  <ul style={styles.list}>
                    {reportData.summary.outcomes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
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
  controlSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  eventSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  selectorLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  select: {
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
  generateBtn: {
    padding: '14px 28px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '10px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    alignSelf: 'flex-start',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)'
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
  exportActions: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: '16px'
  },
  exportBtn: {
    padding: '10px 20px',
    backgroundColor: '#FEE2E2',
    border: 'none',
    borderRadius: '8px',
    color: '#DC2626',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  reportSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '12px',
    borderBottom: '2px solid #E5E7EB'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    fontSize: '14px',
    color: '#374151'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  statBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #E5E7EB'
  },
  statIcon: {
    marginBottom: '12px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '13px',
    color: '#6B7280'
  },
  dataTable: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    borderBottom: '2px solid #E5E7EB'
  },
  tr: {
    borderBottom: '1px solid #F3F4F6'
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#374151'
  },
  percentBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600'
  },
  feedbackGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  subTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '12px'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
    fontSize: '14px'
  },
  ratingBar: {
    flex: 1,
    height: '8px',
    backgroundColor: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  ratingFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    transition: 'width 0.3s ease'
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #F3F4F6',
    fontSize: '14px'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    color: '#374151',
    fontSize: '14px',
    lineHeight: '1.8'
  }
};

export default GenerateReport;
