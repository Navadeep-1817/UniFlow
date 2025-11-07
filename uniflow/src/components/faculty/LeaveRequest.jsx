import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSend,
  FiCalendar,
  FiClock,
  FiUser,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiBookOpen,
  FiHome,
  FiFilter,
  FiSearch,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';

const LeaveRequest = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    leaveType: 'substitution',
    fromDate: '',
    toDate: '',
    session: '',
    substituteId: '',
    reason: ''
  });

  useEffect(() => {
    // Mock leave requests data
    const mockRequests = [
      {
        id: 1,
        leaveType: 'substitution',
        fromDate: '2024-11-20',
        toDate: '2024-11-20',
        session: 'AI & ML Workshop - Session 3',
        sessionTime: '10:00 AM - 12:00 PM',
        substitute: 'Dr. Priya Sharma',
        reason: 'Medical appointment',
        status: 'approved',
        requestedOn: '2024-11-15',
        respondedOn: '2024-11-16',
        respondedBy: 'HOD - Computer Science'
      },
      {
        id: 2,
        leaveType: 'leave',
        fromDate: '2024-11-25',
        toDate: '2024-11-27',
        session: 'Multiple Sessions',
        sessionTime: 'Full Days',
        substitute: 'N/A',
        reason: 'Family emergency',
        status: 'pending',
        requestedOn: '2024-11-18',
        respondedOn: null,
        respondedBy: null
      },
      {
        id: 3,
        leaveType: 'substitution',
        fromDate: '2024-11-10',
        toDate: '2024-11-10',
        session: 'Web Development SDP - Session 2',
        sessionTime: '2:00 PM - 4:00 PM',
        substitute: 'Prof. Rajesh Kumar',
        reason: 'Conference attendance',
        status: 'rejected',
        requestedOn: '2024-11-05',
        respondedOn: '2024-11-06',
        respondedBy: 'Admin',
        rejectionReason: 'No substitute available for the requested date'
      }
    ];

    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
  }, []);

  useEffect(() => {
    let filtered = requests;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.session.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.substitute.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    setFilteredRequests(filtered);
  }, [searchQuery, filterStatus, requests]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRequest = {
      id: requests.length + 1,
      ...formData,
      session: 'Selected Session', // Would come from session selector
      sessionTime: '10:00 AM - 12:00 PM',
      substitute: formData.substituteId ? 'Selected Faculty' : 'N/A',
      status: 'pending',
      requestedOn: new Date().toISOString().split('T')[0],
      respondedOn: null,
      respondedBy: null
    };

    setRequests([newRequest, ...requests]);
    setShowForm(false);
    resetForm();
    showToast('Leave request submitted successfully!', 'success');
  };

  const resetForm = () => {
    setFormData({
      leaveType: 'substitution',
      fromDate: '',
      toDate: '',
      session: '',
      substituteId: '',
      reason: ''
    });
  };

  const handleDelete = (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      setRequests(requests.filter(r => r.id !== requestId));
      showToast('Request cancelled successfully!', 'success');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      approved: { bg: '#D1FAE5', color: '#065F46', icon: <FiCheckCircle size={16} /> },
      pending: { bg: '#FEF3C7', color: '#92400E', icon: <FiAlertCircle size={16} /> },
      rejected: { bg: '#FEE2E2', color: '#991B1B', icon: <FiXCircle size={16} /> }
    };
    return styles[status] || styles.pending;
  };

  return (
    <div style={styles.container}>
      {/* Toast */}
      {toast.show && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'success' ? '#10B981' : toast.type === 'error' ? '#EF4444' : '#3B82F6'
        }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <FiBookOpen size={28} />
          UniFlow Faculty
        </div>
        <div style={styles.nav}>
          <button onClick={() => navigate('/faculty/dashboard')} style={styles.navBtn}>
            <FiHome size={16} /> Dashboard
          </button>
          <button 
            onClick={() => navigate('/faculty/leave-request')} 
            style={{...styles.navBtn, backgroundColor: '#4F46E5', color: '#FFFFFF', border: 'none'}}
          >
            <FiSend size={16} /> Leave Request
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Leave & Substitution Requests</h1>
            <p style={styles.pageSubtitle}>Submit leave requests and track their status</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            style={styles.newRequestBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FiSend size={18} /> {showForm ? 'Cancel' : 'New Request'}
          </button>
        </div>

        {/* Request Form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{...styles.formCard, animation: 'slideDown 0.3s ease-out'}}>
            <h3 style={styles.formTitle}>Submit Leave Request</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Request Type *</label>
                <select name="leaveType" value={formData.leaveType} onChange={handleInputChange} required style={styles.input}>
                  <option value="substitution">Substitution (Single Session)</option>
                  <option value="leave">Leave (Multiple Days)</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>From Date *</label>
                <input type="date" name="fromDate" value={formData.fromDate} onChange={handleInputChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>To Date *</label>
                <input type="date" name="toDate" value={formData.toDate} onChange={handleInputChange} required style={styles.input} />
              </div>
              {formData.leaveType === 'substitution' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Suggest Substitute Faculty</label>
                  <select name="substituteId" value={formData.substituteId} onChange={handleInputChange} style={styles.input}>
                    <option value="">Select faculty...</option>
                    <option value="1">Dr. Priya Sharma</option>
                    <option value="2">Prof. Rajesh Kumar</option>
                    <option value="3">Dr. Anita Desai</option>
                  </select>
                </div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Reason for Leave *</label>
              <textarea name="reason" value={formData.reason} onChange={handleInputChange} required rows={3} style={{...styles.input, resize: 'vertical'}} placeholder="Provide detailed reason..." />
            </div>
            <div style={{display: 'flex', gap: '12px'}}>
              <button type="submit" style={styles.submitBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                <FiSend size={16} /> Submit Request
              </button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} style={styles.cancelBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Search & Filter */}
        <div style={styles.controlsBar}>
          <div style={styles.searchBox}>
            <FiSearch size={18} color="#6B7280" />
            <input type="text" placeholder="Search by session, reason, or substitute..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.filterGroup}>
            <FiFilter size={16} color="#6B7280" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.filterSelect}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        <div style={styles.requestsSection}>
          <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px'}}>Request History ({filteredRequests.length})</h3>
          {filteredRequests.length === 0 ? (
            <div style={styles.emptyState}>
              <FiFileText size={48} color="#9CA3AF" />
              <p style={{margin: '16px 0 0 0', fontSize: '16px', color: '#6B7280'}}>No requests found</p>
              <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#9CA3AF'}}>Submit your first leave request</p>
            </div>
          ) : (
            <div style={styles.requestsList}>
              {filteredRequests.map(request => {
                const statusStyle = getStatusStyle(request.status);
                return (
                  <div key={request.id} style={styles.requestCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
                    <div style={styles.requestHeader}>
                      <div>
                        <h4 style={styles.sessionName}>{request.session}</h4>
                        <div style={styles.requestMeta}>
                          <FiCalendar size={14} color="#6B7280" />
                          <span>{request.fromDate === request.toDate ? request.fromDate : `${request.fromDate} to ${request.toDate}`}</span>
                          <span>•</span>
                          <FiClock size={14} color="#6B7280" />
                          <span>{request.sessionTime}</span>
                        </div>
                      </div>
                      <div style={{...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color}}>
                        {statusStyle.icon}
                        <span>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                      </div>
                    </div>
                    <div style={styles.requestBody}>
                      <div style={styles.detailRow}>
                        <strong>Type:</strong> {request.leaveType === 'substitution' ? 'Substitution' : 'Leave'}
                      </div>
                      <div style={styles.detailRow}>
                        <strong>Reason:</strong> {request.reason}
                      </div>
                      {request.substitute !== 'N/A' && (
                        <div style={styles.detailRow}>
                          <FiUser size={14} />
                          <strong>Substitute:</strong> {request.substitute}
                        </div>
                      )}
                      <div style={styles.detailRow}>
                        <strong>Requested On:</strong> {request.requestedOn}
                      </div>
                      {request.respondedOn && (
                        <>
                          <div style={styles.detailRow}>
                            <strong>Responded On:</strong> {request.respondedOn} by {request.respondedBy}
                          </div>
                          {request.rejectionReason && (
                            <div style={{...styles.detailRow, color: '#991B1B', backgroundColor: '#FEE2E2', padding: '8px', borderRadius: '6px', marginTop: '8px'}}>
                              <FiAlertCircle size={14} />
                              <strong>Reason:</strong> {request.rejectionReason}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {request.status === 'pending' && (
                      <div style={styles.requestActions}>
                        <button onClick={() => handleDelete(request.id)} style={styles.deleteBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.transform = 'scale(1)'; }}>
                          <FiTrash2 size={16} /> Cancel Request
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
  header: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#4F46E5',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  nav: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  navBtn: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s'
  },
  logoutBtn: {
    padding: '10px 16px',
    backgroundColor: '#FEE2E2',
    border: 'none',
    borderRadius: '8px',
    color: '#DC2626',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  mainContent: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  pageHeader: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1F2937',
    margin: 0
  },
  pageSubtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: '8px 0 0 0'
  },
  newRequestBtn: {
    padding: '12px 24px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '10px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)'
  },
  controlsBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  requestsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '16px 24px',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontWeight: '500',
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    animation: 'slideInRight 0.3s ease-out'
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid #E5E7EB'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    color: '#1F2937',
    outline: 'none',
    transition: 'all 0.2s ease'
  },
  submitBtn: {
    padding: '12px 24px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '8px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  cancelBtn: {
    padding: '12px 24px',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '8px',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  searchBox: {
    flex: 1,
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '14px',
    color: '#1F2937'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    outline: 'none'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  requestCard: {
    padding: '20px',
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    transition: 'all 0.2s ease'
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #E5E7EB'
  },
  sessionName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937'
  },
  requestMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '6px'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600'
  },
  requestBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    color: '#374151'
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  requestActions: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    gap: '12px'
  },
  deleteBtn: {
    padding: '8px 16px',
    backgroundColor: '#FEE2E2',
    border: 'none',
    borderRadius: '8px',
    color: '#DC2626',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

export default LeaveRequest;
