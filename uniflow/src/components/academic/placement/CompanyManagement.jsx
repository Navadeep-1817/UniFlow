import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiSearch, FiFilter, FiMapPin, FiPhone, FiMail, FiGlobe, FiUsers, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import PlacementTopNav from './PlacementTopNav';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    name: '',
    industry: 'IT',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    location: '',
    jobRoles: '',
    ctcRange: '',
    employeeStrength: '',
    description: '',
    previousVisits: 0
  });

  useEffect(() => {
    const mockCompanies = [
      { id: 1, name: 'TCS', industry: 'IT', contactPerson: 'Rajesh Kumar', contactEmail: 'rajesh@tcs.com', contactPhone: '+91 98765 11111', website: 'www.tcs.com', location: 'Mumbai', jobRoles: 'Software Developer, Business Analyst', ctcRange: '3.5-7 LPA', employeeStrength: '500000+', description: 'Leading IT services company', previousVisits: 5 },
      { id: 2, name: 'Infosys', industry: 'IT', contactPerson: 'Priya Sharma', contactEmail: 'priya@infosys.com', contactPhone: '+91 98765 22222', website: 'www.infosys.com', location: 'Bangalore', jobRoles: 'Systems Engineer, Digital Specialist', ctcRange: '3.6-7.5 LPA', employeeStrength: '300000+', description: 'Global leader in consulting', previousVisits: 4 },
      { id: 3, name: 'Wipro', industry: 'IT', contactPerson: 'Amit Patel', contactEmail: 'amit@wipro.com', contactPhone: '+91 98765 33333', website: 'www.wipro.com', location: 'Pune', jobRoles: 'Project Engineer, Data Analyst', ctcRange: '3.5-6.8 LPA', employeeStrength: '250000+', description: 'IT services and consulting', previousVisits: 3 }
    ];
    setCompanies(mockCompanies);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    const newCompany = { id: Date.now(), ...formData, previousVisits: 0 };
    setCompanies([newCompany, ...companies]);
    showToast('Company added successfully!');
    setShowAddModal(false);
    setFormData({ name: '', industry: 'IT', contactPerson: '', contactEmail: '', contactPhone: '', website: '', location: '', jobRoles: '', ctcRange: '', employeeStrength: '', description: '', previousVisits: 0 });
  };

  const handleEditCompany = (e) => {
    e.preventDefault();
    setCompanies(companies.map(c => c.id === editingCompany.id ? { ...c, ...formData } : c));
    showToast('Company updated successfully!');
    setShowEditModal(false);
  };

  const handleDeleteCompany = (id) => {
    if (window.confirm('Delete this company?')) {
      setCompanies(companies.filter(c => c.id !== id));
      showToast('Company deleted!');
    }
  };

  const openEditModal = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      industry: company.industry,
      contactPerson: company.contactPerson,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
      website: company.website,
      location: company.location,
      jobRoles: company.jobRoles,
      ctcRange: company.ctcRange,
      employeeStrength: company.employeeStrength,
      description: company.description,
      previousVisits: company.previousVisits
    });
    setShowEditModal(true);
  };

  const industries = ['all', 'IT', 'Consulting', 'Finance', 'Manufacturing', 'Healthcare', 'E-commerce'];
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || c.industry === filterIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div style={styles.container}>
      <PlacementTopNav />
      {toast.show && <div style={{...styles.toast, backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444'}}>{toast.message}</div>}
      
      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div><h1 style={styles.pageTitle}>Company Management</h1><p style={styles.pageSubtitle}>Manage placement companies</p></div>
          <button onClick={() => setShowAddModal(true)} style={styles.addBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}><FiPlus size={18} /> Add Company</button>
        </div>

        <div style={styles.statsRow}>
          {[
            { icon: <FiBriefcase size={24} />, value: companies.length, label: 'Total Companies', bg: '#EEF2FF', color: '#4F46E5' },
            { icon: <FiTrendingUp size={24} />, value: companies.filter(c => c.previousVisits > 2).length, label: 'Regular', bg: '#D1FAE5', color: '#10B981' },
            { icon: <FiUsers size={24} />, value: companies.filter(c => c.industry === 'IT').length, label: 'IT', bg: '#FEF3C7', color: '#F59E0B' },
            { icon: <FiDollarSign size={24} />, value: companies.length > 0 ? `${Math.max(...companies.map(c => parseFloat(c.ctcRange.split('-')[1])))} L` : '0', label: 'Highest CTC', bg: '#FEE2E2', color: '#EF4444' }
          ].map((stat, i) => (
            <div key={i} style={styles.statCard} onMouseEnter={hoverEffects.statCardHover} onMouseLeave={hoverEffects.statCardLeave}><div style={{...styles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div><div style={styles.statContent}><div style={styles.statValue}>{stat.value}</div><div style={styles.statLabel}>{stat.label}</div></div></div>
          ))}
        </div>

        <div style={styles.controlsBar}>
          <div style={styles.searchBox}><FiSearch size={18} color="#6B7280" /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} /></div>
          <div style={styles.filterGroup}><FiFilter size={16} /><span style={{fontSize: '14px', fontWeight: '600'}}>Industry:</span><div style={styles.filterButtons}>{industries.map(ind => {
            const isActive = filterIndustry === ind;
            return (<button key={ind} onClick={() => setFilterIndustry(ind)} style={{padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: isActive ? '#4F46E5' : '#FFF', color: isActive ? '#FFF' : '#6B7280', border: isActive ? 'none' : '1px solid #E5E7EB'}} onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; }}} onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = '#FFF'; e.currentTarget.style.transform = 'scale(1)'; }}}>{ind.charAt(0).toUpperCase() + ind.slice(1)}</button>);
          })}</div></div>
        </div>

        <div style={styles.companiesList}>
          {filteredCompanies.length === 0 ? <div style={styles.emptyState}><FiBriefcase size={48} color="#9CA3AF" /><p>No companies</p></div> : filteredCompanies.map(company => (
            <div key={company.id} style={styles.companyCard} onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
              <div style={styles.companyHeader}>
                <div style={styles.companyTitleRow}>
                  <div style={styles.companyIcon}><FiBriefcase size={24} color="#4F46E5" /></div>
                  <div><h3 style={styles.companyName}>{company.name}</h3><div style={styles.companyMeta}><span style={styles.industryBadge}>{company.industry}</span><span style={styles.metaItem}><FiMapPin size={12} /> {company.location}</span></div></div>
                </div>
                <div style={styles.visitBadge}>{company.previousVisits} visits</div>
              </div>
              <div style={styles.companyBody}>
                <p style={styles.description}>{company.description}</p>
                <div style={styles.detailsGrid}>
                  <div style={styles.detailItem}><FiUsers size={14} color="#6B7280" /><span><strong>Roles:</strong> {company.jobRoles}</span></div>
                  <div style={styles.detailItem}><FiDollarSign size={14} color="#6B7280" /><span><strong>CTC:</strong> {company.ctcRange}</span></div>
                  <div style={styles.detailItem}><FiTrendingUp size={14} color="#6B7280" /><span><strong>Size:</strong> {company.employeeStrength}</span></div>
                </div>
                <div style={styles.contactInfo}>
                  <div style={styles.contactItem}><FiMail size={14} /><span>{company.contactEmail}</span></div>
                  <div style={styles.contactItem}><FiPhone size={14} /><span>{company.contactPhone}</span></div>
                  <div style={styles.contactItem}><FiGlobe size={14} /><span>{company.website}</span></div>
                </div>
              </div>
              <div style={styles.companyFooter}>
                <div style={styles.contactPerson}>Contact: <strong>{company.contactPerson}</strong></div>
                <div style={styles.actionButtons}>
                  <button onClick={() => openEditModal(company)} style={styles.editBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DBEAFE'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}><FiEdit size={16} /></button>
                  <button onClick={() => handleDeleteCompany(company.id)} style={styles.deleteBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}><FiTrash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}><h3 style={styles.modalTitle}>Add Company</h3><button onClick={() => setShowAddModal(false)} style={styles.closeBtn} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0) scale(1)'}><FiX size={20} /></button></div>
            <form onSubmit={handleAddCompany} style={styles.modalBody}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}><label style={styles.label}>Name *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Industry *</label><select name="industry" value={formData.industry} onChange={handleInputChange} required style={styles.input}><option value="IT">IT</option><option value="Consulting">Consulting</option><option value="Finance">Finance</option><option value="Manufacturing">Manufacturing</option><option value="Healthcare">Healthcare</option><option value="E-commerce">E-commerce</option></select></div>
                <div style={styles.formGroup}><label style={styles.label}>Contact Person *</label><input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Email *</label><input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Phone *</label><input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Website</label><input type="text" name="website" value={formData.website} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Location *</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Employee Strength</label><input type="text" name="employeeStrength" value={formData.employeeStrength} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Job Roles *</label><input type="text" name="jobRoles" value={formData.jobRoles} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>CTC Range *</label><input type="text" name="ctcRange" value={formData.ctcRange} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={{...styles.formGroup, gridColumn: '1 / -1'}}><label style={styles.label}>Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} style={{...styles.input, minHeight: '80px'}} /></div>
              </div>
              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setShowAddModal(false)} style={styles.cancelModalBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>Cancel</button>
                <button type="submit" style={styles.submitBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}><FiSave size={16} /> Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div style={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}><h3 style={styles.modalTitle}>Edit Company</h3><button onClick={() => setShowEditModal(false)} style={styles.closeBtn} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0) scale(1)'}><FiX size={20} /></button></div>
            <form onSubmit={handleEditCompany} style={styles.modalBody}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}><label style={styles.label}>Name *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Industry *</label><select name="industry" value={formData.industry} onChange={handleInputChange} required style={styles.input}><option value="IT">IT</option><option value="Consulting">Consulting</option><option value="Finance">Finance</option><option value="Manufacturing">Manufacturing</option><option value="Healthcare">Healthcare</option><option value="E-commerce">E-commerce</option></select></div>
                <div style={styles.formGroup}><label style={styles.label}>Contact Person *</label><input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Email *</label><input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Phone *</label><input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Website</label><input type="text" name="website" value={formData.website} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Location *</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Employee Strength</label><input type="text" name="employeeStrength" value={formData.employeeStrength} onChange={handleInputChange} style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Job Roles *</label><input type="text" name="jobRoles" value={formData.jobRoles} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>CTC Range *</label><input type="text" name="ctcRange" value={formData.ctcRange} onChange={handleInputChange} required style={styles.input} /></div>
                <div style={styles.formGroup}><label style={styles.label}>Previous Visits</label><input type="number" name="previousVisits" value={formData.previousVisits} onChange={handleInputChange} style={styles.input} /></div>
                <div style={{...styles.formGroup, gridColumn: '1 / -1'}}><label style={styles.label}>Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} style={{...styles.input, minHeight: '80px'}} /></div>
              </div>
              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setShowEditModal(false)} style={styles.cancelModalBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>Cancel</button>
                <button type="submit" style={styles.submitBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}><FiSave size={16} /> Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: commonStyles.container,
  content: commonStyles.content,
  toast: commonStyles.toast,
  pageHeader: commonStyles.pageHeader,
  pageTitle: commonStyles.pageTitle,
  pageSubtitle: commonStyles.pageSubtitle,
  addBtn: commonStyles.primaryBtn,
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  statIcon: { padding: '12px', borderRadius: '10px', flexShrink: 0 },
  statContent: { flex: 1 },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' },
  statLabel: { fontSize: '14px', color: '#6B7280' },
  controlsBar: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
  searchBox: { flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
  searchInput: { flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: '#1F2937' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  filterButtons: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  companiesList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '20px' },
  emptyState: { gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#6B7280', backgroundColor: '#FFF', borderRadius: '12px' },
  companyCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', gap: '16px' },
  companyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' },
  companyTitleRow: { display: 'flex', gap: '12px', alignItems: 'start', flex: 1 },
  companyIcon: { padding: '12px', backgroundColor: '#EEF2FF', borderRadius: '10px', flexShrink: 0 },
  companyName: { fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0' },
  companyMeta: { display: 'flex', gap: '12px', fontSize: '14px', color: '#6B7280', alignItems: 'center', flexWrap: 'wrap' },
  industryBadge: { padding: '4px 12px', backgroundColor: '#EEF2FF', color: '#4F46E5', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '4px' },
  visitBadge: { padding: '6px 12px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '12px', fontSize: '12px', fontWeight: '600', flexShrink: 0 },
  companyBody: { display: 'flex', flexDirection: 'column', gap: '12px' },
  description: { fontSize: '14px', color: '#6B7280', margin: 0 },
  detailsGrid: { display: 'flex', flexDirection: 'column', gap: '8px' },
  detailItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' },
  contactInfo: { display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6B7280' },
  companyFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #E5E7EB' },
  contactPerson: { fontSize: '14px', color: '#6B7280' },
  actionButtons: { display: 'flex', gap: '8px' },
  editBtn: { padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px', color: '#3B82F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  deleteBtn: { padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modalContent: { backgroundColor: '#FFF', borderRadius: '16px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  modalHeader: { padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: '#FFF', zIndex: 10 },
  modalTitle: { fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: 0 },
  closeBtn: { padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  modalBody: { padding: '24px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  input: { padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', color: '#1F2937', outline: 'none', transition: 'border-color 0.2s' },
  modalFooter: { padding: '24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: '12px', position: 'sticky', bottom: 0, backgroundColor: '#FFF' },
  cancelModalBtn: { padding: '10px 20px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px', color: '#374151', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  submitBtn: { padding: '10px 20px', backgroundColor: '#4F46E5', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }
};

export default CompanyManagement;
