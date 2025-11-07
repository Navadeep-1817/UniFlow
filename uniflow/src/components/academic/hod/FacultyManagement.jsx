import React, { useState, useEffect } from 'react';
import HODTopNav from './HODTopNav';
import { 
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiUser,
  FiX,
  FiSave,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiBarChart2,
  FiActivity
} from 'react-icons/fi';

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    department: 'Computer Science',
    qualification: '',
    experience: '',
    status: 'active'
  });

  useEffect(() => {
    // Mock faculty data
    const mockFaculty = [
      {
        id: 1,
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@university.edu',
        phone: '+91 98765 43210',
        specialization: 'Artificial Intelligence',
        department: 'Computer Science',
        qualification: 'Ph.D. in Computer Science',
        experience: '15 years',
        status: 'active',
        eventsAssigned: 8,
        joinedDate: '2015-08-15',
        workload: 85,
        assignedEvents: [
          { id: 1, name: 'AI & ML Workshop', type: 'FDP', sessions: 6, attendance: 92 },
          { id: 2, name: 'Data Science SDP', type: 'SDP', sessions: 10, attendance: 88 },
          { id: 3, name: 'Python Programming', type: 'SDP', sessions: 8, attendance: 95 }
        ],
        attendanceContribution: {
          totalSessions: 24,
          sessionsCompleted: 22,
          avgAttendance: 91.7,
          studentsImpacted: 145
        }
      },
      {
        id: 2,
        name: 'Prof. Rajesh Kumar',
        email: 'rajesh.kumar@university.edu',
        phone: '+91 98765 43211',
        specialization: 'Web Development',
        department: 'Computer Science',
        qualification: 'M.Tech in CSE',
        experience: '12 years',
        status: 'active',
        eventsAssigned: 5,
        joinedDate: '2018-01-10',
        workload: 65,
        assignedEvents: [
          { id: 4, name: 'Web Development SDP', type: 'SDP', sessions: 10, attendance: 87 },
          { id: 5, name: 'React Workshop', type: 'FDP', sessions: 4, attendance: 90 }
        ],
        attendanceContribution: {
          totalSessions: 14,
          sessionsCompleted: 14,
          avgAttendance: 88.5,
          studentsImpacted: 98
        }
      },
      {
        id: 3,
        name: 'Dr. Anita Desai',
        email: 'anita.desai@university.edu',
        phone: '+91 98765 43212',
        specialization: 'Data Science',
        department: 'Computer Science',
        qualification: 'Ph.D. in Data Analytics',
        experience: '10 years',
        status: 'active',
        eventsAssigned: 6,
        joinedDate: '2019-07-20',
        workload: 75,
        assignedEvents: [
          { id: 6, name: 'CRT Training Batch 1', type: 'CRT', sessions: 8, attendance: 94 },
          { id: 7, name: 'Analytics Workshop', type: 'FDP', sessions: 5, attendance: 89 }
        ],
        attendanceContribution: {
          totalSessions: 13,
          sessionsCompleted: 13,
          avgAttendance: 91.5,
          studentsImpacted: 120
        }
      },
      {
        id: 4,
        name: 'Prof. Suresh Patel',
        email: 'suresh.patel@university.edu',
        phone: '+91 98765 43213',
        specialization: 'Database Systems',
        department: 'Computer Science',
        qualification: 'M.Tech in IT',
        experience: '8 years',
        status: 'on_leave',
        eventsAssigned: 3,
        joinedDate: '2020-02-14',
        workload: 40,
        assignedEvents: [
          { id: 8, name: 'Database Workshop', type: 'FDP', sessions: 6, attendance: 85 }
        ],
        attendanceContribution: {
          totalSessions: 6,
          sessionsCompleted: 4,
          avgAttendance: 85,
          studentsImpacted: 45
        }
      },
      {
        id: 5,
        name: 'Dr. Meena Singh',
        email: 'meena.singh@university.edu',
        phone: '+91 98765 43214',
        specialization: 'Machine Learning',
        department: 'Computer Science',
        qualification: 'Ph.D. in AI/ML',
        experience: '14 years',
        status: 'active',
        eventsAssigned: 7,
        joinedDate: '2016-09-01',
        workload: 92,
        assignedEvents: [
          { id: 9, name: 'ML Fundamentals', type: 'SDP', sessions: 12, attendance: 93 },
          { id: 10, name: 'Deep Learning FDP', type: 'FDP', sessions: 8, attendance: 91 },
          { id: 11, name: 'CRT Advanced', type: 'CRT', sessions: 6, attendance: 89 }
        ],
        attendanceContribution: {
          totalSessions: 26,
          sessionsCompleted: 24,
          avgAttendance: 91,
          studentsImpacted: 165
        }
      }
    ];

    setFaculty(mockFaculty);
    setFilteredFaculty(mockFaculty);
  }, []);

  useEffect(() => {
    let filtered = faculty;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(f => f.status === filterStatus);
    }

    setFilteredFaculty(filtered);
  }, [searchQuery, filterStatus, faculty]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingFaculty) {
      setFaculty(faculty.map(f => 
        f.id === editingFaculty.id ? { ...f, ...formData } : f
      ));
      showToast('Faculty updated successfully!', 'success');
    } else {
      const newFaculty = {
        id: faculty.length + 1,
        ...formData,
        eventsAssigned: 0,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setFaculty([newFaculty, ...faculty]);
      showToast('Faculty added successfully!', 'success');
    }
    
    closeModal();
  };

  const openModal = (facultyMember = null) => {
    if (facultyMember) {
      setFormData({
        name: facultyMember.name,
        email: facultyMember.email,
        phone: facultyMember.phone,
        specialization: facultyMember.specialization,
        department: facultyMember.department,
        qualification: facultyMember.qualification,
        experience: facultyMember.experience,
        status: facultyMember.status
      });
      setEditingFaculty(facultyMember);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        department: 'Computer Science',
        qualification: '',
        experience: '',
        status: 'active'
      });
      setEditingFaculty(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFaculty(null);
  };

  const handleDelete = (facultyId) => {
    if (window.confirm('Are you sure you want to remove this faculty member?')) {
      setFaculty(faculty.filter(f => f.id !== facultyId));
      showToast('Faculty removed successfully!', 'success');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      active: { bg: '#D1FAE5', color: '#065F46', icon: <FiCheckCircle size={14} /> },
      on_leave: { bg: '#FEF3C7', color: '#92400E', icon: <FiXCircle size={14} /> },
      inactive: { bg: '#F3F4F6', color: '#6B7280', icon: <FiXCircle size={14} /> }
    };
    return styles[status] || styles.active;
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 90) return { bg: '#FEE2E2', color: '#991B1B', label: 'High' };
    if (workload >= 70) return { bg: '#FEF3C7', color: '#92400E', label: 'Medium' };
    return { bg: '#D1FAE5', color: '#065F46', label: 'Low' };
  };

  const handleViewDetails = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setShowDetailModal(true);
  };

  return (
    <div style={styles.container}>
      <HODTopNav />
      
      {/* Toast */}
      {toast.show && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'success' ? '#10B981' : toast.type === 'error' ? '#EF4444' : '#3B82F6'
        }}>
          {toast.message}
        </div>
      )}

      <div style={styles.content}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Faculty Management</h1>
            <p style={styles.pageSubtitle}>Manage department faculty members</p>
          </div>
          <button 
            onClick={() => openModal()}
            style={styles.addBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FiUserPlus size={18} /> Add Faculty
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{faculty.length}</div>
            <div style={styles.statLabel}>Total Faculty</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{faculty.filter(f => f.status === 'active').length}</div>
            <div style={styles.statLabel}>Active</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{faculty.filter(f => f.status === 'on_leave').length}</div>
            <div style={styles.statLabel}>On Leave</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{faculty.reduce((sum, f) => sum + f.eventsAssigned, 0)}</div>
            <div style={styles.statLabel}>Events Assigned</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div style={styles.filtersBar}>
          <div style={styles.searchBox}>
            <FiSearch size={18} color="#6B7280" />
            <input type="text" placeholder="Search by name, email, or specialization..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.filterGroup}>
            <FiFilter size={16} color="#6B7280" />
            <span style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>Status:</span>
            <div style={styles.filterButtons}>
              {['all', 'active', 'on_leave', 'inactive'].map(status => (
                <button key={status} onClick={() => setFilterStatus(status)} style={{ ...styles.filterBtn, backgroundColor: filterStatus === status ? '#4F46E5' : '#FFFFFF', color: filterStatus === status ? '#FFFFFF' : '#6B7280', border: filterStatus === status ? 'none' : '1px solid #E5E7EB' }} onMouseEnter={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; } }} onMouseLeave={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                  {status === 'all' ? 'All' : status === 'on_leave' ? 'On Leave' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Faculty Table */}
        <div style={styles.tableSection}>
          <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px'}}>Faculty List ({filteredFaculty.length})</h3>
          {filteredFaculty.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>
              <FiUser size={48} color="#9CA3AF" style={{marginBottom: '16px'}} />
              <p>No faculty members found</p>
            </div>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Email</th>
                    <th style={styles.tableHeader}>Phone</th>
                    <th style={styles.tableHeader}>Specialization</th>
                    <th style={styles.tableHeader}>Qualification</th>
                    <th style={styles.tableHeader}>Experience</th>
                    <th style={styles.tableHeader}>Workload</th>
                    <th style={styles.tableHeader}>Events</th>
                    <th style={styles.tableHeader}>Status</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map(f => {
                    const statusStyle = getStatusStyle(f.status);
                    return (
                      <tr key={f.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>
                          <div style={{fontWeight: '600', color: '#1F2937'}}>{f.name}</div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.emailCell}>
                            <FiMail size={14} color="#6B7280" />
                            {f.email}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.phoneCell}>
                            <FiPhone size={14} color="#6B7280" />
                            {f.phone}
                          </div>
                        </td>
                        <td style={styles.tableCell}>{f.specialization}</td>
                        <td style={styles.tableCell}>{f.qualification}</td>
                        <td style={styles.tableCell}>{f.experience}</td>
                        <td style={styles.tableCell}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <div style={styles.workloadBar}>
                              <div style={{...styles.workloadFill, width: `${f.workload}%`, backgroundColor: getWorkloadColor(f.workload).bg.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(', ')}}></div>
                            </div>
                            <span style={{...styles.workloadBadge, backgroundColor: getWorkloadColor(f.workload).bg, color: getWorkloadColor(f.workload).color}}>
                              {f.workload}%
                            </span>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.eventsBadge}>{f.eventsAssigned}</span>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={{...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color}}>
                            {statusStyle.icon}
                            <span>{f.status === 'on_leave' ? 'On Leave' : f.status.charAt(0).toUpperCase() + f.status.slice(1)}</span>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.actionButtons}>
                            <button onClick={() => handleViewDetails(f)} style={styles.viewDetailsBtn} title="View Details" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EEF2FF'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                              <FiEye size={16} />
                            </button>
                            <button onClick={() => openModal(f)} style={styles.editBtn} title="Edit" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DBEAFE'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                              <FiEdit size={16} />
                            </button>
                            <button onClick={() => handleDelete(f.id)} style={styles.deleteBtn} title="Delete" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}>
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>{editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}</h3>
                <button onClick={closeModal} style={styles.closeBtn} onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}>
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} style={styles.modalBody}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={styles.input} placeholder="Dr. John Doe" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={styles.input} placeholder="john.doe@university.edu" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required style={styles.input} placeholder="+91 98765 43210" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Specialization *</label>
                    <input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} required style={styles.input} placeholder="Artificial Intelligence" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Department *</label>
                    <select name="department" value={formData.department} onChange={handleInputChange} required style={styles.input}>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Qualification *</label>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} required style={styles.input} placeholder="Ph.D. in Computer Science" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Experience *</label>
                    <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} required style={styles.input} placeholder="10 years" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} style={styles.input}>
                      <option value="active">Active</option>
                      <option value="on_leave">On Leave</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div style={styles.modalFooter}>
                  <button type="button" onClick={closeModal} style={styles.cancelBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <FiSave size={16} /> {editingFaculty ? 'Update' : 'Add'} Faculty
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Faculty Details Modal */}
        {showDetailModal && selectedFaculty && (
          <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
            <div style={{...styles.modalContent, maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>{selectedFaculty.name}</h3>
                  <p style={{margin: '4px 0 0 0', color: '#6B7280', fontSize: '14px'}}>{selectedFaculty.specialization}</p>
                </div>
                <button onClick={() => setShowDetailModal(false)} style={styles.closeBtn} onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}>
                  <FiX size={20} />
                </button>
              </div>
              <div style={styles.modalBody}>
                {/* Contact Info */}
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}>Contact Information</h4>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>
                      <FiMail size={16} color="#6B7280" />
                      <div>
                        <div style={styles.detailLabel}>Email</div>
                        <div style={styles.detailValue}>{selectedFaculty.email}</div>
                      </div>
                    </div>
                    <div style={styles.detailItem}>
                      <FiPhone size={16} color="#6B7280" />
                      <div>
                        <div style={styles.detailLabel}>Phone</div>
                        <div style={styles.detailValue}>{selectedFaculty.phone}</div>
                      </div>
                    </div>
                    <div style={styles.detailItem}>
                      <FiUser size={16} color="#6B7280" />
                      <div>
                        <div style={styles.detailLabel}>Qualification</div>
                        <div style={styles.detailValue}>{selectedFaculty.qualification}</div>
                      </div>
                    </div>
                    <div style={styles.detailItem}>
                      <FiClock size={16} color="#6B7280" />
                      <div>
                        <div style={styles.detailLabel}>Experience</div>
                        <div style={styles.detailValue}>{selectedFaculty.experience}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workload Overview */}
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}>
                    <FiTrendingUp size={18} /> Workload Analysis
                  </h4>
                  <div style={styles.workloadSection}>
                    <div style={styles.workloadCircle}>
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                        <circle cx="60" cy="60" r="50" fill="none" stroke={getWorkloadColor(selectedFaculty.workload).bg} strokeWidth="10" strokeDasharray={`${selectedFaculty.workload * 3.14} 314`} strokeDashoffset="0" transform="rotate(-90 60 60)" />
                        <text x="60" y="55" textAnchor="middle" fontSize="24" fontWeight="700" fill="#1F2937">{selectedFaculty.workload}%</text>
                        <text x="60" y="75" textAnchor="middle" fontSize="12" fill="#6B7280">{getWorkloadColor(selectedFaculty.workload).label}</text>
                      </svg>
                    </div>
                    <div style={{flex: 1}}>
                      <div style={styles.workloadStats}>
                        <div style={styles.workloadStatItem}>
                          <FiCalendar size={20} color="#4F46E5" />
                          <div>
                            <div style={styles.workloadStatValue}>{selectedFaculty.eventsAssigned}</div>
                            <div style={styles.workloadStatLabel}>Events Assigned</div>
                          </div>
                        </div>
                        <div style={styles.workloadStatItem}>
                          <FiActivity size={20} color="#10B981" />
                          <div>
                            <div style={styles.workloadStatValue}>{selectedFaculty.attendanceContribution.totalSessions}</div>
                            <div style={styles.workloadStatLabel}>Total Sessions</div>
                          </div>
                        </div>
                        <div style={styles.workloadStatItem}>
                          <FiBarChart2 size={20} color="#F59E0B" />
                          <div>
                            <div style={styles.workloadStatValue}>{selectedFaculty.attendanceContribution.sessionsCompleted}</div>
                            <div style={styles.workloadStatLabel}>Completed</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Events */}
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}>
                    <FiCalendar size={18} /> Assigned Events ({selectedFaculty.assignedEvents.length})
                  </h4>
                  <div style={styles.eventsList}>
                    {selectedFaculty.assignedEvents.map(event => (
                      <div key={event.id} style={styles.eventItem}>
                        <div style={styles.eventItemHeader}>
                          <div style={styles.eventItemTitle}>{event.name}</div>
                          <div style={{...styles.eventTypeBadge, backgroundColor: event.type === 'FDP' ? '#4F46E5' : event.type === 'SDP' ? '#10B981' : '#F59E0B'}}>
                            {event.type}
                          </div>
                        </div>
                        <div style={styles.eventItemMeta}>
                          <div style={styles.eventItemMetaItem}>
                            <FiClock size={14} color="#6B7280" />
                            <span>{event.sessions} sessions</span>
                          </div>
                          <div style={styles.eventItemMetaItem}>
                            <FiCheckCircle size={14} color="#6B7280" />
                            <span>{event.attendance}% attendance</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attendance Contribution */}
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}>
                    <FiCheckCircle size={18} /> Attendance Contribution
                  </h4>
                  <div style={styles.contributionGrid}>
                    <div style={styles.contributionCard}>
                      <div style={styles.contributionValue}>{selectedFaculty.attendanceContribution.avgAttendance}%</div>
                      <div style={styles.contributionLabel}>Average Attendance</div>
                      <div style={styles.contributionBar}>
                        <div style={{...styles.contributionBarFill, width: `${selectedFaculty.attendanceContribution.avgAttendance}%`, backgroundColor: '#10B981'}}></div>
                      </div>
                    </div>
                    <div style={styles.contributionCard}>
                      <div style={styles.contributionValue}>{selectedFaculty.attendanceContribution.studentsImpacted}</div>
                      <div style={styles.contributionLabel}>Students Impacted</div>
                    </div>
                    <div style={styles.contributionCard}>
                      <div style={styles.contributionValue}>{selectedFaculty.attendanceContribution.sessionsCompleted}/{selectedFaculty.attendanceContribution.totalSessions}</div>
                      <div style={styles.contributionLabel}>Sessions Completion</div>
                      <div style={styles.contributionBar}>
                        <div style={{...styles.contributionBarFill, width: `${(selectedFaculty.attendanceContribution.sessionsCompleted / selectedFaculty.attendanceContribution.totalSessions) * 100}%`, backgroundColor: '#4F46E5'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
  content: {
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
  addBtn: {
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
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6B7280'
  },
  filtersBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center'
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
    gap: '12px',
    flexWrap: 'wrap'
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  tableSection: {
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
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderRow: {
    backgroundColor: '#F9FAFB',
    borderBottom: '2px solid #E5E7EB'
  },
  tableHeader: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableRow: {
    borderBottom: '1px solid #F3F4F6',
    transition: 'background-color 0.2s ease'
  },
  tableCell: {
    padding: '16px',
    fontSize: '14px',
    color: '#374151'
  },
  emailCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  },
  phoneCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  },
  eventsBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    width: 'fit-content'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    padding: '8px',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '8px',
    color: '#3B82F6',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  deleteBtn: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#DC2626',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    animation: 'slideUp 0.3s ease-out'
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937'
  },
  closeBtn: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#6B7280',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  modalBody: {
    padding: '24px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
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
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB'
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
  workloadBar: {
    flex: 1,
    height: '8px',
    backgroundColor: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden',
    minWidth: '60px'
  },
  workloadFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  },
  workloadBadge: {
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0
  },
  viewDetailsBtn: {
    padding: '8px',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '8px',
    color: '#4F46E5',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  detailSection: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #E5E7EB'
  },
  detailSectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  detailItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'start'
  },
  detailLabel: {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '4px'
  },
  detailValue: {
    fontSize: '14px',
    color: '#1F2937',
    fontWeight: '500'
  },
  workloadSection: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center'
  },
  workloadCircle: {
    flexShrink: 0
  },
  workloadStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  workloadStatItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px'
  },
  workloadStatValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 1
  },
  workloadStatLabel: {
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '4px'
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  eventItem: {
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    border: '1px solid #E5E7EB'
  },
  eventItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  eventItemTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1F2937'
  },
  eventTypeBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '600'
  },
  eventItemMeta: {
    display: 'flex',
    gap: '16px'
  },
  eventItemMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6B7280'
  },
  contributionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  contributionCard: {
    padding: '20px',
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    textAlign: 'center'
  },
  contributionValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '8px'
  },
  contributionLabel: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '12px'
  },
  contributionBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  contributionBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  }
};

export default FacultyManagement;
