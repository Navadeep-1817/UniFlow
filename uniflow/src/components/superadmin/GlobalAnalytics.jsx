import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GlobalAnalytics = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState({
    totalUniversities: 4,
    totalStudents: 2450,
    totalFaculty: 387,
    totalEvents: 156,
    activeEvents: 23
  });

  const universityData = [
    { name: 'MIT University', students: 850, faculty: 120, color: '#4F46E5' },
    { name: 'Stanford College', students: 620, faculty: 95, color: '#10B981' },
    { name: 'Harvard Institute', students: 540, faculty: 87, color: '#F59E0B' },
    { name: 'Oxford Academy', students: 440, faculty: 85, color: '#EF4444' }
  ];

  const eventTrends = [
    { month: 'Jan', events: 12 },
    { month: 'Feb', events: 18 },
    { month: 'Mar', events: 15 },
    { month: 'Apr', events: 22 },
    { month: 'May', events: 28 },
    { month: 'Jun', events: 25 }
  ];

  const userGrowth = [
    { month: 'Jan', users: 1850 },
    { month: 'Feb', users: 2050 },
    { month: 'Mar', users: 2250 },
    { month: 'Apr', users: 2450 },
    { month: 'May', users: 2650 },
    { month: 'Jun', users: 2837 }
  ];

  const departmentData = [
    { name: 'Computer Science', events: 45, color: '#4F46E5' },
    { name: 'Mechanical', events: 32, color: '#10B981' },
    { name: 'Civil', events: 28, color: '#F59E0B' },
    { name: 'Electrical', events: 35, color: '#EF4444' },
    { name: 'Electronics', events: 16, color: '#8B5CF6' }
  ];

  useEffect(() => {
    // Fetch cross-university analytics - mock data for now
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
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
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1F2937',
      margin: 0
    },
    logoutBtn: {
      padding: '10px 20px',
      backgroundColor: 'white',
      color: '#4F46E5',
      border: '2px solid #4F46E5',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    content: {
      padding: '40px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '40px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#4F46E5',
      margin: '8px 0'
    },
    statLabel: {
      fontSize: '14px',
      color: '#6B7280',
      margin: 0
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px'
    },
    chartCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    chartTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '20px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>UniFlow</div>
          <h1 style={styles.title}>Super Admin - Global Analytics</h1>
        </div>
        <button 
          style={styles.logoutBtn}
          onClick={handleLogout}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#4F46E5';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.color = '#4F46E5';
          }}
        >
          Logout
        </button>
      </div>

      {/* Top Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 40px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => navigate('/superadmin/dashboard')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#4F46E5';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
          }}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => navigate('/superadmin/approval-queue')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#4F46E5';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
          }}
        >
          ✓ Approval Queue
        </button>
        <button
          onClick={() => navigate('/superadmin/global-analytics')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid #4F46E5',
            fontSize: '14px',
            fontWeight: '600',
            color: '#4F46E5',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          📈 Global Analytics
        </button>
        <button
          onClick={() => navigate('/superadmin/event-calendar')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#4F46E5';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
          }}
        >
          📅 Event Calendar
        </button>
        <button
          onClick={() => navigate('/superadmin/user-management')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#4F46E5';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
          }}
        >
          👥 User Management
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Universities</p>
            <h2 style={styles.statNumber}>{analyticsData.totalUniversities}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Students</p>
            <h2 style={styles.statNumber}>{analyticsData.totalStudents}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Faculty</p>
            <h2 style={styles.statNumber}>{analyticsData.totalFaculty}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Events</p>
            <h2 style={styles.statNumber}>{analyticsData.totalEvents}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Active Events</p>
            <h2 style={styles.statNumber}>{analyticsData.activeEvents}</h2>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={styles.chartsGrid}>
          {/* University Distribution */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>University-wise User Distribution</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              {universityData.map((uni, i) => (
                <div key={i}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <span style={{fontSize: '14px', fontWeight: '500', color: '#374151'}}>{uni.name}</span>
                    <span style={{fontSize: '14px', fontWeight: '600', color: uni.color}}>{uni.students} students</span>
                  </div>
                  <div style={{height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden'}}>
                    <div style={{height: '100%', backgroundColor: uni.color, width: `${(uni.students / 850) * 100}%`, transition: 'width 0.3s'}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Trends */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Event Trends</h3>
            <div style={{position: 'relative', height: '220px', paddingTop: '20px'}}>
              <svg width="100%" height="200" style={{overflow: 'visible'}}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((y, i) => (
                  <line key={i} x1="0" y1={200 - (y * 2)} x2="100%" y2={200 - (y * 2)} stroke="#E5E7EB" strokeWidth="1" />
                ))}
                
                {/* Line path */}
                <polyline
                  points={eventTrends.map((data, i) => {
                    const x = (i / (eventTrends.length - 1)) * 100;
                    const maxEvents = Math.max(...eventTrends.map(e => e.events));
                    const y = 200 - ((data.events / maxEvents) * 180);
                    return `${x}%,${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {eventTrends.map((data, i) => {
                  const x = (i / (eventTrends.length - 1)) * 100;
                  const maxEvents = Math.max(...eventTrends.map(e => e.events));
                  const y = 200 - ((data.events / maxEvents) * 180);
                  return (
                    <g key={i}>
                      <circle cx={`${x}%`} cy={y} r="5" fill="#4F46E5" stroke="white" strokeWidth="2" />
                      <text x={`${x}%`} y={y - 12} textAnchor="middle" fontSize="12" fontWeight="600" fill="#4F46E5">{data.events}</text>
                    </g>
                  );
                })}
              </svg>
              
              {/* X-axis labels */}
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px'}}>
                {eventTrends.map((data, i) => (
                  <div key={i} style={{fontSize: '12px', color: '#6B7280', fontWeight: '500', textAlign: 'center', flex: 1}}>{data.month}</div>
                ))}
              </div>
            </div>
          </div>

          {/* User Growth */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>User Growth Over Time</h3>
            <div style={{position: 'relative', height: '220px', paddingTop: '20px'}}>
              <svg width="100%" height="200" style={{overflow: 'visible'}}>
                {/* Grid lines */}
                {[0, 500, 1000, 1500, 2000, 2500, 3000].map((value, i) => {
                  const y = 200 - ((value / 3000) * 180);
                  return <line key={i} x1="0" y1={y} x2="100%" y2={y} stroke="#E5E7EB" strokeWidth="1" />;
                })}
                
                {/* Area fill */}
                <defs>
                  <linearGradient id="userGrowthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                
                <polygon
                  points={`0,200 ${userGrowth.map((data, i) => {
                    const x = (i / (userGrowth.length - 1)) * 100;
                    const maxUsers = Math.max(...userGrowth.map(u => u.users));
                    const y = 200 - ((data.users / maxUsers) * 180);
                    return `${x}%,${y}`;
                  }).join(' ')} 100%,200`}
                  fill="url(#userGrowthGradient)"
                />
                
                {/* Line path */}
                <polyline
                  points={userGrowth.map((data, i) => {
                    const x = (i / (userGrowth.length - 1)) * 100;
                    const maxUsers = Math.max(...userGrowth.map(u => u.users));
                    const y = 200 - ((data.users / maxUsers) * 180);
                    return `${x}%,${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {userGrowth.map((data, i) => {
                  const x = (i / (userGrowth.length - 1)) * 100;
                  const maxUsers = Math.max(...userGrowth.map(u => u.users));
                  const y = 200 - ((data.users / maxUsers) * 180);
                  return (
                    <g key={i}>
                      <circle cx={`${x}%`} cy={y} r="5" fill="#10B981" stroke="white" strokeWidth="2" />
                      <text x={`${x}%`} y={y - 12} textAnchor="middle" fontSize="11" fontWeight="600" fill="#10B981">{data.users}</text>
                    </g>
                  );
                })}
              </svg>
              
              {/* X-axis labels */}
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px'}}>
                {userGrowth.map((data, i) => (
                  <div key={i} style={{fontSize: '12px', color: '#6B7280', fontWeight: '500', textAlign: 'center', flex: 1}}>{data.month}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Analytics */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Department-wise Analytics</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {departmentData.map((dept, i) => {
                const maxEvents = Math.max(...departmentData.map(d => d.events));
                const width = (dept.events / maxEvents) * 100;
                return (
                  <div key={i}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                      <span style={{fontSize: '13px', fontWeight: '500', color: '#374151'}}>{dept.name}</span>
                      <span style={{fontSize: '13px', fontWeight: '600', color: dept.color}}>{dept.events} events</span>
                    </div>
                    <div style={{height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden'}}>
                      <div style={{height: '100%', backgroundColor: dept.color, width: `${width}%`, transition: 'width 0.3s'}}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalAnalytics;
