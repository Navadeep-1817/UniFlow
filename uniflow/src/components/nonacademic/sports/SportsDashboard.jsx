import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiAward, FiTrendingUp, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';

const SportsDashboard = () => {
  const navigate = useNavigate();
  const [sportsStats, setSportsStats] = useState({
    totalEvents: 0,
    activeTeams: 0,
    upcomingMatches: 0,
    totalAthletes: 0
  });

  useEffect(() => {
    // Fetch sports events overview
  }, []);

  return (
    <div className="sports-dashboard">
      {/* Top Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 40px',
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        <button onClick={() => navigate('/sports/dashboard')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid #4F46E5', fontSize: '13px', fontWeight: '600', color: '#4F46E5', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px'}}><FiHome size={16} /> Dashboard</button>
        <button onClick={() => navigate('/sports/athletics-report')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiAward size={14} /> Athletics Report</button>
        <button onClick={() => navigate('/sports/results-management')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiTrendingUp size={14} /> Results Management</button>
        <button onClick={() => navigate('/sports/event-management')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiCalendar size={14} /> Event Management</button>
        <button onClick={() => navigate('/sports/venue-booking')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiMapPin size={14} /> Venue Booking</button>
        <button onClick={() => navigate('/sports/team-selection')} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '3px solid transparent', fontSize: '13px', fontWeight: '600', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseOver={(e) => { e.target.style.color = '#4F46E5'; e.target.style.borderBottomColor = '#4F46E5'; }} onMouseOut={(e) => { e.target.style.color = '#6B7280'; e.target.style.borderBottomColor = 'transparent'; }}><FiUsers size={14} /> Team Selection</button>
      </div>

      <h1>Sports Department Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p>{sportsStats.totalEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Active Teams</h3>
          <p>{sportsStats.activeTeams}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Matches</h3>
          <p>{sportsStats.upcomingMatches}</p>
        </div>
        <div className="stat-card">
          <h3>Total Athletes</h3>
          <p>{sportsStats.totalAthletes}</p>
        </div>
      </div>
    </div>
  );
};

export default SportsDashboard;
