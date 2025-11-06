import React, { useState, useEffect } from 'react';

const HODDashboard = () => {
  const [departmentStats, setDepartmentStats] = useState({
    totalFaculty: 0,
    totalStudents: 0,
    upcomingEvents: 0,
    activeEvents: 0
  });

  useEffect(() => {
    // Fetch department overview
  }, []);

  return (
    <div className="hod-dashboard">
      <h1>HOD Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Faculty</h3>
          <p>{departmentStats.totalFaculty}</p>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{departmentStats.totalStudents}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Events</h3>
          <p>{departmentStats.upcomingEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Active Events</h3>
          <p>{departmentStats.activeEvents}</p>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;
