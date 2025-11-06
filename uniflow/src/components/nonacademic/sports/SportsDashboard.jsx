import React, { useState, useEffect } from 'react';

const SportsDashboard = () => {
  const [sportsStats, setSportsStats] = useState({
    totalEvents: 0,
    activeTeams: 0,
    upcomingMatches: 0,
    totalAthletes: 0
  });

  useEffect(() => {
    // Fetch sports events overview
  }, []);

  return (
    <div className="sports-dashboard">
      <h1>Sports Department Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p>{sportsStats.totalEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Active Teams</h3>
          <p>{sportsStats.activeTeams}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Matches</h3>
          <p>{sportsStats.upcomingMatches}</p>
        </div>
        <div className="stat-card">
          <h3>Total Athletes</h3>
          <p>{sportsStats.totalAthletes}</p>
        </div>
      </div>
    </div>
  );
};

export default SportsDashboard;
