import React, { useState, useEffect } from 'react';

const AthleticsReport = () => {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);

  useEffect(() => {
    // Fetch performance tracking data
  }, []);

  return (
    <div className="athletics-report">
      <h2>Athletics Performance Report</h2>
      <div className="overview-stats">
        <div className="stat-card">
          <h3>Total Athletes</h3>
          <p>150</p>
        </div>
        <div className="stat-card">
          <h3>Medals Won</h3>
          <p>45</p>
        </div>
        <div className="stat-card">
          <h3>Tournaments Participated</h3>
          <p>20</p>
        </div>
      </div>
      <div className="athletes-table">
        <h3>Athlete Performance</h3>
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Sport</th>
              <th>Events Participated</th>
              <th>Medals</th>
              <th>Best Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map(athlete => (
              <tr key={athlete.id}>
                <td>{athlete.rollNo}</td>
                <td>{athlete.name}</td>
                <td>{athlete.sport}</td>
                <td>{athlete.eventsCount}</td>
                <td>{athlete.medals}</td>
                <td>{athlete.bestPerformance}</td>
                <td>
                  <button onClick={() => setSelectedAthlete(athlete)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedAthlete && (
        <div className="athlete-details">
          <h3>{selectedAthlete.name} - Detailed Report</h3>
          {/* Display detailed performance analytics */}
        </div>
      )}
    </div>
  );
};

export default AthleticsReport;
