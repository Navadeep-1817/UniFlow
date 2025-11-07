import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiAward,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX
} from 'react-icons/fi';
import TrainerTopNav from './TrainerTopNav';

const TrainerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('trainerToken');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    if (!token) {
      navigate('/trainer/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/trainers/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.data);
        setFormData(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('trainerToken');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    try {
      const response = await fetch(`${API_BASE_URL}/trainers/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.data);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <TrainerTopNav />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <TrainerTopNav />

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>My Profile</h1>
          {!editing ? (
            <button style={styles.editBtn} onClick={() => setEditing(true)}>
              <FiEdit2 size={18} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div style={styles.actionBtns}>
              <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
                <FiSave size={18} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
              <button style={styles.cancelBtn} onClick={() => {
                setEditing(false);
                setFormData(profile);
              }}>
                <FiX size={18} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>
              <FiUser size={48} color="#4F46E5" />
            </div>
            <div>
              <h2 style={styles.name}>{profile.name}</h2>
              <p style={styles.email}>{profile.email}</p>
              {!profile.isVerified && (
                <span style={styles.unverifiedBadge}>Pending Verification</span>
              )}
              {profile.isVerified && (
                <span style={styles.verifiedBadge}>✓ Verified Trainer</span>
              )}
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <FiBriefcase size={18} />
              Professional Information
            </h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>Type</label>
                {editing ? (
                  <select
                    style={styles.input}
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="External">External</option>
                    <option value="Internal">Internal</option>
                    <option value="Guest">Guest</option>
                  </select>
                ) : (
                  <p style={styles.fieldValue}>{profile.type || 'N/A'}</p>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Organization</label>
                {editing ? (
                  <input
                    style={styles.input}
                    value={formData.organization || ''}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Your organization"
                  />
                ) : (
                  <p style={styles.fieldValue}>{profile.organization || 'N/A'}</p>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Designation</label>
                {editing ? (
                  <input
                    style={styles.input}
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="Your designation"
                  />
                ) : (
                  <p style={styles.fieldValue}>{profile.designation || 'N/A'}</p>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Experience (Years)</label>
                {editing ? (
                  <input
                    style={styles.input}
                    type="number"
                    value={formData.experience || ''}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="Years of experience"
                  />
                ) : (
                  <p style={styles.fieldValue}>{profile.experience || 'N/A'} years</p>
                )}
              </div>

              {profile.type === 'Internal' && (
                <>
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>University</label>
                    <p style={styles.fieldValue}>{profile.university?.name || 'N/A'}</p>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Department</label>
                    <p style={styles.fieldValue}>{profile.department?.name || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <FiPhone size={18} />
              Contact Information
            </h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.fieldLabel}>Phone</label>
                {editing ? (
                  <input
                    style={styles.input}
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit phone number"
                  />
                ) : (
                  <p style={styles.fieldValue}>{profile.phone || 'N/A'}</p>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Alternate Phone</label>
                {editing ? (
                  <input
                    style={styles.input}
                    value={formData.alternatePhone || ''}
                    onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                    placeholder="Optional"
                  />
                ) : (
                  <p style={styles.fieldValue}>{profile.alternatePhone || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <FiAward size={18} />
              Qualifications
            </h3>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Qualification</label>
              {editing ? (
                <input
                  style={styles.input}
                  value={formData.qualification || ''}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g., Ph.D. in Computer Science"
                />
              ) : (
                <p style={styles.fieldValue}>{profile.qualification || 'N/A'}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.fieldLabel}>Bio</label>
              {editing ? (
                <textarea
                  style={{ ...styles.input, minHeight: '100px' }}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p style={styles.fieldValue}>{profile.bio || 'No bio added yet'}</p>
              )}
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <FiAward size={18} />
              Statistics
            </h3>
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>{profile.eventsDelivered || 0}</div>
                <div style={styles.statLabel}>Events Delivered</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>{profile.ratings?.averageRating?.toFixed(1) || '0.0'}</div>
                <div style={styles.statLabel}>Average Rating</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>{profile.ratings?.totalRatings || 0}</div>
                <div style={styles.statLabel}>Total Ratings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  mainContent: {
    padding: '24px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #E5E7EB',
    borderTopColor: '#4F46E5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    margin: 0
  },
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  actionBtns: {
    display: 'flex',
    gap: '12px'
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cancelBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#6B7280',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #E5E7EB',
    marginBottom: '32px'
  },
  avatar: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    backgroundColor: '#EEF2FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937',
    margin: '0 0 4px 0'
  },
  email: {
    fontSize: '14px',
    color: '#6B7280',
    margin: '0 0 8px 0'
  },
  verifiedBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  unverifiedBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  section: {
    marginBottom: '32px'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  fieldLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  fieldValue: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px'
  },
  statBox: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#4F46E5'
  },
  statLabel: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '4px'
  }
};

export default TrainerProfile;
