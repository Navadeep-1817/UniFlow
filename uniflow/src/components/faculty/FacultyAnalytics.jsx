import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiCalendar, 
  FiCheckCircle, 
  FiAward,
  FiTarget,
  FiUsers,
  FiClock,
  FiDownload,
  FiArrowLeft,
  FiPieChart,
  FiBook,
  FiFileText,
  FiStar
} from 'react-icons/fi';

const FacultyAnalytics = () => {
  const navigate = useNavigate();

  // Mock data for faculty
  const stats = {
    assignedEvents: 18,
    studentsManaged: 245,
    sessionsCompleted: 42,
    attendanceMarked: 38,
    materialsUploaded: 25,
    averageFeedback: 4.6
  };

  const eventTypeData = [
    { type: 'Workshops', count: 8, percentage: 44, color: '#4F46E5' },
    { type: 'Seminars', count: 5, percentage: 28, color: '#10B981' },
    { type: 'Technical', count: 3, percentage: 17, color: '#F59E0B' },
    { type: 'Training', count: 2, percentage: 11, color: '#8B5CF6' }
  ];

  const monthlySessionData = [
    { month: 'Jan', sessions: 5 },
    { month: 'Feb', sessions: 8 },
    { month: 'Mar', sessions: 6 },
    { month: 'Apr', sessions: 10 },
    { month: 'May', sessions: 7 },
    { month: 'Jun', sessions: 9 }
  ];

  const performanceMetrics = [
    { label: 'Session Completion Rate', value: 93, color: '#4F46E5' },
    { label: 'Student Engagement', value: 87, color: '#10B981' },
    { label: 'Material Quality', value: 91, color: '#F59E0B' },
    { label: 'Feedback Rating', value: 92, color: '#EF4444' }
  ];

  const attendanceTrend = [
    { week: 'Week 1', rate: 85 },
    { week: 'Week 2', rate: 88 },
    { week: 'Week 3', rate: 90 },
    { week: 'Week 4', rate: 87 },
    { week: 'Week 5', rate: 92 },
    { week: 'Week 6', rate: 89 }
  ];

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
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: 'transparent',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      transition: 'all 0.3s'
    },
    title: {
      fontSize: '28px',
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
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #E5E7EB'
    },
    statHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
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
    statChange: {
      fontSize: '13px',
      color: '#10B981',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    chartCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #E5E7EB'
    },
    chartTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Faculty Analytics Dashboard</h1>
            <p style={styles.subtitle}>Comprehensive overview of your teaching activities and performance</p>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
            <button 
              style={styles.backButton}
              onClick={() => navigate('/faculty/dashboard')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <FiArrowLeft size={16} /> Back to Dashboard
            </button>
            <button 
              style={{...styles.backButton, backgroundColor: '#4F46E5', color: 'white', border: 'none'}}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338CA'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}>
              <FiDownload size={16} /> Export Report
            </button>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Summary Stats */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px'}}>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Assigned Events</h3>
              <div style={{...styles.statIcon, backgroundColor: '#EEF2FF'}}>
                <FiCalendar size={20} color="#4F46E5" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.assignedEvents}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> +3 this month
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Students Managed</h3>
              <div style={{...styles.statIcon, backgroundColor: '#D1FAE5'}}>
                <FiUsers size={20} color="#10B981" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.studentsManaged}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Active learners
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Sessions Completed</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
                <FiCheckCircle size={20} color="#F59E0B" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.sessionsCompleted}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> {stats.sessionsCompleted} total
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Materials Uploaded</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FCE7F3'}}>
                <FiBook size={20} color="#EC4899" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.materialsUploaded}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Resources shared
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Attendance Marked</h3>
              <div style={{...styles.statIcon, backgroundColor: '#DBEAFE'}}>
                <FiFileText size={20} color="#3B82F6" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.attendanceMarked}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Sessions recorded
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Avg Feedback</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
                <FiStar size={20} color="#F59E0B" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.averageFeedback}/5</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Excellent rating
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '32px'}}>
          
          {/* Event Type Distribution */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiPieChart size={18} /> Event Type Distribution
            </h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '32px'}}>
              {/* Donut Chart */}
              <div style={{position: 'relative', width: '180px', height: '180px'}}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#F3F4F6" strokeWidth="28" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#4F46E5" strokeWidth="28" 
                    strokeDasharray="193 440" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#10B981" strokeWidth="28" 
                    strokeDasharray="123 440" strokeDashoffset="-193" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#F59E0B" strokeWidth="28" 
                    strokeDasharray="75 440" strokeDashoffset="-316" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#8B5CF6" strokeWidth="28" 
                    strokeDasharray="48 440" strokeDashoffset="-391" transform="rotate(-90 90 90)" />
                  <text x="90" y="85" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1F2937">{stats.assignedEvents}</text>
                  <text x="90" y="105" textAnchor="middle" fontSize="12" fill="#6B7280">Events</text>
                </svg>
              </div>
              {/* Legend */}
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {eventTypeData.map((item, i) => (
                  <div key={i}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color}}></div>
                        <span style={{fontSize: '14px', color: '#374151', fontWeight: '500'}}>{item.type}</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '14px', fontWeight: '600', color: '#1F2937'}}>{item.count}</span>
                        <span style={{fontSize: '12px', color: '#6B7280'}}>({item.percentage}%)</span>
                      </div>
                    </div>
                    <div style={{height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden'}}>
                      <div style={{height: '100%', width: `${item.percentage}%`, backgroundColor: item.color}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Sessions - Bar Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiBarChart2 size={18} /> Monthly Sessions Conducted
            </h3>
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '220px', gap: '12px', padding: '0 20px'}}>
              {monthlySessionData.map((data, i) => {
                const maxValue = Math.max(...monthlySessionData.map(d => d.sessions));
                const height = (data.sessions / maxValue) * 100;
                return (
                  <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                    <div style={{fontSize: '13px', fontWeight: '600', color: '#10B981'}}>{data.sessions}</div>
                    <div 
                      style={{
                        width: '100%', 
                        maxWidth: '50px',
                        height: `${height}%`, 
                        backgroundColor: '#10B981', 
                        borderRadius: '6px 6px 0 0', 
                        transition: 'all 0.3s',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
                    ></div>
                    <div style={{fontSize: '12px', color: '#6B7280', fontWeight: '500'}}>{data.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Second Row Charts */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px'}}>
          
          {/* Attendance Trend - Line Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiTrendingUp size={18} /> Weekly Attendance Trend
            </h3>
            <div style={{position: 'relative', height: '220px', paddingTop: '20px'}}>
              <svg width="100%" height="200" style={{overflow: 'visible'}}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((y, i) => (
                  <line key={i} x1="0" y1={200 - (y * 2)} x2="100%" y2={200 - (y * 2)} stroke="#E5E7EB" strokeWidth="1" />
                ))}
                
                {/* Area fill */}
                <defs>
                  <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                
                <polygon
                  points={`0,200 ${attendanceTrend.map((data, i) => {
                    const x = (i / (attendanceTrend.length - 1)) * 100;
                    const y = 200 - ((data.rate / 100) * 180);
                    return `${x}%,${y}`;
                  }).join(' ')} 100%,200`}
                  fill="url(#attendanceGradient)"
                />
                
                {/* Line path */}
                <polyline
                  points={attendanceTrend.map((data, i) => {
                    const x = (i / (attendanceTrend.length - 1)) * 100;
                    const y = 200 - ((data.rate / 100) * 180);
                    return `${x}%,${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {attendanceTrend.map((data, i) => {
                  const x = (i / (attendanceTrend.length - 1)) * 100;
                  const y = 200 - ((data.rate / 100) * 180);
                  return (
                    <g key={i}>
                      <circle cx={`${x}%`} cy={y} r="5" fill="#4F46E5" stroke="white" strokeWidth="2" />
                      <text x={`${x}%`} y={y - 12} textAnchor="middle" fontSize="12" fontWeight="600" fill="#4F46E5">{data.rate}%</text>
                    </g>
                  );
                })}
              </svg>
              
              {/* X-axis labels */}
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px'}}>
                {attendanceTrend.map((data, i) => (
                  <div key={i} style={{fontSize: '12px', color: '#6B7280', fontWeight: '500', textAlign: 'center', flex: 1}}>{data.week}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiTarget size={18} /> Performance Metrics
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0'}}>
              {performanceMetrics.map((metric, i) => (
                <div key={i}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <span style={{fontSize: '14px', color: '#374151', fontWeight: '500'}}>{metric.label}</span>
                    <span style={{fontSize: '16px', fontWeight: '700', color: metric.color}}>{metric.value}%</span>
                  </div>
                  <div style={{height: '12px', backgroundColor: '#E5E7EB', borderRadius: '6px', overflow: 'hidden'}}>
                    <div 
                      style={{
                        height: '100%', 
                        width: `${metric.value}%`, 
                        backgroundColor: metric.color, 
                        transition: 'width 0.5s ease',
                        borderRadius: '6px'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAnalytics;
