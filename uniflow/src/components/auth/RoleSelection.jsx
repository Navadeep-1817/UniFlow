import React from 'react';

const RoleSelection = () => {
  const handleRoleSelect = (role) => {
    console.log('Role selected:', role);
    // Redirect to appropriate dashboard
  };

  return (
    <div className="role-selection-container">
      <h2>Select Your Role</h2>
      <div className="role-cards">
        <button onClick={() => handleRoleSelect('student')}>Student</button>
        <button onClick={() => handleRoleSelect('faculty')}>Faculty</button>
        <button onClick={() => handleRoleSelect('admin')}>Admin</button>
      </div>
    </div>
  );
};

export default RoleSelection;
