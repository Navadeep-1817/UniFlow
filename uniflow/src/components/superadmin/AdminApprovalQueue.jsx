import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminApprovalQueue = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [confirmModal, setConfirmModal] = useState({ show: false, user: null, action: '' });

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = () => {
    // Check both localStorage and sessionStorage for token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    if (!token) {
      showToast('Authentication required. Please login again.', 'error');
      console.error('No token found in localStorage or sessionStorage');
      return;
    }

    console.log('Fetching pending approvals from:', `${API_BASE_URL}/superadmin/pending-approvals`);
    console.log('Token found:', token ? 'Yes' : 'No');

    fetch(`${API_BASE_URL}/superadmin/pending-approvals`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
      .then((r) => {
        if (!r.ok) {
          console.error('Failed to fetch pending approvals - Status:', r.status, r.statusText);
          return r.json().then(errData => {
            console.error('Error response:', errData);
            throw new Error(errData.message || `HTTP ${r.status}`);
          }).catch(() => {
            throw new Error(`HTTP ${r.status}: ${r.statusText}`);
          });
        }
        return r.json();
      })
      .then((json) => {
        console.log('Received approval data:', json);
        
        if (json && json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((u) => ({
            id: u._id,
            fullName: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
            email: u.email,
            role: u.role,
            university: u.university?.name || 'N/A',
            department: u.department?.name || 'N/A',
            registeredDate: u.createdAt,
            rollNumber: u.rollNumber,
            employeeId: u.employeeId,
            status: u.isApproved ? 'approved' : 'pending',
          }));
          
          console.log(`Loaded ${mapped.length} pending users (Faculty, HOD, T&P only - Students excluded)`);
          setPendingUsers(mapped);
          
          if (mapped.length === 0) {
            showToast('No pending approvals at this time.', 'info');
          }
        } else {
          setPendingUsers([]);
          if (json && !json.success) {
            showToast(json.message || 'Failed to load pending approvals.', 'error');
          }
        }
      })
      .catch((err) => {
        console.error('Error loading pending users:', err);
        setPendingUsers([]);
        showToast(`Error: ${err.message}. Check if backend is running on port 5000.`, 'error');
      });
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const openConfirmModal = (user, action) => {
    setConfirmModal({ show: true, user, action });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ show: false, user: null, action: '' });
  };

  const handleApproval = async (userId, action) => {
    const user = pendingUsers.find(u => u.id === userId);
    // Check both localStorage and sessionStorage for token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    if (!token) {
      showToast('Authentication required. Please login again.', 'error');
      return;
    }

    try {
      const endpoint = `${API_BASE_URL}/superadmin/${action === 'approved' ? 'approve' : 'reject'}/${userId}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // --- FIX 2: ADDED 'userName' FALLBACK ---
        // Prevents a crash if 'user' is undefined when accessing 'user.fullName'
        const userName = user ? user.fullName : 'The user';
        
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        showToast(
          action === 'approved'
            ? `${userName} has been approved!`
            : `${userName}'s registration has been rejected.`,
          action === 'approved' ? 'success' : 'error'
        );
      } else {
        showToast(data.message || 'Action failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Approval/Rejection error:', error);
      showToast('Failed to process request. Please try again.', 'error');
    }

    closeConfirmModal();
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      student: 'Student',
      faculty: 'Faculty',
      hod: 'Head of Department',
      placement: 'Training & Placement Head',
      student_body: 'Student Body Representative',
      sports: 'Sports Administrator',
      superadmin: 'Super Admin'
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colorMap = {
      student: { bg: '#DBEAFE', color: '#1E40AF' },
      faculty: { bg: '#FEF3C7', color: '#92400E' },
      hod: { bg: '#FCE7F3', color: '#9F1239' },
      placement: { bg: '#D1FAE5', color: '#065F46' },
      student_body: { bg: '#E0E7FF', color: '#3730A3' },
      sports: { bg: '#FED7AA', color: '#9A3412' },
      superadmin: { bg: '#F3E8FF', color: '#6B21A8' }
    };
    return colorMap[role] || { bg: '#F3F4F6', color: '#374151' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = filterRole === 'all'
    ? pendingUsers
    : pendingUsers.filter(u => u.role === filterRole);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #E5E7EB',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1F2937',
      margin: 0
    },
    backBtn: {
      padding: '10px 20px',
      backgroundColor: 'white',
      color: '#4F46E5',
      border: '2px solid #4F46E5',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    content: {
      padding: '40px'
    },
    filterSection: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
      border: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap'
    },
    filterLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1F2937'
    },
    filterBtn: {
      padding: '8px 16px',
      backgroundColor: 'white',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s',
      color: '#6B7280'
    },
    activeFilterBtn: {
      backgroundColor: '#4F46E5',
      borderColor: '#4F46E5',
      color: 'white'
    },
    statsBar: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px 24px',
      marginBottom: '24px',
      border: '1px solid #E5E7EB',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    statItem: {
      textAlign: 'center',
      flex: 1,
      minWidth: '100px'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#4F46E5'
    },
    statLabel: {
      fontSize: '12px',
      color: '#6B7280',
      marginTop: '4px'
    },
    userGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '20px'
    },
    userCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'all 0.3s'
    },
    userHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    userName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      margin: 0,
      wordBreak: 'break-word'
    },
    roleBadge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      flexShrink: 0,
      marginLeft: '8px'
    },
    userInfo: {
      marginBottom: '16px'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#6B7280',
      wordBreak: 'break-word'
    },
    infoLabel: {
      fontWeight: '600',
      color: '#374151',
      width: '120px',
      flexShrink: 0
    },
    dateInfo: {
      fontSize: '12px',
      color: '#9CA3AF',
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #F3F4F6'
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '16px'
    },
    approveBtn: {
      flex: 1,
      padding: '10px',
      backgroundColor: '#10B981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    rejectBtn: {
      flex: 1,
      padding: '10px',
      backgroundColor: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #E5E7EB'
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      color: '#10B981'
    },
    emptyText: {
      fontSize: '18px',
      color: '#6B7280',
      marginBottom: '8px'
    },
    toast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    toastSuccess: {
      backgroundColor: '#10B981'
    },
    toastError: {
      backgroundColor: '#EF4444'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '480px',
      width: '90%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '16px'
    },
    modalText: {
      fontSize: '14px',
      color: '#6B7280',
      lineHeight: '1.6',
      marginBottom: '24px'
    },
    modalButtons: {
      display: 'flex',
      gap: '12px'
    },
    modalCancelBtn: {
      flex: 1,
      padding: '12px',
      backgroundColor: '#F3F4F6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    modalConfirmBtn: {
      flex: 1,
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      color: 'white'
    }
  };

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{...styles.toast, ...(toast.type === 'success' ? styles.toastSuccess : styles.toastError)}}>
          {toast.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div style={styles.modal} onClick={closeConfirmModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>
              {confirmModal.action === 'approved' ? 'Approve User Registration' : 'Reject User Registration'}
            </h3>
            <p style={styles.modalText}>
              {confirmModal.action === 'approved' 
                ? `Are you sure you want to approve ${confirmModal.user?.fullName}'s registration? They will be able to login and access their dashboard.`
                : `Are you sure you want to reject ${confirmModal.user?.fullName}'s registration? This action cannot be undone.`
              }
            </p>
            <div style={styles.modalButtons}>
              <button 
                style={styles.modalCancelBtn}
                onClick={closeConfirmModal}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.modalConfirmBtn,
                  backgroundColor: confirmModal.action === 'approved' ? '#10B981' : '#EF4444'
                }}
                onClick={() => handleApproval(confirmModal.user.id, confirmModal.action)}
              >
                {confirmModal.action === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>UniFlow</div>
          <h1 style={styles.title}>Super Admin - User Approval Queue</h1>
        </div>
        <button 
          style={styles.backBtn}
          onClick={() => {
            sessionStorage.clear();
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            navigate('/login');
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#4F46E5';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.color = '#4F46E5';
          }}
        >
          Logout
        </button>
      </div>

      {/* Top Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 40px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => navigate('/superadmin/dashboard')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            if (e.target.style.color !== '#4F46E5') {
              e.target.style.color = '#4F46E5';
              e.target.style.borderBottomColor = '#DDDDEE';
            }
          }}
          onMouseOut={(e) => {
            if (e.target.style.color !== '#4F46E5') {
              e.target.style.color = '#6B7280';
              e.target.style.borderBottomColor = 'transparent';
            }
          }}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => navigate('/superadmin/approval-queue')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid #4F46E5',
            fontSize: '14px',
            fontWeight: '600',
            color: '#4F46E5',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          ✓ Approval Queue
        </button>
        <button
          onClick={() => navigate('/superadmin/global-analytics')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#DDDDEE';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
          }}
        >
          📈 Global Analytics
        </button>
        <button
          onClick={() => navigate('/superadmin/event-calendar')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#DDDDEE';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
          }}
        >
          📅 Event Calendar
        </button>
        <button
          onClick={() => navigate('/superadmin/user-management')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#DDDDEE';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
          }}
        >
          👥 User Management
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Stats Bar - Students excluded (auto-approved) */}
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{pendingUsers.length}</div>
            <div style={styles.statLabel}>Total Pending</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{pendingUsers.filter(u => u.role === 'faculty').length}</div>
            <div style={styles.statLabel}>Faculty</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{pendingUsers.filter(u => u.role === 'hod').length}</div>
            <div style={styles.statLabel}>HOD</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{pendingUsers.filter(u => u.role === 'placement').length}</div>
            <div style={styles.statLabel}>T&P Head</div>
          </div>
        </div>

        {/* Filter Section - Students excluded (auto-approved) */}
        <div style={styles.filterSection}>
          <span style={styles.filterLabel}>Filter by Role:</span>
          <button 
            style={{...styles.filterBtn, ...(filterRole === 'all' && styles.activeFilterBtn)}}
            onClick={() => setFilterRole('all')}
          >
            All ({pendingUsers.length})
          </button>
          <button 
            style={{...styles.filterBtn, ...(filterRole === 'faculty' && styles.activeFilterBtn)}}
            onClick={() => setFilterRole('faculty')}
          >
            Faculty ({pendingUsers.filter(u => u.role === 'faculty').length})
          </button>
          <button 
            style={{...styles.filterBtn, ...(filterRole === 'hod' && styles.activeFilterBtn)}}
            onClick={() => setFilterRole('hod')}
          >
            HOD ({pendingUsers.filter(u => u.role === 'hod').length})
          </button>
          <button 
            style={{...styles.filterBtn, ...(filterRole === 'placement' && styles.activeFilterBtn)}}
            onClick={() => setFilterRole('placement')}
          >
            T&P Head ({pendingUsers.filter(u => u.role === 'placement').length})
          </button>
        </div>

        {/* User Cards Grid */}
        {filteredUsers.length > 0 ? (
          <div style={styles.userGrid}>
            {filteredUsers.map(user => {
              const roleColors = getRoleBadgeColor(user.role);
              return (
                <div key={user.id} style={styles.userCard}>
                  <div style={styles.userHeader}>
                    <h3 style={styles.userName}>{user.fullName}</h3>
                    <span 
                      style={{
                        ...styles.roleBadge,
                        backgroundColor: roleColors.bg,
                        color: roleColors.color
                      }}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </div>

                  <div style={styles.userInfo}>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>University:</span>
                      <span>{user.university}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Department:</span>
                      <span>{user.department}</span>
                    </div>
                    
                    {/* These will now render if data is present */}
                    {user.rollNumber && (
                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Roll Number:</span>
                        <span>{user.rollNumber}</span>
                      </div>
                    )}
                    {user.employeeId && (
                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Employee ID:</span>
                        <span>{user.employeeId}</span>
                      </div>
                    )}
                  </div>

                  <div style={styles.dateInfo}>
                    Registered: {formatDate(user.registeredDate)}
                  </div>

                  <div style={styles.actionButtons}>
                    <button 
                      style={styles.approveBtn}
                      onClick={() => openConfirmModal(user, 'approved')}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#10B981'}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      style={styles.rejectBtn}
                      onClick={() => openConfirmModal(user, 'rejected')}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#DC2626'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#EF4444'}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>✓</div>
            <h3 style={styles.emptyText}>No Pending Approvals</h3>
            <p style={{color: '#9CA3AF', fontSize: '14px'}}>
              All user registrations have been reviewed. New registrations will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalQueue;