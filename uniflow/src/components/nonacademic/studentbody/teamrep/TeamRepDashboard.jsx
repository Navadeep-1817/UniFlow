import React, { useState, useEffect } from 'react';

const TeamRepDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: 0,
    pendingApprovals: 0,
    activeMembers: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    // Fetch personal team dashboard data
  }, []);

  return (
    <div className="team-rep-dashboard">
      <h1>Team Representative Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p>{dashboardStats.totalEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <p>{dashboardStats.pendingApprovals}</p>
        </div>
        <div className="stat-card">
          <h3>Active Members</h3>
          <p>{dashboardStats.activeMembers}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Events</h3>
          <p>{dashboardStats.upcomingEvents}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamRepDashboard;
