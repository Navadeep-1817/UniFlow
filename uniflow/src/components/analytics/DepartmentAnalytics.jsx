import React, { useState, useEffect } from 'react';

const DepartmentAnalytics = () => {
  const [departmentData, setDepartmentData] = useState({});

  useEffect(() => {
    // Fetch department-wise reports
  }, []);

  return (
    <div className="department-analytics">
      <h2>Department Analytics</h2>
      <select>
        <option>Computer Science</option>
        <option>Electronics</option>
        <option>Mechanical</option>
      </select>
      <div className="department-metrics">
        <div className="metric">
          <h3>Events Conducted</h3>
          <p>85</p>
        </div>
        <div className="metric">
          <h3>Faculty Participation</h3>
          <p>95%</p>
        </div>
        <div className="metric">
          <h3>Student Engagement</h3>
          <p>88%</p>
        </div>
        <div className="metric">
          <h3>Budget Utilization</h3>
          <p>78%</p>
        </div>
      </div>
      <div className="performance-charts">
        <h3>Performance Trends</h3>
        {/* Charts */}
      </div>
    </div>
  );
};

export default DepartmentAnalytics;
