import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiUser, FiDollarSign, FiCalendar, FiMapPin, FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiSearch, FiFilter, FiCheckCircle, FiXCircle, FiClock, FiEye, FiFileText } from 'react-icons/fi';
import PlacementTopNav from './PlacementTopNav';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [viewingOffer, setViewingOffer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    studentName: '', studentId: '', companyName: '', role: '', package: '', offerDate: '',
    joiningDate: '', location: '', bond: '', offerLetterUrl: '', status: 'pending', notes: ''
  });

  useEffect(() => {
    setOffers([
      { id: 1, studentName: 'Rajesh Kumar', studentId: 'CS2021001', companyName: 'Tata Consultancy Services',
        role: 'Software Developer', package: '7.5', offerDate: '2024-12-05', joiningDate: '2025-07-15',
        location: 'Bangalore', bond: '2 years', offerLetterUrl: 'offer_tcs_001.pdf', status: 'accepted', notes: 'Full-stack development role' },
      { id: 2, studentName: 'Priya Sharma', studentId: 'CS2021002', companyName: 'Infosys',
        role: 'Systems Engineer', package: '6.8', offerDate: '2024-12-03', joiningDate: '2025-06-01',
        location: 'Hyderabad', bond: '1.5 years', offerLetterUrl: 'offer_infosys_002.pdf', status: 'pending', notes: 'Core systems' },
      { id: 3, studentName: 'Amit Patel', studentId: 'CS2021003', companyName: 'Wipro',
        role: 'Project Engineer', package: '6.2', offerDate: '2024-12-01', joiningDate: '2025-08-01',
        location: 'Pune', bond: '2 years', offerLetterUrl: 'offer_wipro_003.pdf', status: 'rejected', notes: 'IT services' },
      { id: 4, studentName: 'Neha Singh', studentId: 'CS2021004', companyName: 'Amazon',
        role: 'SDE-1', package: '28.5', offerDate: '2024-12-10', joiningDate: '2025-07-01',
        location: 'Bangalore', bond: 'None', offerLetterUrl: 'offer_amazon_004.pdf', status: 'accepted', notes: 'E-commerce development' }
    ]);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddOffer = (e) => {
    e.preventDefault();
    setOffers([{ id: Date.now(), ...formData }, ...offers]);
    showToast('Offer added successfully!');
    setShowAddModal(false);
    resetForm();
  };

  const handleEditOffer = (e) => {
    e.preventDefault();
    setOffers(offers.map(o => o.id === editingOffer.id ? { ...o, ...formData } : o));
    showToast('Offer updated successfully!');
    setShowEditModal(false);
    setEditingOffer(null);
    resetForm();
  };

  const handleDeleteOffer = (id) => {
    if (window.confirm('Delete this offer?')) {
      setOffers(offers.filter(o => o.id !== id));
      showToast('Offer deleted!');
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    setOffers(offers.map(o => o.id === id ? { ...o, status: newStatus } : o));
    showToast(`Offer marked as ${newStatus}!`);
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setFormData({ ...offer });
    setShowEditModal(true);
  };

  const resetForm = () => setFormData({ studentName: '', studentId: '', companyName: '', role: '', package: '',
    offerDate: '', joiningDate: '', location: '', bond: '', offerLetterUrl: '', status: 'pending', notes: '' });

  const getStatusBadge = (status) => ({
    pending: { bg: colors.warningLight, color: colors.warningDark, icon: <FiClock size={14} /> },
    accepted: { bg: colors.successLight, color: colors.successDark, icon: <FiCheckCircle size={14} /> },
    rejected: { bg: colors.errorLight, color: colors.error, icon: <FiXCircle size={14} /> }
  }[status] || {});

  const filteredOffers = offers.filter(o => ((o.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.companyName.toLowerCase().includes(searchQuery.toLowerCase())) && (filterStatus === 'all' || o.status === filterStatus)));

  const stats = {
    total: offers.length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    pending: offers.filter(o => o.status === 'pending').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
    avgPackage: offers.length > 0 ? (offers.reduce((sum, o) => sum + parseFloat(o.package || 0), 0) / offers.length).toFixed(2) : '0'
  };

  return (
    <div style={commonStyles.container}>
      <PlacementTopNav />
      {toast.show && <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>{toast.message}</div>}
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>Offer Management</h1>
            <p style={commonStyles.pageSubtitle}>Manage job offers, acceptances, and placement details</p>
          </div>
          <button onClick={() => setShowAddModal(true)} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
            <FiPlus size={18} /> Add Offer
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <FiBriefcase size={24} />, value: stats.total, label: 'Total Offers', bg: colors.primaryLight, color: colors.primary },
            { icon: <FiCheckCircle size={24} />, value: stats.accepted, label: 'Accepted', bg: colors.successLight, color: colors.success },
            { icon: <FiClock size={24} />, value: stats.pending, label: 'Pending', bg: colors.warningLight, color: colors.warning },
            { icon: <FiXCircle size={24} />, value: stats.rejected, label: 'Rejected', bg: colors.errorLight, color: colors.error },
            { icon: <FiDollarSign size={24} />, value: `₹${stats.avgPackage} LPA`, label: 'Avg Package', bg: colors.infoLight, color: colors.info }
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
            <input type="text" placeholder="Search by student or company..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
              style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: colors.gray800 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <FiFilter size={16} color={colors.gray500} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Status:</span>
            {['all', 'pending', 'accepted', 'rejected'].map(status => {
              const isActive = filterStatus === status;
              return (
                <button key={status} onClick={() => setFilterStatus(status)} 
                  style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: isActive ? colors.primary : colors.white,
                    color: isActive ? colors.white : colors.gray500, border: isActive ? 'none' : `1px solid ${colors.gray200}` }}
                  onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = colors.gray50, e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = colors.white, e.currentTarget.style.transform = 'scale(1)')}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOffers.length === 0 ? (
            <div style={{ ...commonStyles.card, textAlign: 'center', padding: '60px 20px' }}>
              <FiBriefcase size={48} color={colors.gray400} />
              <p style={{ color: colors.gray500, marginTop: '16px' }}>No offers found</p>
            </div>
          ) : filteredOffers.map(offer => {
            const statusBadge = getStatusBadge(offer.status);
            return (
              <div key={offer.id} style={commonStyles.card} onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'start', flex: 1 }}>
                    <div style={{ padding: '12px', backgroundColor: colors.primaryLight, borderRadius: '10px' }}>
                      <FiUser size={24} color={colors.primary} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: '0 0 4px 0' }}>{offer.studentName}</h3>
                      <p style={{ fontSize: '14px', color: colors.gray500, margin: '0 0 8px 0' }}>ID: {offer.studentId}</p>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ ...commonStyles.badge, backgroundColor: statusBadge.bg, color: statusBadge.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {statusBadge.icon} {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: colors.success, display: 'flex', alignItems: 'center' }}>
                          <FiDollarSign size={14} />₹{offer.package} LPA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '4px' }}>Company:</div>
                      <div style={{ fontSize: '14px', color: colors.gray800 }}>{offer.companyName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '4px' }}>Role:</div>
                      <div style={{ fontSize: '14px', color: colors.gray800 }}>{offer.role}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: colors.gray600 }}>
                    <FiCalendar size={14} />
                    <div><span style={{ fontSize: '11px', color: colors.gray500 }}>Offer:</span> {offer.offerDate}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: colors.gray600 }}>
                    <FiCalendar size={14} />
                    <div><span style={{ fontSize: '11px', color: colors.gray500 }}>Joining:</span> {offer.joiningDate}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: colors.gray600 }}>
                    <FiMapPin size={14} />
                    <span>{offer.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: colors.gray600 }}>
                    <FiFileText size={14} />
                    <span>Bond: {offer.bond}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid ${colors.gray200}` }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {offer.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(offer.id, 'accepted')} 
                          style={{ padding: '8px 12px', backgroundColor: colors.success, border: 'none', borderRadius: '8px', color: colors.white, 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 4px 12px ${colors.success}40`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                          <FiCheckCircle size={14} /> Accept
                        </button>
                        <button onClick={() => handleStatusUpdate(offer.id, 'rejected')} 
                          style={{ padding: '8px 12px', backgroundColor: colors.error, border: 'none', borderRadius: '8px', color: colors.white, 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 4px 12px ${colors.error}40`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                          <FiXCircle size={14} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setViewingOffer(offer); setShowViewModal(true); }} 
                      style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onMouseEnter={hoverEffects.iconButtonHover} onMouseLeave={hoverEffects.iconButtonLeave}>
                      <FiEye size={16} />
                    </button>
                    <button onClick={() => openEditModal(offer)} 
                      style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.primary, cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onMouseEnter={hoverEffects.iconButtonHover} onMouseLeave={hoverEffects.iconButtonLeave}>
                      <FiEdit size={16} />
                    </button>
                    <button onClick={() => handleDeleteOffer(offer.id)} 
                      style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: colors.error, cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onMouseEnter={hoverEffects.iconButtonHover} onMouseLeave={hoverEffects.iconButtonLeave}>
                      <FiTrash2 size={16} />
                    </button>
                  </div>
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
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: 0 }}>{showEditModal ? 'Edit' : 'Add'} Offer</h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} 
                style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={showEditModal ? handleEditOffer : handleAddOffer} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Student Name *</label>
                  <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Student ID *</label>
                  <input type="text" name="studentId" value={formData.studentId} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Company *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Role *</label>
                  <input type="text" name="role" value={formData.role} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Package (LPA) *</label>
                  <input type="number" name="package" value={formData.package} onChange={handleInputChange} required step="0.1" style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Offer Date *</label>
                  <input type="date" name="offerDate" value={formData.offerDate} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Joining Date *</label>
                  <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Location *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Bond *</label>
                  <input type="text" name="bond" value={formData.bond} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., 2 years" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Status *</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} required style={commonStyles.input}>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Offer Letter URL</label>
                  <input type="text" name="offerLetterUrl" value={formData.offerLetterUrl} onChange={handleInputChange} style={commonStyles.input} placeholder="e.g., offer_letter.pdf" />
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
                  <FiSave size={16} /> {showEditModal ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && viewingOffer && (
        <div style={commonStyles.modalOverlay} onClick={() => setShowViewModal(false)}>
          <div style={{ ...commonStyles.modalContent, maxWidth: '700px', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: '0 0 4px 0' }}>{viewingOffer.studentName}</h3>
                <p style={{ fontSize: '14px', color: colors.gray500, margin: 0 }}>ID: {viewingOffer.studentId}</p>
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
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '12px' }}>Job Details</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Company:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingOffer.companyName}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Role:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingOffer.role}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Package:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.success }}>₹{viewingOffer.package} LPA</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Location:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingOffer.location}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Bond:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingOffer.bond}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Status:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingOffer.status}</span></div>
                  </div>
                </div>
                <div style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '12px' }}>Important Dates</div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Offer Date:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingOffer.offerDate}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Joining Date:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingOffer.joiningDate}</span></div>
                  </div>
                </div>
                {viewingOffer.notes && (
                  <div style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '8px' }}>Notes</div>
                    <div style={{ fontSize: '13px', color: colors.gray600 }}>{viewingOffer.notes}</div>
                  </div>
                )}
                {viewingOffer.offerLetterUrl && (
                  <div style={{ padding: '16px', backgroundColor: colors.primaryLight, borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.primary, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiFileText size={16} /> Offer Letter
                    </div>
                    <div style={{ fontSize: '13px', color: colors.gray600 }}>{viewingOffer.offerLetterUrl}</div>
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

export default OfferManagement;
