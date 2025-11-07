import React, { useState, useEffect } from 'react';
import { FiCalendar, FiBriefcase, FiUsers, FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiSearch, FiFilter, FiClock, FiMapPin, FiDollarSign, FiCheckCircle, FiAlertCircle, FiEye, FiUserCheck } from 'react-icons/fi';
import PlacementTopNav from './PlacementTopNav';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const PlacementDrives = () => {
  const [drives, setDrives] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [viewingDrive, setViewingDrive] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    description: '',
    driveDate: '',
    driveTime: '09:00',
    venue: '',
    package: '',
    eligibilityCriteria: '',
    rounds: '',
    maxRegistrations: '',
    registrationDeadline: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    const mockDrives = [
      {
        id: 1,
        companyName: 'Tata Consultancy Services',
        role: 'Software Developer',
        description: 'Full-stack development role with cutting-edge technologies',
        driveDate: '2024-12-20',
        driveTime: '09:00',
        venue: 'Main Auditorium',
        package: '7.5',
        eligibilityCriteria: 'BE/B.Tech CSE/IT, 60% throughout',
        rounds: 'Aptitude, Technical, HR',
        maxRegistrations: 200,
        registeredCount: 185,
        status: 'upcoming',
        registrationDeadline: '2024-12-18',
        contactPerson: 'Rajesh Kumar',
        contactEmail: 'rajesh@tcs.com',
        contactPhone: '+91 98765 11111',
        applicants: []
      },
      {
        id: 2,
        companyName: 'Infosys',
        role: 'Systems Engineer',
        description: 'Core systems engineering and development',
        driveDate: '2024-12-15',
        driveTime: '10:00',
        venue: 'Conference Hall A',
        package: '6.8',
        eligibilityCriteria: 'BE/B.Tech any branch, 65% throughout',
        rounds: 'Aptitude, Technical, HR',
        maxRegistrations: 150,
        registeredCount: 142,
        status: 'ongoing',
        registrationDeadline: '2024-12-13',
        contactPerson: 'Priya Sharma',
        contactEmail: 'priya@infosys.com',
        contactPhone: '+91 98765 22222',
        applicants: []
      },
      {
        id: 3,
        companyName: 'Wipro',
        role: 'Project Engineer',
        description: 'IT services and consulting role',
        driveDate: '2024-12-10',
        driveTime: '09:30',
        venue: 'Seminar Hall',
        package: '6.2',
        eligibilityCriteria: 'BE/B.Tech CSE/IT/ECE, 60% throughout',
        rounds: 'Aptitude, Technical, HR',
        maxRegistrations: 100,
        registeredCount: 98,
        status: 'completed',
        registrationDeadline: '2024-12-08',
        contactPerson: 'Amit Patel',
        contactEmail: 'amit@wipro.com',
        contactPhone: '+91 98765 33333',
        applicants: []
      }
    ];
    setDrives(mockDrives);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddDrive = (e) => {
    e.preventDefault();
    const newDrive = { 
      id: Date.now(), 
      ...formData, 
      registeredCount: 0, 
      status: 'upcoming',
      applicants: []
    };
    setDrives([newDrive, ...drives]);
    showToast('Placement drive created successfully!');
    setShowAddModal(false);
    resetForm();
  };

  const handleEditDrive = (e) => {
    e.preventDefault();
    setDrives(drives.map(d => d.id === editingDrive.id ? { ...d, ...formData } : d));
    showToast('Drive updated successfully!');
    setShowEditModal(false);
    setEditingDrive(null);
    resetForm();
  };

  const handleDeleteDrive = (id) => {
    if (window.confirm('Delete this placement drive? This action cannot be undone.')) {
      setDrives(drives.filter(d => d.id !== id));
      showToast('Drive deleted!');
    }
  };

  const openEditModal = (drive) => {
    setEditingDrive(drive);
    setFormData({
      companyName: drive.companyName,
      role: drive.role,
      description: drive.description,
      driveDate: drive.driveDate,
      driveTime: drive.driveTime,
      venue: drive.venue,
      package: drive.package,
      eligibilityCriteria: drive.eligibilityCriteria,
      rounds: drive.rounds,
      maxRegistrations: drive.maxRegistrations,
      registrationDeadline: drive.registrationDeadline,
      contactPerson: drive.contactPerson,
      contactEmail: drive.contactEmail,
      contactPhone: drive.contactPhone
    });
    setShowEditModal(true);
  };

  const openViewModal = (drive) => {
    setViewingDrive(drive);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      role: '',
      description: '',
      driveDate: '',
      driveTime: '09:00',
      venue: '',
      package: '',
      eligibilityCriteria: '',
      rounds: '',
      maxRegistrations: '',
      registrationDeadline: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: ''
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { bg: colors.warningLight, color: colors.warningDark },
      ongoing: { bg: colors.infoLight, color: colors.infoDark },
      completed: { bg: colors.successLight, color: colors.successDark }
    };
    return statusConfig[status] || statusConfig.upcoming;
  };

  const statusOptions = ['all', 'upcoming', 'ongoing', 'completed'];
  const filteredDrives = drives.filter(drive => {
    const matchesSearch = drive.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         drive.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || drive.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={commonStyles.container}>
      <PlacementTopNav />
      {toast.show && <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>{toast.message}</div>}
      
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>Placement Drives</h1>
            <p style={commonStyles.pageSubtitle}>Manage campus recruitment events and company drives</p>
          </div>
          <button onClick={() => setShowAddModal(true)} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
            <FiPlus size={18} /> Create Drive
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <FiBriefcase size={24} />, value: drives.length, label: 'Total Drives', bg: colors.primaryLight, color: colors.primary },
            { icon: <FiCalendar size={24} />, value: drives.filter(d => d.status === 'upcoming').length, label: 'Upcoming', bg: colors.warningLight, color: colors.warning },
            { icon: <FiCheckCircle size={24} />, value: drives.filter(d => d.status === 'ongoing').length, label: 'Ongoing', bg: colors.infoLight, color: colors.info },
            { icon: <FiUsers size={24} />, value: drives.reduce((sum, d) => sum + d.registeredCount, 0), label: 'Total Registrations', bg: colors.successLight, color: colors.success }
          ].map((stat, i) => (
            <div key={i} style={commonStyles.statCard} onMouseEnter={hoverEffects.statCardHover} onMouseLeave={hoverEffects.statCardLeave}>
              <div style={{...commonStyles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div>
              <div style={commonStyles.statContent}>
                <div style={commonStyles.statValue}>{stat.value}</div>
                <div style={commonStyles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={commonStyles.controlsBar}>
          <div style={commonStyles.searchBox}>
            <FiSearch size={18} color={colors.gray500} />
            <input 
              type="text" 
              placeholder="Search drives..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: colors.gray800 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <FiFilter size={16} color={colors.gray500} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Status:</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {statusOptions.map(status => {
                const isActive = filterStatus === status;
                return (
                  <button 
                    key={status} 
                    onClick={() => setFilterStatus(status)} 
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: isActive ? colors.primary : colors.white,
                      color: isActive ? colors.white : colors.gray500,
                      border: isActive ? 'none' : `1px solid ${colors.gray200}`
                    }}
                    onMouseEnter={(e) => { 
                      if (!isActive) { 
                        e.currentTarget.style.backgroundColor = colors.gray50; 
                        e.currentTarget.style.transform = 'scale(1.05)'; 
                      }
                    }}
                    onMouseLeave={(e) => { 
                      if (!isActive) { 
                        e.currentTarget.style.backgroundColor = colors.white; 
                        e.currentTarget.style.transform = 'scale(1)'; 
                      }
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredDrives.length === 0 ? (
            <div style={{ ...commonStyles.card, textAlign: 'center', padding: '60px 20px' }}>
              <FiBriefcase size={48} color={colors.gray400} />
              <p style={{ color: colors.gray500, marginTop: '16px' }}>No placement drives found</p>
            </div>
          ) : (
            filteredDrives.map(drive => {
              const statusBadge = getStatusBadge(drive.status);
              return (
                <div key={drive.id} style={{ ...commonStyles.card, position: 'relative' }} onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'start', flex: 1 }}>
                      <div style={{ padding: '12px', backgroundColor: colors.primaryLight, borderRadius: '10px', flexShrink: 0 }}>
                        <FiBriefcase size={24} color={colors.primary} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: '0 0 8px 0' }}>{drive.companyName}</h3>
                        <p style={{ fontSize: '16px', fontWeight: '500', color: colors.primary, margin: '0 0 8px 0' }}>{drive.role}</p>
                        <p style={{ fontSize: '14px', color: colors.gray500, margin: 0 }}>{drive.description}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <span style={{ ...commonStyles.badge, backgroundColor: statusBadge.bg, color: statusBadge.color }}>
                        {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: colors.gray500 }}>
                        <FiDollarSign size={16} />
                        <span style={{ fontWeight: '600' }}>{drive.package} LPA</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: colors.gray600 }}>
                      <FiCalendar size={14} />
                      <span>{drive.driveDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: colors.gray600 }}>
                      <FiClock size={14} />
                      <span>{drive.driveTime}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: colors.gray600 }}>
                      <FiMapPin size={14} />
                      <span>{drive.venue}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: colors.gray600 }}>
                      <FiUsers size={14} />
                      <span>{drive.registeredCount}/{drive.maxRegistrations} registered</span>
                    </div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '4px' }}>Eligibility:</div>
                    <div style={{ fontSize: '13px', color: colors.gray600 }}>{drive.eligibilityCriteria}</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid ${colors.gray200}` }}>
                    <div style={{ fontSize: '13px', color: colors.gray500 }}>
                      <div>Deadline: {drive.registrationDeadline}</div>
                      <div>Contact: {drive.contactPerson}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => openViewModal(drive)} 
                        style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                        onMouseEnter={hoverEffects.iconButtonHover}
                        onMouseLeave={hoverEffects.iconButtonLeave}
                      >
                        <FiEye size={16} />
                      </button>
                      <button 
                        onClick={() => openEditModal(drive)} 
                        style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                        onMouseEnter={hoverEffects.iconButtonHover}
                        onMouseLeave={hoverEffects.iconButtonLeave}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteDrive(drive.id)} 
                        style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: colors.error, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                        onMouseEnter={hoverEffects.iconButtonHover}
                        onMouseLeave={hoverEffects.iconButtonLeave}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Drive Modal */}
      {showAddModal && (
        <div style={commonStyles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={{ ...commonStyles.modalContent, maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Create Placement Drive</h3>
              <button onClick={() => setShowAddModal(false)} style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleAddDrive} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., Tata Consultancy Services" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Role *</label>
                  <input type="text" name="role" value={formData.role} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., Software Developer" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ ...commonStyles.input, minHeight: '80px', resize: 'vertical' }} placeholder="Brief description of the role and company" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Drive Date *</label>
                  <input type="date" name="driveDate" value={formData.driveDate} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Drive Time *</label>
                  <input type="time" name="driveTime" value={formData.driveTime} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Venue *</label>
                  <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., Main Auditorium" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Package (LPA) *</label>
                  <input type="number" name="package" value={formData.package} onChange={handleInputChange} required step="0.1" style={commonStyles.input} placeholder="e.g., 7.5" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Max Registrations *</label>
                  <input type="number" name="maxRegistrations" value={formData.maxRegistrations} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., 200" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Registration Deadline *</label>
                  <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Contact Person *</label>
                  <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., Rajesh Kumar" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Contact Email *</label>
                  <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., rajesh@company.com" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Contact Phone *</label>
                  <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., +91 98765 11111" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Eligibility Criteria *</label>
                  <textarea name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleInputChange} required style={{ ...commonStyles.input, minHeight: '60px', resize: 'vertical' }} placeholder="e.g., BE/B.Tech CSE/IT, 60% throughout" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Rounds *</label>
                  <input type="text" name="rounds" value={formData.rounds} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., Aptitude, Technical, HR" />
                </div>
              </div>
              <div style={{ padding: '24px', borderTop: `1px solid ${colors.gray200}`, display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={commonStyles.secondaryBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray200; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'scale(1)'; }}>
                  Cancel
                </button>
                <button type="submit" style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                  <FiSave size={16} /> Create Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Drive Modal */}
      {showEditModal && (
        <div style={commonStyles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div style={{ ...commonStyles.modalContent, maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Edit Placement Drive</h3>
              <button onClick={() => setShowEditModal(false)} style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleEditDrive} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Role *</label>
                  <input type="text" name="role" value={formData.role} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ ...commonStyles.input, minHeight: '80px', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Drive Date *</label>
                  <input type="date" name="driveDate" value={formData.driveDate} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Drive Time *</label>
                  <input type="time" name="driveTime" value={formData.driveTime} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Venue *</label>
                  <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Package (LPA) *</label>
                  <input type="number" name="package" value={formData.package} onChange={handleInputChange} required step="0.1" style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Max Registrations *</label>
                  <input type="number" name="maxRegistrations" value={formData.maxRegistrations} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Registration Deadline *</label>
                  <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Contact Person *</label>
                  <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Contact Email *</label>
                  <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Contact Phone *</label>
                  <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Eligibility Criteria *</label>
                  <textarea name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleInputChange} required style={{ ...commonStyles.input, minHeight: '60px', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Rounds *</label>
                  <input type="text" name="rounds" value={formData.rounds} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
              </div>
              <div style={{ padding: '24px', borderTop: `1px solid ${colors.gray200}`, display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={commonStyles.secondaryBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray200; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'scale(1)'; }}>
                  Cancel
                </button>
                <button type="submit" style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                  <FiSave size={16} /> Update Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Drive Modal */}
      {showViewModal && viewingDrive && (
        <div style={commonStyles.modalOverlay} onClick={() => setShowViewModal(false)}>
          <div style={{ ...commonStyles.modalContent, maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: '0 0 4px 0' }}>{viewingDrive.companyName}</h3>
                <p style={{ fontSize: '16px', color: colors.primary, margin: 0, fontWeight: '500' }}>{viewingDrive.role}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: colors.gray600, margin: '0 0 16px 0' }}>{viewingDrive.description}</p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ ...commonStyles.badge, backgroundColor: getStatusBadge(viewingDrive.status).bg, color: getStatusBadge(viewingDrive.status).color }}>
                    {viewingDrive.status.charAt(0).toUpperCase() + viewingDrive.status.slice(1)}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: colors.gray600 }}>
                    <FiDollarSign size={16} />
                    <span style={{ fontWeight: '600' }}>{viewingDrive.package} LPA</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: colors.gray600 }}>
                    <FiUsers size={16} />
                    <span>{viewingDrive.registeredCount}/{viewingDrive.maxRegistrations} registered</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '4px' }}>Drive Date & Time</div>
                  <div style={{ fontSize: '14px', color: colors.gray600 }}>{viewingDrive.driveDate} at {viewingDrive.driveTime}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '4px' }}>Venue</div>
                  <div style={{ fontSize: '14px', color: colors.gray600 }}>{viewingDrive.venue}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '4px' }}>Registration Deadline</div>
                  <div style={{ fontSize: '14px', color: colors.gray600 }}>{viewingDrive.registrationDeadline}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '4px' }}>Contact Person</div>
                  <div style={{ fontSize: '14px', color: colors.gray600 }}>{viewingDrive.contactPerson}</div>
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '8px' }}>Eligibility Criteria</div>
                <div style={{ fontSize: '14px', color: colors.gray600 }}>{viewingDrive.eligibilityCriteria}</div>
              </div>

              <div style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '8px' }}>Rounds</div>
                <div style={{ fontSize: '14px', color: colors.gray600 }}>{viewingDrive.rounds}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '4px' }}>Email</div>
                  <div style={{ fontSize: '14px', color: colors.gray600 }}>{viewingDrive.contactEmail}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '4px' }}>Phone</div>
                  <div style={{ fontSize: '14px', color: colors.gray600 }}>{viewingDrive.contactPhone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementDrives;
