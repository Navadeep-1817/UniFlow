import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ userRole }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">UniFlow</Link>
      </div>
      <div className="navbar-menu">
        {userRole === 'student' && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/events">Events</Link>
            <Link to="/registrations">My Registrations</Link>
          </>
        )}
        {userRole === 'faculty' && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/assigned-events">Assigned Events</Link>
            <Link to="/attendance">Attendance</Link>
          </>
        )}
        {/* Add role-specific navigation */}
      </div>
      <div className="navbar-user">
        <button>Profile</button>
        <button>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
