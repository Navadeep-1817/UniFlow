import React, { useState } from 'react';

const RegisterEvent = ({ eventId }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = () => {
    setIsRegistering(true);
    console.log('Registering for event:', eventId);
    // One-click registration
  };

  return (
    <div className="register-event">
      <h2>Event Registration</h2>
      <div className="registration-confirmation">
        <p>Are you sure you want to register for this event?</p>
        <div className="registration-details">
          <p>You will receive updates and reminders via email.</p>
          <p>Attendance is mandatory for registered events.</p>
        </div>
        <button onClick={handleRegister} disabled={isRegistering}>
          {isRegistering ? 'Registering...' : 'Confirm Registration'}
        </button>
        <button>Cancel</button>
      </div>
    </div>
  );
};

export default RegisterEvent;
