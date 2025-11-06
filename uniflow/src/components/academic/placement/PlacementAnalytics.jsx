import React, { useState, useEffect } from 'react';

const PlacementAnalytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Fetch year-wise placement trends
  }, [selectedYear]);

  return (
    <div className="placement-analytics">
      <h2>Placement Analytics</h2>
      <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
      </select>
      <div className="analytics-grid">
        <div className="metric-card">
          <h3>Placement Percentage</h3>
          <p>85%</p>
        </div>
        <div className="metric-card">
          <h3>Highest Package</h3>
          <p>₹45 LPA</p>
        </div>
        <div className="metric-card">
          <h3>Average Package</h3>
          <p>₹8.5 LPA</p>
        </div>
        <div className="metric-card">
          <h3>Total Companies</h3>
          <p>120</p>
        </div>
      </div>
      <div className="charts-section">
        {/* Add trend charts */}
      </div>
    </div>
  );
};

export default PlacementAnalytics;
