import React, { useState, useEffect } from 'react';

const ResultsManagement = () => {
  const [matches, setMatches] = useState([]);

  const handleRecordResult = (matchId, resultData) => {
    console.log('Recording result for match:', matchId, resultData);
    // Record match results
  };

  return (
    <div className="results-management">
      <h2>Results Management</h2>
      <div className="matches-list">
        {matches.map(match => (
          <div key={match.id} className="match-card">
            <h3>Match {match.matchNo}</h3>
            <div className="teams">
              <div className="team">{match.team1}</div>
              <div className="vs">VS</div>
              <div className="team">{match.team2}</div>
            </div>
            <p>Date: {match.date}</p>
            <p>Venue: {match.venue}</p>
            {match.status === 'completed' ? (
              <div className="result">
                <p>Winner: {match.winner}</p>
                <p>Score: {match.score}</p>
                <button>Edit Result</button>
              </div>
            ) : (
              <div className="record-result">
                <input type="text" placeholder="Winner" />
                <input type="text" placeholder="Score" />
                <button onClick={() => handleRecordResult(match.id)}>
                  Record Result
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsManagement;
