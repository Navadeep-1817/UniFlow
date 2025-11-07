import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalFaculty: 0,
    totalAdmins: 0
  });

  useEffect(() => {
    // Get current user info
    const userEmail = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
    const userRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const fetchRemote = async () => {
      if (!token) {
        console.warn('No token found, loading mock data');
        return loadMock();
      }
      
      try {
        const statsRes = await fetch(`${API_BASE_URL}/superadmin/stats`, { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        });
        
        if (!statsRes.ok) {
          console.error('Failed to fetch stats:', statsRes.status);
          throw new Error(`HTTP ${statsRes.status}`);
        }
        
        const statsJson = await statsRes.json();
        if (statsJson && statsJson.success) {
          const data = statsJson.data;
          // build stats totals
          const totalUsers = data.totalUsers || 0;
          const totalStudents = (data.byRole || []).find(r => r._id === 'student')?.count || 0;
          const totalFaculty = (data.byRole || []).find(r => r._id === 'faculty')?.count || 0;
          const totalAdmins = (data.byRole || []).filter(r => ['academic_admin_hod','academic_admin_tp','non_academic_faculty_head','non_academic_team_rep','superadmin'].includes(r._id)).reduce((s, r) => s + r.count, 0);
          setStats({ totalUsers, totalStudents, totalFaculty, totalAdmins });
          console.log('Stats loaded:', { totalUsers, totalStudents, totalFaculty, totalAdmins });
        } else {
          loadMock();
        }

        const usersRes = await fetch(`${API_BASE_URL}/superadmin/users?limit=50`, { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        });
        
        if (usersRes.ok) {
          const usersJson = await usersRes.json();
          if (usersJson && usersJson.success) {
            const mapped = usersJson.data.map(u => ({ 
              id: u._id, 
              name: u.name, 
              email: u.email, 
              role: u.role, 
              department: u.department?.name || 'N/A', 
              university: u.university?.name || 'N/A', 
              status: u.isApproved ? 'Active' : 'Pending' 
            }));
            setUsers(mapped);
            console.log('Users loaded:', mapped.length);
          }
        }
      } catch (err) {
        console.error('Error fetching superadmin data:', err);
        loadMock();
      }
    };

    const loadMock = () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@university.edu', role: 'student', department: 'Computer Science', university: 'JNTU Hyderabad', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@university.edu', role: 'faculty', department: 'Electronics', university: 'JNTU Hyderabad', status: 'Active' },
        { id: 3, name: 'Dr. Kumar', email: 'kumar@university.edu', role: 'hod', department: 'Computer Science', university: 'JNTU Kakinada', status: 'Active' },
        { id: 4, name: 'Prof. Sharma', email: 'sharma@university.edu', role: 'placement', department: 'Training & Placement', university: 'Osmania University', status: 'Active' },
        { id: 5, name: 'Student Rep', email: 'rep@university.edu', role: 'student_body', department: 'Student Affairs', university: 'JNTU Hyderabad', status: 'Active' },
      ];
      setUsers(mockUsers);
      setStats({
        totalUsers: mockUsers.length,
        totalStudents: mockUsers.filter(u => u.role === 'student').length,
        totalFaculty: mockUsers.filter(u => u.role === 'faculty').length,
        totalAdmins: mockUsers.filter(u => ['hod', 'placement', 'student_body', 'sports', 'superadmin'].includes(u.role)).length
      });
    };

    fetchRemote();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      'student': 'Student',
      'faculty': 'Faculty',
      'hod': 'HOD',
      'placement': 'T&P Head',
      'student_body': 'Student Body Rep',
      'sports': 'Sports Admin',
      'superadmin': 'Super Admin'
    };
    return roleMap[role] || role;
  };

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
    logoutBtn: {
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '40px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#4F46E5',
      margin: '8px 0'
    },
    statLabel: {
      fontSize: '14px',
      color: '#6B7280',
      margin: 0
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      borderBottom: '2px solid #E5E7EB',
      paddingBottom: '0'
    },
    tab: {
      padding: '12px 24px',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '2px solid transparent',
      fontSize: '14px',
      fontWeight: '600',
      color: '#6B7280',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginBottom: '-2px'
    },
    activeTab: {
      color: '#4F46E5',
      borderBottomColor: '#4F46E5'
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      backgroundColor: '#F9FAFB',
      color: '#6B7280',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      borderBottom: '1px solid #E5E7EB'
    },
    td: {
      padding: '16px 12px',
      borderBottom: '1px solid #E5E7EB',
      fontSize: '14px',
      color: '#1F2937'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    roleBadge: {
      backgroundColor: '#EEF2FF',
      color: '#4F46E5'
    },
    statusBadge: {
      backgroundColor: '#D1FAE5',
      color: '#059669'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#6B7280'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>UniFlow</div>
          <h1 style={styles.title}>Super Admin Dashboard - Full Access</h1>
        </div>
        <button 
          style={styles.logoutBtn}
          onClick={handleLogout}
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
            borderBottom: '3px solid #4F46E5',
            fontSize: '14px',
            fontWeight: '600',
            color: '#4F46E5',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
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
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Users</p>
            <h2 style={styles.statNumber}>{stats.totalUsers}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Students</p>
            <h2 style={styles.statNumber}>{stats.totalStudents}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Faculty</p>
            <h2 style={styles.statNumber}>{stats.totalFaculty}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Admins</p>
            <h2 style={styles.statNumber}>{stats.totalAdmins}</h2>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{...styles.tab, ...(activeTab === 'overview' && styles.activeTab)}}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            style={{...styles.tab, ...(activeTab === 'users' && styles.activeTab)}}
            onClick={() => setActiveTab('users')}
          >
            All Users
          </button>
          <button
            style={{...styles.tab, ...(activeTab === 'admins' && styles.activeTab)}}
            onClick={() => setActiveTab('admins')}
          >
            Admins Only
          </button>
        </div>

        {/* Content Sections */}
        <div style={styles.section}>
          {activeTab === 'overview' && (
            <>
              <h3 style={styles.sectionTitle}>System Overview</h3>
              <p style={{color: '#6B7280', marginBottom: '20px'}}>
                As Super Admin, you have full access to view and manage all users, departments, and administrative roles across the platform.
              </p>
              
              {/* Quick Actions */}
              <div style={{marginBottom: '30px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB'}}>
                <h4 style={{color: '#1F2937', fontSize: '16px', marginBottom: '16px', fontWeight: '600'}}>Quick Actions</h4>
                <button
                  onClick={() => navigate('/superadmin/approval-queue')}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  📋 User Approval Queue →
                </button>
                <p style={{color: '#6B7280', fontSize: '13px', marginTop: '8px', marginLeft: '4px'}}>
                  Review and approve pending user registrations
                </p>
              </div>

              <div style={{marginTop: '20px'}}>
                <h4 style={{color: '#1F2937', fontSize: '16px', marginBottom: '12px'}}>Your Capabilities:</h4>
                <ul style={{color: '#6B7280', lineHeight: '2'}}>
                  <li>View all registered users across all roles</li>
                  <li>Monitor department-wise distribution</li>
                  <li>Track admin assignments (HOD, T&P, Student Body, Sports)</li>
                  <li>View university-wise user analytics</li>
                  <li>Access complete system logs and activities</li>
                  <li><strong>Approve or reject user registrations</strong></li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <>
              <h3 style={styles.sectionTitle}>All Registered Users</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>University</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td style={styles.td}>{user.name}</td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>
                        <span style={{...styles.badge, ...styles.roleBadge}}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td style={styles.td}>{user.department}</td>
                      <td style={styles.td}>{user.university}</td>
                      <td style={styles.td}>
                        <span style={{...styles.badge, ...styles.statusBadge}}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === 'admins' && (
            <>
              <h3 style={styles.sectionTitle}>Administrative Users</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Admin Role</th>
                    <th style={styles.th}>Department/Field</th>
                    <th style={styles.th}>University</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => ['hod', 'placement', 'student_body', 'sports', 'superadmin'].includes(u.role)).map(user => (
                    <tr key={user.id}>
                      <td style={styles.td}>{user.name}</td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>
                        <span style={{...styles.badge, ...styles.roleBadge}}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td style={styles.td}>{user.department}</td>
                      <td style={styles.td}>{user.university}</td>
                    </tr>
                  ))}
                  {users.filter(u => ['hod', 'placement', 'student_body', 'sports', 'superadmin'].includes(u.role)).length === 0 && (
                    <tr>
                      <td colSpan="5" style={{...styles.td, ...styles.emptyState}}>
                        No administrative users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
