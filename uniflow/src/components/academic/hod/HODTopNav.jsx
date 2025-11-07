import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome,
  FiUsers,
  FiCalendar,
  FiGrid,
  FiMapPin,
  FiAward,
  FiBarChart,
  FiCheckCircle,
  FiSettings,
  FiClock,
  FiUserCheck,
  FiLogOut,
  FiBookOpen
} from 'react-icons/fi';

const HODTopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { path: '/hod/dashboard', label: 'Dashboard', icon: <FiHome size={16} /> },
    { path: '/hod/faculty', label: 'Faculty', icon: <FiUsers size={16} /> },
    { path: '/hod/students', label: 'Students', icon: <FiUserCheck size={16} /> },
    { path: '/hod/events', label: 'Events', icon: <FiCalendar size={16} /> },
    { path: '/hod/allocation', label: 'Allocation', icon: <FiGrid size={16} /> },
    { path: '/hod/trainers', label: 'Trainers', icon: <FiAward size={16} /> },
    { path: '/hod/analytics', label: 'Analytics', icon: <FiBarChart size={16} /> },
    { path: '/hod/attendance', label: 'Attendance', icon: <FiCheckCircle size={16} /> }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.header}>
      <div style={styles.logo}>
        <FiBookOpen size={28} />
        UniFlow HOD
      </div>
      <div style={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.navBtn,
              ...(isActive(item.path) ? styles.navBtnActive : {})
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
        <button 
          onClick={handleLogout} 
          style={styles.logoutBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FCA5A5';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FEE2E2';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    gap: '20px',
    flexWrap: 'wrap'
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#4F46E5',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0
  },
  nav: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  navBtn: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap'
  },
  navBtnActive: {
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    border: 'none'
  },
  logoutBtn: {
    padding: '8px 12px',
    backgroundColor: '#FEE2E2',
    border: 'none',
    borderRadius: '8px',
    color: '#DC2626',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap'
  }
};

export default HODTopNav;
