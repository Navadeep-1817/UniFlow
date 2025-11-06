import React, { useState, useEffect } from 'react';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);

  const handleAddMember = (memberData) => {
    console.log('Adding team member:', memberData);
    // Manage team representative and members
  };

  return (
    <div className="team-management">
      <h2>Team Management</h2>
      <div className="team-structure">
        <h3>Team Representative</h3>
        <div className="representative-card">
          {/* Display team rep details */}
        </div>
        <h3>Team Members</h3>
        <button onClick={() => console.log('Add Member')}>Add Member</button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Position</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.rollNo}</td>
                <td>{member.position}</td>
                <td>{member.contact}</td>
                <td>
                  <button>Edit</button>
                  <button>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamManagement;
