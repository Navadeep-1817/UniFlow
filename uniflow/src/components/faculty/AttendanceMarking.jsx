import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiDownload,
  FiBookOpen,
  FiHome,
  FiCamera,
  FiMaximize2,
  FiCheck,
  FiX,
  FiSave
} from 'react-icons/fi';

const AttendanceMarking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    // Mock sessions data
    const mockSessions = [
      {
        id: 1,
        eventName: 'AI & ML Workshop',
        sessionTitle: 'Introduction to Machine Learning',
        date: '2024-11-15',
        startTime: '10:00',
        endTime: '12:00',
        venue: 'Lab 301',
        totalStudents: 45
      },
      {
        id: 2,
        eventName: 'Web Development SDP',
        sessionTitle: 'React Fundamentals',
        date: '2024-11-20',
        startTime: '10:00',
        endTime: '13:00',
        venue: 'Computer Lab A',
        totalStudents: 30
      },
      {
        id: 3,
        eventName: 'CRT Training',
        sessionTitle: 'Aptitude Test Preparation',
        date: '2024-11-10',
        startTime: '09:00',
        endTime: '12:00',
        venue: 'Auditorium',
        totalStudents: 120
      }
    ];

    setSessions(mockSessions);

    // Check if session was passed from route state
    if (location.state?.session) {
      setSelectedSession(location.state.session.id);
      loadStudents(location.state.session.id);
    }
  }, [location]);

  const loadStudents = (sessionId) => {
    // Mock students data
    const mockStudents = [
      { id: 1, rollNo: '20CS001', name: 'Aarav Sharma', email: 'aarav@example.com', department: 'CSE', year: '3rd' },
      { id: 2, rollNo: '20CS002', name: 'Aditi Patel', email: 'aditi@example.com', department: 'CSE', year: '3rd' },
      { id: 3, rollNo: '20CS003', name: 'Arjun Kumar', email: 'arjun@example.com', department: 'CSE', year: '3rd' },
      { id: 4, rollNo: '20CS004', name: 'Ananya Singh', email: 'ananya@example.com', department: 'CSE', year: '3rd' },
      { id: 5, rollNo: '20CS005', name: 'Dhruv Verma', email: 'dhruv@example.com', department: 'CSE', year: '3rd' },
      { id: 6, rollNo: '20CS006', name: 'Ishita Reddy', email: 'ishita@example.com', department: 'CSE', year: '3rd' },
      { id: 7, rollNo: '20CS007', name: 'Kabir Mehta', email: 'kabir@example.com', department: 'CSE', year: '3rd' },
      { id: 8, rollNo: '20CS008', name: 'Kavya Iyer', email: 'kavya@example.com', department: 'CSE', year: '3rd' },
      { id: 9, rollNo: '20CS009', name: 'Nikhil Joshi', email: 'nikhil@example.com', department: 'CSE', year: '3rd' },
      { id: 10, rollNo: '20CS010', name: 'Priya Nair', email: 'priya@example.com', department: 'CSE', year: '3rd' }
    ];

    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
    
    // Initialize attendance data
    const initialAttendance = {};
    mockStudents.forEach(student => {
      initialAttendance[student.id] = { status: 'unmarked', timestamp: null };
    });
    setAttendanceData(initialAttendance);
  };

  useEffect(() => {
    let filtered = students;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(student => attendanceData[student.id]?.status === filterStatus);
    }

    setFilteredStudents(filtered);
  }, [searchQuery, filterStatus, students, attendanceData]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  const handleSessionChange = (sessionId) => {
    setSelectedSession(parseInt(sessionId));
    if (sessionId) {
      loadStudents(sessionId);
    } else {
      setStudents([]);
      setFilteredStudents([]);
    }
  };

  const markAttendance = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        status,
        timestamp: new Date().toISOString()
      }
    }));
    showToast(`Marked ${status}`, 'success');
  };

  const markAllPresent = () => {
    const updatedAttendance = { ...attendanceData };
    filteredStudents.forEach(student => {
      updatedAttendance[student.id] = {
        status: 'present',
        timestamp: new Date().toISOString()
      };
    });
    setAttendanceData(updatedAttendance);
    showToast('Marked all as present', 'success');
  };

  const markAllAbsent = () => {
    const updatedAttendance = { ...attendanceData };
    filteredStudents.forEach(student => {
      updatedAttendance[student.id] = {
        status: 'absent',
        timestamp: new Date().toISOString()
      };
    });
    setAttendanceData(updatedAttendance);
    showToast('Marked all as absent', 'success');
  };

  const submitAttendance = () => {
    const unmarkedCount = Object.values(attendanceData).filter(a => a.status === 'unmarked').length;
    if (unmarkedCount > 0) {
      if (!window.confirm(`${unmarkedCount} students are unmarked. Do you want to continue?`)) {
        return;
      }
    }
    // Submit attendance data to backend
    console.log('Submitting attendance:', attendanceData);
    showToast('Attendance submitted successfully!', 'success');
  };

  const getAttendanceStats = () => {
    const present = Object.values(attendanceData).filter(a => a.status === 'present').length;
    const absent = Object.values(attendanceData).filter(a => a.status === 'absent').length;
    const unmarked = Object.values(attendanceData).filter(a => a.status === 'unmarked').length;
    return { present, absent, unmarked, total: students.length };
  };

  const stats = getAttendanceStats();
  const currentSession = sessions.find(s => s.id === selectedSession);

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
            onClick={() => navigate('/faculty/attendance')} 
            style={{...styles.navBtn, backgroundColor: '#4F46E5', color: '#FFFFFF', border: 'none'}}
          >
            <FiCheckCircle size={16} /> Attendance
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Mark Attendance</h1>
            <p style={styles.pageSubtitle}>Select a session and mark student attendance</p>
          </div>
        </div>

        {/* Session Selection */}
        <div style={styles.sessionSelector}>
          <label style={styles.selectorLabel}>Select Session:</label>
          <select 
            value={selectedSession || ''} 
            onChange={(e) => handleSessionChange(e.target.value)}
            style={styles.select}
            onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
          >
            <option value="">Choose a session...</option>
            {sessions.map(session => (
              <option key={session.id} value={session.id}>
                {session.eventName} - {session.sessionTitle} ({session.date})
              </option>
            ))}
          </select>
        </div>

        {/* Attendance Interface - Shown after session selection */}
        {selectedSession && currentSession && (
          <div style={{animation: 'fadeIn 0.3s ease-out'}}>
            {/* Session Info Card */}
            <div style={styles.sessionInfoCard}>
              <h3 style={styles.sessionInfoTitle}>{currentSession.sessionTitle}</h3>
              <div style={styles.sessionInfoGrid}>
                <div style={styles.infoItem}>
                  <FiCalendar size={16} color="#6B7280" />
                  <span>{currentSession.date}</span>
                </div>
                <div style={styles.infoItem}>
                  <FiClock size={16} color="#6B7280" />
                  <span>{currentSession.startTime} - {currentSession.endTime}</span>
                </div>
                <div style={styles.infoItem}>
                  <FiUsers size={16} color="#6B7280" />
                  <span>{currentSession.totalStudents} Students</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={{...styles.statCard, borderLeft: '4px solid #10B981'}}>
                <FiCheckCircle size={24} color="#10B981" />
                <div>
                  <div style={styles.statNumber}>{stats.present}</div>
                  <div style={styles.statLabel}>Present</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #EF4444'}}>
                <FiXCircle size={24} color="#EF4444" />
                <div>
                  <div style={styles.statNumber}>{stats.absent}</div>
                  <div style={styles.statLabel}>Absent</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #F59E0B'}}>
                <FiUsers size={24} color="#F59E0B" />
                <div>
                  <div style={styles.statNumber}>{stats.unmarked}</div>
                  <div style={styles.statLabel}>Unmarked</div>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #3B82F6'}}>
                <FiUsers size={24} color="#3B82F6" />
                <div>
                  <div style={styles.statNumber}>{stats.total}</div>
                  <div style={styles.statLabel}>Total</div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div style={styles.actionsBar}>
              <div style={styles.searchBox}>
                <FiSearch size={18} color="#6B7280" />
                <input
                  type="text"
                  placeholder="Search by name, roll no, or email..."
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
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={styles.filterSelect}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                >
                  <option value="all">All Students</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="unmarked">Unmarked</option>
                </select>
              </div>

              <button 
                onClick={() => setShowQRScanner(true)}
                style={styles.qrBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E0E7FF';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#EEF2FF';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FiCamera size={16} /> Scan QR
              </button>

              <button 
                onClick={() => setShowQRCode(true)}
                style={styles.qrBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E0E7FF';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#EEF2FF';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FiMaximize2 size={16} /> Show QR
              </button>
            </div>

            {/* Bulk Actions */}
            <div style={styles.bulkActions}>
              <button 
                onClick={markAllPresent}
                style={styles.bulkBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D1FAE5';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ECFDF5';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FiCheck size={16} /> Mark All Present
              </button>
              <button 
                onClick={markAllAbsent}
                style={{...styles.bulkBtn, backgroundColor: '#FEE2E2', color: '#991B1B'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FCA5A5';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FEE2E2';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FiX size={16} /> Mark All Absent
              </button>
              <button 
                style={styles.exportBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FiDownload size={16} /> Export
              </button>
            </div>

            {/* Students List */}
            <div style={styles.studentsList}>
              {filteredStudents.length === 0 ? (
                <div style={styles.emptyState}>
                  <FiUsers size={48} color="#9CA3AF" />
                  <h3 style={{color: '#6B7280', fontSize: '18px', marginTop: '16px'}}>No students found</h3>
                  <p style={{color: '#9CA3AF', fontSize: '14px'}}>Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredStudents.map(student => {
                  const attendance = attendanceData[student.id];
                  const statusStyle = {
                    present: { bg: '#D1FAE5', color: '#065F46', icon: <FiCheckCircle size={16} /> },
                    absent: { bg: '#FEE2E2', color: '#991B1B', icon: <FiXCircle size={16} /> },
                    unmarked: { bg: '#F3F4F6', color: '#6B7280', icon: <FiUsers size={16} /> }
                  }[attendance.status];

                  return (
                    <div 
                      key={student.id} 
                      style={styles.studentCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={styles.studentInfo}>
                        <div style={styles.studentAvatar}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h4 style={styles.studentName}>{student.name}</h4>
                          <div style={styles.studentMeta}>
                            <span>{student.rollNo}</span>
                            <span>•</span>
                            <span>{student.department}</span>
                            <span>•</span>
                            <span>{student.year} Year</span>
                          </div>
                        </div>
                      </div>

                      <div style={styles.studentActions}>
                        <div style={{
                          ...styles.statusBadge,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color
                        }}>
                          {statusStyle.icon}
                          <span>{attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}</span>
                        </div>

                        <div style={styles.actionButtons}>
                          <button 
                            onClick={() => markAttendance(student.id, 'present')}
                            style={{
                              ...styles.markBtn,
                              backgroundColor: attendance.status === 'present' ? '#10B981' : '#ECFDF5',
                              color: attendance.status === 'present' ? '#FFFFFF' : '#065F46'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#10B981';
                              e.currentTarget.style.color = '#FFFFFF';
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = attendance.status === 'present' ? '#10B981' : '#ECFDF5';
                              e.currentTarget.style.color = attendance.status === 'present' ? '#FFFFFF' : '#065F46';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <FiCheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => markAttendance(student.id, 'absent')}
                            style={{
                              ...styles.markBtn,
                              backgroundColor: attendance.status === 'absent' ? '#EF4444' : '#FEE2E2',
                              color: attendance.status === 'absent' ? '#FFFFFF' : '#991B1B'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#EF4444';
                              e.currentTarget.style.color = '#FFFFFF';
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = attendance.status === 'absent' ? '#EF4444' : '#FEE2E2';
                              e.currentTarget.style.color = attendance.status === 'absent' ? '#FFFFFF' : '#991B1B';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <FiXCircle size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Submit Button */}
            {filteredStudents.length > 0 && (
              <div style={{marginTop: '24px', display: 'flex', justifyContent: 'flex-end'}}>
                <button 
                  onClick={submitAttendance}
                  style={styles.submitBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4338CA';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4F46E5';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(79, 70, 229, 0.2)';
                  }}
                >
                  <FiSave size={18} /> Submit Attendance
                </button>
              </div>
            )}

            {/* QR Scanner Modal */}
            {showQRScanner && (
              <div style={styles.modalOverlay} onClick={() => setShowQRScanner(false)}>
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.modalHeader}>
                    <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600', color: '#1F2937'}}>Scan QR Code</h2>
                    <button 
                      onClick={() => setShowQRScanner(false)}
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
                    <div style={{textAlign: 'center', padding: '40px'}}>
                      <FiCamera size={64} color="#4F46E5" />
                      <h3 style={{color: '#1F2937', marginTop: '16px'}}>QR Scanner Active</h3>
                      <p style={{color: '#6B7280', marginTop: '8px'}}>Point camera at student's QR code</p>
                      <div style={{marginTop: '24px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '8px'}}>
                        <p style={{fontSize: '14px', color: '#6B7280'}}>QR scanning functionality would be integrated here using a camera library</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* QR Code Display Modal */}
            {showQRCode && (
              <div style={styles.modalOverlay} onClick={() => setShowQRCode(false)}>
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.modalHeader}>
                    <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600', color: '#1F2937'}}>Session QR Code</h2>
                    <button 
                      onClick={() => setShowQRCode(false)}
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
                    <div style={{textAlign: 'center'}}>
                      <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '8px'}}>{currentSession.sessionTitle}</h3>
                      <p style={{color: '#6B7280', fontSize: '14px', marginBottom: '24px'}}>Students can scan this QR code to mark their attendance</p>
                      <div style={{width: '300px', height: '300px', margin: '0 auto', backgroundColor: '#F3F4F6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <div style={{textAlign: 'center'}}>
                          <FiMaximize2 size={64} color="#9CA3AF" />
                          <p style={{color: '#6B7280', marginTop: '12px', fontSize: '14px'}}>QR Code would be generated here</p>
                        </div>
                      </div>
                      <button 
                        style={{
                          marginTop: '24px',
                          padding: '10px 20px',
                          backgroundColor: '#4F46E5',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          margin: '24px auto 0',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#4338CA';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#4F46E5';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <FiDownload size={16} /> Download QR Code
                      </button>
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
  sessionSelector: {
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
  sessionInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sessionInfoTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 16px 0'
  },
  sessionInfoGrid: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6B7280'
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
  attendanceSection: {
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
  actionsBar: {
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
  qrBtn: {
    padding: '10px 16px',
    backgroundColor: '#EEF2FF',
    border: 'none',
    borderRadius: '8px',
    color: '#4F46E5',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  bulkActions: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    gap: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flexWrap: 'wrap'
  },
  bulkBtn: {
    padding: '10px 20px',
    backgroundColor: '#ECFDF5',
    border: 'none',
    borderRadius: '8px',
    color: '#065F46',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  exportBtn: {
    padding: '10px 20px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    marginLeft: 'auto'
  },
  studentsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  studentCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #F3F4F6',
    transition: 'all 0.2s ease'
  },
  studentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '4px'
  },
  studentActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  markBtn: {
    width: '40px',
    height: '40px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  submitBtn: {
    padding: '14px 32px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '10px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
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
  }
};

export default AttendanceMarking;
