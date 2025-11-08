import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import SportsTopNav from './SportsTopNav';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBriefcase, FiAward, FiEdit2, FiSave, FiX, FiCamera } from 'react-icons/fi';

const SportsProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    designation: '',
    department: 'Sports',
    university: '',
    specialization: '',
    experience: 0,
    achievements: [],
    profileImage: null
  });

  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        employeeId: user.employeeId || '',
        designation: user.designation || 'Sports Administrator',
        department: 'Sports Department',
        university: user.university?.name || user.university || '',
        specialization: user.specialization || '',
        experience: user.experience || 0,
        achievements: user.achievements || [],
        profileImage: user.profileImage || null
      };
      setProfileData(data);
      setEditData(data);
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to update profile
      // await updateSportsProfile(editData);
      setProfileData(editData);
      setIsEditing(false);
      showToast('Profile updated successfully!');
    } catch (error) {
      showToast('Failed to update profile', 'error');
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'system-ui'}}>
      {toast.show && (
        <div style={{position: 'fixed', top: '20px', right: '20px', backgroundColor: toast.type === 'error' ? '#EF4444' : '#10B981', color: 'white', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 2000}}>
          {toast.message}
        </div>
      )}

      <SportsTopNav />

      {/* Main Content */}
      <div style={{padding: '40px', maxWidth: '1200px', margin: '0 auto'}}>
        {/* Profile Header Card */}
        <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '40px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB'}}>
          <div style={{display: 'flex', gap: '40px', alignItems: 'flex-start'}}>
            {/* Profile Image */}
            <div style={{position: 'relative'}}>
              <div style={{width: '150px', height: '150px', borderRadius: '50%', background: profileData.profileImage ? `url(${profileData.profileImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: 'white', fontWeight: 'bold', border: '4px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
                {!profileData.profileImage && (profileData.name?.charAt(0) || 'S')}
              </div>
              {isEditing && (
                <label style={{position: 'absolute', bottom: '5px', right: '5px', backgroundColor: '#4F46E5', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>
                  <FiCamera size={20} color="white" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{display: 'none'}} />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div style={{flex: 1}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
                <div>
                  {isEditing ? (
                    <input type="text" value={editData.name} onChange={(e) => handleInputChange('name', e.target.value)} style={{fontSize: '28px', fontWeight: 'bold', color: '#1F2937', border: '2px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', width: '400px'}} />
                  ) : (
                    <h2 style={{fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 8px 0'}}>{profileData.name}</h2>
                  )}
                  <p style={{fontSize: '16px', color: '#6B7280', margin: '0 0 4px 0'}}>{profileData.designation}</p>
                  <p style={{fontSize: '14px', color: '#9CA3AF', margin: 0}}>{profileData.department}</p>
                </div>
                
                {!isEditing ? (
                  <button onClick={handleEdit} style={{padding: '10px 20px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <FiEdit2 size={16} /> Edit Profile
                  </button>
                ) : (
                  <div style={{display: 'flex', gap: '12px'}}>
                    <button onClick={handleSave} style={{padding: '10px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <FiSave size={16} /> Save
                    </button>
                    <button onClick={handleCancel} style={{padding: '10px 20px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <FiX size={16} /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <FiMail size={20} color="#6B7280" />
                  {isEditing ? (
                    <input type="email" value={editData.email} onChange={(e) => handleInputChange('email', e.target.value)} style={{fontSize: '14px', color: '#1F2937', border: '2px solid #E5E7EB', borderRadius: '6px', padding: '6px 10px', flex: 1}} />
                  ) : (
                    <span style={{fontSize: '14px', color: '#1F2937'}}>{profileData.email}</span>
                  )}
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <FiPhone size={20} color="#6B7280" />
                  {isEditing ? (
                    <input type="tel" value={editData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} style={{fontSize: '14px', color: '#1F2937', border: '2px solid #E5E7EB', borderRadius: '6px', padding: '6px 10px', flex: 1}} />
                  ) : (
                    <span style={{fontSize: '14px', color: '#1F2937'}}>{profileData.phone}</span>
                  )}
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <FiBriefcase size={20} color="#6B7280" />
                  {isEditing ? (
                    <input type="text" value={editData.employeeId} onChange={(e) => handleInputChange('employeeId', e.target.value)} style={{fontSize: '14px', color: '#1F2937', border: '2px solid #E5E7EB', borderRadius: '6px', padding: '6px 10px', flex: 1}} />
                  ) : (
                    <span style={{fontSize: '14px', color: '#1F2937'}}>ID: {profileData.employeeId}</span>
                  )}
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <FiMapPin size={20} color="#6B7280" />
                  {isEditing ? (
                    <input type="text" value={editData.university} onChange={(e) => handleInputChange('university', e.target.value)} style={{fontSize: '14px', color: '#1F2937', border: '2px solid #E5E7EB', borderRadius: '6px', padding: '6px 10px', flex: 1}} />
                  ) : (
                    <span style={{fontSize: '14px', color: '#1F2937'}}>{profileData.university}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px'}}>
          {/* Specialization */}
          <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB'}}>
            <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <FiAward size={20} color="#4F46E5" /> Specialization
            </h3>
            {isEditing ? (
              <input type="text" value={editData.specialization} onChange={(e) => handleInputChange('specialization', e.target.value)} style={{width: '100%', fontSize: '14px', color: '#1F2937', border: '2px solid #E5E7EB', borderRadius: '8px', padding: '12px'}} placeholder="e.g., Athletic Training, Sports Management" />
            ) : (
              <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>{profileData.specialization || 'Not specified'}</p>
            )}
          </div>

          {/* Experience */}
          <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB'}}>
            <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <FiCalendar size={20} color="#4F46E5" /> Experience
            </h3>
            {isEditing ? (
              <input type="number" value={editData.experience} onChange={(e) => handleInputChange('experience', e.target.value)} style={{width: '100%', fontSize: '14px', color: '#1F2937', border: '2px solid #E5E7EB', borderRadius: '8px', padding: '12px'}} placeholder="Years of experience" />
            ) : (
              <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>{profileData.experience} years in sports administration</p>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB'}}>
          <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '16px'}}>Achievements & Certifications</h3>
          {profileData.achievements.length > 0 ? (
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {profileData.achievements.map((achievement, index) => (
                <li key={index} style={{padding: '12px', marginBottom: '8px', backgroundColor: '#F9FAFB', borderRadius: '8px', borderLeft: '4px solid #4F46E5'}}>
                  {achievement}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>No achievements added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SportsProfile;
