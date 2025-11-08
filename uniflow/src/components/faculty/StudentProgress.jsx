import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiAward,
  FiTarget,
  FiBookOpen,
  FiHome,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiPieChart,
  FiBarChart,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle
} from 'react-icons/fi';

const StudentProgress = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPerformance, setFilterPerformance] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // TODO: Fetch events from API
    // fetchEvents();
  }, []);

  const loadStudentProgress = (eventId) => {
    // TODO: Fetch student progress from API
    // fetchStudentProgress(eventId);
    setStudents([]);
    setFilteredStudents([]);
  };

  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Performance filter
    if (filterPerformance !== 'all') {
      switch (filterPerformance) {
        case 'excellent':
          filtered = filtered.filter(s => s.performanceScore >= 90);
          break;
        case 'good':
          filtered = filtered.filter(s => s.performanceScore >= 75 && s.performanceScore < 90);
          break;
        case 'average':
          filtered = filtered.filter(s => s.performanceScore >= 60 && s.performanceScore < 75);
          break;
        case 'poor':
          filtered = filtered.filter(s => s.performanceScore < 60);
          break;
        default:
          break;
      }
    }

    setFilteredStudents(filtered);
  }, [searchQuery, filterPerformance, students]);

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
      loadStudentProgress(event.id);
    } else {
      setStudents([]);
      setFilteredStudents([]);
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return { bg: '#D1FAE5', color: '#065F46', label: 'Excellent' };
    if (score >= 75) return { bg: '#DBEAFE', color: '#1E40AF', label: 'Good' };
    if (score >= 60) return { bg: '#FEF3C7', color: '#92400E', label: 'Average' };
    return { bg: '#FEE2E2', color: '#991B1B', label: 'Poor' };
  };

  const getOverallStats = () => {
    if (students.length === 0) return { avgPerformance: 0, avgAttendance: 0, avgParticipation: 0 };
    
    const totalPerformance = students.reduce((sum, s) => sum + s.performanceScore, 0);
    const totalAttendance = students.reduce((sum, s) => sum + s.attendance, 0);
    const totalParticipation = students.reduce((sum, s) => sum + s.participation, 0);

    return {
      avgPerformance: (totalPerformance / students.length).toFixed(2),
      avgAttendance: (totalAttendance / students.length).toFixed(2),
      avgParticipation: (totalParticipation / students.length).toFixed(2)
    };
  };

  const stats = getOverallStats();

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
            onClick={() => navigate('/faculty/student-progress')} 
            style={{...styles.navBtn, backgroundColor: '#4F46E5', color: '#FFFFFF', border: 'none'}}
          >
            <FiTrendingUp size={16} /> Student Progress
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Student Progress Tracking</h1>
            <p style={styles.pageSubtitle}>Monitor engagement and performance across sessions</p>
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

        {/* Progress Content */}
        {selectedEvent && students.length > 0 && (
          <div style={{animation: 'fadeIn 0.3s ease-out'}}>
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={{...styles.statCard, borderLeft: '4px solid #4F46E5'}}>
                <FiBarChart size={28} color="#4F46E5" />
                <div>
                  <div style={styles.statNumber}>{stats.avgPerformance}%</div>
                  <div style={styles.statLabel}>Avg Performance</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #10B981'}}>
                <FiCheckCircle size={28} color="#10B981" />
                <div>
                  <div style={styles.statNumber}>{stats.avgAttendance}%</div>
                  <div style={styles.statLabel}>Avg Attendance</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #F59E0B'}}>
                <FiActivity size={28} color="#F59E0B" />
                <div>
                  <div style={styles.statNumber}>{stats.avgParticipation}%</div>
                  <div style={styles.statLabel}>Avg Participation</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #3B82F6'}}>
                <FiUsers size={28} color="#3B82F6" />
                <div>
                  <div style={styles.statNumber}>{students.length}</div>
                  <div style={styles.statLabel}>Total Students</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={styles.controlsBar}>
              <div style={styles.searchBox}>
                <FiSearch size={18} color="#6B7280" />
                <input
                  type="text"
                  placeholder="Search by name or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
              <div style={styles.filterGroup}>
                <FiFilter size={16} color="#6B7280" />
                <select 
                  value={filterPerformance} 
                  onChange={(e) => setFilterPerformance(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">All Performance</option>
                  <option value="excellent">Excellent (90%+)</option>
                  <option value="good">Good (75-89%)</option>
                  <option value="average">Average (60-74%)</option>
                  <option value="poor">Poor (Below 60%)</option>
                </select>
              </div>
            </div>

            {/* Student Cards */}
            <div style={styles.studentsGrid}>
              {filteredStudents.map(student => {
                const perfStyle = getPerformanceColor(student.performanceScore);
                return (
                  <div 
                    key={student.id} 
                    style={styles.studentCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={styles.cardHeader}>
                      <div style={styles.studentAvatar}>{student.name.charAt(0)}</div>
                      <div style={{flex: 1}}>
                        <h3 style={styles.studentName}>{student.name}</h3>
                        <p style={styles.studentMeta}>{student.rollNo} • {student.department}</p>
                      </div>
                      <span style={{...styles.badge, backgroundColor: perfStyle.bg, color: perfStyle.color}}>
                        {perfStyle.label}
                      </span>
                    </div>

                    <div style={styles.metricsGrid}>
                      <div style={styles.metric}>
                        <div style={styles.metricValue}>{student.performanceScore}%</div>
                        <div style={styles.metricLabel}>Performance</div>
                        <div style={styles.progressBar}>
                          <div style={{...styles.progressFill, width: `${student.performanceScore}%`, backgroundColor: perfStyle.color}}></div>
                        </div>
                      </div>
                      <div style={styles.metric}>
                        <div style={styles.metricValue}>{student.attendance}%</div>
                        <div style={styles.metricLabel}>Attendance</div>
                        <div style={styles.progressBar}>
                          <div style={{...styles.progressFill, width: `${student.attendance}%`, backgroundColor: '#10B981'}}></div>
                        </div>
                      </div>
                      <div style={styles.metric}>
                        <div style={styles.metricValue}>{student.participation}%</div>
                        <div style={styles.metricLabel}>Participation</div>
                        <div style={styles.progressBar}>
                          <div style={{...styles.progressFill, width: `${student.participation}%`, backgroundColor: '#F59E0B'}}></div>
                        </div>
                      </div>
                    </div>

                    <div style={styles.cardFooter}>
                      <div style={styles.assignmentInfo}>
                        <FiTarget size={14} color="#6B7280" />
                        <span>Assignments: {student.assignments.submitted}/{student.assignments.total}</span>
                      </div>
                      <button 
                        onClick={() => { setSelectedStudent(student); setShowDetailsModal(true); }}
                        style={styles.detailsBtn}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#4338CA';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#4F46E5';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <FiEye size={16} /> View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Student Details Modal */}
            {showDetailsModal && selectedStudent && (
              <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.modalHeader}>
                    <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600', color: '#1F2937'}}>Student Progress Details</h2>
                    <button 
                      onClick={() => setShowDetailsModal(false)}
                      style={styles.closeBtn}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
                    >
                      <FiXCircle size={24} />
                    </button>
                  </div>
                  <div style={styles.modalBody}>
                    <div style={styles.studentHeader}>
                      <div style={{...styles.studentAvatar, width: '60px', height: '60px', fontSize: '24px'}}>
                        {selectedStudent.name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{margin: 0, fontSize: '20px', fontWeight: '600', color: '#1F2937'}}>{selectedStudent.name}</h3>
                        <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280'}}>
                          {selectedStudent.rollNo} • {selectedStudent.department}
                        </p>
                      </div>
                    </div>

                    <div style={{marginTop: '24px'}}>
                      <h4 style={{fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px'}}>Performance Metrics</h4>
                      <div style={styles.modalMetricsGrid}>
                        <div style={styles.modalMetric}>
                          <FiPieChart size={20} color="#4F46E5" />
                          <div>
                            <div style={{fontSize: '24px', fontWeight: '700', color: '#1F2937'}}>{selectedStudent.performanceScore}%</div>
                            <div style={{fontSize: '13px', color: '#6B7280'}}>Overall Score</div>
                          </div>
                        </div>
                        <div style={styles.modalMetric}>
                          <FiCheckCircle size={20} color="#10B981" />
                          <div>
                            <div style={{fontSize: '24px', fontWeight: '700', color: '#1F2937'}}>{selectedStudent.attendedSessions}/{selectedStudent.totalSessions}</div>
                            <div style={{fontSize: '13px', color: '#6B7280'}}>Sessions Attended</div>
                          </div>
                        </div>
                        <div style={styles.modalMetric}>
                          <FiTarget size={20} color="#F59E0B" />
                          <div>
                            <div style={{fontSize: '24px', fontWeight: '700', color: '#1F2937'}}>{selectedStudent.assignments.submitted}/{selectedStudent.assignments.total}</div>
                            <div style={{fontSize: '13px', color: '#6B7280'}}>Assignments Done</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{marginTop: '24px'}}>
                      <h4 style={{fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px'}}>Assessment Scores</h4>
                      {selectedStudent.assessments.map((assess, idx) => (
                        <div key={idx} style={{marginBottom: '12px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                            <span style={{fontSize: '14px', color: '#374151'}}>{assess.name}</span>
                            <span style={{fontSize: '14px', fontWeight: '600', color: '#1F2937'}}>{assess.score}/{assess.maxScore}</span>
                          </div>
                          <div style={styles.progressBar}>
                            <div style={{...styles.progressFill, width: `${(assess.score/assess.maxScore)*100}%`, backgroundColor: '#4F46E5'}}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{marginTop: '24px'}}>
                      <h4 style={{fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '8px'}}>Faculty Remarks</h4>
                      <div style={{padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB'}}>
                        <p style={{margin: 0, fontSize: '14px', color: '#374151'}}>{selectedStudent.remarks}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
  studentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #F3F4F6'
  },
  studentAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '600'
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
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  metricsGrid: {
    display: 'grid',
    gap: '12px',
    marginBottom: '16px'
  },
  metric: {
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px'
  },
  metricValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '4px'
  },
  metricLabel: {
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '8px'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#E5E7EB',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '3px'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #F3F4F6'
  },
  assignmentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6B7280'
  },
  detailsBtn: {
    padding: '8px 16px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '8px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
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
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  studentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  modalMetricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  modalMetric: {
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  }
};

export default StudentProgress;
