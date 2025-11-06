import React, { useState, useEffect } from 'react';

const TPDashboard = () => {
  const [placementStats, setPlacementStats] = useState({
    totalDrives: 0,
    totalRegistrations: 0,
    totalOffers: 0,
    averagePackage: 0
  });

  useEffect(() => {
    // Fetch placement overview
  }, []);

  return (
    <div className="tp-dashboard">
      <h1>Training & Placement Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Drives</h3>
          <p>{placementStats.totalDrives}</p>
        </div>
        <div className="stat-card">
          <h3>Total Registrations</h3>
          <p>{placementStats.totalRegistrations}</p>
        </div>
        <div className="stat-card">
          <h3>Total Offers</h3>
          <p>{placementStats.totalOffers}</p>
        </div>
        <div className="stat-card">
          <h3>Average Package</h3>
          <p>₹{placementStats.averagePackage} LPA</p>
        </div>
      </div>
    </div>
  );
};

export default TPDashboard;
