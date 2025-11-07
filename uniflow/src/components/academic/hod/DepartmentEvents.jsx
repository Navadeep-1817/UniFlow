import React, { useState, useEffect } from 'react';
import HODTopNav from './HODTopNav';
import { 
  FiCalendar,
  FiClock,
  FiUsers,
  FiMapPin,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiFilter,
  FiSearch,
  FiEye,
  FiX,
  FiSave
} from 'react-icons/fi';

const DepartmentEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'FDP',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    capacity: '',
    coordinator: '',
    status: 'pending'
  });

  useEffect(() => {
    // Mock events data
    const mockEvents = [
      {
        id: 1,
        name: 'Faculty Development Program on AI & ML',
        type: 'FDP',
        description: 'Comprehensive training on Artificial Intelligence and Machine Learning for faculty members',
        startDate: '2024-11-25',
        endDate: '2024-11-27',
        venue: 'Conference Hall A',
        capacity: 50,
        registered: 42,
        coordinator: 'Dr. Priya Sharma',
        status: 'ongoing',
        createdOn: '2024-11-01',
        sessions: 6
      },
      {
        id: 2,
        name: 'Student Development Program - Web Technologies',
        type: 'SDP',
        description: 'Full-stack web development training for final year students',
        startDate: '2024-12-01',
        endDate: '2024-12-05',
        venue: 'Lab 201',
        capacity: 60,
        registered: 58,
        coordinator: 'Prof. Rajesh Kumar',
        status: 'pending',
        createdOn: '2024-11-10',
        sessions: 10
      },
      {
        id: 3,
        name: 'Campus Recruitment Training - Batch 1',
        type: 'CRT',
        description: 'Aptitude, reasoning, and technical skills training for placement preparation',
        startDate: '2024-11-15',
        endDate: '2024-11-22',
        venue: 'Auditorium B',
        capacity: 100,
        registered: 95,
        coordinator: 'Dr. Anita Desai',
        status: 'completed',
        createdOn: '2024-10-20',
        sessions: 8
      },
      {
        id: 4,
        name: 'Research Methodology Workshop',
        type: 'FDP',
        description: 'Advanced research techniques and paper writing workshop',
        startDate: '2024-12-10',
        endDate: '2024-12-12',
        venue: 'Conference Hall B',
        capacity: 40,
        registered: 0,
        coordinator: 'Dr. Suresh Patel',
        status: 'pending',
        createdOn: '2024-11-18',
        sessions: 5
      },
      {
        id: 5,
        name: 'Data Science and Analytics SDP',
        type: 'SDP',
        description: 'Hands-on training in data analysis, visualization, and machine learning',
        startDate: '2024-11-20',
        endDate: '2024-11-24',
        venue: 'Lab 305',
        capacity: 50,
        registered: 48,
        coordinator: 'Prof. Meena Singh',
        status: 'ongoing',
        createdOn: '2024-11-05',
        sessions: 10
      }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.coordinator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    setFilteredEvents(filtered);
  }, [searchQuery, filterType, filterStatus, events]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    
    if (editingEvent) {
      setEvents(events.map(ev => 
        ev.id === editingEvent.id ? { ...ev, ...formData } : ev
      ));
      showToast('Event updated successfully!', 'success');
    } else {
      const newEvent = {
        id: events.length + 1,
        ...formData,
        registered: 0,
        createdOn: new Date().toISOString().split('T')[0],
        sessions: 0
      };
      setEvents([newEvent, ...events]);
      showToast('Event created successfully!', 'success');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'FDP',
      description: '',
      startDate: '',
      endDate: '',
      venue: '',
      capacity: '',
      coordinator: '',
      status: 'pending'
    });
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleEdit = (event) => {
    setFormData({
      name: event.name,
      type: event.type,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      venue: event.venue,
      capacity: event.capacity,
      coordinator: event.coordinator,
      status: event.status
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== eventId));
      showToast('Event deleted successfully!', 'success');
    }
  };

  const handleApprove = (eventId) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, status: 'ongoing' } : e
    ));
    showToast('Event approved and marked as ongoing!', 'success');
  };

  const handleReject = (eventId) => {
    if (window.confirm('Are you sure you want to reject this event?')) {
      setEvents(events.filter(e => e.id !== eventId));
      showToast('Event rejected and removed!', 'info');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: '#FEF3C7', color: '#92400E', icon: <FiAlertCircle size={16} /> },
      ongoing: { bg: '#DBEAFE', color: '#1E40AF', icon: <FiClock size={16} /> },
      completed: { bg: '#D1FAE5', color: '#065F46', icon: <FiCheckCircle size={16} /> }
    };
    return styles[status] || styles.pending;
  };

  const getTypeColor = (type) => {
    const colors = {
      FDP: '#4F46E5',
      SDP: '#10B981',
      CRT: '#F59E0B'
    };
    return colors[type] || '#6B7280';
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
            <h1 style={styles.pageTitle}>Department Events</h1>
            <p style={styles.pageSubtitle}>Manage FDPs, SDPs, and CRT sessions</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            style={styles.createBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FiPlus size={18} /> {showForm ? 'Cancel' : 'Create Event'}
          </button>
        </div>

        {/* Event Form */}
        {showForm && (
          <form onSubmit={handleCreateEvent} style={{...styles.formCard, animation: 'slideDown 0.3s ease-out'}}>
            <h3 style={styles.formTitle}>{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Event Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={styles.input} placeholder="Enter event name" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Event Type *</label>
                <select name="type" value={formData.type} onChange={handleInputChange} required style={styles.input}>
                  <option value="FDP">FDP (Faculty Development Program)</option>
                  <option value="SDP">SDP (Student Development Program)</option>
                  <option value="CRT">CRT (Campus Recruitment Training)</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Date *</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>End Date *</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Venue *</label>
                <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} required style={styles.input} placeholder="Conference Hall, Lab, etc." />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Capacity *</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required style={styles.input} placeholder="Max participants" min="1" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Coordinator *</label>
                <input type="text" name="coordinator" value={formData.coordinator} onChange={handleInputChange} required style={styles.input} placeholder="Faculty coordinator name" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} style={styles.input}>
                  <option value="pending">Pending</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} style={{...styles.input, resize: 'vertical'}} placeholder="Detailed event description..." />
            </div>
            <div style={{display: 'flex', gap: '12px'}}>
              <button type="submit" style={styles.submitBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                <FiSave size={16} /> {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
              <button type="button" onClick={resetForm} style={styles.cancelBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Filters & Search */}
        <div style={styles.filtersBar}>
          <div style={styles.searchBox}>
            <FiSearch size={18} color="#6B7280" />
            <input type="text" placeholder="Search by event name, coordinator, or venue..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.filterGroup}>
            <FiFilter size={16} color="#6B7280" />
            <span style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>Type:</span>
            <div style={styles.filterButtons}>
              {['all', 'FDP', 'SDP', 'CRT'].map(type => (
                <button key={type} onClick={() => setFilterType(type)} style={{ ...styles.filterBtn, backgroundColor: filterType === type ? '#4F46E5' : '#FFFFFF', color: filterType === type ? '#FFFFFF' : '#6B7280', border: filterType === type ? 'none' : '1px solid #E5E7EB' }} onMouseEnter={(e) => { if (filterType !== type) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; } }} onMouseLeave={(e) => { if (filterType !== type) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.filterGroup}>
            <span style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>Status:</span>
            <div style={styles.filterButtons}>
              {['all', 'pending', 'ongoing', 'completed'].map(status => (
                <button key={status} onClick={() => setFilterStatus(status)} style={{ ...styles.filterBtn, backgroundColor: filterStatus === status ? '#4F46E5' : '#FFFFFF', color: filterStatus === status ? '#FFFFFF' : '#6B7280', border: filterStatus === status ? 'none' : '1px solid #E5E7EB' }} onMouseEnter={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; } }} onMouseLeave={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div style={styles.eventsSection}>
          <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px'}}>Events ({filteredEvents.length})</h3>
          {filteredEvents.length === 0 ? (
            <div style={styles.emptyState}>
              <FiCalendar size={48} color="#9CA3AF" />
              <p style={{margin: '16px 0 0 0', fontSize: '16px', color: '#6B7280'}}>No events found</p>
              <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#9CA3AF'}}>Create your first event to get started</p>
            </div>
          ) : (
            <div style={styles.eventsGrid}>
              {filteredEvents.map(event => {
                const statusStyle = getStatusStyle(event.status);
                const typeColor = getTypeColor(event.type);
                const fillPercentage = (event.registered / event.capacity) * 100;
                return (
                  <div key={event.id} style={styles.eventCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
                    <div style={styles.eventHeader}>
                      <div style={{...styles.eventTypeBadge, backgroundColor: typeColor}}>{event.type}</div>
                      <div style={{...styles.eventStatusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color}}>
                        {statusStyle.icon}
                        <span>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
                      </div>
                    </div>
                    <h4 style={styles.eventTitle}>{event.name}</h4>
                    <p style={styles.eventDesc}>{event.description}</p>
                    <div style={styles.eventDetails}>
                      <div style={styles.detailItem}>
                        <FiCalendar size={14} color="#6B7280" />
                        <span>{event.startDate} to {event.endDate}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <FiMapPin size={14} color="#6B7280" />
                        <span>{event.venue}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <FiUsers size={14} color="#6B7280" />
                        <span>{event.registered}/{event.capacity} registered</span>
                      </div>
                    </div>
                    <div style={styles.progressContainer}>
                      <div style={styles.progressBar}>
                        <div style={{...styles.progressFill, width: `${fillPercentage}%`, backgroundColor: fillPercentage >= 90 ? '#EF4444' : fillPercentage >= 70 ? '#F59E0B' : '#10B981'}}></div>
                      </div>
                      <span style={styles.progressText}>{fillPercentage.toFixed(0)}% filled</span>
                    </div>
                    <div style={styles.eventFooter}>
                      <span style={styles.coordinator}>Coordinator: {event.coordinator}</span>
                    </div>
                    <div style={styles.eventActions}>
                      <button onClick={() => setSelectedEvent(event)} style={styles.viewBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EEF2FF'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <FiEye size={16} /> View
                      </button>
                      <button onClick={() => handleEdit(event)} style={styles.editBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DBEAFE'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <FiEdit size={16} /> Edit
                      </button>
                      {event.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(event.id)} style={styles.approveBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#BBF7D0'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#D1FAE5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                            <FiCheckCircle size={16} /> Approve
                          </button>
                          <button onClick={() => handleReject(event.id)} style={styles.rejectBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.transform = 'scale(1)'; }}>
                            <FiXCircle size={16} /> Reject
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(event.id)} style={styles.deleteBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div style={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>{selectedEvent.name}</h3>
                <button onClick={() => setSelectedEvent(null)} style={styles.closeBtn} onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}>
                  <FiX size={20} />
                </button>
              </div>
              <div style={styles.modalBody}>
                <div style={styles.modalSection}>
                  <h4 style={styles.sectionTitle}>Event Information</h4>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Type:</span>
                      <span style={{...styles.eventTypeBadge, backgroundColor: getTypeColor(selectedEvent.type)}}>{selectedEvent.type}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Status:</span>
                      <div style={{...styles.eventStatusBadge, ...getStatusStyle(selectedEvent.status), backgroundColor: getStatusStyle(selectedEvent.status).bg, color: getStatusStyle(selectedEvent.status).color}}>
                        {getStatusStyle(selectedEvent.status).icon}
                        <span>{selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}</span>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Duration:</span>
                      <span>{selectedEvent.startDate} to {selectedEvent.endDate}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Venue:</span>
                      <span>{selectedEvent.venue}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Capacity:</span>
                      <span>{selectedEvent.capacity} participants</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Registered:</span>
                      <span>{selectedEvent.registered} participants</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Coordinator:</span>
                      <span>{selectedEvent.coordinator}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Total Sessions:</span>
                      <span>{selectedEvent.sessions} sessions</span>
                    </div>
                  </div>
                </div>
                <div style={styles.modalSection}>
                  <h4 style={styles.sectionTitle}>Description</h4>
                  <p style={{margin: 0, color: '#374151', lineHeight: 1.6}}>{selectedEvent.description}</p>
                </div>
                <div style={styles.modalSection}>
                  <h4 style={styles.sectionTitle}>Registration Progress</h4>
                  <div style={styles.progressContainer}>
                    <div style={styles.progressBar}>
                      <div style={{...styles.progressFill, width: `${(selectedEvent.registered / selectedEvent.capacity) * 100}%`, backgroundColor: '#4F46E5'}}></div>
                    </div>
                    <span style={styles.progressText}>{((selectedEvent.registered / selectedEvent.capacity) * 100).toFixed(0)}% filled</span>
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
  createBtn: {
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
  filtersBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  eventsSection: {
    marginBottom: '24px'
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
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #E5E7EB',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  eventTypeBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '600'
  },
  eventStatusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600'
  },
  eventTitle: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937'
  },
  eventDesc: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  eventDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#374151'
  },
  progressContainer: {
    marginBottom: '12px'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '6px'
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  },
  progressText: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: '500'
  },
  eventFooter: {
    paddingTop: '12px',
    borderTop: '1px solid #F3F4F6',
    marginBottom: '16px'
  },
  coordinator: {
    fontSize: '13px',
    color: '#6B7280'
  },
  eventActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  viewBtn: {
    padding: '8px 12px',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '8px',
    color: '#4F46E5',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  editBtn: {
    padding: '8px 12px',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '8px',
    color: '#3B82F6',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  approveBtn: {
    padding: '8px 12px',
    backgroundColor: '#D1FAE5',
    border: 'none',
    borderRadius: '8px',
    color: '#065F46',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  rejectBtn: {
    padding: '8px 12px',
    backgroundColor: '#FEE2E2',
    border: 'none',
    borderRadius: '8px',
    color: '#991B1B',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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
    maxWidth: '700px',
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
  modalSection: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '12px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  infoLabel: {
    fontSize: '13px',
    color: '#6B7280',
    fontWeight: '500'
  }
};

export default DepartmentEvents;
