import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiSearch, FiFilter, FiBriefcase, FiBell, FiEye, FiCheckCircle } from 'react-icons/fi';
import PlacementTopNav from './PlacementTopNav';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const InterviewScheduling = () => {
  const [interviews, setInterviews] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [viewingInterview, setViewingInterview] = useState(null);
  const [notifyingInterview, setNotifyingInterview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRound, setFilterRound] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    companyName: '', driveName: '', roundType: 'HR', interviewDate: '', interviewTime: '09:00',
    venue: '', panelMembers: '', coordinator: '', coordinatorEmail: '', coordinatorPhone: '',
    candidateCount: '', duration: '30', notes: ''
  });

  useEffect(() => {
    setInterviews([
      { id: 1, companyName: 'Tata Consultancy Services', driveName: 'Software Developer Drive 2024', roundType: 'Technical',
        interviewDate: '2024-12-22', interviewTime: '09:00', venue: 'Seminar Hall A', panelMembers: 'Dr. Sharma, Prof. Kumar',
        coordinator: 'Rajesh Kumar', coordinatorEmail: 'rajesh@tcs.com', coordinatorPhone: '+91 98765 11111',
        candidateCount: 45, duration: '45', status: 'scheduled', notes: 'Technical coding round', notifiedStudents: true, notifiedRecruiters: true },
      { id: 2, companyName: 'Infosys', driveName: 'Systems Engineer Drive', roundType: 'HR',
        interviewDate: '2024-12-21', interviewTime: '10:30', venue: 'Conference Room B', panelMembers: 'Ms. Priya Reddy',
        coordinator: 'Priya Sharma', coordinatorEmail: 'priya@infosys.com', coordinatorPhone: '+91 98765 22222',
        candidateCount: 30, duration: '30', status: 'scheduled', notes: 'Behavioral questions', notifiedStudents: true, notifiedRecruiters: false }
    ]);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddInterview = (e) => {
    e.preventDefault();
    setInterviews([{ id: Date.now(), ...formData, status: 'scheduled', notifiedStudents: false, notifiedRecruiters: false }, ...interviews]);
    showToast('Interview scheduled successfully!');
    setShowAddModal(false);
    resetForm();
  };

  const handleEditInterview = (e) => {
    e.preventDefault();
    setInterviews(interviews.map(i => i.id === editingInterview.id ? { ...i, ...formData } : i));
    showToast('Interview updated successfully!');
    setShowEditModal(false);
    setEditingInterview(null);
    resetForm();
  };

  const handleDeleteInterview = (id) => {
    if (window.confirm('Delete this interview?')) {
      setInterviews(interviews.filter(i => i.id !== id));
      showToast('Interview deleted!');
    }
  };

  const handleNotify = (type) => {
    if (notifyingInterview) {
      setInterviews(interviews.map(i => i.id === notifyingInterview.id ? {
        ...i,
        notifiedStudents: type === 'students' || type === 'both' ? true : i.notifiedStudents,
        notifiedRecruiters: type === 'recruiters' || type === 'both' ? true : i.notifiedRecruiters
      } : i));
      showToast(`Notification sent to ${type}!`);
      setShowNotifyModal(false);
      setNotifyingInterview(null);
    }
  };

  const openEditModal = (interview) => {
    setEditingInterview(interview);
    setFormData({ companyName: interview.companyName, driveName: interview.driveName, roundType: interview.roundType,
      interviewDate: interview.interviewDate, interviewTime: interview.interviewTime, venue: interview.venue,
      panelMembers: interview.panelMembers, coordinator: interview.coordinator, coordinatorEmail: interview.coordinatorEmail,
      coordinatorPhone: interview.coordinatorPhone, candidateCount: interview.candidateCount, duration: interview.duration, notes: interview.notes });
    setShowEditModal(true);
  };

  const resetForm = () => setFormData({ companyName: '', driveName: '', roundType: 'HR', interviewDate: '', interviewTime: '09:00',
    venue: '', panelMembers: '', coordinator: '', coordinatorEmail: '', coordinatorPhone: '', candidateCount: '', duration: '30', notes: '' });

  const getRoundBadge = (type) => ({ HR: { bg: colors.infoLight, color: colors.infoDark },
    Technical: { bg: colors.primaryLight, color: colors.primary }, Aptitude: { bg: colors.warningLight, color: colors.warningDark } }[type] || {});

  const getStatusBadge = (status) => ({ scheduled: { bg: colors.warningLight, color: colors.warningDark },
    completed: { bg: colors.successLight, color: colors.successDark } }[status] || {});

  const filteredInterviews = interviews.filter(i => (i.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.driveName.toLowerCase().includes(searchQuery.toLowerCase())) && (filterRound === 'all' || i.roundType === filterRound));

  return (
    <div style={commonStyles.container}>
      <PlacementTopNav />
      {toast.show && <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>{toast.message}</div>}
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>Interview Scheduling</h1>
            <p style={commonStyles.pageSubtitle}>Manage interview slots and coordinate between companies and students</p>
          </div>
          <button onClick={() => setShowAddModal(true)} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
            <FiPlus size={18} /> Schedule Interview
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <FiCalendar size={24} />, value: interviews.length, label: 'Total Interviews', bg: colors.primaryLight, color: colors.primary },
            { icon: <FiCheckCircle size={24} />, value: interviews.filter(i => i.status === 'scheduled').length, label: 'Scheduled', bg: colors.warningLight, color: colors.warning },
            { icon: <FiUsers size={24} />, value: interviews.reduce((sum, i) => sum + parseInt(i.candidateCount || 0), 0), label: 'Total Candidates', bg: colors.successLight, color: colors.success },
            { icon: <FiBell size={24} />, value: interviews.filter(i => i.notifiedStudents && i.notifiedRecruiters).length, label: 'Fully Notified', bg: colors.infoLight, color: colors.info }
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
            <input type="text" placeholder="Search interviews..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
              style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: colors.gray800 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <FiFilter size={16} color={colors.gray500} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Round:</span>
            {['all', 'HR', 'Technical', 'Aptitude'].map(round => {
              const isActive = filterRound === round;
              return (
                <button key={round} onClick={() => setFilterRound(round)} 
                  style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: isActive ? colors.primary : colors.white,
                    color: isActive ? colors.white : colors.gray500, border: isActive ? 'none' : `1px solid ${colors.gray200}` }}
                  onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = colors.gray50, e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = colors.white, e.currentTarget.style.transform = 'scale(1)')}>
                  {round.charAt(0).toUpperCase() + round.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredInterviews.length === 0 ? (
            <div style={{ ...commonStyles.card, textAlign: 'center', padding: '60px 20px' }}>
              <FiCalendar size={48} color={colors.gray400} />
              <p style={{ color: colors.gray500, marginTop: '16px' }}>No interviews scheduled</p>
            </div>
          ) : filteredInterviews.map(interview => {
            const roundBadge = getRoundBadge(interview.roundType);
            const statusBadge = getStatusBadge(interview.status);
            return (
              <div key={interview.id} style={commonStyles.card} onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'start', flex: 1 }}>
                    <div style={{ padding: '12px', backgroundColor: colors.primaryLight, borderRadius: '10px' }}>
                      <FiBriefcase size={24} color={colors.primary} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: '0 0 4px 0' }}>{interview.companyName}</h3>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: colors.gray600, margin: '0 0 8px 0' }}>{interview.driveName}</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ ...commonStyles.badge, backgroundColor: roundBadge.bg, color: roundBadge.color }}>{interview.roundType}</span>
                        <span style={{ ...commonStyles.badge, backgroundColor: statusBadge.bg, color: statusBadge.color }}>{interview.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: colors.gray600 }}>
                    <FiCalendar size={14} /> <span>{interview.interviewDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: colors.gray600 }}>
                    <FiClock size={14} /> <span>{interview.interviewTime} ({interview.duration} min)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: colors.gray600 }}>
                    <FiMapPin size={14} /> <span>{interview.venue}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: colors.gray600 }}>
                    <FiUsers size={14} /> <span>{interview.candidateCount} candidates</span>
                  </div>
                </div>
                <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '4px' }}>Panel:</div>
                      <div style={{ fontSize: '13px', color: colors.gray600 }}>{interview.panelMembers}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '4px' }}>Coordinator:</div>
                      <div style={{ fontSize: '13px', color: colors.gray600 }}>{interview.coordinator}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '12px',
                  backgroundColor: interview.notifiedStudents && interview.notifiedRecruiters ? colors.successLight : colors.warningLight, borderRadius: '8px' }}>
                  <FiBell size={16} color={interview.notifiedStudents && interview.notifiedRecruiters ? colors.success : colors.warning} />
                  <div style={{ fontSize: '13px', color: colors.gray700 }}>
                    <span style={{ fontWeight: '600' }}>Notifications: </span>
                    Students {interview.notifiedStudents ? '✓' : '✗'} | Recruiters {interview.notifiedRecruiters ? '✓' : '✗'}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: `1px solid ${colors.gray200}` }}>
                  <button onClick={() => { setNotifyingInterview(interview); setShowNotifyModal(true); }} 
                    style={{ padding: '8px 12px', backgroundColor: colors.info, border: 'none', borderRadius: '8px', color: colors.white, 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 4px 12px ${colors.info}40`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <FiBell size={14} /> Notify
                  </button>
                  <button onClick={() => { setViewingInterview(interview); setShowViewModal(true); }} 
                    style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={hoverEffects.iconButtonHover} onMouseLeave={hoverEffects.iconButtonLeave}>
                    <FiEye size={16} />
                  </button>
                  <button onClick={() => openEditModal(interview)} 
                    style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.primary, cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={hoverEffects.iconButtonHover} onMouseLeave={hoverEffects.iconButtonLeave}>
                    <FiEdit size={16} />
                  </button>
                  <button onClick={() => handleDeleteInterview(interview.id)} 
                    style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: colors.error, cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={hoverEffects.iconButtonHover} onMouseLeave={hoverEffects.iconButtonLeave}>
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(showAddModal || showEditModal) && (
        <div style={commonStyles.modalOverlay} onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
          <div style={{ ...commonStyles.modalContent, maxWidth: '900px', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: 0 }}>{showEditModal ? 'Edit' : 'Schedule'} Interview</h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} 
                style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={showEditModal ? handleEditInterview : handleAddInterview} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Drive Name *</label>
                  <input type="text" name="driveName" value={formData.driveName} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Round Type *</label>
                  <select name="roundType" value={formData.roundType} onChange={handleInputChange} required style={commonStyles.input}>
                    <option value="HR">HR Round</option>
                    <option value="Technical">Technical Round</option>
                    <option value="Aptitude">Aptitude Round</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Date *</label>
                  <input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Time *</label>
                  <input type="time" name="interviewTime" value={formData.interviewTime} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Duration (min) *</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Venue *</label>
                  <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Panel Members *</label>
                  <input type="text" name="panelMembers" value={formData.panelMembers} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Candidates *</label>
                  <input type="number" name="candidateCount" value={formData.candidateCount} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Coordinator *</label>
                  <input type="text" name="coordinator" value={formData.coordinator} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Email *</label>
                  <input type="email" name="coordinatorEmail" value={formData.coordinatorEmail} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Phone *</label>
                  <input type="tel" name="coordinatorPhone" value={formData.coordinatorPhone} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} style={{ ...commonStyles.input, minHeight: '80px', resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${colors.gray200}` }}>
                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} style={commonStyles.secondaryBtn}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray200; e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'scale(1)'; }}>
                  Cancel
                </button>
                <button type="submit" style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                  <FiSave size={16} /> {showEditModal ? 'Update' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && viewingInterview && (
        <div style={commonStyles.modalOverlay} onClick={() => setShowViewModal(false)}>
          <div style={{ ...commonStyles.modalContent, maxWidth: '700px', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: '0 0 4px 0' }}>{viewingInterview.companyName}</h3>
                <p style={{ fontSize: '16px', color: colors.primary, margin: 0, fontWeight: '500' }}>{viewingInterview.driveName}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', 
                color: colors.gray500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '8px' }}>Interview Details</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Round:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingInterview.roundType}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Status:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingInterview.status}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Date:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingInterview.interviewDate}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Time:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingInterview.interviewTime}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Duration:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingInterview.duration} min</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Venue:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingInterview.venue}</span></div>
                    <div style={{ gridColumn: '1 / -1' }}><span style={{ fontSize: '13px', color: colors.gray500 }}>Panel:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingInterview.panelMembers}</span></div>
                  </div>
                </div>
                <div style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '8px' }}>Coordinator Information</div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Name:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingInterview.coordinator}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Email:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingInterview.coordinatorEmail}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Phone:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingInterview.coordinatorPhone}</span></div>
                  </div>
                </div>
                {viewingInterview.notes && (
                  <div style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '8px' }}>Notes</div>
                    <div style={{ fontSize: '13px', color: colors.gray600 }}>{viewingInterview.notes}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotifyModal && notifyingInterview && (
        <div style={commonStyles.modalOverlay} onClick={() => setShowNotifyModal(false)}>
          <div style={{ ...commonStyles.modalContent, maxWidth: '500px', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Send Notifications</h3>
              <button onClick={() => setShowNotifyModal(false)} style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', 
                color: colors.gray500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', color: colors.gray600, marginBottom: '24px' }}>
                Send notifications for <span style={{ fontWeight: '600' }}>{notifyingInterview.companyName}</span> interview
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => handleNotify('students')} 
                  style={{ padding: '12px', backgroundColor: colors.white, border: `2px solid ${colors.primary}`, borderRadius: '8px', 
                    color: colors.primary, cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primaryLight; e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.white; e.currentTarget.style.transform = 'scale(1)'; }}>
                  <FiBell size={16} style={{ marginRight: '8px' }} /> Notify Students Only
                </button>
                <button onClick={() => handleNotify('recruiters')} 
                  style={{ padding: '12px', backgroundColor: colors.white, border: `2px solid ${colors.info}`, borderRadius: '8px', 
                    color: colors.info, cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.infoLight; e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.white; e.currentTarget.style.transform = 'scale(1)'; }}>
                  <FiBell size={16} style={{ marginRight: '8px' }} /> Notify Recruiters Only
                </button>
                <button onClick={() => handleNotify('both')} 
                  style={{ padding: '12px', backgroundColor: colors.success, border: 'none', borderRadius: '8px', 
                    color: colors.white, cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 4px 12px ${colors.success}40`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <FiBell size={16} style={{ marginRight: '8px' }} /> Notify Both Students & Recruiters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduling;
