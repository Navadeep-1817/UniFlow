import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBriefcase, FiCalendar, FiTarget, FiUsers, FiAward, FiCheckSquare, FiFileText, FiBarChart2, FiClipboard } from 'react-icons/fi';

const PlacementTopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/placement/dashboard', icon: <FiHome size={18} />, label: 'Dashboard' },
    { path: '/placement/companies', icon: <FiBriefcase size={18} />, label: 'Companies' },
    { path: '/placement/crt-sessions', icon: <FiCalendar size={18} />, label: 'CRT Sessions' },
    { path: '/placement/drives', icon: <FiTarget size={18} />, label: 'Placement Drives' },
    { path: '/placement/interviews', icon: <FiUsers size={18} />, label: 'Interviews' },
    { path: '/placement/offers', icon: <FiAward size={18} />, label: 'Offers' },
    { path: '/placement/eligibility', icon: <FiCheckSquare size={18} />, label: 'Eligibility' },
    { path: '/placement/student-status', icon: <FiClipboard size={18} />, label: 'Student Status' },
    { path: '/placement/analytics', icon: <FiBarChart2 size={18} />, label: 'Analytics' },
    { path: '/placement/reports', icon: <FiFileText size={18} />, label: 'Reports' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.topNav}>
      <div style={styles.navContainer}>
        <div style={styles.navBrand}>
          <div style={styles.brandIcon}>
            <FiBriefcase size={24} color="#4F46E5" />
          </div>
          <div>
            <h2 style={styles.brandTitle}>Training & Placement</h2>
            <p style={styles.brandSubtitle}>Manage campus recruitment</p>
          </div>
        </div>
        
        <div style={styles.navItems}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.navItem,
                  backgroundColor: active ? '#EEF2FF' : 'transparent',
                  color: active ? '#4F46E5' : '#6B7280',
                  fontWeight: active ? '600' : '500'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                    e.currentTarget.style.color = '#1F2937';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6B7280';
                  }
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  topNav: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  navContainer: {
    maxWidth: '1600px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px'
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingRight: '32px',
    borderRight: '1px solid #E5E7EB',
    flexShrink: 0
  },
  brandIcon: {
    padding: '10px',
    backgroundColor: '#EEF2FF',
    borderRadius: '10px'
  },
  brandTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1F2937',
    margin: 0,
    lineHeight: 1.2
  },
  brandSubtitle: {
    fontSize: '12px',
    color: '#6B7280',
    margin: '2px 0 0 0',
    lineHeight: 1
  },
  navItems: {
    display: 'flex',
    gap: '8px',
    flex: 1,
    overflowX: 'auto',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
    outline: 'none'
  }
};

export default PlacementTopNav;
