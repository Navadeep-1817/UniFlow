import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiFilter,
  FiSearch,
  FiBookOpen,
  FiHome,
  FiTrendingUp,
  FiPieChart,
  FiFileText,
  FiAlertCircle
} from 'react-icons/fi';

const AttendanceSheet = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPercentage, setFilterPercentage] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Mock events data
    const mockEvents = [
      {
        id: 1,
        name: 'AI & ML Workshop',
        startDate: '2024-11-15',
        endDate: '2024-11-17',
        totalSessions: 6,
        totalStudents: 45
      },
      {
        id: 2,
        name: 'Web Development SDP',
        startDate: '2024-11-20',
        endDate: '2024-11-22',
        totalSessions: 4,
        totalStudents: 30
      },
      {
        id: 3,
        name: 'CRT Training',
        startDate: '2024-11-10',
        endDate: '2024-11-12',
        totalSessions: 3,
        totalStudents: 120
      }
    ];

    setEvents(mockEvents);
  }, []);

  const loadAttendanceData = (eventId) => {
    // Mock attendance data
    const mockAttendance = [
      {
        id: 1,
        rollNo: '20CS001',
        name: 'Aarav Sharma',
        department: 'CSE',
        sessions: [
          { id: 1, status: 'present', date: '2024-11-15' },
          { id: 2, status: 'present', date: '2024-11-15' },
          { id: 3, status: 'present', date: '2024-11-16' },
          { id: 4, status: 'present', date: '2024-11-16' },
          { id: 5, status: 'absent', date: '2024-11-17' },
          { id: 6, status: 'present', date: '2024-11-17' }
        ]
      },
      {
        id: 2,
        rollNo: '20CS002',
        name: 'Aditi Patel',
        department: 'CSE',
        sessions: [
          { id: 1, status: 'present', date: '2024-11-15' },
          { id: 2, status: 'absent', date: '2024-11-15' },
          { id: 3, status: 'present', date: '2024-11-16' },
          { id: 4, status: 'present', date: '2024-11-16' },
          { id: 5, status: 'present', date: '2024-11-17' },
          { id: 6, status: 'present', date: '2024-11-17' }
        ]
      },
      {
        id: 3,
        rollNo: '20CS003',
        name: 'Arjun Kumar',
        department: 'CSE',
        sessions: [
          { id: 1, status: 'present', date: '2024-11-15' },
          { id: 2, status: 'present', date: '2024-11-15' },
          { id: 3, status: 'absent', date: '2024-11-16' },
          { id: 4, status: 'absent', date: '2024-11-16' },
          { id: 5, status: 'present', date: '2024-11-17' },
          { id: 6, status: 'absent', date: '2024-11-17' }
        ]
      },
      {
        id: 4,
        rollNo: '20CS004',
        name: 'Ananya Singh',
        department: 'CSE',
        sessions: [
          { id: 1, status: 'present', date: '2024-11-15' },
          { id: 2, status: 'present', date: '2024-11-15' },
          { id: 3, status: 'present', date: '2024-11-16' },
          { id: 4, status: 'present', date: '2024-11-16' },
          { id: 5, status: 'present', date: '2024-11-17' },
          { id: 6, status: 'present', date: '2024-11-17' }
        ]
      },
      {
        id: 5,
        rollNo: '20CS005',
        name: 'Dhruv Verma',
        department: 'CSE',
        sessions: [
          { id: 1, status: 'absent', date: '2024-11-15' },
          { id: 2, status: 'absent', date: '2024-11-15' },
          { id: 3, status: 'present', date: '2024-11-16' },
          { id: 4, status: 'present', date: '2024-11-16' },
          { id: 5, status: 'absent', date: '2024-11-17' },
          { id: 6, status: 'present', date: '2024-11-17' }
        ]
      }
    ];

    // Calculate totals and percentages
    const processedData = mockAttendance.map(student => {
      const presentCount = student.sessions.filter(s => s.status === 'present').length;
      const totalSessions = student.sessions.length;
      const percentage = ((presentCount / totalSessions) * 100).toFixed(2);

      return {
        ...student,
        presentCount,
        absentCount: totalSessions - presentCount,
        totalSessions,
        percentage: parseFloat(percentage)
      };
    });

    setAttendanceData(processedData);
    setFilteredData(processedData);
  };

  useEffect(() => {
    let filtered = attendanceData;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply percentage filter
    if (filterPercentage !== 'all') {
      switch (filterPercentage) {
        case 'excellent':
          filtered = filtered.filter(s => s.percentage >= 90);
          break;
        case 'good':
          filtered = filtered.filter(s => s.percentage >= 75 && s.percentage < 90);
          break;
        case 'average':
          filtered = filtered.filter(s => s.percentage >= 60 && s.percentage < 75);
          break;
        case 'poor':
          filtered = filtered.filter(s => s.percentage < 60);
          break;
        default:
          break;
      }
    }

    setFilteredData(filtered);
  }, [searchQuery, filterPercentage, attendanceData]);

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
      loadAttendanceData(event.id);
    } else {
      setAttendanceData([]);
      setFilteredData([]);
    }
  };

  const handleExport = (format) => {
    // Export logic would go here
    showToast(`Exporting attendance as ${format.toUpperCase()}...`, 'success');
  };

  const getOverallStats = () => {
    if (attendanceData.length === 0) return { avgAttendance: 0, totalPresent: 0, totalAbsent: 0 };

    const totalStudents = attendanceData.length;
    const totalPresent = attendanceData.reduce((sum, s) => sum + s.presentCount, 0);
    const totalPossible = totalStudents * (selectedEvent?.totalSessions || 0);
    const avgAttendance = ((totalPresent / totalPossible) * 100).toFixed(2);

    return {
      avgAttendance: parseFloat(avgAttendance),
      totalPresent,
      totalAbsent: totalPossible - totalPresent
    };
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return { bg: '#D1FAE5', color: '#065F46' };
    if (percentage >= 75) return { bg: '#DBEAFE', color: '#1E40AF' };
    if (percentage >= 60) return { bg: '#FEF3C7', color: '#92400E' };
    return { bg: '#FEE2E2', color: '#991B1B' };
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
            onClick={() => navigate('/faculty/attendance-sheet')} 
            style={{...styles.navBtn, backgroundColor: '#4F46E5', color: '#FFFFFF', border: 'none'}}
          >
            <FiFileText size={16} /> Attendance Sheet
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Attendance Sheet</h1>
            <p style={styles.pageSubtitle}>View and export attendance records</p>
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

        {/* Attendance Sheet Content */}
        {selectedEvent && (
          <div style={{animation: 'fadeIn 0.3s ease-out'}}>
            {/* Event Info Card */}
            <div style={styles.eventInfoCard}>
              <div style={styles.eventInfoHeader}>
                <div>
                  <h3 style={styles.eventInfoTitle}>{selectedEvent.name}</h3>
                  <p style={styles.eventInfoSubtitle}>
                    {selectedEvent.startDate} to {selectedEvent.endDate} • {selectedEvent.totalSessions} Sessions
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={{...styles.statCard, borderLeft: '4px solid #4F46E5'}}>
                <FiTrendingUp size={28} color="#4F46E5" />
                <div>
                  <div style={styles.statNumber}>{stats.avgAttendance}%</div>
                  <div style={styles.statLabel}>Average Attendance</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #10B981'}}>
                <FiCheckCircle size={28} color="#10B981" />
                <div>
                  <div style={styles.statNumber}>{stats.totalPresent}</div>
                  <div style={styles.statLabel}>Total Present</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #EF4444'}}>
                <FiXCircle size={28} color="#EF4444" />
                <div>
                  <div style={styles.statNumber}>{stats.totalAbsent}</div>
                  <div style={styles.statLabel}>Total Absent</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #3B82F6'}}>
                <FiUsers size={28} color="#3B82F6" />
                <div>
                  <div style={styles.statNumber}>{attendanceData.length}</div>
                  <div style={styles.statLabel}>Total Students</div>
                </div>
              </div>
            </div>

            {/* Filters and Export Bar */}
            <div style={styles.controlsBar}>
              <div style={styles.searchBox}>
                <FiSearch size={18} color="#6B7280" />
                <input
                  type="text"
                  placeholder="Search by name or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
                />
              </div>

              <div style={styles.filterGroup}>
                <FiFilter size={16} color="#6B7280" />
                <select 
                  value={filterPercentage} 
                  onChange={(e) => setFilterPercentage(e.target.value)}
                  style={styles.filterSelect}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                >
                  <option value="all">All Students</option>
                  <option value="excellent">Excellent (90%+)</option>
                  <option value="good">Good (75-89%)</option>
                  <option value="average">Average (60-74%)</option>
                  <option value="poor">Poor (Below 60%)</option>
                </select>
              </div>

              <div style={styles.exportButtons}>
                <button 
                  onClick={() => handleExport('pdf')}
                  style={styles.exportBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FiDownload size={16} /> PDF
                </button>
                <button 
                  onClick={() => handleExport('excel')}
                  style={styles.exportBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D1FAE5';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FiDownload size={16} /> Excel
                </button>
                <button 
                  onClick={() => handleExport('csv')}
                  style={styles.exportBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#DBEAFE';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FiDownload size={16} /> CSV
                </button>
              </div>
            </div>

            {/* Attendance Table */}
            {filteredData.length === 0 ? (
              <div style={styles.emptyState}>
                <FiAlertCircle size={48} color="#9CA3AF" />
                <h3 style={{color: '#6B7280', fontSize: '18px', marginTop: '16px'}}>No records found</h3>
                <p style={{color: '#9CA3AF', fontSize: '14px'}}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={{...styles.tableHeader, minWidth: '100px'}}>Roll No</th>
                      <th style={{...styles.tableHeader, minWidth: '180px', textAlign: 'left'}}>Student Name</th>
                      <th style={{...styles.tableHeader, minWidth: '100px'}}>Department</th>
                      {selectedEvent.sessions && Array.from({length: selectedEvent.totalSessions}, (_, i) => (
                        <th key={i} style={{...styles.tableHeader, minWidth: '80px'}}>S{i + 1}</th>
                      ))}
                      <th style={{...styles.tableHeader, minWidth: '80px'}}>Present</th>
                      <th style={{...styles.tableHeader, minWidth: '80px'}}>Absent</th>
                      <th style={{...styles.tableHeader, minWidth: '100px'}}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((student, index) => {
                      const percentageStyle = getPercentageColor(student.percentage);
                      return (
                        <tr 
                          key={student.id} 
                          style={{
                            ...styles.tableRow,
                            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EEF2FF'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F9FAFB'}
                        >
                          <td style={styles.tableCell}>{student.rollNo}</td>
                          <td style={{...styles.tableCell, textAlign: 'left', fontWeight: '500'}}>{student.name}</td>
                          <td style={styles.tableCell}>{student.department}</td>
                          {student.sessions.map((session, idx) => (
                            <td key={idx} style={styles.tableCell}>
                              {session.status === 'present' ? (
                                <FiCheckCircle size={18} color="#10B981" />
                              ) : (
                                <FiXCircle size={18} color="#EF4444" />
                              )}
                            </td>
                          ))}
                          <td style={{...styles.tableCell, fontWeight: '600', color: '#10B981'}}>{student.presentCount}</td>
                          <td style={{...styles.tableCell, fontWeight: '600', color: '#EF4444'}}>{student.absentCount}</td>
                          <td style={styles.tableCell}>
                            <span style={{
                              ...styles.percentageBadge,
                              backgroundColor: percentageStyle.bg,
                              color: percentageStyle.color
                            }}>
                              {student.percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary Info */}
            {filteredData.length > 0 && (
              <div style={styles.summaryCard}>
                <FiPieChart size={20} color="#4F46E5" />
                <span style={{color: '#6B7280', fontSize: '14px'}}>
                  Showing {filteredData.length} of {attendanceData.length} students
                </span>
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
  eventInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  eventInfoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eventInfoTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1F2937',
    margin: 0
  },
  eventInfoSubtitle: {
    fontSize: '14px',
    color: '#6B7280',
    margin: '4px 0 0 0'
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
    marginBottom: '16px',
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
    borderRadius: '8px',
    border: '1px solid transparent',
    transition: 'all 0.2s ease'
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
    outline: 'none',
    transition: 'all 0.2s ease'
  },
  exportButtons: {
    display: 'flex',
    gap: '8px'
  },
  exportBtn: {
    padding: '8px 16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderRow: {
    borderBottom: '2px solid #E5E7EB'
  },
  tableHeader: {
    padding: '12px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableRow: {
    transition: 'background-color 0.2s ease'
  },
  tableCell: {
    padding: '16px 12px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#1F2937',
    borderBottom: '1px solid #F3F4F6'
  },
  percentageBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'inline-block'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  summaryCard: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }
};

export default AttendanceSheet;
