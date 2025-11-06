import React, { useState, useEffect } from 'react';

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);

  const handleAddFaculty = (facultyData) => {
    console.log('Adding faculty:', facultyData);
    // Add/remove faculty under department
  };

  return (
    <div className="faculty-management">
      <h2>Faculty Management</h2>
      <button onClick={() => console.log('Add Faculty')}>Add Faculty</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculty.map(f => (
            <tr key={f.id}>
              <td>{f.name}</td>
              <td>{f.email}</td>
              <td>{f.specialization}</td>
              <td>{f.status}</td>
              <td>
                <button>Edit</button>
                <button>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyManagement;
