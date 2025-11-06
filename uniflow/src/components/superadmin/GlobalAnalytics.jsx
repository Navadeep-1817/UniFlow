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
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>University-wise User Distribution</h3>
            <div style={{padding: '40px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '8px'}}>
              <p style={{color: '#6B7280'}}>📊 Chart visualization coming soon</p>
              <p style={{color: '#9CA3AF', fontSize: '12px'}}>University comparison data</p>
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Event Trends</h3>
            <div style={{padding: '40px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '8px'}}>
              <p style={{color: '#6B7280'}}>📈 Chart visualization coming soon</p>
              <p style={{color: '#9CA3AF', fontSize: '12px'}}>Monthly event statistics</p>
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>User Growth Over Time</h3>
            <div style={{padding: '40px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '8px'}}>
              <p style={{color: '#6B7280'}}>📉 Chart visualization coming soon</p>
              <p style={{color: '#9CA3AF', fontSize: '12px'}}>User registration trends</p>
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Department-wise Analytics</h3>
            <div style={{padding: '40px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '8px'}}>
              <p style={{color: '#6B7280'}}>🎯 Chart visualization coming soon</p>
              <p style={{color: '#9CA3AF', fontSize: '12px'}}>Department performance metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalAnalytics;
