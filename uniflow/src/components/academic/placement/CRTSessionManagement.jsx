import React, { useState, useEffect } from 'react';

const CRTSessionManagement = () => {
  const [sessions, setSessions] = useState([]);

  const handleCreateSession = (sessionData) => {
    console.log('Creating CRT session:', sessionData);
    // Organize CRT (Campus Recruitment Training)
  };

  return (
    <div className="crt-session-management">
      <h2>CRT Session Management</h2>
      <button onClick={() => console.log('Create Session')}>Create New Session</button>
      <div className="sessions-list">
        {sessions.map(session => (
          <div key={session.id} className="session-card">
            <h3>{session.title}</h3>
            <p>Date: {session.date}</p>
            <p>Time: {session.time}</p>
            <p>Trainer: {session.trainer}</p>
            <p>Registered: {session.registeredCount}</p>
            <button>View Attendance</button>
            <button>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CRTSessionManagement;
