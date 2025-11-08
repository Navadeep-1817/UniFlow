import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import SportsTopNav from './SportsTopNav';
import { FiUsers, FiCalendar, FiTrendingUp, FiAward } from 'react-icons/fi';

const SportsDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [sportsCoordinatorInfo, setSportsCoordinatorInfo] = useState({
    name: '',
    employeeId: '',
    university: ''
  });
  
  const [sportsStats, setSportsStats] = useState({
    totalEvents: 0,
    activeTeams: 0,
    upcomingMatches: 0,
    totalAthletes: 0
  });

  useEffect(() => {
    // Load Sports Coordinator data from user context
    if (user) {
      setSportsCoordinatorInfo({
        name: user.name || 'Sports Coordinator',
        employeeId: user.employeeId || 'N/A',
        university: user.university?.name || user.university || 'N/A'
      });
    }
  }, [user]);

  useEffect(() => {
    // Fetch real data from API
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // TODO: Implement backend API endpoints
        // GET /api/sports/stats
        // GET /api/sports/events
        // GET /api/sports/teams
        console.log('Sports Dashboard ready for API integration');
      } catch (error) {
        console.error('Error fetching Sports dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'system-ui'}}>
      <SportsTopNav />

      {/* Dashboard Content */}
      <div style={{padding: '40px'}}>
        <div style={{marginBottom: '32px'}}>
          <h1 style={{fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 8px 0'}}>Sports Dashboard</h1>
          <p style={{fontSize: '16px', color: '#6B7280', margin: 0}}>Welcome back, {sportsCoordinatorInfo.name}!</p>
        </div>
        {/* Stats Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px'}}>
          <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
              <div style={{padding: '12px', backgroundColor: '#EFF6FF', borderRadius: '12px'}}>
                <FiCalendar size={24} color="#1E40AF" />
              </div>
            </div>
            <h3 style={{fontSize: '32px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0'}}>{sportsStats.totalEvents}</h3>
            <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>Total Events</p>
          </div>

          <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
              <div style={{padding: '12px', backgroundColor: '#F0FDF4', borderRadius: '12px'}}>
                <FiUsers size={24} color="#065F46" />
              </div>
            </div>
            <h3 style={{fontSize: '32px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0'}}>{sportsStats.activeTeams}</h3>
            <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>Active Teams</p>
          </div>

          <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
              <div style={{padding: '12px', backgroundColor: '#FEF3C7', borderRadius: '12px'}}>
                <FiTrendingUp size={24} color="#92400E" />
              </div>
            </div>
            <h3 style={{fontSize: '32px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0'}}>{sportsStats.upcomingMatches}</h3>
            <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>Upcoming Matches</p>
          </div>

          <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
              <div style={{padding: '12px', backgroundColor: '#FCE7F3', borderRadius: '12px'}}>
                <FiAward size={24} color="#9F1239" />
              </div>
            </div>
            <h3 style={{fontSize: '32px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 4px 0'}}>{sportsStats.totalAthletes}</h3>
            <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>Total Athletes</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', marginBottom: '32px'}}>
          <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '20px'}}>Quick Actions</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
            <button onClick={() => navigate('/sports/event-management')} style={{padding: '16px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left'}}>
              Create New Event
            </button>
            <button onClick={() => navigate('/sports/venue-booking')} style={{padding: '16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left'}}>
              Book Venue
            </button>
            <button onClick={() => navigate('/sports/team-selection')} style={{padding: '16px', backgroundColor: '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left'}}>
              Select Team
            </button>
            <button onClick={() => navigate('/sports/results-management')} style={{padding: '16px', backgroundColor: '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left'}}>
              Add Results
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB'}}>
          <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '20px'}}>Recent Activity</h2>
          <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>
            <p>No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsDashboard;
