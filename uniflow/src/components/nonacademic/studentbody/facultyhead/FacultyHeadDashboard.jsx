import React, { useState, useEffect } from 'react';

const FacultyHeadDashboard = () => {
  const [bodyStats, setBodyStats] = useState({
    totalMembers: 0,
    activeEvents: 0,
    pendingApprovals: 0,
    budgetUtilized: 0
  });

  useEffect(() => {
    // Fetch student body overview
  }, []);

  return (
    <div className="faculty-head-dashboard">
      <h1>Student Body Faculty Head Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Members</h3>
          <p>{bodyStats.totalMembers}</p>
        </div>
        <div className="stat-card">
          <h3>Active Events</h3>
          <p>{bodyStats.activeEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <p>{bodyStats.pendingApprovals}</p>
        </div>
        <div className="stat-card">
          <h3>Budget Utilized</h3>
          <p>₹{bodyStats.budgetUtilized}</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyHeadDashboard;
