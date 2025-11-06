import React, { useState } from 'react';

const ComparativeAnalytics = () => {
  const [comparisonType, setComparisonType] = useState('departments');

  return (
    <div className="comparative-analytics">
      <h2>Comparative Analytics</h2>
      <div className="comparison-selector">
        <button onClick={() => setComparisonType('departments')}>
          Compare Departments
        </button>
        <button onClick={() => setComparisonType('bodies')}>
          Compare Student Bodies
        </button>
        <button onClick={() => setComparisonType('events')}>
          Compare Events
        </button>
      </div>
      <div className="comparison-view">
        {comparisonType === 'departments' && (
          <div className="department-comparison">
            <h3>Department Comparison</h3>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Events</th>
                  <th>Attendance</th>
                  <th>Feedback</th>
                  <th>Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {/* Comparison data */}
              </tbody>
            </table>
          </div>
        )}
        {comparisonType === 'bodies' && (
          <div className="bodies-comparison">
            <h3>Student Bodies Comparison</h3>
            {/* Comparison charts and data */}
          </div>
        )}
        {comparisonType === 'events' && (
          <div className="events-comparison">
            <h3>Events Comparison</h3>
            {/* Comparison charts and data */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparativeAnalytics;
