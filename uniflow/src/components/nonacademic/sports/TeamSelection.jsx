import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SportsTopNav from './SportsTopNav';
import { FiUsers, FiSearch, FiUserPlus, FiUserX, FiAward, FiFilter, FiSave, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

const TeamSelection = () => {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterPosition, setFilterPosition] = useState('all');
  const [teamName, setTeamName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(15);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // TODO: Fetch sports and players from API
    // fetchSports();
  }, []);

  useEffect(() => {
    if (selectedSport) {
      // TODO: Fetch players for selected sport
      // fetchPlayersForSport(selectedSport);
    }
  }, [selectedSport]);

  useEffect(() => {
    let filtered = players;

    if (searchQuery) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterYear !== 'all') {
      filtered = filtered.filter(player => player.year === filterYear);
    }

    if (filterPosition !== 'all') {
      filtered = filtered.filter(player => player.position === filterPosition);
    }

    setFilteredPlayers(filtered);
  }, [players, searchQuery, filterYear, filterPosition]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSelectPlayer = (player) => {
    if (selectedPlayers.length >= maxPlayers) {
      showToast(`Maximum ${maxPlayers} players allowed`, 'error');
      return;
    }
    
    if (!selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers([...selectedPlayers, player]);
      showToast(`${player.name} added to team`);
    }
  };

  const handleRemovePlayer = (playerId) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
    showToast('Player removed from team');
  };

  const handleSaveTeam = async () => {
    if (!teamName) {
      showToast('Please enter team name', 'error');
      return;
    }
    
    if (selectedPlayers.length === 0) {
      showToast('Please select at least one player', 'error');
      return;
    }

    try {
      // TODO: API call to save team
      showToast('Team saved successfully!');
    } catch (error) {
      showToast('Failed to save team', 'error');
    }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'system-ui'}}>
      {toast.show && (
        <div style={{position: 'fixed', top: '20px', right: '20px', backgroundColor: toast.type === 'error' ? '#EF4444' : '#10B981', color: 'white', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 2000}}>
          {toast.message}
        </div>
      )}

      <SportsTopNav />

      {/* Page Header */}
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '20px 40px'}}>
        <div>
          <h1 style={{fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0}}>Team Selection</h1>
          <p style={{fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0'}}>Select players and create sports teams</p>
        </div>
      </div>

      <div style={{padding: '40px'}}>
        {/* Sport Selection and Team Info */}
        <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #E5E7EB'}}>
          <h2 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px'}}>Team Configuration</h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px'}}>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Sport *</label>
              <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white'}}>
                <option value="">Select Sport</option>
                {sports.map(sport => (
                  <option key={sport.id} value={sport.id}>{sport.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Team Name *</label>
              <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} placeholder="e.g., University Cricket Team" />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Max Players *</label>
              <input type="number" value={maxPlayers} onChange={(e) => setMaxPlayers(parseInt(e.target.value))} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} min="1" max="30" />
            </div>
          </div>
        </div>

        {selectedSport && (
          <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px'}}>
            {/* Available Players */}
            <div style={{backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden'}}>
              <div style={{padding: '20px', borderBottom: '1px solid #E5E7EB'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                  <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: 0}}>Available Players</h3>
                  <span style={{fontSize: '14px', color: '#6B7280'}}>{filteredPlayers.length} players</span>
                </div>

                {/* Filters */}
                <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                  <div style={{flex: 1, minWidth: '200px', position: 'relative'}}>
                    <FiSearch size={18} color="#9CA3AF" style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
                    <input type="text" placeholder="Search by name or roll number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{width: '100%', padding: '8px 8px 8px 36px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} />
                  </div>
                  
                  <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} style={{padding: '8px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white'}}>
                    <option value="all">All Years</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>

                  <select value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)} style={{padding: '8px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white'}}>
                    <option value="all">All Positions</option>
                    <option value="forward">Forward</option>
                    <option value="midfielder">Midfielder</option>
                    <option value="defender">Defender</option>
                    <option value="goalkeeper">Goalkeeper</option>
                  </select>
                </div>
              </div>

              <div style={{maxHeight: '600px', overflowY: 'auto'}}>
                {filteredPlayers.length === 0 ? (
                  <div style={{padding: '40px', textAlign: 'center'}}>
                    <FiUsers size={48} color="#9CA3AF" style={{margin: '0 auto 16px'}} />
                    <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>No players found</p>
                  </div>
                ) : (
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead style={{position: 'sticky', top: 0, backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB'}}>
                      <tr>
                        <th style={{padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280'}}>Roll No</th>
                        <th style={{padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280'}}>Name</th>
                        <th style={{padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280'}}>Year</th>
                        <th style={{padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280'}}>Position</th>
                        <th style={{padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6B7280'}}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlayers.map((player, index) => {
                        const isSelected = selectedPlayers.find(p => p.id === player.id);
                        
                        return (
                          <tr key={player.id} style={{borderBottom: '1px solid #E5E7EB', backgroundColor: isSelected ? '#F0FDF4' : 'white'}}>
                            <td style={{padding: '12px 16px', fontSize: '14px', color: '#1F2937', fontWeight: '500'}}>{player.rollNo}</td>
                            <td style={{padding: '12px 16px', fontSize: '14px', color: '#1F2937'}}>{player.name}</td>
                            <td style={{padding: '12px 16px', fontSize: '14px', color: '#6B7280'}}>{player.year} Year</td>
                            <td style={{padding: '12px 16px'}}>
                              <span style={{padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', backgroundColor: '#EFF6FF', color: '#1E40AF'}}>
                                {player.position}
                              </span>
                            </td>
                            <td style={{padding: '12px 16px', textAlign: 'center'}}>
                              {isSelected ? (
                                <button disabled style={{padding: '6px 12px', backgroundColor: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto'}}>
                                  <FiCheckCircle size={14} /> Selected
                                </button>
                              ) : (
                                <button onClick={() => handleSelectPlayer(player)} style={{padding: '6px 12px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto'}}>
                                  <FiUserPlus size={14} /> Add
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Selected Team */}
            <div style={{backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', position: 'sticky', top: '20px', height: 'fit-content'}}>
              <div style={{padding: '20px', borderBottom: '1px solid #E5E7EB', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: 'white', margin: '0 0 8px 0'}}>Selected Team</h3>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: '14px', color: 'rgba(255,255,255,0.9)'}}>{selectedPlayers.length} / {maxPlayers} players</span>
                  <div style={{width: '100px', height: '8px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden'}}>
                    <div style={{width: `${(selectedPlayers.length / maxPlayers) * 100}%`, height: '100%', backgroundColor: 'white', transition: 'width 0.3s'}} />
                  </div>
                </div>
              </div>

              <div style={{padding: '20px', maxHeight: '500px', overflowY: 'auto'}}>
                {selectedPlayers.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '40px 20px'}}>
                    <FiUsers size={48} color="#9CA3AF" style={{margin: '0 auto 16px'}} />
                    <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>No players selected yet</p>
                    <p style={{fontSize: '13px', color: '#9CA3AF', margin: '8px 0 0 0'}}>Select players from the left panel</p>
                  </div>
                ) : (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    {selectedPlayers.map((player, index) => (
                      <div key={player.id} style={{padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{flex: 1}}>
                          <div style={{fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '4px'}}>
                            {index + 1}. {player.name}
                          </div>
                          <div style={{fontSize: '12px', color: '#6B7280'}}>
                            {player.rollNo} • {player.year} Year • {player.position}
                          </div>
                        </div>
                        <button onClick={() => handleRemovePlayer(player.id)} style={{padding: '6px', backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>
                          <FiUserX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedPlayers.length > 0 && (
                <div style={{padding: '20px', borderTop: '1px solid #E5E7EB'}}>
                  <button onClick={handleSaveTeam} style={{width: '100%', padding: '12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                    <FiSave size={16} /> Save Team
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedSport && (
          <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', border: '2px dashed #E5E7EB'}}>
            <FiUsers size={64} color="#9CA3AF" style={{margin: '0 auto 20px'}} />
            <h3 style={{fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: '0 0 12px 0'}}>Select a Sport to Begin</h3>
            <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>Choose a sport from the configuration above to start selecting players</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSelection;
