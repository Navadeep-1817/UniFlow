import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUsers, FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiSearch, FiFilter, FiCheckCircle, FiBarChart, FiAward, FiTrendingUp, FiUserCheck } from 'react-icons/fi';

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
  const [formData, setFormData] = useState({ title: '', type: 'Aptitude', trainerName: '', date: '', startTime: '09:00', endTime: '17:00', venue: '', capacity: '', description: '', topics: '' });

  useEffect(() => {
    const mockSessions = [
      { id: 1, title: 'Quantitative Aptitude Training', type: 'Aptitude', trainerName: 'Prof. Rajesh Kumar', date: '2024-12-15', startTime: '09:00', endTime: '13:00', venue: 'Auditorium', capacity: 100, registered: 85, attended: 82, description: 'Number systems, percentages, ratios', topics: 'Numbers, Algebra, Geometry', status: 'completed', avgScore: 78 },
      { id: 2, title: 'Soft Skills Development', type: 'Soft Skills', trainerName: 'Ms. Anjali Mehta', date: '2024-12-20', startTime: '09:00', endTime: '17:00', venue: 'Seminar Hall', capacity: 60, registered: 58, attended: 0, description: 'Communication, teamwork, leadership', topics: 'Communication, Leadership', status: 'upcoming', avgScore: 0 }
    ];
    setSessions(mockSessions);
  }, []);

  const showToast = (message, type = 'success') => { setToast({ show: true, message, type }); setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000); };
  const handleInputChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleAddSession = (e) => { e.preventDefault(); const newSession = { id: Date.now(), ...formData, registered: 0, attended: 0, status: 'upcoming', avgScore: 0 }; setSessions([newSession, ...sessions]); showToast('Session created!'); setShowAddModal(false); setFormData({ title: '', type: 'Aptitude', trainerName: '', date: '', startTime: '09:00', endTime: '17:00', venue: '', capacity: '', description: '', topics: '' }); };
  const handleEditSession = (e) => { e.preventDefault(); setSessions(sessions.map(s => s.id === editingSession.id ? { ...s, ...formData } : s)); showToast('Updated!'); setShowEditModal(false); };
  const handleDeleteSession = (id) => { if (window.confirm('Delete?')) { setSessions(sessions.filter(s => s.id !== id)); showToast('Deleted!'); } };
  const openEditModal = (session) => { setEditingSession(session); setFormData({ title: session.title, type: session.type, trainerName: session.trainerName, date: session.date, startTime: session.startTime, endTime: session.endTime, venue: session.venue, capacity: session.capacity, description: session.description, topics: session.topics }); setShowEditModal(true); };

  const sessionTypes = ['all', 'Aptitude', 'Verbal', 'Soft Skills', 'Technical'];
  const filteredSessions = sessions.filter(s => { const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.trainerName.toLowerCase().includes(searchQuery.toLowerCase()); const matchesType = filterType === 'all' || s.type === filterType; return matchesSearch && matchesType; });

  return (
    <div style={styles.container}>
      {toast.show && <div style={{...styles.toast, backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444'}}>{toast.message}</div>}
      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div><h1 style={styles.pageTitle}>CRT Sessions</h1><p style={styles.pageSubtitle}>Campus Recruitment Training</p></div>
          <button onClick={() => setShowAddModal(true)} style={styles.addBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}><FiPlus size={18} /> Create Session</button>
        </div>
        <div style={styles.statsRow}>
          {[{icon: <FiCalendar size={24} />, value: sessions.length, label: 'Total', bg: '#EEF2FF', color: '#4F46E5'}, {icon: <FiUsers size={24} />, value: sessions.reduce((sum, s) => sum + s.registered, 0), label: 'Registered', bg: '#FEF3C7', color: '#F59E0B'}, {icon: <FiCheckCircle size={24} />, value: sessions.filter(s => s.status === 'completed').length, label: 'Completed', bg: '#D1FAE5', color: '#10B981'}].map((stat, i) => (
            <div key={i} style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}><div style={{...styles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div><div><div style={styles.statValue}>{stat.value}</div><div style={styles.statLabel}>{stat.label}</div></div></div>
          ))}
        </div>
        <div style={styles.controlsBar}>
          <div style={styles.searchBox}><FiSearch size={18} /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} /></div>
          <div style={styles.filterGroup}><FiFilter size={16} /><span>Type:</span><div style={styles.filterButtons}>{sessionTypes.map(type => (<button key={type} onClick={() => setFilterType(type)} style={{...styles.filterBtn, backgroundColor: filterType === type ? '#4F46E5' : '#FFF', color: filterType === type ? '#FFF' : '#6B7280'}} onMouseEnter={(e) => { if (filterType !== type) e.currentTarget.style.backgroundColor = '#F3F4F6'; }} onMouseLeave={(e) => { if (filterType !== type) e.currentTarget.style.backgroundColor = '#FFF'; }}>{type}</button>))}</div></div>
        </div>
        <div style={styles.sessionsList}>
          {filteredSessions.map(s => (
            <div key={s.id} style={styles.sessionCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
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
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  content: { padding: '24px', maxWidth: '1600px', margin: '0 auto' },
  toast: { position: 'fixed', top: '20px', right: '20px', padding: '16px 24px', borderRadius: '8px', color: '#FFF', fontWeight: '500', zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  pageHeader: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  pageTitle: { fontSize: '32px', fontWeight: '700', color: '#1F2937', margin: 0 },
  pageSubtitle: { fontSize: '16px', color: '#6B7280', margin: '8px 0 0 0' },
  addBtn: { padding: '12px 24px', backgroundColor: '#4F46E5', border: 'none', borderRadius: '10px', color: '#FFF', cursor: 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' },
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
  filterBtn: { padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', border: '1px solid #E5E7EB', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
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
