import React, { useState, useEffect } from 'react';

const UniversityManagement = () => {
  const [universities, setUniversities] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddUniversity = (universityData) => {
    console.log('Adding university:', universityData);
    // Add/edit/delete universities logic
  };

  return (
    <div className="university-management">
      <h2>University Management</h2>
      <button onClick={() => setShowForm(true)}>Add New University</button>
      <div className="university-list">
        {universities.map(uni => (
          <div key={uni.id} className="university-card">
            <h3>{uni.name}</h3>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversityManagement;
