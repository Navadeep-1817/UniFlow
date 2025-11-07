import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiMail, FiCheckCircle, FiAlertCircle, FiLogOut, FiRefreshCw } from 'react-icons/fi';

const PendingApproval = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    role: '',
    registeredDate: ''
  });
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Get user info from localStorage or session
    const storedEmail = localStorage.getItem('userEmail') || 'user@university.edu';
    const storedRole = localStorage.getItem('userRole') || 'Student';
    const storedName = localStorage.getItem('userName') || 'User';
    
    setUserInfo({
      name: storedName,
      email: storedEmail,
      role: storedRole,
      registeredDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    });
  }, []);

  const handleCheckStatus = () => {
    setChecking(true);
    // Simulate API call to check approval status
    setTimeout(() => {
      setChecking(false);
      // In real implementation, this would check with backend
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F9FAFB',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '48px',
      width: '100%',
      maxWidth: '600px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      textAlign: 'center'
    },
    iconContainer: {
      width: '120px',
      height: '120px',
      margin: '0 auto 24px',
      backgroundColor: '#FEF3C7',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      animation: 'pulse 2s ease-in-out infinite'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1F2937',
      margin: '0 0 12px 0'
    },
    subtitle: {
      fontSize: '16px',
      color: '#6B7280',
      margin: '0 0 32px 0',
      lineHeight: '1.6'
    },
    infoCard: {
      backgroundColor: '#F9FAFB',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      textAlign: 'left'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #E5E7EB'
    },
    infoLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#6B7280',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    infoValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1F2937'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#FEF3C7',
      color: '#92400E',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '24px'
    },
    timeline: {
      backgroundColor: '#F9FAFB',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      textAlign: 'left'
    },
    timelineTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '16px'
    },
    timelineItem: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
      position: 'relative'
    },
    timelineIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    timelineContent: {
      flex: 1
    },
    timelineText: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1F2937',
      margin: '0 0 4px 0'
    },
    timelineSubtext: {
      fontSize: '13px',
      color: '#6B7280',
      margin: 0
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    },
    primaryButton: {
      flex: 1,
      padding: '14px 24px',
      fontSize: '15px',
      fontWeight: '600',
      color: 'white',
      backgroundColor: '#4F46E5',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    secondaryButton: {
      flex: 1,
      padding: '14px 24px',
      fontSize: '15px',
      fontWeight: '600',
      color: '#4F46E5',
      backgroundColor: 'white',
      border: '2px solid #4F46E5',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    helpText: {
      fontSize: '13px',
      color: '#6B7280',
      marginTop: '24px',
      padding: '16px',
      backgroundColor: '#EFF6FF',
      borderRadius: '8px',
      border: '1px solid #DBEAFE'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
      
      <div style={styles.card}>
        {/* Status Icon */}
        <div style={styles.iconContainer}>
          <FiClock size={56} color="#F59E0B" />
        </div>

        {/* Status Badge */}
        <div style={styles.statusBadge}>
          <FiAlertCircle size={16} />
          Pending Approval
        </div>

        {/* Title & Subtitle */}
        <h1 style={styles.title}>Account Under Review</h1>
        <p style={styles.subtitle}>
          Your registration has been received and is currently being reviewed by the administration. 
          You will receive an email notification once your account is approved.
        </p>

        {/* User Info Card */}
        <div style={styles.infoCard}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>
              <FiMail size={16} />
              Email
            </span>
            <span style={styles.infoValue}>{userInfo.email}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Role</span>
            <span style={styles.infoValue}>{userInfo.role}</span>
          </div>
          <div style={{...styles.infoRow, borderBottom: 'none'}}>
            <span style={styles.infoLabel}>Registered On</span>
            <span style={styles.infoValue}>{userInfo.registeredDate}</span>
          </div>
        </div>

        {/* Timeline */}
        <div style={styles.timeline}>
          <h3 style={styles.timelineTitle}>Approval Process</h3>
          
          <div style={styles.timelineItem}>
            <div style={{...styles.timelineIcon, backgroundColor: '#D1FAE5'}}>
              <FiCheckCircle size={16} color="#10B981" />
            </div>
            <div style={styles.timelineContent}>
              <p style={styles.timelineText}>Registration Submitted</p>
              <p style={styles.timelineSubtext}>Your account has been created successfully</p>
            </div>
          </div>

          <div style={styles.timelineItem}>
            <div style={{...styles.timelineIcon, backgroundColor: '#FEF3C7'}}>
              <FiClock size={16} color="#F59E0B" />
            </div>
            <div style={styles.timelineContent}>
              <p style={styles.timelineText}>Awaiting Admin Review</p>
              <p style={styles.timelineSubtext}>Your application is in the approval queue</p>
            </div>
          </div>

          <div style={styles.timelineItem}>
            <div style={{...styles.timelineIcon, backgroundColor: '#E5E7EB'}}>
              <FiMail size={16} color="#6B7280" />
            </div>
            <div style={styles.timelineContent}>
              <p style={styles.timelineText}>Email Notification</p>
              <p style={styles.timelineSubtext}>You'll be notified once approved</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button
            style={styles.primaryButton}
            onClick={handleCheckStatus}
            disabled={checking}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FiRefreshCw size={18} style={checking ? {animation: 'spin 1s linear infinite'} : {}} />
            {checking ? 'Checking...' : 'Check Status'}
          </button>

          <button
            style={styles.secondaryButton}
            onClick={handleLogout}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#EEF2FF';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>

        {/* Help Text */}
        <div style={styles.helpText}>
          <strong>Need help?</strong> If you have any questions or concerns about your registration, 
          please contact the administration at <strong>admin@uniflow.edu</strong>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default PendingApproval;
