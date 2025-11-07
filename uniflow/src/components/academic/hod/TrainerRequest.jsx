import React, { useState, useEffect } from 'react';
import HODTopNav from './HODTopNav';
import { FiUserPlus, FiUsers, FiEdit, FiTrash2, FiX, FiSave, FiFilter, FiSearch, FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiBriefcase, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const TrainerRequest = () => {
  const [requests, setRequests] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({ trainerName: '', organization: '', domain: '', email: '', phone: '', programName: '', programType: 'FDP', date: '', startTime: '09:00', endTime: '17:00', venue: '', expectedAudience: '', budget: '', description: '' });

  useEffect(() => {
    // Fetch real trainer requests from API
    const fetchRequests = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;
      
      try {
        // TODO: Implement API endpoint
        setRequests([]);
        console.log('Trainer requests ready for API integration');
      } catch (error) {
        console.error('Error fetching trainer requests:', error);
        setRequests([]);
      }
    };
    fetchRequests();
  }, []);

  const showToast = (message, type = 'success') => { setToast({ show: true, message, type }); setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000); };
  const handleInputChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleAddRequest = (e) => { e.preventDefault(); const newRequest = { id: Date.now(), ...formData, status: 'pending', requestedOn: new Date().toISOString().split('T')[0] }; setRequests([newRequest, ...requests]); showToast('Request submitted!'); setShowAddModal(false); setFormData({ trainerName: '', organization: '', domain: '', email: '', phone: '', programName: '', programType: 'FDP', date: '', startTime: '09:00', endTime: '17:00', venue: '', expectedAudience: '', budget: '', description: '' }); };
  const handleEditRequest = (e) => { e.preventDefault(); setRequests(requests.map(r => r.id === editingRequest.id ? { ...r, ...formData } : r)); showToast('Updated!'); setShowEditModal(false); };
  const handleDeleteRequest = (id) => { if (window.confirm('Delete?')) { setRequests(requests.filter(r => r.id !== id)); showToast('Deleted!'); } };
  const handleApprove = (id) => { setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r)); showToast('Approved!'); };
  const handleReject = (id) => { const reason = prompt('Reason:'); if (reason) { setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected', rejectionReason: reason } : r)); showToast('Rejected!', 'error'); } };
  const openEditModal = (request) => { setEditingRequest(request); setFormData({ trainerName: request.trainerName, organization: request.organization, domain: request.domain, email: request.email, phone: request.phone, programName: request.programName, programType: request.programType, date: request.date, startTime: request.startTime, endTime: request.endTime, venue: request.venue, expectedAudience: request.expectedAudience, budget: request.budget, description: request.description }); setShowEditModal(true); };
  const getStatusColor = (status) => { switch(status) { case 'pending': return { bg: '#FEF3C7', color: '#92400E', icon: <FiClock size={14} /> }; case 'approved': return { bg: '#D1FAE5', color: '#065F46', icon: <FiCheckCircle size={14} /> }; case 'rejected': return { bg: '#FEE2E2', color: '#991B1B', icon: <FiAlertCircle size={14} /> }; default: return { bg: '#F3F4F6', color: '#6B7280', icon: <FiClock size={14} /> }; } };
  const filteredRequests = requests.filter(r => { const matchesStatus = filterStatus === 'all' || r.status === filterStatus; const matchesSearch = r.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) || r.organization.toLowerCase().includes(searchQuery.toLowerCase()); return matchesStatus && matchesSearch; });

  return (
    <div style={styles.container}>
      <HODTopNav />
      {toast.show && <div style={{...styles.toast, backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444'}}>{toast.message}</div>}
      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div><h1 style={styles.pageTitle}>Trainer Requests</h1><p style={styles.pageSubtitle}>Request external trainers</p></div>
          <button onClick={() => setShowAddModal(true)} style={styles.addBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}><FiUserPlus size={18} /> New Request</button>
        </div>
        <div style={styles.statsRow}>
          {[{icon: <FiUsers size={24} />, value: requests.length, label: 'Total', bg: '#EEF2FF', color: '#4F46E5'}, {icon: <FiClock size={24} />, value: requests.filter(r => r.status === 'pending').length, label: 'Pending', bg: '#FEF3C7', color: '#F59E0B'}, {icon: <FiCheckCircle size={24} />, value: requests.filter(r => r.status === 'approved').length, label: 'Approved', bg: '#D1FAE5', color: '#10B981'}, {icon: <FiAlertCircle size={24} />, value: requests.filter(r => r.status === 'rejected').length, label: 'Rejected', bg: '#FEE2E2', color: '#EF4444'}].map((stat, i) => (
            <div key={i} style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}><div style={{...styles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div><div style={styles.statContent}><div style={styles.statValue}>{stat.value}</div><div style={styles.statLabel}>{stat.label}</div></div></div>
          ))}
        </div>
        <div style={styles.controlsBar}>
          <div style={styles.searchBox}><FiSearch size={18} color="#6B7280" /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} /></div>
          <div style={styles.filterGroup}><FiFilter size={16} /><span>Status:</span><div style={styles.filterButtons}>{['all', 'pending', 'approved', 'rejected'].map(status => (<button key={status} onClick={() => setFilterStatus(status)} style={{...styles.filterBtn, backgroundColor: filterStatus === status ? '#4F46E5' : '#FFF', color: filterStatus === status ? '#FFF' : '#6B7280'}} onMouseEnter={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; }}} onMouseLeave={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#FFF'; e.currentTarget.style.transform = 'scale(1)'; }}}>{status.charAt(0).toUpperCase() + status.slice(1)}</button>))}</div></div>
        </div>
        <div style={styles.requestsList}>{filteredRequests.length === 0 ? <div style={styles.emptyState}><FiUsers size={48} color="#9CA3AF" /><p>No requests</p></div> : filteredRequests.map(request => { const statusStyle = getStatusColor(request.status); return (<div key={request.id} style={styles.requestCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}><div style={styles.requestHeader}><div><h3 style={styles.trainerName}>{request.trainerName}</h3><div style={styles.trainerMeta}><span><FiBriefcase size={14} /> {request.organization}</span><span>{request.domain}</span></div></div><div style={{...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color}}>{statusStyle.icon}<span>{request.status}</span></div></div><div><h4>{request.programName}</h4><div style={styles.programDetails}><div style={styles.detailItem}><FiCalendar size={14} /><span>{request.date}</span></div><div style={styles.detailItem}><FiClock size={14} /><span>{request.startTime} - {request.endTime}</span></div><div style={styles.detailItem}><FiMapPin size={14} /><span>{request.venue}</span></div></div></div><div style={styles.requestFooter}><div>Budget: \u20b9{request.budget.toLocaleString()}</div><div style={styles.actionButtons}>{request.status === 'pending' && (<><button onClick={() => handleApprove(request.id)} style={styles.approveBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#10B981'; e.currentTarget.style.transform = 'scale(1)'; }}><FiCheckCircle size={14} /> Approve</button><button onClick={() => handleReject(request.id)} style={styles.rejectBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DC2626'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#EF4444'; e.currentTarget.style.transform = 'scale(1)'; }}><FiAlertCircle size={14} /> Reject</button></>)}<button onClick={() => openEditModal(request)} style={styles.editBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DBEAFE'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}><FiEdit size={16} /></button><button onClick={() => handleDeleteRequest(request.id)} style={styles.deleteBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}><FiTrash2 size={16} /></button></div></div></div>); })}</div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  content: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
  toast: { position: 'fixed', top: '20px', right: '20px', padding: '16px 24px', borderRadius: '8px', color: '#FFF', fontWeight: '500', zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  pageHeader: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  pageTitle: { fontSize: '32px', fontWeight: '700', color: '#1F2937', margin: 0 },
  pageSubtitle: { fontSize: '16px', color: '#6B7280', margin: '8px 0 0 0' },
  addBtn: { padding: '12px 24px', backgroundColor: '#4F46E5', border: 'none', borderRadius: '10px', color: '#FFF', cursor: 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  statIcon: { padding: '12px', borderRadius: '10px', flexShrink: 0 },
  statContent: { flex: 1 },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' },
  statLabel: { fontSize: '14px', color: '#6B7280' },
  controlsBar: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
  searchBox: { flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
  searchInput: { flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: '#1F2937' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  filterButtons: { display: 'flex', gap: '8px' },
  filterBtn: { padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', border: '1px solid #E5E7EB', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  requestsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#6B7280', backgroundColor: '#FFF', borderRadius: '12px' },
  requestCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  requestHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' },
  trainerName: { fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0' },
  trainerMeta: { display: 'flex', gap: '16px', fontSize: '14px', color: '#6B7280', alignItems: 'center' },
  statusBadge: { padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize' },
  programDetails: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' },
  detailItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280' },
  requestFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' },
  actionButtons: { display: 'flex', gap: '8px' },
  approveBtn: { padding: '8px 16px', backgroundColor: '#10B981', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  rejectBtn: { padding: '8px 16px', backgroundColor: '#EF4444', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  editBtn: { padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px', color: '#3B82F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  deleteBtn: { padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }
};

export default TrainerRequest;
