import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
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
  FiEye,
  FiCalendar,
  FiAward,
  FiTrendingUp,
  FiCheckCircle,
  FiBookOpen,
  FiBarChart2,
  FiTarget
} from 'react-icons/fi';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterSection, setFilterSection] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    email: '',
    phone: '',
    year: '1',
    section: 'A',
    department: 'Computer Science',
    cgpa: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    if (!token) {
      showToast('Authentication required', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/hod/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      console.log('Students data received:', data);
      
      // Transform data to match component structure
      const studentsData = (data.data || []).map(student => ({
        id: student._id,
        rollNo: student.rollNumber || 'N/A',
        name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.name || 'Unknown',
        email: student.email || 'N/A',
        phone: student.phone || 'N/A',
        year: student.year?.toString() || '1',
        section: student.section || 'A',
        department: student.department?.name || 'N/A',
        cgpa: student.cgpa || 'N/A',
        profilePicture: student.profilePicture,
        eventsParticipated: 0,
        performanceMetrics: {
          averageScore: 0
        }
      }));

      setStudents(studentsData);
      setFilteredStudents(studentsData);
      
      if (studentsData.length === 0) {
        showToast('No students found in your department', 'info');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      showToast(error.message || 'Failed to fetch students', 'error');
      setStudents([]);
      setFilteredStudents([]);
    }
  };

  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Year filter
    if (filterYear !== 'all') {
      filtered = filtered.filter(s => s.year === filterYear);
    }

    // Section filter
    if (filterSection !== 'all') {
      filtered = filtered.filter(s => s.section === filterSection);
    }

    setFilteredStudents(filtered);
  }, [searchQuery, filterYear, filterSection, students]);

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
    
    if (editingStudent) {
      setStudents(students.map(s => 
        s.id === editingStudent.id ? { ...s, ...formData } : s
      ));
      showToast('Student updated successfully!', 'success');
    } else {
      const newStudent = {
        id: students.length + 1,
        ...formData,
        eventsParticipated: 0,
        eventDetails: [],
        performanceMetrics: {
          overallAttendance: 0,
          certificatesEarned: 0,
          averageScore: 0,
          rank: 0
        },
        achievements: []
      };
      setStudents([newStudent, ...students]);
      showToast('Student added successfully!', 'success');
    }
    
    closeModal();
  };

  const openModal = (student = null) => {
    if (student) {
      setFormData({
        rollNo: student.rollNo,
        name: student.name,
        email: student.email,
        phone: student.phone,
        year: student.year,
        section: student.section,
        department: student.department,
        cgpa: student.cgpa
      });
      setEditingStudent(student);
    } else {
      setFormData({
        rollNo: '',
        name: '',
        email: '',
        phone: '',
        year: '1',
        section: 'A',
        department: 'Computer Science',
        cgpa: ''
      });
      setEditingStudent(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      setStudents(students.filter(s => s.id !== studentId));
      showToast('Student removed successfully!', 'success');
    }
  };

  const getPerformanceColor = (cgpa) => {
    if (cgpa >= 9) return { bg: '#D1FAE5', color: '#065F46' };
    if (cgpa >= 7.5) return { bg: '#DBEAFE', color: '#1E40AF' };
    if (cgpa >= 6) return { bg: '#FEF3C7', color: '#92400E' };
    return { bg: '#FEE2E2', color: '#991B1B' };
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
            <h1 style={styles.pageTitle}>Student Management</h1>
            <p style={styles.pageSubtitle}>View and track department students and their performance</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{students.length}</div>
            <div style={styles.statLabel}>Total Students</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{students.reduce((sum, s) => sum + s.eventsParticipated, 0)}</div>
            <div style={styles.statLabel}>Total Participations</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{(students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2)}</div>
            <div style={styles.statLabel}>Average CGPA</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{students.reduce((sum, s) => sum + s.performanceMetrics.certificatesEarned, 0)}</div>
            <div style={styles.statLabel}>Certificates Earned</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div style={styles.filtersBar}>
          <div style={styles.searchBox}>
            <FiSearch size={18} color="#6B7280" />
            <input type="text" placeholder="Search by name, roll no, or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.filterGroup}>
            <FiFilter size={16} color="#6B7280" />
            <span style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>Year:</span>
            <div style={styles.filterButtons}>
              {['all', '1', '2', '3', '4'].map(year => (
                <button key={year} onClick={() => setFilterYear(year)} style={{ ...styles.filterBtn, backgroundColor: filterYear === year ? '#4F46E5' : '#FFFFFF', color: filterYear === year ? '#FFFFFF' : '#6B7280', border: filterYear === year ? 'none' : '1px solid #E5E7EB' }} onMouseEnter={(e) => { if (filterYear !== year) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; } }} onMouseLeave={(e) => { if (filterYear !== year) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                  {year === 'all' ? 'All' : `${year}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year`}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.filterGroup}>
            <span style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>Section:</span>
            <div style={styles.filterButtons}>
              {['all', 'A', 'B', 'C'].map(section => (
                <button key={section} onClick={() => setFilterSection(section)} style={{ ...styles.filterBtn, backgroundColor: filterSection === section ? '#4F46E5' : '#FFFFFF', color: filterSection === section ? '#FFFFFF' : '#6B7280', border: filterSection === section ? 'none' : '1px solid #E5E7EB' }} onMouseEnter={(e) => { if (filterSection !== section) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; } }} onMouseLeave={(e) => { if (filterSection !== section) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                  {section === 'all' ? 'All' : `Section ${section}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div style={styles.tableSection}>
          <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px'}}>Students List ({filteredStudents.length})</h3>
          {filteredStudents.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>
              <FiUser size={48} color="#9CA3AF" style={{marginBottom: '16px'}} />
              <p>No students found</p>
            </div>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Roll No</th>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Email</th>
                    <th style={styles.tableHeader}>Year</th>
                    <th style={styles.tableHeader}>Section</th>
                    <th style={styles.tableHeader}>CGPA</th>
                    <th style={styles.tableHeader}>Events</th>
                    <th style={styles.tableHeader}>Performance</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(s => {
                    const perfColor = getPerformanceColor(s.cgpa);
                    return (
                      <tr key={s.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>
                          <div style={{fontWeight: '600', color: '#4F46E5'}}>{s.rollNo}</div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={{fontWeight: '600', color: '#1F2937'}}>{s.name}</div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.emailCell}>
                            <FiMail size={14} color="#6B7280" />
                            {s.email}
                          </div>
                        </td>
                        <td style={styles.tableCell}>{s.year}{s.year === '1' ? 'st' : s.year === '2' ? 'nd' : s.year === '3' ? 'rd' : 'th'} Year</td>
                        <td style={styles.tableCell}>Section {s.section}</td>
                        <td style={styles.tableCell}>
                          <span style={{...styles.cgpaBadge, backgroundColor: perfColor.bg, color: perfColor.color}}>
                            {s.cgpa}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.eventsBadge}>
                            <FiCalendar size={14} />
                            <span>{s.eventsParticipated}</span>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.performanceBadge}>
                            <FiTrendingUp size={14} />
                            <span>{s.performanceMetrics.averageScore}%</span>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.actionButtons}>
                            <button onClick={() => handleViewDetails(s)} style={styles.viewDetailsBtn} title="View Details" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EEF2FF'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                              <FiEye size={16} />
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

        {/* Add/Edit Student Modal */}
        {showModal && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                <button onClick={closeModal} style={styles.closeBtn} onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}>
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} style={styles.modalBody}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Roll Number *</label>
                    <input type="text" name="rollNo" value={formData.rollNo} onChange={handleInputChange} required style={styles.input} placeholder="CS21001" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={styles.input} placeholder="John Doe" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={styles.input} placeholder="student@example.edu" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required style={styles.input} placeholder="+91 98765 43210" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Year *</label>
                    <select name="year" value={formData.year} onChange={handleInputChange} required style={styles.input}>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Section *</label>
                    <select name="section" value={formData.section} onChange={handleInputChange} required style={styles.input}>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
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
                    <label style={styles.label}>CGPA *</label>
                    <input type="number" name="cgpa" value={formData.cgpa} onChange={handleInputChange} required style={styles.input} placeholder="8.5" min="0" max="10" step="0.01" />
                  </div>
                </div>
                <div style={styles.modalFooter}>
                  <button type="button" onClick={closeModal} style={styles.cancelBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <FiSave size={16} /> {editingStudent ? 'Update' : 'Add'} Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Student Details Modal */}
        {showDetailModal && selectedStudent && (
          <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
            <div style={{...styles.modalContent, maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>{selectedStudent.name}</h3>
                  <p style={{margin: '4px 0 0 0', color: '#6B7280', fontSize: '14px'}}>{selectedStudent.rollNo} • {selectedStudent.year}{selectedStudent.year === '1' ? 'st' : selectedStudent.year === '2' ? 'nd' : selectedStudent.year === '3' ? 'rd' : 'th'} Year Section {selectedStudent.section}</p>
                </div>
                <button onClick={() => setShowDetailModal(false)} style={styles.closeBtn} onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}>
                  <FiX size={20} />
                </button>
              </div>
              <div style={styles.modalBody}>
                {/* Academic Performance */}
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}><FiTrendingUp size={18} /> Academic Performance</h4>
                  <div style={styles.performanceGrid}>
                    <div style={styles.performanceCard}>
                      <div style={styles.performanceValue}>{selectedStudent.cgpa}</div>
                      <div style={styles.performanceLabel}>CGPA</div>
                    </div>
                    <div style={styles.performanceCard}>
                      <div style={styles.performanceValue}>#{selectedStudent.performanceMetrics.rank}</div>
                      <div style={styles.performanceLabel}>Class Rank</div>
                    </div>
                    <div style={styles.performanceCard}>
                      <div style={styles.performanceValue}>{selectedStudent.performanceMetrics.averageScore}%</div>
                      <div style={styles.performanceLabel}>Average Score</div>
                    </div>
                    <div style={styles.performanceCard}>
                      <div style={styles.performanceValue}>{selectedStudent.performanceMetrics.overallAttendance}%</div>
                      <div style={styles.performanceLabel}>Attendance</div>
                    </div>
                  </div>
                </div>

                {/* Event Participation */}
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}><FiCalendar size={18} /> Event Participation ({selectedStudent.eventDetails.length})</h4>
                  <div style={styles.eventsList}>
                    {selectedStudent.eventDetails.map(event => (
                      <div key={event.id} style={styles.eventItemCard}>
                        <div style={styles.eventItemHeader}>
                          <div style={styles.eventItemTitle}>{event.name}</div>
                          <div style={{...styles.eventTypeBadge, backgroundColor: event.type === 'FDP' ? '#4F46E5' : event.type === 'SDP' ? '#10B981' : '#F59E0B'}}>
                            {event.type}
                          </div>
                        </div>
                        <div style={styles.eventItemMeta}>
                          <div style={styles.metaItem}>
                            <FiCheckCircle size={14} color="#6B7280" />
                            <span>Attendance: {event.attendance}%</span>
                          </div>
                          <div style={styles.metaItem}>
                            <FiAward size={14} color="#6B7280" />
                            <span>Performance: {event.performance}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}><FiAward size={18} /> Achievements & Certifications</h4>
                  <div style={styles.achievementsList}>
                    <div style={styles.achievementCard}>
                      <FiTarget size={24} color="#4F46E5" />
                      <div>
                        <div style={styles.achievementCount}>{selectedStudent.performanceMetrics.certificatesEarned}</div>
                        <div style={styles.achievementLabel}>Certificates Earned</div>
                      </div>
                    </div>
                    {selectedStudent.achievements.map((achievement, index) => (
                      <div key={index} style={styles.achievementItem}>
                        <FiCheckCircle size={16} color="#10B981" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}><FiUser size={18} /> Contact Information</h4>
                  <div style={styles.contactGrid}>
                    <div style={styles.contactItem}>
                      <FiMail size={16} color="#6B7280" />
                      <div>
                        <div style={styles.contactLabel}>Email</div>
                        <div style={styles.contactValue}>{selectedStudent.email}</div>
                      </div>
                    </div>
                    <div style={styles.contactItem}>
                      <FiPhone size={16} color="#6B7280" />
                      <div>
                        <div style={styles.contactLabel}>Phone</div>
                        <div style={styles.contactValue}>{selectedStudent.phone}</div>
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
    marginBottom: '24px'
  },
  filtersBar: {
    marginBottom: '24px'
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
  cgpaBadge: {
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600'
  },
  eventsBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    width: 'fit-content'
  },
  performanceBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    width: 'fit-content'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
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
  performanceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px'
  },
  performanceCard: {
    padding: '20px',
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    textAlign: 'center'
  },
  performanceValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '8px'
  },
  performanceLabel: {
    fontSize: '14px',
    color: '#6B7280'
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  eventItemCard: {
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
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6B7280'
  },
  achievementsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  achievementCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#EEF2FF',
    borderRadius: '12px'
  },
  achievementCount: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937'
  },
  achievementLabel: {
    fontSize: '14px',
    color: '#6B7280'
  },
  achievementItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#374151'
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  contactItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'start'
  },
  contactLabel: {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '4px'
  },
  contactValue: {
    fontSize: '14px',
    color: '#1F2937',
    fontWeight: '500'
  }
};

export default StudentManagement;
