import React, { useState, useEffect } from 'react';

const StudentBodyAnalytics = () => {
  const [bodyAnalytics, setBodyAnalytics] = useState({});

  useEffect(() => {
    // Fetch SAC/E-Cell/NSS activity reports
  }, []);

  return (
    <div className="student-body-analytics">
      <h2>Student Body Analytics</h2>
      <select>
        <option>SAC</option>
        <option>E-Cell</option>
        <option>NSS</option>
        <option>NCC</option>
      </select>
      <div className="body-stats">
        <div className="stat">
          <h3>Total Members</h3>
          <p>150</p>
        </div>
        <div className="stat">
          <h3>Events Organized</h3>
          <p>32</p>
        </div>
        <div className="stat">
          <h3>Total Participants</h3>
          <p>2,500</p>
        </div>
        <div className="stat">
          <h3>Average Rating</h3>
          <p>4.5/5</p>
        </div>
      </div>
      <div className="activity-timeline">
        <h3>Activity Timeline</h3>
        {/* Timeline visualization */}
      </div>
    </div>
  );
};

export default StudentBodyAnalytics;
