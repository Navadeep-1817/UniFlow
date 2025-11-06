import React, { useState, useEffect } from 'react';

const StudentPerformanceReport = () => {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    // Fetch individual student analytics
  }, []);

  return (
    <div className="student-performance-report">
      <h2>Student Performance Report</h2>
      <div className="search-student">
        <input type="text" placeholder="Search by Roll No or Name" />
        <button>Search</button>
      </div>
      <div className="performance-overview">
        <div className="metric">
          <h3>Events Participated</h3>
          <p>25</p>
        </div>
        <div className="metric">
          <h3>Overall Attendance</h3>
          <p>88%</p>
        </div>
        <div className="metric">
          <h3>Certificates Earned</h3>
          <p>18</p>
        </div>
        <div className="metric">
          <h3>Engagement Score</h3>
          <p>85/100</p>
        </div>
      </div>
      <div className="event-participation">
        <h3>Event Participation History</h3>
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Type</th>
              <th>Date</th>
              <th>Attendance</th>
              <th>Feedback Given</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.type}</td>
                <td>{event.date}</td>
                <td>{event.attendance}%</td>
                <td>{event.feedbackGiven ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPerformanceReport;
