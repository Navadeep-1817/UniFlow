import React, { useState, useEffect } from 'react';
import FacultyHeadTopNav from './FacultyHeadTopNav';

const FacultyHeadDashboard = () => {
  const [bodyStats, setBodyStats] = useState({
    totalMembers: 45,
    activeEvents: 8,
    pendingApprovals: 3,
    budgetUtilized: 125000
  });

  useEffect(() => {
    // Fetch student body overview
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
