import React, { useState } from 'react';

const RoleAssignment = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleAssignment = () => {
    console.log('Assigning role:', selectedRole, 'to user:', selectedUser);
    // Assign/revoke admin privileges
  };

  return (
    <div className="role-assignment">
      <h2>Role Assignment</h2>
      <div className="assignment-form">
        <input 
          type="text" 
          placeholder="Search user..."
          onChange={(e) => console.log('Searching:', e.target.value)}
        />
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="hod">HOD</option>
          <option value="placement">Placement Head</option>
          <option value="studentbody">Student Body Head</option>
          <option value="sports">Sports Head</option>
        </select>
        <button onClick={handleRoleAssignment}>Assign Role</button>
      </div>
    </div>
  );
};

export default RoleAssignment;
