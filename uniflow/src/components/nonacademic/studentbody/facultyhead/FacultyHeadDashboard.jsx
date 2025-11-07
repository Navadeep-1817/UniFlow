import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import FacultyHeadTopNav from './FacultyHeadTopNav';

const FacultyHeadDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [facultyHeadInfo, setFacultyHeadInfo] = useState({
    name: '',
    employeeId: '',
    studentBody: '',
    university: ''
  });
  
  const [bodyStats, setBodyStats] = useState({
    totalMembers: 0,
    activeEvents: 0,
    pendingApprovals: 0,
    budgetUtilized: 0
  });

  useEffect(() => {
    // Load Faculty Head data from user context
    if (user) {
      setFacultyHeadInfo({
        name: user.name || 'Faculty Head',
        employeeId: user.employeeId || 'N/A',
        studentBody: user.studentBody?.name || user.studentBody || 'N/A',
        university: user.university?.name || user.university || 'N/A'
      });
    }
  }, [user]);

  useEffect(() => {
    // Fetch real data from API
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // TODO: Implement backend API endpoints
        // GET /api/facultyhead/stats
        // GET /api/facultyhead/members
        // GET /api/facultyhead/events
        console.log('Faculty Head Dashboard ready for API integration');
      } catch (error) {
        console.error('Error fetching Faculty Head dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <FacultyHeadTopNav />
      <div style={styles.container}>
        <h1 style={styles.title}>Student Body Faculty Head Dashboard</h1>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Total Members</h3>
            <p style={styles.statValue}>{bodyStats.totalMembers}</p>
            <p style={styles.statSubtext}>Active team members</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Active Events</h3>
            <p style={styles.statValue}>{bodyStats.activeEvents}</p>
            <p style={styles.statSubtext}>Ongoing activities</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Pending Approvals</h3>
            <p style={styles.statValue}>{bodyStats.pendingApprovals}</p>
            <p style={styles.statSubtext}>Requires your attention</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Budget Utilized</h3>
            <p style={styles.statValue}>₹{bodyStats.budgetUtilized.toLocaleString()}</p>
            <p style={styles.statSubtext}>Out of ₹500,000</p>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#F9FAFB',
    minHeight: 'calc(100vh - 73px)'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '24px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  statTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: '4px'
  },
  statSubtext: {
    fontSize: '12px',
    color: '#9CA3AF'
  }
};

export default FacultyHeadDashboard;
