import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBook, FiCamera, FiSave, FiEdit2, FiX } from 'react-icons/fi';
import { colors, commonStyles, hoverEffects } from '../../styles/globalStyles';
import { useAuth } from '../../context/AuthContext';

const MyProfile = () => {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    rollNo: '',
    email: '',
    personalEmail: '',
    phone: '',
    alternatePhone: '',
    branch: '',
    year: '',
    section: '',
    semester: '',
    batch: '',
    dateOfBirth: '',
    bloodGroup: '',
    address: '',
    parentName: '',
    parentPhone: '',
    cgpa: '',
    university: '',
    department: '',
    profilePicture: null
  });

  const [editedData, setEditedData] = useState({ ...profileData });

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        if (!isMounted) return;

        const userData = {
          name: user.name || '',
          rollNo: user.rollNumber || 'N/A',
          email: user.email || '',
          phone: user.phone || '',
          branch: user.department?.name || user.department || 'N/A',
          university: user.university?.name || user.university || 'N/A',
          department: user.department?.name || '',
          year: user.year || 'N/A',
          section: user.section || 'N/A',
          batch: user.batch || 'N/A',
          semester: user.year ? `${parseInt(user.year) * 2}th Semester` : 'N/A',
          personalEmail: user.personalEmail || '',
          alternatePhone: user.alternatePhone || '',
          dateOfBirth: user.dateOfBirth || '',
          bloodGroup: user.bloodGroup || '',
          address: user.address || '',
          parentName: user.parentName || '',
          parentPhone: user.parentPhone || '',
          cgpa: user.cgpa || 'N/A',
          profilePicture: user.profilePicture || null
        };

        if (isMounted) {
          setProfileData(userData);
          setEditedData(userData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
  };

  const handleSave = async () => {
    try {
      // For now, just update local state
      // Later, this will call the backend API to update profile
      setProfileData({ ...editedData });
      setIsEditing(false);
      showToast('Profile updated successfully!');
      
      // TODO: Add API call to update backend
      // await updateProfile(editedData);
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Failed to save changes', 'error');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const currentData = isEditing ? editedData : profileData;

  if (loading || authLoading) {
    return (
      <div style={commonStyles.container}>
        <div style={{...commonStyles.content, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px'}}>
          <div style={{textAlign: 'center'}}>
            <p style={{fontSize: '18px', color: colors.textSecondary}}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={commonStyles.container}>
      {toast.show && (
        <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>
          {toast.message}
        </div>
      )}

      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>My Profile</h1>
            <p style={commonStyles.pageSubtitle}>View and manage your personal information</p>
          </div>
          {!isEditing ? (
            <button 
              onClick={handleEdit} 
              style={commonStyles.primaryBtn}
            >
              <FiEdit2 size={18} /> Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleCancel} 
                style={commonStyles.secondaryBtn}
              >
                <FiX size={18} /> Cancel
              </button>
              <button 
                onClick={handleSave} 
                style={commonStyles.primaryBtn}
              >
                <FiSave size={18} /> Save Changes
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
          {/* Profile Picture Section */}
          <div style={commonStyles.card}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', 
                  border: `4px solid ${colors.primary}`, backgroundColor: colors.gray100 }}>
                  {currentData.profilePicture ? (
                    <img src={currentData.profilePicture} alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', backgroundColor: colors.primaryLight }}>
                      <FiUser size={80} color={colors.primary} />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label style={{ 
                    position: 'absolute', 
                    bottom: '10px', 
                    right: '10px', 
                    width: '45px', 
                    height: '45px',
                    backgroundColor: colors.primary, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center', 
                    cursor: 'pointer', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    <FiCamera size={20} color={colors.white} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfilePictureChange}
                      style={{ display: 'none' }} 
                    />
                  </label>
                )}
              </div>
              
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: colors.gray800, margin: '0 0 4px 0' }}>
                  {currentData.name}
                </h2>
                <p style={{ fontSize: '16px', fontWeight: '600', color: colors.primary, margin: '0 0 8px 0' }}>
                  {currentData.rollNo}
                </p>
                <div style={{ ...commonStyles.badge, backgroundColor: colors.successLight, color: colors.successDark }}>
                  {currentData.year} • {currentData.section}
                </div>
              </div>

              <div style={{ width: '100%', padding: '16px', backgroundColor: colors.primaryLight, borderRadius: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: colors.primaryDark, marginBottom: '4px' }}>
                  Current CGPA
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: colors.primary }}>
                  {currentData.cgpa}
                </div>
              </div>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '14px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Branch</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{currentData.branch}</div>
                </div>
                <div style={{ padding: '14px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Batch</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{currentData.batch}</div>
                </div>
                <div style={{ padding: '14px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Semester</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{currentData.semester}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Personal Information */}
            <div style={commonStyles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0', 
                paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>
                Personal Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiUser size={14} /> Full Name
                  </label>
                  {isEditing ? (
                    <input type="text" value={currentData.name} onChange={(e) => handleInputChange('name', e.target.value)}
                      style={commonStyles.input} />
                  ) : (
                    <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', 
                      fontSize: '14px', fontWeight: '500', color: colors.gray800 }}>
                      {currentData.name}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiBook size={14} /> Roll Number
                  </label>
                  <div style={{ padding: '12px', backgroundColor: colors.gray100, borderRadius: '8px', 
                    fontSize: '14px', fontWeight: '600', color: colors.gray600, border: `1px dashed ${colors.gray300}` }}>
                    {currentData.rollNo} <span style={{ fontSize: '11px' }}>(Not Editable)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiCalendar size={14} /> Date of Birth
                  </label>
                  {isEditing ? (
                    <input type="date" value={currentData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      style={commonStyles.input} />
                  ) : (
                    <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', 
                      fontSize: '14px', fontWeight: '500', color: colors.gray800 }}>
                      {new Date(currentData.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600 }}>Blood Group</label>
                  {isEditing ? (
                    <select value={currentData.bloodGroup} onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                      style={commonStyles.input}>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  ) : (
                    <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', 
                      fontSize: '14px', fontWeight: '500', color: colors.gray800 }}>
                      {currentData.bloodGroup}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div style={commonStyles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0', 
                paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>
                Contact Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiMail size={14} /> University Email
                  </label>
                  <div style={{ padding: '12px', backgroundColor: colors.gray100, borderRadius: '8px', 
                    fontSize: '14px', fontWeight: '500', color: colors.gray600 }}>
                    {currentData.email}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiMail size={14} /> Personal Email
                  </label>
                  {isEditing ? (
                    <input type="email" value={currentData.personalEmail} onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                      style={commonStyles.input} />
                  ) : (
                    <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', 
                      fontSize: '14px', fontWeight: '500', color: colors.gray800 }}>
                      {currentData.personalEmail}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiPhone size={14} /> Phone Number
                  </label>
                  {isEditing ? (
                    <input type="tel" value={currentData.phone} onChange={(e) => handleInputChange('phone', e.target.value)}
                      style={commonStyles.input} />
                  ) : (
                    <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', 
                      fontSize: '14px', fontWeight: '500', color: colors.gray800 }}>
                      {currentData.phone}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiPhone size={14} /> Alternate Phone
                  </label>
                  {isEditing ? (
                    <input type="tel" value={currentData.alternatePhone} onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                      style={commonStyles.input} />
                  ) : (
                    <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', 
                      fontSize: '14px', fontWeight: '500', color: colors.gray800 }}>
                      {currentData.alternatePhone}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiMapPin size={14} /> Address
                  </label>
                  {isEditing ? (
                    <textarea value={currentData.address} onChange={(e) => handleInputChange('address', e.target.value)}
                      style={{ ...commonStyles.input, minHeight: '80px', resize: 'vertical' }} />
                  ) : (
                    <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', 
                      fontSize: '14px', fontWeight: '500', color: colors.gray800 }}>
                      {currentData.address}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div style={commonStyles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0', 
                paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>
                Parent/Guardian Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiUser size={14} /> Parent/Guardian Name
                  </label>
                  {isEditing ? (
                    <input type="text" value={currentData.parentName} onChange={(e) => handleInputChange('parentName', e.target.value)}
                      style={commonStyles.input} />
                  ) : (
                    <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', 
                      fontSize: '14px', fontWeight: '500', color: colors.gray800 }}>
                      {currentData.parentName}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: colors.gray600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiPhone size={14} /> Parent Contact Number
                  </label>
                  {isEditing ? (
                    <input type="tel" value={currentData.parentPhone} onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                      style={commonStyles.input} />
                  ) : (
                    <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', 
                      fontSize: '14px', fontWeight: '500', color: colors.gray800 }}>
                      {currentData.parentPhone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
