import React, { useState, useEffect } from 'react';

const PlacementProfile = () => {
  const [profile, setProfile] = useState({
    personalInfo: {},
    academicInfo: {},
    skills: [],
    projects: [],
    internships: []
  });

  const handleUpdateProfile = () => {
    console.log('Updating placement profile:', profile);
    // Update profile for placements (for TP events)
  };

  return (
    <div className="placement-profile">
      <h2>Placement Profile</h2>
      <div className="profile-sections">
        <div className="section">
          <h3>Personal Information</h3>
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />
          <input type="tel" placeholder="Phone" />
          <input type="text" placeholder="LinkedIn Profile" />
        </div>
        <div className="section">
          <h3>Academic Information</h3>
          <input type="number" placeholder="CGPA" step="0.01" />
          <input type="number" placeholder="12th Percentage" />
          <input type="number" placeholder="10th Percentage" />
          <input type="number" placeholder="Active Backlogs" />
        </div>
        <div className="section">
          <h3>Skills</h3>
          <textarea placeholder="Add your skills (comma-separated)"></textarea>
        </div>
        <div className="section">
          <h3>Projects</h3>
          <button>Add Project</button>
        </div>
        <div className="section">
          <h3>Internships</h3>
          <button>Add Internship</button>
        </div>
        <div className="section">
          <h3>Resume</h3>
          <input type="file" accept=".pdf" />
          <button>Upload Resume</button>
        </div>
      </div>
      <button onClick={handleUpdateProfile}>Save Profile</button>
    </div>
  );
};

export default PlacementProfile;
