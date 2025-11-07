import React, { useState, useEffect } from 'react';
import { FiCheckSquare, FiXSquare, FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiSearch, FiBriefcase, FiUsers, FiAward, FiAlertCircle, FiEye } from 'react-icons/fi';
import PlacementTopNav from './PlacementTopNav';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const EligibilityCriteria = () => {
  const [criteria, setCriteria] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [viewingCriteria, setViewingCriteria] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    companyName: '', driveName: '', minCGPA: '', maxBacklogs: '', eligibleBranches: [],
    min10thPercentage: '', min12thPercentage: '', graduationYear: '', gapYearsAllowed: '',
    additionalRequirements: '', applicationType: 'drive'
  });

  useEffect(() => {
    setCriteria([
      { id: 1, companyName: 'Amazon', driveName: 'SDE-1 Hiring 2024', minCGPA: 7.5, maxBacklogs: 0,
        eligibleBranches: ['Computer Science', 'Electronics'], min10thPercentage: 60, min12thPercentage: 60,
        graduationYear: '2024', gapYearsAllowed: 0, additionalRequirements: 'Strong coding skills required',
        applicationType: 'drive', eligibleStudents: 45, totalStudents: 180 },
      { id: 2, companyName: 'TCS', driveName: 'Digital Hiring', minCGPA: 6.0, maxBacklogs: 2,
        eligibleBranches: ['Computer Science', 'Electronics', 'Mechanical', 'Civil'], min10thPercentage: 60, min12thPercentage: 60,
        graduationYear: '2024', gapYearsAllowed: 1, additionalRequirements: 'No specific requirements',
        applicationType: 'drive', eligibleStudents: 165, totalStudents: 180 },
      { id: 3, companyName: 'Microsoft', driveName: 'SDE Intern', minCGPA: 8.0, maxBacklogs: 0,
        eligibleBranches: ['Computer Science'], min10thPercentage: 75, min12thPercentage: 75,
        graduationYear: '2025', gapYearsAllowed: 0, additionalRequirements: 'Strong problem-solving, competitive programming',
        applicationType: 'internship', eligibleStudents: 22, totalStudents: 180 }
    ]);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'eligibleBranches') {
      const branches = formData.eligibleBranches || [];
      setFormData(prev => ({ ...prev, eligibleBranches: checked ? [...branches, value] : branches.filter(b => b !== value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCriteria = (e) => {
    e.preventDefault();
    const newCriteria = { id: Date.now(), ...formData, minCGPA: parseFloat(formData.minCGPA), maxBacklogs: parseInt(formData.maxBacklogs),
      min10thPercentage: parseFloat(formData.min10thPercentage), min12thPercentage: parseFloat(formData.min12thPercentage),
      gapYearsAllowed: parseInt(formData.gapYearsAllowed), eligibleStudents: Math.floor(Math.random() * 100) + 20, totalStudents: 180 };
    setCriteria([newCriteria, ...criteria]);
    showToast('Eligibility criteria created successfully!');
    setShowAddModal(false);
    resetForm();
  };

  const handleEditCriteria = (e) => {
    e.preventDefault();
    setCriteria(criteria.map(c => c.id === editingCriteria.id ? { ...c, ...formData, minCGPA: parseFloat(formData.minCGPA),
      maxBacklogs: parseInt(formData.maxBacklogs), min10thPercentage: parseFloat(formData.min10thPercentage),
      min12thPercentage: parseFloat(formData.min12thPercentage), gapYearsAllowed: parseInt(formData.gapYearsAllowed) } : c));
    showToast('Criteria updated successfully!');
    setShowEditModal(false);
    setEditingCriteria(null);
    resetForm();
  };

  const handleDeleteCriteria = (id) => {
    if (window.confirm('Delete this eligibility criteria?')) {
      setCriteria(criteria.filter(c => c.id !== id));
      showToast('Criteria deleted!');
    }
  };

  const openEditModal = (item) => {
    setEditingCriteria(item);
    setFormData({ companyName: item.companyName, driveName: item.driveName, minCGPA: item.minCGPA.toString(),
      maxBacklogs: item.maxBacklogs.toString(), eligibleBranches: item.eligibleBranches, min10thPercentage: item.min10thPercentage.toString(),
      min12thPercentage: item.min12thPercentage.toString(), graduationYear: item.graduationYear, gapYearsAllowed: item.gapYearsAllowed.toString(),
      additionalRequirements: item.additionalRequirements, applicationType: item.applicationType });
    setShowEditModal(true);
  };

  const resetForm = () => setFormData({ companyName: '', driveName: '', minCGPA: '', maxBacklogs: '', eligibleBranches: [],
    min10thPercentage: '', min12thPercentage: '', graduationYear: '', gapYearsAllowed: '', additionalRequirements: '', applicationType: 'drive' });

  const filteredCriteria = criteria.filter(c => c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.driveName.toLowerCase().includes(searchQuery.toLowerCase()));

  const stats = { total: criteria.length, strict: criteria.filter(c => c.minCGPA >= 7.5 && c.maxBacklogs === 0).length,
    moderate: criteria.filter(c => c.minCGPA >= 6.5 && c.minCGPA < 7.5).length, flexible: criteria.filter(c => c.minCGPA < 6.5).length };

  const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'IT'];

  return (
    <div style={commonStyles.container}>
      <PlacementTopNav />
      {toast.show && <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>{toast.message}</div>}
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>Eligibility Criteria</h1>
            <p style={commonStyles.pageSubtitle}>Define and manage placement eligibility rules for drives and companies</p>
          </div>
          <button onClick={() => setShowAddModal(true)} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
            <FiPlus size={18} /> Add Criteria
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <FiCheckSquare size={24} />, value: stats.total, label: 'Total Criteria', bg: colors.primaryLight, color: colors.primary },
            { icon: <FiAward size={24} />, value: stats.strict, label: 'Strict', bg: colors.errorLight, color: colors.error, subtitle: 'CGPA ≥7.5, 0 backlogs' },
            { icon: <FiBriefcase size={24} />, value: stats.moderate, label: 'Moderate', bg: colors.warningLight, color: colors.warning, subtitle: 'CGPA 6.5-7.5' },
            { icon: <FiUsers size={24} />, value: stats.flexible, label: 'Flexible', bg: colors.successLight, color: colors.success, subtitle: 'CGPA <6.5' }
          ].map((stat, i) => (
            <div key={i} style={commonStyles.statCard} onMouseEnter={hoverEffects.statCardHover} onMouseLeave={hoverEffects.statCardLeave}>
              <div style={{...commonStyles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div>
              <div style={commonStyles.statContent}>
                <div style={commonStyles.statValue}>{stat.value}</div>
                <div style={commonStyles.statLabel}>{stat.label}</div>
                {stat.subtitle && <div style={{ fontSize: '11px', color: colors.gray500, marginTop: '2px' }}>{stat.subtitle}</div>}
              </div>
            </div>
          ))}
        </div>

        <div style={commonStyles.controlsBar}>
          <div style={commonStyles.searchBox}>
            <FiSearch size={18} color={colors.gray500} />
            <input type="text" placeholder="Search by company or drive..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
              style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: colors.gray800 }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredCriteria.length === 0 ? (
            <div style={{ ...commonStyles.card, textAlign: 'center', padding: '60px 20px' }}>
              <FiCheckSquare size={48} color={colors.gray400} />
              <p style={{ color: colors.gray500, marginTop: '16px' }}>No eligibility criteria found</p>
            </div>
          ) : filteredCriteria.map(item => (
            <div key={item.id} style={commonStyles.card} onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'start', flex: 1 }}>
                  <div style={{ padding: '12px', backgroundColor: colors.primaryLight, borderRadius: '10px' }}>
                    <FiBriefcase size={24} color={colors.primary} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: '0 0 4px 0' }}>{item.companyName}</h3>
                    <p style={{ fontSize: '15px', fontWeight: '500', color: colors.gray600, margin: '0 0 8px 0' }}>{item.driveName}</p>
                    <span style={{ ...commonStyles.badge, backgroundColor: item.applicationType === 'drive' ? colors.primaryLight : colors.infoLight,
                      color: item.applicationType === 'drive' ? colors.primary : colors.info }}>
                      {item.applicationType === 'drive' ? 'Placement Drive' : 'Internship'}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: colors.success }}>{item.eligibleStudents}/{item.totalStudents}</div>
                  <div style={{ fontSize: '12px', color: colors.gray500 }}>eligible students</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.gray500, marginBottom: '4px' }}>MIN CGPA</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: item.minCGPA >= 7.5 ? colors.error : item.minCGPA >= 6.5 ? colors.warning : colors.success }}>
                    {item.minCGPA.toFixed(1)}
                  </div>
                </div>
                <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.gray500, marginBottom: '4px' }}>MAX BACKLOGS</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: item.maxBacklogs === 0 ? colors.error : colors.warning }}>{item.maxBacklogs}</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.gray500, marginBottom: '4px' }}>10TH %</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: colors.primary }}>{item.min10thPercentage}%</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.gray500, marginBottom: '4px' }}>12TH %</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: colors.primary }}>{item.min12thPercentage}%</div>
                </div>
              </div>
              <div style={{ padding: '14px', backgroundColor: colors.infoLight, borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: colors.infoDark, marginBottom: '8px' }}>Eligible Branches:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {item.eligibleBranches.map((branch, i) => (
                    <span key={i} style={{ padding: '6px 12px', backgroundColor: colors.white, borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: colors.gray700 }}>{branch}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px', fontSize: '13px', color: colors.gray600 }}>
                <div><span style={{ fontWeight: '600', color: colors.gray700 }}>Graduation Year:</span> {item.graduationYear}</div>
                <div><span style={{ fontWeight: '600', color: colors.gray700 }}>Gap Years Allowed:</span> {item.gapYearsAllowed}</div>
              </div>
              {item.additionalRequirements && (
                <div style={{ padding: '12px', backgroundColor: colors.warningLight, borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.warningDark, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiAlertCircle size={14} /> Additional Requirements:
                  </div>
                  <div style={{ fontSize: '13px', color: colors.gray700 }}>{item.additionalRequirements}</div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: `1px solid ${colors.gray200}` }}>
                <button onClick={() => { setViewingCriteria(item); setShowViewModal(true); }} 
                  style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={hoverEffects.iconButtonHover} onMouseLeave={hoverEffects.iconButtonLeave}>
                  <FiEye size={16} />
                </button>
                <button onClick={() => openEditModal(item)} 
                  style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.primary, cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={hoverEffects.iconButtonHover} onMouseLeave={hoverEffects.iconButtonLeave}>
                  <FiEdit size={16} />
                </button>
                <button onClick={() => handleDeleteCriteria(item.id)} 
                  style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: colors.error, cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={hoverEffects.iconButtonHover} onMouseLeave={hoverEffects.iconButtonLeave}>
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(showAddModal || showEditModal) && (
        <div style={commonStyles.modalOverlay} onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
          <div style={{ ...commonStyles.modalContent, maxWidth: '900px', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: 0 }}>{showEditModal ? 'Edit' : 'Add'} Eligibility Criteria</h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} 
                style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={showEditModal ? handleEditCriteria : handleAddCriteria} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Drive/Position Name *</label>
                  <input type="text" name="driveName" value={formData.driveName} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Type *</label>
                  <select name="applicationType" value={formData.applicationType} onChange={handleInputChange} required style={commonStyles.input}>
                    <option value="drive">Placement Drive</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Year *</label>
                  <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Min CGPA *</label>
                  <input type="number" name="minCGPA" value={formData.minCGPA} onChange={handleInputChange} required step="0.1" min="0" max="10" style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Max Backlogs *</label>
                  <input type="number" name="maxBacklogs" value={formData.maxBacklogs} onChange={handleInputChange} required min="0" style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Min 10th % *</label>
                  <input type="number" name="min10thPercentage" value={formData.min10thPercentage} onChange={handleInputChange} required min="0" max="100" style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Min 12th % *</label>
                  <input type="number" name="min12thPercentage" value={formData.min12thPercentage} onChange={handleInputChange} required min="0" max="100" style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Gap Years *</label>
                  <input type="number" name="gapYearsAllowed" value={formData.gapYearsAllowed} onChange={handleInputChange} required min="0" style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Eligible Branches *</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                    {branches.map(branch => (
                      <label key={branch} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" name="eligibleBranches" value={branch} 
                          checked={formData.eligibleBranches.includes(branch)} onChange={handleInputChange} />
                        <span style={{ fontSize: '14px', color: colors.gray700 }}>{branch}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Additional Requirements</label>
                  <textarea name="additionalRequirements" value={formData.additionalRequirements} onChange={handleInputChange} 
                    style={{ ...commonStyles.input, minHeight: '80px', resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${colors.gray200}` }}>
                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} style={commonStyles.secondaryBtn}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray200; e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'scale(1)'; }}>
                  Cancel
                </button>
                <button type="submit" style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                  <FiSave size={16} /> {showEditModal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && viewingCriteria && (
        <div style={commonStyles.modalOverlay} onClick={() => setShowViewModal(false)}>
          <div style={{ ...commonStyles.modalContent, maxWidth: '700px', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: '0 0 4px 0' }}>{viewingCriteria.companyName}</h3>
                <p style={{ fontSize: '16px', color: colors.primary, margin: 0, fontWeight: '500' }}>{viewingCriteria.driveName}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} 
                style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, marginBottom: '12px' }}>Academic Requirements</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Min CGPA:</span> <span style={{ fontSize: '15px', fontWeight: '700', color: colors.gray800 }}>{viewingCriteria.minCGPA.toFixed(1)}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Max Backlogs:</span> <span style={{ fontSize: '15px', fontWeight: '700', color: colors.gray800 }}>{viewingCriteria.maxBacklogs}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>10th %:</span> <span style={{ fontSize: '15px', fontWeight: '700', color: colors.gray800 }}>{viewingCriteria.min10thPercentage}%</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>12th %:</span> <span style={{ fontSize: '15px', fontWeight: '700', color: colors.gray800 }}>{viewingCriteria.min12thPercentage}%</span></div>
                  </div>
                </div>
                <div style={{ padding: '16px', backgroundColor: colors.infoLight, borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.infoDark, marginBottom: '8px' }}>Eligible Branches</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {viewingCriteria.eligibleBranches.map((branch, i) => (
                      <span key={i} style={{ padding: '6px 12px', backgroundColor: colors.white, borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: colors.gray700 }}>{branch}</span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '16px', backgroundColor: colors.successLight, borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.successDark, marginBottom: '12px' }}>Eligibility Summary</div>
                  <div style={{ display: 'grid', gap: '8px', fontSize: '13px', color: colors.gray700 }}>
                    <div><span style={{ fontWeight: '600' }}>Graduation Year:</span> {viewingCriteria.graduationYear}</div>
                    <div><span style={{ fontWeight: '600' }}>Gap Years Allowed:</span> {viewingCriteria.gapYearsAllowed}</div>
                    <div><span style={{ fontWeight: '600' }}>Eligible Students:</span> {viewingCriteria.eligibleStudents} out of {viewingCriteria.totalStudents}</div>
                  </div>
                </div>
                {viewingCriteria.additionalRequirements && (
                  <div style={{ padding: '16px', backgroundColor: colors.warningLight, borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: colors.warningDark, marginBottom: '8px' }}>Additional Requirements</div>
                    <div style={{ fontSize: '13px', color: colors.gray700 }}>{viewingCriteria.additionalRequirements}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityCriteria;
