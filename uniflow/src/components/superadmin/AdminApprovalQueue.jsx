import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminApprovalQueue = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [confirmModal, setConfirmModal] = useState({ show: false, user: null, action: '' });

  useEffect(() => {
    // Load pending users from storage
    loadPendingUsers();
  }, []);

  const loadPendingUsers = () => {
    // Mock pending users - In real app, this would be API call
    const mockPendingUsers = [
      {
        id: 1,
        fullName: 'Rahul Sharma',
        email: 'rahul.sharma@jntu.ac.in',
        role: 'student',
        university: 'JNTU Hyderabad',
        department: 'Computer Science',
        rollNumber: 'CS21001',
        registeredDate: '2024-11-05T10:30:00',
        status: 'pending'
      },
      {
        id: 2,
        fullName: 'Dr. Priya Reddy',
        email: 'priya.reddy@osmania.ac.in',
        role: 'faculty',
        university: 'Osmania University',
        department: 'Electronics',
        employeeId: 'FAC2024',
        registeredDate: '2024-11-05T14:20:00',
        status: 'pending'
      },
      {
        id: 3,
        fullName: 'Prof. Venkat Rao',
        email: 'venkat.rao@jntu.ac.in',
        role: 'hod',
        university: 'JNTU Kakinada',
        department: 'Mechanical',
        employeeId: 'HOD2024',
        registeredDate: '2024-11-06T09:15:00',
        status: 'pending'
      },
      {
        id: 4,
        fullName: 'Ms. Anjali Kumar',
        email: 'anjali.kumar@andhra.ac.in',
        role: 'placement',
        university: 'Andhra University',
        department: 'Training & Placement',
        employeeId: 'TNP2024',
        registeredDate: '2024-11-06T11:00:00',
        status: 'pending'
      },
      {
        id: 5,
        fullName: 'Kiran Patel',
        email: 'kiran.patel@jntu.ac.in',
        role: 'student_body',
        university: 'JNTU Hyderabad',
        department: 'Student Affairs',
        registeredDate: '2024-11-06T08:45:00',
        status: 'pending'
      },
      {
        id: 6,
        fullName: 'Sneha Gupta',
        email: 'sneha.gupta@osmania.ac.in',
        role: 'student',
        university: 'Osmania University',
        department: 'IT',
        rollNumber: 'IT21045',
        registeredDate: '2024-11-05T16:30:00',
        status: 'pending'
      }
    ];

    setPendingUsers(mockPendingUsers);
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

  const handleApproval = (userId, action) => {
    // Find the user
    const user = pendingUsers.find(u => u.id === userId);
    
    if (action === 'approved') {
      // In real app, make API call to approve user
      // Then remove from pending list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      showToast(`${user.fullName} has been approved! They can now login to the system.`, 'success');
    } else if (action === 'rejected') {
      // In real app, make API call to reject user
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      showToast(`${user.fullName}'s registration has been rejected.`, 'error');
    }
    
    closeConfirmModal();
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      'student': 'Student',
      'faculty': 'Faculty',
      'hod': 'Head of Department',
      'placement': 'Training & Placement Head',
      'student_body': 'Student Body Representative',
      'sports': 'Sports Administrator',
      'superadmin': 'Super Admin'
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colorMap = {
      'student': { bg: '#DBEAFE', color: '#1E40AF' },
      'faculty': { bg: '#FEF3C7', color: '#92400E' },
      'hod': { bg: '#FCE7F3', color: '#9F1239' },
      'placement': { bg: '#D1FAE5', color: '#065F46' },
      'student_body': { bg: '#E0E7FF', color: '#3730A3' },
      'sports': { bg: '#FED7AA', color: '#9A3412' },
      'superadmin': { bg: '#F3E8FF', color: '#6B21A8' }
    };
    return colorMap[role] || { bg: '#F3F4F6', color: '#374151' };
  };

  const formatDate = (dateString) => {
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
      gap: '16px'
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
      alignItems: 'center'
    },
    statItem: {
      textAlign: 'center'
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
      margin: 0
    },
    roleBadge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    userInfo: {
      marginBottom: '16px'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#6B7280'
    },
    infoLabel: {
      fontWeight: '600',
      color: '#374151',
      width: '120px'
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
      marginBottom: '16px'
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
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#4F46E5';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
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
            e.target.style.borderBottomColor = '#4F46E5';
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
            e.target.style.borderBottomColor = '#4F46E5';
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
            e.target.style.borderBottomColor = '#4F46E5';
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
        {/* Stats Bar */}
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{pendingUsers.length}</div>
            <div style={styles.statLabel}>Total Pending</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{pendingUsers.filter(u => u.role === 'student').length}</div>
            <div style={styles.statLabel}>Students</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{pendingUsers.filter(u => u.role === 'faculty').length}</div>
            <div style={styles.statLabel}>Faculty</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>
              {pendingUsers.filter(u => ['hod', 'placement', 'student_body', 'sports'].includes(u.role)).length}
            </div>
            <div style={styles.statLabel}>Admins</div>
          </div>
        </div>

        {/* Filter Section */}
        <div style={styles.filterSection}>
          <span style={styles.filterLabel}>Filter by Role:</span>
          <button 
            style={{...styles.filterBtn, ...(filterRole === 'all' && styles.activeFilterBtn)}}
            onClick={() => setFilterRole('all')}
          >
            All ({pendingUsers.length})
          </button>
          <button 
            style={{...styles.filterBtn, ...(filterRole === 'student' && styles.activeFilterBtn)}}
            onClick={() => setFilterRole('student')}
          >
            Students ({pendingUsers.filter(u => u.role === 'student').length})
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
            T&P ({pendingUsers.filter(u => u.role === 'placement').length})
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
