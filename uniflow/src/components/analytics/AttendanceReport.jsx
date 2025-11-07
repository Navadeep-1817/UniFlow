import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiTrendingUp, FiCalendar, FiDownload, FiFilter, FiBarChart2, FiPieChart, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const AttendanceReport = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('superadmin'); // 'superadmin' or 'facultyhead'
  const [filters, setFilters] = useState({
    department: 'all',
    eventType: 'all',
    dateRange: 'month',
    startDate: '',
    endDate: ''
  });
  const [viewMode, setViewMode] = useState('summary'); // 'summary', 'trends', 'detailed'

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('userRole') || 'superadmin';
    setUserRole(role.toLowerCase());
  }, []);

  // Mock data - Replace with API calls
  const summaryStats = {
    overall: { percentage: 87, total: 2450, present: 2132, absent: 318 },
    academic: { percentage: 92, total: 1200, present: 1104, absent: 96 },
    nonAcademic: { percentage: 82, total: 1250, present: 1025, absent: 225 },
    sports: { percentage: 85, total: 450, present: 383, absent: 67 }
  };

  const departmentData = [
    { name: 'Computer Science', attendance: 92, total: 650, present: 598, color: '#4F46E5' },
    { name: 'Mechanical', attendance: 88, total: 520, present: 458, color: '#10B981' },
    { name: 'Civil', attendance: 85, total: 480, present: 408, color: '#F59E0B' },
    { name: 'Electrical', attendance: 90, total: 550, present: 495, color: '#EF4444' },
    { name: 'Electronics', attendance: 84, total: 250, present: 210, color: '#8B5CF6' }
  ];

  const monthlyTrends = [
    { month: 'Jan', attendance: 85 },
    { month: 'Feb', attendance: 88 },
    { month: 'Mar', attendance: 87 },
    { month: 'Apr', attendance: 90 },
    { month: 'May', attendance: 89 },
    { month: 'Jun', attendance: 92 }
  ];

  const detailedData = [
    { id: 1, event: 'Tech Fest 2024', date: '2024-06-15', department: 'Computer Science', registered: 450, present: 425, percentage: 94 },
    { id: 2, event: 'Sports Day', date: '2024-06-10', department: 'All', registered: 800, present: 680, percentage: 85 },
    { id: 3, event: 'Workshop on AI', date: '2024-06-08', department: 'Computer Science', registered: 120, present: 115, percentage: 96 },
    { id: 4, event: 'Cultural Fest', date: '2024-06-05', department: 'All', registered: 650, present: 520, percentage: 80 },
    { id: 5, event: 'Hackathon', date: '2024-06-01', department: 'Computer Science', registered: 85, present: 82, percentage: 96 }
  ];

  const handleExport = () => {
    console.log('Exporting attendance report...');
    // Implement export functionality
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #E5E7EB',
      padding: '20px 40px'
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1F2937',
      margin: 0
    },
    subtitle: {
      fontSize: '14px',
      color: '#6B7280',
      margin: '4px 0 0 0'
    },
    content: {
      padding: '32px 40px'
    },
    filterBar: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      flex: '1',
      minWidth: '180px'
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151'
    },
    select: {
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      outline: 'none',
      cursor: 'pointer'
    },
    input: {
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      outline: 'none'
    },
    button: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      backgroundColor: '#4F46E5',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s'
    },
    secondaryButton: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#4F46E5',
      backgroundColor: 'white',
      border: '2px solid #4F46E5',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: '1px solid #E5E7EB'
    },
    statHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    statTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#6B7280',
      margin: 0
    },
    statIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1F2937',
      margin: '0 0 8px 0'
    },
    statSubtext: {
      fontSize: '13px',
      color: '#6B7280',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    chartCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: '1px solid #E5E7EB',
      marginBottom: '24px'
    },
    chartTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white'
    },
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '13px',
      fontWeight: '600',
      color: '#6B7280',
      borderBottom: '2px solid #E5E7EB',
      backgroundColor: '#F9FAFB'
    },
    td: {
      padding: '16px',
      fontSize: '14px',
      color: '#374151',
      borderBottom: '1px solid #E5E7EB'
    },
    badge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block'
    },
    progressBar: {
      height: '8px',
      backgroundColor: '#E5E7EB',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '8px'
    }
  };

  const getAttendanceBadge = (percentage) => {
    if (percentage >= 90) return { bg: '#D1FAE5', color: '#065F46', text: 'Excellent' };
    if (percentage >= 75) return { bg: '#DBEAFE', color: '#1E40AF', text: 'Good' };
    if (percentage >= 60) return { bg: '#FEF3C7', color: '#92400E', text: 'Average' };
    return { bg: '#FEE2E2', color: '#991B1B', text: 'Poor' };
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Attendance Report & Analytics</h1>
            <p style={styles.subtitle}>
              {userRole === 'superadmin' ? 'All Departments' : 'Department Level'} - Comprehensive attendance tracking and insights
            </p>
          </div>
          <button style={styles.button} onClick={handleExport}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338CA'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}>
            <FiDownload size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Filters */}
        <div style={styles.filterBar}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Department</label>
            <select style={styles.select} value={filters.department} 
              onChange={(e) => setFilters({...filters, department: e.target.value})}>
              <option value="all">All Departments</option>
              <option value="cs">Computer Science</option>
              <option value="mech">Mechanical</option>
              <option value="civil">Civil</option>
              <option value="eee">Electrical</option>
              <option value="ece">Electronics</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Event Type</label>
            <select style={styles.select} value={filters.eventType}
              onChange={(e) => setFilters({...filters, eventType: e.target.value})}>
              <option value="all">All Events</option>
              <option value="academic">Academic</option>
              <option value="nonacademic">Non-Academic</option>
              <option value="sports">Sports</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.label}>Date Range</label>
            <select style={styles.select} value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <button style={styles.secondaryButton}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#EEF2FF'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
            <FiFilter size={16} />
            Apply Filters
          </button>
        </div>

        {/* Summary Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Overall Attendance</h3>
              <div style={{...styles.statIcon, backgroundColor: '#EEF2FF'}}>
                <FiUsers size={20} color="#4F46E5" />
              </div>
            </div>
            <h2 style={styles.statValue}>{summaryStats.overall.percentage}%</h2>
            <p style={styles.statSubtext}>
              <FiCheckCircle size={14} color="#10B981" />
              {summaryStats.overall.present} present / {summaryStats.overall.total} total
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Academic Events</h3>
              <div style={{...styles.statIcon, backgroundColor: '#D1FAE5'}}>
                <FiBarChart2 size={20} color="#10B981" />
              </div>
            </div>
            <h2 style={styles.statValue}>{summaryStats.academic.percentage}%</h2>
            <p style={styles.statSubtext}>
              <FiCheckCircle size={14} color="#10B981" />
              {summaryStats.academic.present} present / {summaryStats.academic.total} total
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Non-Academic Events</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
                <FiPieChart size={20} color="#F59E0B" />
              </div>
            </div>
            <h2 style={styles.statValue}>{summaryStats.nonAcademic.percentage}%</h2>
            <p style={styles.statSubtext}>
              <FiCheckCircle size={14} color="#10B981" />
              {summaryStats.nonAcademic.present} present / {summaryStats.nonAcademic.total} total
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Sports Events</h3>
              <div style={{...styles.statIcon, backgroundColor: '#DBEAFE'}}>
                <FiTrendingUp size={20} color="#3B82F6" />
              </div>
            </div>
            <h2 style={styles.statValue}>{summaryStats.sports.percentage}%</h2>
            <p style={styles.statSubtext}>
              <FiCheckCircle size={14} color="#10B981" />
              {summaryStats.sports.present} present / {summaryStats.sports.total} total
            </p>
          </div>
        </div>

        {/* Department-wise Attendance */}
        {userRole === 'superadmin' && (
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Department-wise Attendance</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              {departmentData.map((dept, i) => {
                const badge = getAttendanceBadge(dept.attendance);
                return (
                  <div key={i}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                      <div>
                        <span style={{fontSize: '15px', fontWeight: '600', color: '#374151'}}>{dept.name}</span>
                        <span style={{fontSize: '13px', color: '#6B7280', marginLeft: '12px'}}>
                          {dept.present}/{dept.total} students
                        </span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <span style={{...styles.badge, backgroundColor: badge.bg, color: badge.color}}>
                          {badge.text}
                        </span>
                        <span style={{fontSize: '18px', fontWeight: '700', color: dept.color}}>
                          {dept.attendance}%
                        </span>
                      </div>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={{height: '100%', width: `${dept.attendance}%`, backgroundColor: dept.color, transition: 'width 0.3s'}}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Monthly Trends */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Monthly Attendance Trends</h3>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', gap: '12px'}}>
            {monthlyTrends.map((data, i) => {
              const height = data.attendance;
              return (
                <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                  <div style={{fontSize: '13px', fontWeight: '600', color: '#4F46E5'}}>{data.attendance}%</div>
                  <div style={{width: '100%', height: `${height}%`, backgroundColor: '#4F46E5', borderRadius: '4px 4px 0 0', transition: 'height 0.3s'}}></div>
                  <div style={{fontSize: '13px', color: '#6B7280', fontWeight: '500'}}>{data.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Report Table */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Detailed Event-wise Report</h3>
          <div style={{overflowX: 'auto'}}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Event Name</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Registered</th>
                  <th style={styles.th}>Present</th>
                  <th style={styles.th}>Absent</th>
                  <th style={styles.th}>Attendance %</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {detailedData.map((record) => {
                  const badge = getAttendanceBadge(record.percentage);
                  const absent = record.registered - record.present;
                  return (
                    <tr key={record.id}>
                      <td style={styles.td}><strong>{record.event}</strong></td>
                      <td style={styles.td}>{record.date}</td>
                      <td style={styles.td}>{record.department}</td>
                      <td style={styles.td}>{record.registered}</td>
                      <td style={styles.td}>
                        <span style={{color: '#10B981', fontWeight: '600'}}>{record.present}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{color: '#EF4444', fontWeight: '600'}}>{absent}</span>
                      </td>
                      <td style={styles.td}>
                        <strong style={{color: record.percentage >= 85 ? '#10B981' : '#F59E0B'}}>
                          {record.percentage}%
                        </strong>
                      </td>
                      <td style={styles.td}>
                        <span style={{...styles.badge, backgroundColor: badge.bg, color: badge.color}}>
                          {badge.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
