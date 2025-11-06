import React, { useState, useEffect } from 'react';

const FacultyDashboard = () => {
  const [schedule, setSchedule] = useState([]);
  const [stats, setStats] = useState({
    assignedEvents: 0,
    upcomingSessions: 0,
    totalStudents: 0
  });

  useEffect(() => {
    // Fetch personal schedule and assigned events
  }, []);

  return (
    <div className="faculty-dashboard">
      <h1>Faculty Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Assigned Events</h3>
          <p>{stats.assignedEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Sessions</h3>
          <p>{stats.upcomingSessions}</p>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{stats.totalStudents}</p>
        </div>
      </div>
      <div className="today-schedule">
        <h2>Today's Schedule</h2>
        {schedule.map(session => (
          <div key={session.id} className="session-card">
            <h3>{session.eventName}</h3>
            <p>Time: {session.time}</p>
            <p>Venue: {session.venue}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyDashboard;
