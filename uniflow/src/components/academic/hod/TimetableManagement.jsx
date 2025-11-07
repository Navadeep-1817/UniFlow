import React, { useState, useEffect } from 'react';
import HODTopNav from './HODTopNav';
import { 
  FiCalendar,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiSave,
  FiFilter,
  FiUsers,
  FiBook,
  FiMapPin
} from 'react-icons/fi';

const TimetableManagement = () => {
  const [timetable, setTimetable] = useState([]);
  const [events, setEvents] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSection, setSelectedSection] = useState('A');
  const [viewMode, setViewMode] = useState('classes');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    type: 'class',
    day: 'Monday',
    timeSlot: '09:00-10:00',
    subject: '',
    faculty: '',
    venue: '',
    year: '3',
    section: 'A'
  });

  const timeSlots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-01:00', '01:00-02:00', '02:00-03:00', '03:00-04:00', '04:00-05:00'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const mockTimetable = [
      { id: 1, type: 'class', day: 'Monday', timeSlot: '09:00-10:00', subject: 'Data Structures', faculty: 'Dr. Priya Sharma', venue: 'Room 301', year: '3', section: 'A' },
      { id: 2, type: 'class', day: 'Monday', timeSlot: '10:00-11:00', subject: 'Algorithms', faculty: 'Prof. Rajesh Kumar', venue: 'Room 301', year: '3', section: 'A' },
      { id: 3, type: 'class', day: 'Tuesday', timeSlot: '09:00-10:00', subject: 'Operating Systems', faculty: 'Prof. Suresh Patel', venue: 'Room 302', year: '3', section: 'A' },
      { id: 4, type: 'class', day: 'Wednesday', timeSlot: '09:00-10:00', subject: 'Machine Learning', faculty: 'Dr. Priya Sharma', venue: 'Room 301', year: '3', section: 'A' },
      { id: 5, type: 'class', day: 'Thursday', timeSlot: '09:00-10:00', subject: 'Software Engineering', faculty: 'Dr. Anita Desai', venue: 'Room 303', year: '3', section: 'A' }
    ];

    const mockEvents = [
      { id: 101, type: 'event', day: 'Wednesday', timeSlot: '10:00-11:00', subject: 'AI Workshop', faculty: 'Guest Speaker', venue: 'Conference Hall', year: 'all', section: 'all' },
      { id: 102, type: 'event', day: 'Friday', timeSlot: '02:00-03:00', subject: 'CRT Training', faculty: 'Training Team', venue: 'Auditorium', year: '3', section: 'all' }
    ];

    setTimetable(mockTimetable);
    setEvents(mockEvents);
    checkConflicts([...mockTimetable, ...mockEvents]);
  }, []);

  const checkConflicts = (allEntries) => {
    const conflictList = [];
    const grouped = {};
    allEntries.forEach(entry => {
      const key = `${entry.day}-${entry.timeSlot}-${entry.venue}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(entry);
    });
    Object.entries(grouped).forEach(([key, entries]) => {
      if (entries.length > 1) {
        conflictList.push({ key, day: entries[0].day, timeSlot: entries[0].timeSlot, venue: entries[0].venue, entries });
      }
    });
    setConflicts(conflictList);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    const newEntry = { id: Date.now(), ...formData };
    if (formData.type === 'class') {
      setTimetable([...timetable, newEntry]);
      checkConflicts([...timetable, newEntry, ...events]);
    } else {
      setEvents([...events, newEntry]);
      checkConflicts([...timetable, ...events, newEntry]);
    }
    showToast(`${formData.type === 'class' ? 'Class' : 'Event'} added successfully!`);
    setShowAddModal(false);
  };

  const handleEditEntry = (e) => {
    e.preventDefault();
    if (editingEntry.type === 'class') {
      const updated = timetable.map(e => e.id === editingEntry.id ? { ...editingEntry, ...formData } : e);
      setTimetable(updated);
      checkConflicts([...updated, ...events]);
    } else {
      const updated = events.map(e => e.id === editingEntry.id ? { ...editingEntry, ...formData } : e);
      setEvents(updated);
      checkConflicts([...timetable, ...updated]);
    }
    showToast('Entry updated successfully!');
    setShowEditModal(false);
  };

  const handleDeleteEntry = (entry) => {
    if (window.confirm('Delete this entry?')) {
      if (entry.type === 'class') {
        const updated = timetable.filter(e => e.id !== entry.id);
        setTimetable(updated);
        checkConflicts([...updated, ...events]);
      } else {
        const updated = events.filter(e => e.id !== entry.id);
        setEvents(updated);
        checkConflicts([...timetable, ...updated]);
      }
      showToast('Entry deleted!');
    }
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setFormData({ type: entry.type, day: entry.day, timeSlot: entry.timeSlot, subject: entry.subject, faculty: entry.faculty, venue: entry.venue, year: entry.year, section: entry.section });
    setShowEditModal(true);
  };

  const getEntriesForSlot = (day, timeSlot) => {
    return [...timetable, ...events].filter(e => {
      if (viewMode === 'classes' && e.type !== 'class') return false;
      if (viewMode === 'events' && e.type !== 'event') return false;
      return e.day === day && e.timeSlot === timeSlot && (e.year === selectedYear || e.year === 'all') && (e.section === selectedSection || e.section === 'all');
    });
  };

  const hasConflict = (day, timeSlot) => conflicts.some(c => c.day === day && c.timeSlot === timeSlot);

  return (
    <div style={styles.container}>
      <HODTopNav />
      
      {toast.show && (
        <div style={{...styles.toast, backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444'}}>
          {toast.message}
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Timetable Management</h1>
            <p style={styles.pageSubtitle}>Manage schedules and prevent conflicts</p>
          </div>
          <button onClick={() => setShowAddModal(true)} style={styles.addBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
            <FiPlus size={18} /> Add Entry
          </button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={{...styles.statIcon, backgroundColor: '#EEF2FF'}}>
              <FiBook size={24} color="#4F46E5" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{timetable.length}</div>
              <div style={styles.statLabel}>Classes</div>
            </div>
          </div>
          <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
              <FiCalendar size={24} color="#F59E0B" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{events.length}</div>
              <div style={styles.statLabel}>Events</div>
            </div>
          </div>
          <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={{...styles.statIcon, backgroundColor: conflicts.length > 0 ? '#FEE2E2' : '#D1FAE5'}}>
              {conflicts.length > 0 ? <FiAlertCircle size={24} color="#EF4444" /> : <FiCheckCircle size={24} color="#10B981" />}
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{conflicts.length}</div>
              <div style={styles.statLabel}>Conflicts</div>
            </div>
          </div>
        </div>

        {conflicts.length > 0 && (
          <div style={styles.conflictAlert}>
            <div style={styles.conflictHeader}>
              <FiAlertCircle size={20} color="#EF4444" />
              <strong>Schedule Conflicts Detected</strong>
            </div>
            <div style={styles.conflictsList}>
              {conflicts.map((c, i) => (
                <div key={i} style={styles.conflictItem}>
                  <div><strong>{c.day} • {c.timeSlot}</strong> @ {c.venue}</div>
                  <div>{c.entries.map(e => e.subject).join(' & ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.controlsBar}>
          <div style={styles.viewModeButtons}>
            {[{id: 'classes', label: 'Classes', icon: <FiBook size={16} />}, {id: 'events', label: 'Events', icon: <FiCalendar size={16} />}, {id: 'combined', label: 'Combined', icon: <FiUsers size={16} />}].map(m => (
              <button key={m.id} onClick={() => setViewMode(m.id)} style={{...styles.viewModeBtn, backgroundColor: viewMode === m.id ? '#4F46E5' : '#FFF', color: viewMode === m.id ? '#FFF' : '#6B7280', border: viewMode === m.id ? 'none' : '1px solid #E5E7EB'}} onMouseEnter={(e) => { if (viewMode !== m.id) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; }}} onMouseLeave={(e) => { if (viewMode !== m.id) { e.currentTarget.style.backgroundColor = '#FFF'; e.currentTarget.style.transform = 'scale(1)'; }}}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
          <div style={styles.filterGroup}>
            <FiFilter size={16} color="#6B7280" />
            <span style={{fontSize: '14px', fontWeight: '600'}}>Year:</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={styles.filterSelect}>
              <option value="1">1st</option>
              <option value="2">2nd</option>
              <option value="3">3rd</option>
              <option value="4">4th</option>
            </select>
            <span style={{fontSize: '14px', fontWeight: '600'}}>Section:</span>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} style={styles.filterSelect}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
        </div>

        <div style={styles.timetableSection}>
          <h3 style={styles.sectionTitle}><FiClock size={18} /> Weekly Schedule - {selectedYear}{selectedYear === '1' ? 'st' : selectedYear === '2' ? 'nd' : selectedYear === '3' ? 'rd' : 'th'} Year Section {selectedSection}</h3>
          <div style={styles.timetableWrapper}>
            <table style={styles.timetable}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={{...styles.tableHeader, minWidth: '100px'}}>Time</th>
                  {days.map(d => <th key={d} style={styles.tableHeader}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(slot => (
                  <tr key={slot} style={styles.tableRow}>
                    <td style={styles.timeCell}>{slot}</td>
                    {days.map(day => {
                      const entries = getEntriesForSlot(day, slot);
                      const conflict = hasConflict(day, slot);
                      return (
                        <td key={day} style={{...styles.slotCell, backgroundColor: conflict ? '#FEE2E2' : entries.length > 0 ? '#F3F4F6' : '#FFF'}}>
                          {entries.length > 0 ? entries.map(e => (
                            <div key={e.id} style={{...styles.entryCard, borderLeftColor: e.type === 'class' ? '#4F46E5' : '#F59E0B'}} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
                              <div style={styles.entryHeader}>
                                <div style={{...styles.entryType, backgroundColor: e.type === 'class' ? '#EEF2FF' : '#FEF3C7', color: e.type === 'class' ? '#4F46E5' : '#F59E0B'}}>
                                  {e.type === 'class' ? <FiBook size={12} /> : <FiCalendar size={12} />}
                                </div>
                                <div style={styles.entryActions}>
                                  <button onClick={() => openEditModal(e)} style={styles.iconBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DBEAFE'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}>
                                    <FiEdit size={12} color="#3B82F6" />
                                  </button>
                                  <button onClick={() => handleDeleteEntry(e)} style={styles.iconBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}>
                                    <FiTrash2 size={12} color="#EF4444" />
                                  </button>
                                </div>
                              </div>
                              <div style={styles.entrySubject}>{e.subject}</div>
                              <div style={styles.entryDetails}>
                                <div style={styles.entryDetail}><FiUsers size={10} /> {e.faculty}</div>
                                <div style={styles.entryDetail}><FiMapPin size={10} /> {e.venue}</div>
                              </div>
                            </div>
                          )) : <span style={{color: '#9CA3AF', fontSize: '12px'}}>Free</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showAddModal && (
          <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Add New Entry</h3>
                <button onClick={() => setShowAddModal(false)} style={styles.closeBtn} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}>
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleAddEntry} style={styles.modalBody}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Type *</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} required style={styles.input}>
                      <option value="class">Class</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Day *</label>
                    <select name="day" value={formData.day} onChange={handleInputChange} required style={styles.input}>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Time Slot *</label>
                    <select name="timeSlot" value={formData.timeSlot} onChange={handleInputChange} required style={styles.input}>
                      {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Subject/Event *</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required style={styles.input} placeholder="Data Structures" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Faculty *</label>
                    <input type="text" name="faculty" value={formData.faculty} onChange={handleInputChange} required style={styles.input} placeholder="Dr. John Doe" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Venue *</label>
                    <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} required style={styles.input} placeholder="Room 301" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Year *</label>
                    <select name="year" value={formData.year} onChange={handleInputChange} required style={styles.input}>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="all">All Years</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Section *</label>
                    <select name="section" value={formData.section} onChange={handleInputChange} required style={styles.input}>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                </div>
                <div style={styles.modalFooter}>
                  <button type="button" onClick={() => setShowAddModal(false)} style={styles.cancelBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>Cancel</button>
                  <button type="submit" style={styles.submitBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <FiSave size={16} /> Add Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div style={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Edit Entry</h3>
                <button onClick={() => setShowEditModal(false)} style={styles.closeBtn} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}>
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleEditEntry} style={styles.modalBody}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Day *</label>
                    <select name="day" value={formData.day} onChange={handleInputChange} required style={styles.input}>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Time Slot *</label>
                    <select name="timeSlot" value={formData.timeSlot} onChange={handleInputChange} required style={styles.input}>
                      {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Subject *</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Faculty *</label>
                    <input type="text" name="faculty" value={formData.faculty} onChange={handleInputChange} required style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Venue *</label>
                    <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} required style={styles.input} />
                  </div>
                </div>
                <div style={styles.modalFooter}>
                  <button type="button" onClick={() => setShowEditModal(false)} style={styles.cancelBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>Cancel</button>
                  <button type="submit" style={styles.submitBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <FiSave size={16} /> Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  content: { padding: '24px', maxWidth: '1600px', margin: '0 auto' },
  toast: { position: 'fixed', top: '20px', right: '20px', padding: '16px 24px', borderRadius: '8px', color: '#FFF', fontWeight: '500', zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s ease-out' },
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
  conflictAlert: { backgroundColor: '#FEE2E2', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #FCA5A5' },
  conflictHeader: { display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', marginBottom: '12px', fontSize: '16px' },
  conflictsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  conflictItem: { padding: '12px', backgroundColor: '#FFF', borderRadius: '8px', fontSize: '14px', color: '#374151' },
  controlsBar: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
  viewModeButtons: { display: 'flex', gap: '8px' },
  viewModeBtn: { padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  filterSelect: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', cursor: 'pointer', outline: 'none', transition: 'all 0.2s ease' },
  timetableSection: { backgroundColor: '#FFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
  timetableWrapper: { overflowX: 'auto' },
  timetable: { width: '100%', borderCollapse: 'collapse', minWidth: '1000px' },
  tableHeaderRow: { backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' },
  tableHeader: { padding: '12px 8px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tableRow: { borderBottom: '1px solid #E5E7EB' },
  timeCell: { padding: '12px', fontWeight: '600', fontSize: '13px', color: '#4F46E5', backgroundColor: '#F9FAFB', textAlign: 'center', whiteSpace: 'nowrap' },
  slotCell: { padding: '8px', minWidth: '150px', verticalAlign: 'top', position: 'relative' },
  entryCard: { padding: '8px', backgroundColor: '#FFF', borderRadius: '8px', marginBottom: '8px', border: '1px solid #E5E7EB', borderLeft: '3px solid', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  entryHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  entryType: { padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600' },
  entryActions: { display: 'flex', gap: '4px' },
  iconBtn: { padding: '4px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s ease' },
  entrySubject: { fontWeight: '600', fontSize: '13px', color: '#1F2937', marginBottom: '6px' },
  entryDetails: { display: 'flex', flexDirection: 'column', gap: '4px' },
  entryDetail: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#6B7280' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.3s ease-out' },
  modalContent: { backgroundColor: '#FFF', borderRadius: '16px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto', animation: 'slideUp 0.3s ease-out' },
  modalHeader: { padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { margin: 0, fontSize: '24px', fontWeight: '700', color: '#1F2937' },
  closeBtn: { padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  modalBody: { padding: '24px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', transition: 'all 0.2s ease' },
  modalFooter: { display: 'flex', gap: '12px', justifyContent: 'flex-end', padding: '24px', borderTop: '1px solid #E5E7EB' },
  cancelBtn: { padding: '12px 24px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px', color: '#374151', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  submitBtn: { padding: '12px 24px', backgroundColor: '#4F46E5', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }
};

export default TimetableManagement;
