import React, { useState, useEffect } from 'react';
import HODTopNav from './HODTopNav';
import { 
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiDownload,
  FiFilter,
  FiSearch,
  FiBarChart2,
  FiPieChart,
  FiClock,
  FiAward,
  FiAlertCircle
} from 'react-icons/fi';

const DepartmentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterSection, setFilterSection] = useState('all');
  const [viewMode, setViewMode] = useState('overview'); // overview, academic, events, students
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // TODO: Fetch attendance data from API
    // fetchDepartmentAttendance();
  }, []);

  useEffect(() => {
    let filtered = attendanceData;

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterYear !== 'all') {
      filtered = filtered.filter(s => s.year === filterYear);
    }

    if (filterSection !== 'all') {
      filtered = filtered.filter(s => s.section === filterSection);
    }

    setFilteredData(filtered);
  }, [searchQuery, filterYear, filterSection, attendanceData]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleExport = () => {
    showToast('Attendance report exported successfully!', 'success');
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return { bg: '#D1FAE5', color: '#065F46' };
    if (percentage >= 75) return { bg: '#DBEAFE', color: '#1E40AF' };
    if (percentage >= 60) return { bg: '#FEF3C7', color: '#92400E' };
    return { bg: '#FEE2E2', color: '#991B1B' };
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <FiTrendingUp size={14} color="#10B981" />;
    if (trend === 'down') return <FiTrendingDown size={14} color="#EF4444" />;
    return <FiCheckCircle size={14} color="#6B7280" />;
  };

  // Calculate statistics
  const avgAcademicAttendance = (filteredData.reduce((sum, s) => sum + s.academicAttendance, 0) / filteredData.length || 0).toFixed(1);
  const avgEventAttendance = (filteredData.reduce((sum, s) => sum + s.eventAttendance, 0) / filteredData.length || 0).toFixed(1);
  const avgOverallAttendance = (filteredData.reduce((sum, s) => sum + s.overallAttendance, 0) / filteredData.length || 0).toFixed(1);
  const studentsAbove90 = filteredData.filter(s => s.overallAttendance >= 90).length;
  const studentsBelow75 = filteredData.filter(s => s.overallAttendance < 75).length;

  return (
    <div style={styles.container}>
      <HODTopNav />
      
      {/* Toast */}
      {toast.show && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'success' ? '#10B981' : toast.type === 'error' ? '#EF4444' : '#3B82F6'
        }}>
          {toast.message}
        </div>
      )}

      <div style={styles.content}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Department Attendance</h1>
            <p style={styles.pageSubtitle}>Comprehensive attendance reports for academic and event participation</p>
          </div>
          <button 
            onClick={handleExport}
            style={styles.exportBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FiDownload size={18} /> Export Report
          </button>
        </div>

        {/* Statistics Cards */}
        <div style={styles.statsSection}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
              <div style={{...styles.statIcon, backgroundColor: '#EEF2FF'}}>
                <FiUsers size={24} color="#4F46E5" />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{filteredData.length}</div>
                <div style={styles.statLabel}>Total Students</div>
              </div>
            </div>
            <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
              <div style={{...styles.statIcon, backgroundColor: '#D1FAE5'}}>
                <FiBarChart2 size={24} color="#10B981" />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{avgAcademicAttendance}%</div>
                <div style={styles.statLabel}>Academic Attendance</div>
              </div>
            </div>
            <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
              <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
                <FiCalendar size={24} color="#F59E0B" />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{avgEventAttendance}%</div>
                <div style={styles.statLabel}>Event Attendance</div>
              </div>
            </div>
            <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
              <div style={{...styles.statIcon, backgroundColor: '#DBEAFE'}}>
                <FiTrendingUp size={24} color="#3B82F6" />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{avgOverallAttendance}%</div>
                <div style={styles.statLabel}>Overall Average</div>
              </div>
            </div>
            <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
              <div style={{...styles.statIcon, backgroundColor: '#D1FAE5'}}>
                <FiCheckCircle size={24} color="#10B981" />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{studentsAbove90}</div>
                <div style={styles.statLabel}>Above 90%</div>
              </div>
            </div>
            <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
              <div style={{...styles.statIcon, backgroundColor: '#FEE2E2'}}>
                <FiAlertCircle size={24} color="#EF4444" />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{studentsBelow75}</div>
                <div style={styles.statLabel}>Below 75%</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div style={styles.tabsSection}>
          <div style={styles.tabs}>
            {[
              { id: 'overview', label: 'Overview', icon: <FiPieChart size={16} /> },
              { id: 'academic', label: 'Academic', icon: <FiBarChart2 size={16} /> },
              { id: 'events', label: 'Events', icon: <FiCalendar size={16} /> },
              { id: 'students', label: 'Students', icon: <FiUsers size={16} /> }
            ].map(tab => (
              <button key={tab.id} onClick={() => setViewMode(tab.id)} style={{ ...styles.tab, backgroundColor: viewMode === tab.id ? '#4F46E5' : '#FFFFFF', color: viewMode === tab.id ? '#FFFFFF' : '#6B7280', border: viewMode === tab.id ? 'none' : '1px solid #E5E7EB' }} onMouseEnter={(e) => { if (viewMode !== tab.id) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; } }} onMouseLeave={(e) => { if (viewMode !== tab.id) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersBar}>
          <div style={styles.searchBox}>
            <FiSearch size={18} color="#6B7280" />
            <input type="text" placeholder="Search by name or student ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.filterGroup}>
            <FiFilter size={16} color="#6B7280" />
            <span style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>Year:</span>
            <div style={styles.filterButtons}>
              {['all', '1', '2', '3', '4'].map(year => (
                <button key={year} onClick={() => setFilterYear(year)} style={{ ...styles.filterBtn, backgroundColor: filterYear === year ? '#4F46E5' : '#FFFFFF', color: filterYear === year ? '#FFFFFF' : '#6B7280', border: filterYear === year ? 'none' : '1px solid #E5E7EB' }} onMouseEnter={(e) => { if (filterYear !== year) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; } }} onMouseLeave={(e) => { if (filterYear !== year) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                  {year === 'all' ? 'All' : `${year}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'}`}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.filterGroup}>
            <span style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>Section:</span>
            <div style={styles.filterButtons}>
              {['all', 'A', 'B', 'C'].map(section => (
                <button key={section} onClick={() => setFilterSection(section)} style={{ ...styles.filterBtn, backgroundColor: filterSection === section ? '#4F46E5' : '#FFFFFF', color: filterSection === section ? '#FFFFFF' : '#6B7280', border: filterSection === section ? 'none' : '1px solid #E5E7EB' }} onMouseEnter={(e) => { if (filterSection !== section) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; } }} onMouseLeave={(e) => { if (filterSection !== section) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                  {section === 'all' ? 'All' : section}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        <div style={styles.dataSection}>
          {viewMode === 'students' && (
            <div style={styles.tableContainer}>
              <h3 style={styles.sectionTitle}>Student-wise Attendance ({filteredData.length})</h3>
              {filteredData.length === 0 ? (
                <div style={styles.emptyState}>
                  <FiUsers size={48} color="#9CA3AF" />
                  <p>No data found</p>
                </div>
              ) : (
                <div style={{overflowX: 'auto'}}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeaderRow}>
                        <th style={styles.tableHeader}>Student ID</th>
                        <th style={styles.tableHeader}>Name</th>
                        <th style={styles.tableHeader}>Year/Section</th>
                        <th style={styles.tableHeader}>Academic</th>
                        <th style={styles.tableHeader}>Events</th>
                        <th style={styles.tableHeader}>Overall</th>
                        <th style={styles.tableHeader}>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map(student => {
                        const academicColor = getAttendanceColor(student.academicAttendance);
                        const eventColor = getAttendanceColor(student.eventAttendance);
                        const overallColor = getAttendanceColor(student.overallAttendance);
                        return (
                          <tr key={student.id} style={styles.tableRow}>
                            <td style={styles.tableCell}>
                              <span style={{fontWeight: '600', color: '#4F46E5'}}>{student.studentId}</span>
                            </td>
                            <td style={styles.tableCell}>
                              <span style={{fontWeight: '600', color: '#1F2937'}}>{student.name}</span>
                            </td>
                            <td style={styles.tableCell}>{student.year}{student.year === '1' ? 'st' : student.year === '2' ? 'nd' : student.year === '3' ? 'rd' : 'th'} Year / {student.section}</td>
                            <td style={styles.tableCell}>
                              <div style={styles.attendanceCell}>
                                <span style={{...styles.attendanceBadge, backgroundColor: academicColor.bg, color: academicColor.color}}>
                                  {student.academicAttendance}%
                                </span>
                                <span style={styles.attendanceDetail}>{student.classesAttended}/{student.totalClasses}</span>
                              </div>
                            </td>
                            <td style={styles.tableCell}>
                              <div style={styles.attendanceCell}>
                                <span style={{...styles.attendanceBadge, backgroundColor: eventColor.bg, color: eventColor.color}}>
                                  {student.eventAttendance}%
                                </span>
                                <span style={styles.attendanceDetail}>{student.eventsAttended}/{student.totalEvents}</span>
                              </div>
                            </td>
                            <td style={styles.tableCell}>
                              <span style={{...styles.attendanceBadge, backgroundColor: overallColor.bg, color: overallColor.color}}>
                                {student.overallAttendance}%
                              </span>
                            </td>
                            <td style={styles.tableCell}>
                              <div style={styles.trendCell}>
                                {getTrendIcon(student.academicTrend)}
                                {getTrendIcon(student.eventTrend)}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {viewMode === 'overview' && (
            <div style={styles.overviewGrid}>
              <div style={styles.overviewCard}>
                <h3 style={styles.cardTitle}><FiBarChart2 size={18} /> Attendance Distribution</h3>
                <div style={styles.distributionList}>
                  <div style={styles.distributionItem}>
                    <div style={styles.distributionLabel}>
                      <div style={{...styles.colorDot, backgroundColor: '#10B981'}}></div>
                      <span>90% and above</span>
                    </div>
                    <div style={styles.distributionValue}>{studentsAbove90} students</div>
                  </div>
                  <div style={styles.distributionItem}>
                    <div style={styles.distributionLabel}>
                      <div style={{...styles.colorDot, backgroundColor: '#3B82F6'}}></div>
                      <span>75% - 89%</span>
                    </div>
                    <div style={styles.distributionValue}>{filteredData.filter(s => s.overallAttendance >= 75 && s.overallAttendance < 90).length} students</div>
                  </div>
                  <div style={styles.distributionItem}>
                    <div style={styles.distributionLabel}>
                      <div style={{...styles.colorDot, backgroundColor: '#F59E0B'}}></div>
                      <span>60% - 74%</span>
                    </div>
                    <div style={styles.distributionValue}>{filteredData.filter(s => s.overallAttendance >= 60 && s.overallAttendance < 75).length} students</div>
                  </div>
                  <div style={styles.distributionItem}>
                    <div style={styles.distributionLabel}>
                      <div style={{...styles.colorDot, backgroundColor: '#EF4444'}}></div>
                      <span>Below 60%</span>
                    </div>
                    <div style={styles.distributionValue}>{filteredData.filter(s => s.overallAttendance < 60).length} students</div>
                  </div>
                </div>
              </div>
              <div style={styles.overviewCard}>
                <h3 style={styles.cardTitle}><FiAward size={18} /> Top Performers</h3>
                <div style={styles.topPerformersList}>
                  {filteredData.sort((a, b) => b.overallAttendance - a.overallAttendance).slice(0, 5).map((student, index) => (
                    <div key={student.id} style={styles.performerItem}>
                      <div style={styles.performerRank}>#{index + 1}</div>
                      <div style={styles.performerInfo}>
                        <div style={styles.performerName}>{student.name}</div>
                        <div style={styles.performerId}>{student.studentId}</div>
                      </div>
                      <div style={{...styles.attendanceBadge, ...getAttendanceColor(student.overallAttendance)}}>
                        {student.overallAttendance}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'academic' && (
            <div style={styles.tableContainer}>
              <h3 style={styles.sectionTitle}>Academic Attendance Report</h3>
              <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.tableHeader}>Student ID</th>
                      <th style={styles.tableHeader}>Name</th>
                      <th style={styles.tableHeader}>Classes Attended</th>
                      <th style={styles.tableHeader}>Total Classes</th>
                      <th style={styles.tableHeader}>Percentage</th>
                      <th style={styles.tableHeader}>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map(student => {
                      const color = getAttendanceColor(student.academicAttendance);
                      return (
                        <tr key={student.id} style={styles.tableRow}>
                          <td style={styles.tableCell}><span style={{fontWeight: '600', color: '#4F46E5'}}>{student.studentId}</span></td>
                          <td style={styles.tableCell}><span style={{fontWeight: '600'}}>{student.name}</span></td>
                          <td style={styles.tableCell}>{student.classesAttended}</td>
                          <td style={styles.tableCell}>{student.totalClasses}</td>
                          <td style={styles.tableCell}>
                            <span style={{...styles.attendanceBadge, backgroundColor: color.bg, color: color.color}}>
                              {student.academicAttendance}%
                            </span>
                          </td>
                          <td style={styles.tableCell}>{getTrendIcon(student.academicTrend)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {viewMode === 'events' && (
            <div style={styles.tableContainer}>
              <h3 style={styles.sectionTitle}>Event Participation Report</h3>
              <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.tableHeader}>Student ID</th>
                      <th style={styles.tableHeader}>Name</th>
                      <th style={styles.tableHeader}>Events Attended</th>
                      <th style={styles.tableHeader}>Total Events</th>
                      <th style={styles.tableHeader}>Percentage</th>
                      <th style={styles.tableHeader}>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map(student => {
                      const color = getAttendanceColor(student.eventAttendance);
                      return (
                        <tr key={student.id} style={styles.tableRow}>
                          <td style={styles.tableCell}><span style={{fontWeight: '600', color: '#4F46E5'}}>{student.studentId}</span></td>
                          <td style={styles.tableCell}><span style={{fontWeight: '600'}}>{student.name}</span></td>
                          <td style={styles.tableCell}>{student.eventsAttended}</td>
                          <td style={styles.tableCell}>{student.totalEvents}</td>
                          <td style={styles.tableCell}>
                            <span style={{...styles.attendanceBadge, backgroundColor: color.bg, color: color.color}}>
                              {student.eventAttendance}%
                            </span>
                          </td>
                          <td style={styles.tableCell}>{getTrendIcon(student.eventTrend)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
  content: {
    padding: '24px',
    maxWidth: '1400px',
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
  exportBtn: {
    padding: '12px 24px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '10px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)'
  },
  statsSection: {
    marginBottom: '24px'
  },
  tabsSection: {
    marginBottom: '24px'
  },
  filtersBar: {
    marginBottom: '24px'
  },
  dataSection: {
    marginBottom: '24px'
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
    gap: '16px'
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  statIcon: {
    padding: '12px',
    borderRadius: '10px',
    flexShrink: 0
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6B7280'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  tab: {
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  filtersBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center'
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
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '20px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6B7280'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderRow: {
    backgroundColor: '#F9FAFB',
    borderBottom: '2px solid #E5E7EB'
  },
  tableHeader: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableRow: {
    borderBottom: '1px solid #F3F4F6',
    transition: 'background-color 0.2s ease'
  },
  tableCell: {
    padding: '16px',
    fontSize: '14px',
    color: '#374151'
  },
  attendanceCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  attendanceBadge: {
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    width: 'fit-content'
  },
  attendanceDetail: {
    fontSize: '12px',
    color: '#9CA3AF'
  },
  trendCell: {
    display: 'flex',
    gap: '8px'
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  distributionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  distributionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px'
  },
  distributionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500'
  },
  colorDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  },
  distributionValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1F2937'
  },
  topPerformersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  performerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px'
  },
  performerRank: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#4F46E5',
    minWidth: '40px'
  },
  performerInfo: {
    flex: 1
  },
  performerName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '2px'
  },
  performerId: {
    fontSize: '12px',
    color: '#6B7280'
  }
};

export default DepartmentAttendance;
