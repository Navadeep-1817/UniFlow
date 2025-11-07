import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUser, FiCalendar, FiClock, FiLogOut } from 'react-icons/fi';

const TrainerTopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('trainerToken');
    navigate('/trainer/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <div style={styles.logo} onClick={() => navigate('/trainer/dashboard')}>
          <span style={styles.logoText}>UniFlow</span>
          <span style={styles.logoSubtext}>Trainer Portal</span>
        </div>

        <div style={styles.navLinks}>
          <button
            style={{
              ...styles.navLink,
              ...(isActive('/trainer/dashboard') && styles.navLinkActive)
            }}
            onClick={() => navigate('/trainer/dashboard')}
          >
            <FiHome size={18} />
            <span>Dashboard</span>
          </button>

          <button
            style={{
              ...styles.navLink,
              ...(isActive('/trainer/profile') && styles.navLinkActive)
            }}
            onClick={() => navigate('/trainer/profile')}
          >
            <FiUser size={18} />
            <span>Profile</span>
          </button>

          <button
            style={{
              ...styles.navLink,
              ...(isActive('/trainer/events') && styles.navLinkActive)
            }}
            onClick={() => navigate('/trainer/events')}
          >
            <FiCalendar size={18} />
            <span>My Events</span>
          </button>

          <button
            style={{
              ...styles.navLink,
              ...(isActive('/trainer/schedule') && styles.navLinkActive)
            }}
            onClick={() => navigate('/trainer/schedule')}
          >
            <FiClock size={18} />
            <span>Schedule</span>
          </button>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px'
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer'
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#4F46E5',
    lineHeight: 1
  },
  logoSubtext: {
    fontSize: '11px',
    color: '#6B7280',
    marginTop: '2px'
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  navLinkActive: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #DC2626',
    borderRadius: '6px',
    color: '#DC2626',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginLeft: '8px',
    transition: 'all 0.2s'
  }
};

export default TrainerTopNav;
