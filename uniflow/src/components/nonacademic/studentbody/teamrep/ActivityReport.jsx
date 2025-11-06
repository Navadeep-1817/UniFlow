import React, { useState, useEffect } from 'react';

const ActivityReport = () => {
  const [reports, setReports] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const handleSubmitReport = (reportData) => {
    console.log('Submitting activity report:', reportData);
    // Submit monthly activity reports
  };

  return (
    <div className="activity-report">
      <h2>Activity Reports</h2>
      <div className="report-form">
        <h3>Submit Monthly Report</h3>
        <select value={currentMonth} onChange={(e) => setCurrentMonth(e.target.value)}>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          {/* Add all months */}
        </select>
        <textarea placeholder="Events Conducted"></textarea>
        <textarea placeholder="Achievements"></textarea>
        <textarea placeholder="Challenges Faced"></textarea>
        <textarea placeholder="Future Plans"></textarea>
        <button onClick={handleSubmitReport}>Submit Report</button>
      </div>
      <div className="previous-reports">
        <h3>Previous Reports</h3>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Events</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.month}</td>
                <td>{report.eventsCount}</td>
                <td>{report.status}</td>
                <td><button>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityReport;
