import React, { useState, useEffect } from 'react';

const TeamPerformanceReview = () => {
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    // Fetch team performance data
  }, []);

  return (
    <div className="team-performance-review">
      <h2>Team Performance Review</h2>
      <div className="performance-metrics">
        <div className="metric-card">
          <h3>Events Conducted</h3>
          <p>24</p>
        </div>
        <div className="metric-card">
          <h3>Success Rate</h3>
          <p>92%</p>
        </div>
        <div className="metric-card">
          <h3>Participant Satisfaction</h3>
          <p>4.5/5</p>
        </div>
        <div className="metric-card">
          <h3>Budget Efficiency</h3>
          <p>88%</p>
        </div>
      </div>
      <h3>Monthly Performance</h3>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Events</th>
            <th>Attendance</th>
            <th>Budget Used</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {performanceData.map(data => (
            <tr key={data.id}>
              <td>{data.month}</td>
              <td>{data.events}</td>
              <td>{data.attendance}</td>
              <td>₹{data.budgetUsed}</td>
              <td>{data.rating}/5</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamPerformanceReview;
