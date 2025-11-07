import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUsers, FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiSearch, FiFilter, FiCheckCircle, FiBarChart, FiAward, FiTrendingUp, FiUserCheck } from 'react-icons/fi';
import PlacementTopNav from './PlacementTopNav';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const CRTSessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    title: '',
    type: 'Aptitude',
    trainerName: '',
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    venue: '',
    capacity: '',
    description: '',
    topics: ''
  });

  useEffect(() => {
    const mockSessions = [
      { id: 1, title: 'Quantitative Aptitude Training', type: 'Aptitude', trainerName: 'Prof. Rajesh Kumar', date: '2024-12-15', startTime: '09:00', endTime: '13:00', venue: 'Auditorium', capacity: 100, registered: 85, attended: 82, description: 'Number systems, percentages, ratios', topics: 'Numbers, Algebra, Geometry', status: 'completed', avgScore: 78 },
      { id: 2, title: 'Verbal Ability Workshop', type: 'Verbal', trainerName: 'Dr. Priya Sharma', date: '2024-12-18', startTime: '10:00', endTime: '16:00', venue: 'Conference Hall A', capacity: 80, registered: 72, attended: 70, description: 'Grammar, comprehension, vocabulary', topics: 'Grammar, RC, Vocabulary', status: 'completed', avgScore: 72 },
      { id: 3, title: 'Soft Skills Development', type: 'Soft Skills', trainerName: 'Ms. Anjali Mehta', date: '2024-12-20', startTime: '09:00', endTime: '17:00', venue: 'Seminar Hall', capacity: 60, registered: 58, attended: 0, description: 'Communication, teamwork, leadership', topics: 'Communication, Leadership', status: 'upcoming', avgScore: 0 },
      { id: 4, title: 'Logical Reasoning Training', type: 'Aptitude', trainerName: 'Mr. Amit Patel', date: '2024-12-22', startTime: '14:00', endTime: '18:00', venue: 'Lab 301', capacity: 50, registered: 48, attended: 0, description: 'Puzzles, patterns, logical deduction', topics: 'Puzzles, Series, Patterns', status: 'upcoming', avgScore: 0 }
    ];
    setSessions(mockSessions);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSession = (e) => {
    e.preventDefault();
    const newSession = { id: Date.now(), ...formData, registered: 0, attended: 0, status: 'upcoming', avgScore: 0 };
    setSessions([newSession, ...sessions]);
    showToast('Session created successfully!');
    setShowAddModal(false);
    setFormData({ title: '', type: 'Aptitude', trainerName: '', date: '', startTime: '09:00', endTime: '17:00', venue: '', capacity: '', description: '', topics: '' });
  };

  const handleEditSession = (e) => {
    e.preventDefault();
    setSessions(sessions.map(s => s.id === editingSession.id ? { ...s, ...formData } : s));
    showToast('Session updated successfully!');
    setShowEditModal(false);
  };

  const handleDeleteSession = (id) => {
    if (window.confirm('Delete this session?')) {
      setSessions(sessions.filter(s => s.id !== id));
      showToast('Session deleted!');
    }
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      type: session.type,
      trainerName: session.trainerName,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      venue: session.venue,
      capacity: session.capacity,
      description: session.description,
      topics: session.topics
    });
    setShowEditModal(true);
  };

  const sessionTypes = ['all', 'Aptitude', 'Verbal', 'Soft Skills', 'Technical', 'Group Discussion', 'Mock Interview'];
  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.trainerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || s.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={styles.container}>
      <PlacementTopNav />
      {toast.show && <div style={{...styles.toast, backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444'}}>{toast.message}</div>}
      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div><h1 style={styles.pageTitle}>CRT Sessions</h1><p style={styles.pageSubtitle}>Campus Recruitment Training</p></div>
          <button onClick={() => setShowAddModal(true)} style={styles.addBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}><FiPlus size={18} /> Create Session</button>
        </div>
        <div style={styles.statsRow}>
          {[{icon: <FiCalendar size={24} />, value: sessions.length, label: 'Total', bg: '#EEF2FF', color: '#4F46E5'}, {icon: <FiUsers size={24} />, value: sessions.reduce((sum, s) => sum + s.registered, 0), label: 'Registered', bg: '#FEF3C7', color: '#F59E0B'}, {icon: <FiCheckCircle size={24} />, value: sessions.filter(s => s.status === 'completed').length, label: 'Completed', bg: '#D1FAE5', color: '#10B981'}].map((stat, i) => (
            <div key={i} style={styles.statCard} onMouseEnter={hoverEffects.statCardHover} onMouseLeave={hoverEffects.statCardLeave}><div style={{...styles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div><div><div style={styles.statValue}>{stat.value}</div><div style={styles.statLabel}>{stat.label}</div></div></div>
          ))}
        </div>
        <div style={styles.controlsBar}>
          <div style={styles.searchBox}><FiSearch size={18} /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} /></div>
          <div style={styles.filterGroup}><FiFilter size={16} /><span>Type:</span><div style={styles.filterButtons}>{sessionTypes.map(type => {
            const isActive = filterType === type;
            return (<button key={type} onClick={() => setFilterType(type)} style={{padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: isActive ? '#4F46E5' : '#FFF', color: isActive ? '#FFF' : '#6B7280', border: isActive ? 'none' : '1px solid #E5E7EB'}} onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#F3F4F6'; }} onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#FFF'; }}>{type}</button>);
          })}</div></div>
        </div>
        <div style={styles.sessionsList}>
          {filteredSessions.map(s => (
            <div key={s.id} style={styles.sessionCard} onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
              <div style={styles.sessionHeader}>
                <div><h3 style={styles.sessionTitle}>{s.title}</h3><div style={styles.sessionMeta}><span style={styles.typeBadge}>{s.type}</span><span>{s.trainerName}</span></div></div>
                <div style={{...styles.statusBadge, backgroundColor: s.status === 'completed' ? '#D1FAE5' : '#FEF3C7', color: s.status === 'completed' ? '#065F46' : '#92400E'}}>{s.status}</div>
              </div>
              <p style={styles.description}>{s.description}</p>
              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}><FiCalendar size={14} /><span>{s.date}</span></div>
                <div style={styles.detailItem}><FiClock size={14} /><span>{s.startTime} - {s.endTime}</span></div>
                <div style={styles.detailItem}><FiUsers size={14} /><span>{s.venue}</span></div>
              </div>
              <div style={styles.performanceBar}>
                <div><span>Registered:</span><span>{s.registered}/{s.capacity}</span></div>
                {s.status === 'completed' && <div><span>Attended:</span><span>{s.attended}/{s.registered}</span></div>}
              </div>
              <div style={styles.sessionFooter}>
                <button onClick={() => openEditModal(s)} style={styles.editBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DBEAFE'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}><FiEdit size={16} /></button>
                <button onClick={() => handleDeleteSession(s.id)} style={styles.deleteBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}><FiTrash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div style={commonStyles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={commonStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Create CRT Session</h3>
              <button onClick={() => setShowAddModal(false)} style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleAddSession} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Session Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., Quantitative Aptitude Training" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} required style={commonStyles.input}>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Verbal">Verbal</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Technical">Technical</option>
                    <option value="Group Discussion">Group Discussion</option>
                    <option value="Mock Interview">Mock Interview</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Trainer Name *</label>
                  <input type="text" name="trainerName" value={formData.trainerName} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., Prof. John Doe" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Start Time *</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>End Time *</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Venue *</label>
                  <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., Auditorium" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Capacity *</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required style={commonStyles.input} placeholder="e.g., 100" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Topics Covered</label>
                  <input type="text" name="topics" value={formData.topics} onChange={handleInputChange} style={commonStyles.input} placeholder="e.g., Numbers, Algebra, Geometry" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ ...commonStyles.input, minHeight: '80px', resize: 'vertical' }} placeholder="Brief description of the session" />
                </div>
              </div>
              <div style={{ padding: '24px', borderTop: `1px solid ${colors.gray200}`, display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={commonStyles.secondaryBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray200; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'scale(1)'; }}>Cancel</button>
                <button type="submit" style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}><FiSave size={16} /> Create Session</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {showEditModal && (
        <div style={commonStyles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div style={commonStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Edit CRT Session</h3>
              <button onClick={() => setShowEditModal(false)} style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleEditSession} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Session Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} required style={commonStyles.input}>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Verbal">Verbal</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Technical">Technical</option>
                    <option value="Group Discussion">Group Discussion</option>
                    <option value="Mock Interview">Mock Interview</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Trainer Name *</label>
                  <input type="text" name="trainerName" value={formData.trainerName} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Start Time *</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>End Time *</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Venue *</label>
                  <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Capacity *</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Topics Covered</label>
                  <input type="text" name="topics" value={formData.topics} onChange={handleInputChange} style={commonStyles.input} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ ...commonStyles.input, minHeight: '80px', resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ padding: '24px', borderTop: `1px solid ${colors.gray200}`, display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={commonStyles.secondaryBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray200; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'scale(1)'; }}>Cancel</button>
                <button type="submit" style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}><FiSave size={16} /> Update Session</button>
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
  statValue: { fontSize: '28px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' },
  statLabel: { fontSize: '14px', color: '#6B7280' },
  controlsBar: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
  searchBox: { flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
  searchInput: { flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: '#1F2937' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  filterButtons: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  sessionsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  sessionCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  sessionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' },
  sessionTitle: { fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0' },
  sessionMeta: { display: 'flex', gap: '12px', fontSize: '14px', color: '#6B7280', alignItems: 'center' },
  typeBadge: { padding: '4px 12px', backgroundColor: '#EEF2FF', color: '#4F46E5', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  statusBadge: { padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
  description: { fontSize: '14px', color: '#6B7280', marginBottom: '12px' },
  detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' },
  detailItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' },
  performanceBar: { padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', display: 'flex', gap: '24px', marginBottom: '16px' },
  sessionFooter: { display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' },
  editBtn: { padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px', color: '#3B82F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  deleteBtn: { padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }
};

export default CRTSessionManagement;
