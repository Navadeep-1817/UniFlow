import React, { useState, useEffect } from 'react';

const MyProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    rollNo: '',
    email: '',
    department: '',
    year: '',
    section: ''
  });

  const handleUpdateProfile = () => {
    console.log('Updating profile:', profile);
  };

  return (
    <div className="my-profile">
      <h2>My Profile</h2>
      <div className="profile-form">
        <div className="profile-avatar">
          <img src="/default-avatar.png" alt="Profile" />
          <button>Change Photo</button>
        </div>
        <div className="profile-fields">
          <input 
            type="text" 
            placeholder="Full Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Roll Number"
            value={profile.rollNo}
            disabled
          />
          <input 
            type="email" 
            placeholder="Email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <select value={profile.department} disabled>
            <option>{profile.department}</option>
          </select>
          <select value={profile.year} disabled>
            <option>{profile.year}</option>
          </select>
          <select value={profile.section} disabled>
            <option>{profile.section}</option>
          </select>
        </div>
        <button onClick={handleUpdateProfile}>Update Profile</button>
      </div>
    </div>
  );
};

export default MyProfile;
