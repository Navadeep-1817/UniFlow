import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBook, FiCamera, FiSave, FiEdit2, FiX, FiBriefcase } from 'react-icons/fi';
import { colors, commonStyles } from '../../styles/globalStyles';
import { useAuth } from '../../context/AuthContext';

const FacultyProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    university: '',
    specialization: '',
    qualification: '',
    experience: '',
    personalEmail: '',
    alternatePhone: '',
    dateOfBirth: '',
    bloodGroup: '',
    address: '',
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
          employeeId: user.employeeId || 'N/A',
          email: user.email || '',
          phone: user.phone || '',
          department: user.department?.name || user.department || 'N/A',
          designation: user.designation || 'Faculty',
          university: user.university?.name || user.university || 'N/A',
          specialization: user.specialization || '',
          qualification: user.qualification || '',
          experience: user.experience || '',
          personalEmail: user.personalEmail || '',
          alternatePhone: user.alternatePhone || '',
          dateOfBirth: user.dateOfBirth || '',
          bloodGroup: user.bloodGroup || '',
          address: user.address || '',
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
            <p style={commonStyles.pageSubtitle}>View and manage your professional information</p>
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
                  {currentData.employeeId}
                </p>
                <div style={{ ...commonStyles.badge, backgroundColor: colors.successLight, color: colors.successDark }}>
                  {currentData.designation}
                </div>
              </div>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '14px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Department</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{currentData.department}</div>
                </div>
                <div style={{ padding: '14px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>University</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{currentData.university}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Professional Information */}
            <div style={commonStyles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.gray800, marginBottom: '20px' }}>
                <FiBriefcase size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Professional Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InputField label="Employee ID" value={currentData.employeeId} disabled icon={<FiBriefcase />} />
                <InputField label="Designation" value={currentData.designation} field="designation" 
                  isEditing={isEditing} onChange={handleInputChange} icon={<FiUser />} />
                <InputField label="Specialization" value={currentData.specialization} field="specialization"
                  isEditing={isEditing} onChange={handleInputChange} icon={<FiBook />} />
                <InputField label="Qualification" value={currentData.qualification} field="qualification"
                  isEditing={isEditing} onChange={handleInputChange} icon={<FiBook />} />
                <InputField label="Experience (Years)" value={currentData.experience} field="experience"
                  isEditing={isEditing} onChange={handleInputChange} icon={<FiCalendar />} />
              </div>
            </div>

            {/* Contact Information */}
            <div style={commonStyles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.gray800, marginBottom: '20px' }}>
                <FiMail size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Contact Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InputField label="University Email" value={currentData.email} disabled icon={<FiMail />} />
                <InputField label="Personal Email" value={currentData.personalEmail} field="personalEmail"
                  isEditing={isEditing} onChange={handleInputChange} icon={<FiMail />} />
                <InputField label="Phone Number" value={currentData.phone} field="phone"
                  isEditing={isEditing} onChange={handleInputChange} icon={<FiPhone />} />
                <InputField label="Alternate Phone" value={currentData.alternatePhone} field="alternatePhone"
                  isEditing={isEditing} onChange={handleInputChange} icon={<FiPhone />} />
                <InputField label="Address" value={currentData.address} field="address" fullWidth
                  isEditing={isEditing} onChange={handleInputChange} icon={<FiMapPin />} />
              </div>
            </div>

            {/* Personal Information */}
            <div style={commonStyles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.gray800, marginBottom: '20px' }}>
                <FiUser size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Personal Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InputField label="Date of Birth" value={currentData.dateOfBirth} field="dateOfBirth" type="date"
                  isEditing={isEditing} onChange={handleInputChange} icon={<FiCalendar />} />
                <InputField label="Blood Group" value={currentData.bloodGroup} field="bloodGroup"
                  isEditing={isEditing} onChange={handleInputChange} icon={<FiUser />} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, field, isEditing, onChange, disabled, type = 'text', icon, fullWidth = false }) => {
  const inputStyle = {
    ...commonStyles.input,
    cursor: disabled ? 'not-allowed' : 'default',
    backgroundColor: disabled ? colors.gray100 : (isEditing ? colors.white : colors.gray50)
  };

  return (
    <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
      <label style={commonStyles.label}>
        {icon && <span style={{ marginRight: '6px', verticalAlign: 'middle' }}>{icon}</span>}
        {label}
        {disabled && <span style={{ fontSize: '11px', color: colors.gray400, marginLeft: '6px' }}>(Not Editable)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(field, e.target.value)}
        disabled={disabled || !isEditing}
        style={inputStyle}
      />
    </div>
  );
};

export default FacultyProfile;
