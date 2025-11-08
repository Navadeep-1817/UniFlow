import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiMapPin, FiUsers, FiTrendingUp, FiFileText, FiAward, FiUser, FiLogOut } from 'react-icons/fi';

const SportsTopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      sessionStorage.clear();
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/sports/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/sports/event-management', label: 'Events', icon: FiCalendar },
    { path: '/sports/venue-booking', label: 'Venues', icon: FiMapPin },
    { path: '/sports/team-selection', label: 'Teams', icon: FiUsers },
    { path: '/sports/fixture-scheduling', label: 'Fixtures', icon: FiFileText },
    { path: '/sports/results-management', label: 'Results', icon: FiTrendingUp },
    { path: '/sports/athletics-report', label: 'Reports', icon: FiAward },
    { path: '/sports/profile', label: 'Profile', icon: FiUser }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
      {/* Top Bar with Logo and Logout */}
      <div style={{padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <div style={{fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            UniFlow Sports
          </div>
          <div style={{padding: '6px 12px', backgroundColor: '#F0FDF4', color: '#065F46', borderRadius: '6px', fontSize: '13px', fontWeight: '600'}}>
            Sports Administrator
          </div>
        </div>
        
        <button onClick={handleLogout} style={{padding: '10px 20px', backgroundColor: 'white', color: '#EF4444', border: '2px solid #EF4444', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s'}} onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#EF4444'; e.currentTarget.style.color = 'white';}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#EF4444';}}>
          <FiLogOut size={16} /> Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{padding: '0 40px', display: 'flex', gap: '4px', overflowX: 'auto', whiteSpace: 'nowrap'}}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: active ? '3px solid #4F46E5' : '3px solid transparent', fontSize: '13px', fontWeight: '600', color: active ? '#4F46E5' : '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'}} onMouseEnter={(e) => {if (!active) {e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.borderBottomColor = '#4F46E5';}}} onMouseLeave={(e) => {if (!active) {e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderBottomColor = 'transparent';}}}>
              <Icon size={16} /> {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SportsTopNav;
