import React, { useState, useEffect } from 'react';

const ManageTeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddMember = (memberData) => {
    console.log('Adding team member:', memberData);
    // Add/remove team members
  };

  const handleRemoveMember = (memberId) => {
    console.log('Removing member:', memberId);
  };

  return (
    <div className="manage-team-members">
      <h2>Manage Team Members</h2>
      <button onClick={() => setShowAddForm(true)}>Add Member</button>
      {showAddForm && (
        <div className="add-member-form">
          <input type="text" placeholder="Name" />
          <input type="text" placeholder="Roll Number" />
          <input type="text" placeholder="Position" />
          <input type="email" placeholder="Email" />
          <button onClick={handleAddMember}>Add</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Position</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.rollNo}</td>
              <td>{member.position}</td>
              <td>{member.email}</td>
              <td>
                <button onClick={() => handleRemoveMember(member.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTeamMembers;
