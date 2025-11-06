import React, { useState, useEffect } from 'react';

const PlacementDrives = () => {
  const [drives, setDrives] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleCreateDrive = (driveData) => {
    console.log('Creating placement drive:', driveData);
    // Create/manage campus recruitment events
  };

  return (
    <div className="placement-drives">
      <h2>Placement Drives</h2>
      <button onClick={() => setShowForm(true)}>Create New Drive</button>
      <div className="drives-list">
        {drives.map(drive => (
          <div key={drive.id} className="drive-card">
            <h3>{drive.companyName}</h3>
            <p>Date: {drive.date}</p>
            <p>Role: {drive.role}</p>
            <p>Package: ₹{drive.package} LPA</p>
            <p>Registrations: {drive.registrations}</p>
            <button>View Details</button>
            <button>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacementDrives;
