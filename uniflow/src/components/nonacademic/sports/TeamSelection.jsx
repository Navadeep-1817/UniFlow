import React, { useState, useEffect } from 'react';

const TeamSelection = () => {
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const handleSelectPlayer = (playerId) => {
    console.log('Selecting player:', playerId);
    // Select players for teams
  };

  return (
    <div className="team-selection">
      <h2>Team Selection</h2>
      <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
        <option value="">Select Sport</option>
        {sports.map(sport => (
          <option key={sport.id} value={sport.id}>{sport.name}</option>
        ))}
      </select>
      {selectedSport && (
        <div className="selection-interface">
          <div className="available-players">
            <h3>Available Players</h3>
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Year</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map(player => (
                  <tr key={player.id}>
                    <td>{player.rollNo}</td>
                    <td>{player.name}</td>
                    <td>{player.year}</td>
                    <td>{player.position}</td>
                    <td>
                      <button onClick={() => handleSelectPlayer(player.id)}>
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="selected-team">
            <h3>Selected Team</h3>
            {/* Display selected players */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSelection;
