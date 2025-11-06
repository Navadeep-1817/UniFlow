import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userRole }) => {
  const getMenuItems = () => {
    // Hierarchical menu based on role
    switch (userRole) {
      case 'superadmin':
        return [
          { label: 'Dashboard', path: '/superadmin/dashboard' },
          { label: 'Universities', path: '/superadmin/universities' },
          { label: 'Admin Approval', path: '/superadmin/approvals' },
          { label: 'Analytics', path: '/superadmin/analytics' }
        ];
      case 'hod':
        return [
          { label: 'Dashboard', path: '/hod/dashboard' },
          { label: 'Events', path: '/hod/events' },
          { label: 'Faculty', path: '/hod/faculty' },
          { label: 'Students', path: '/hod/students' }
        ];
      // Add more roles
      default:
        return [];
    }
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {getMenuItems().map((item, index) => (
          <li key={index}>
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
