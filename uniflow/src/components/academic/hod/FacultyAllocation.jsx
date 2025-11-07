import React, { useState, useEffect } from 'react';
import HODTopNav from './HODTopNav';
import { 
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiX,
  FiSave,
  FiUserPlus,
  FiTrendingUp,
  FiClock,
  FiTarget,
  FiRefreshCw
} from 'react-icons/fi';

const FacultyAllocation = () => {
  const [events, setEvents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Mock faculty data with current workload
    const mockFaculty = [
      { id: 1, name: 'Dr. Priya Sharma', specialization: 'AI & ML', currentWorkload: 85, maxWorkload: 100, allocatedEvents: 8 },
      { id: 2, name: 'Prof. Rajesh Kumar', specialization: 'Web Development', currentWorkload: 65, maxWorkload: 100, allocatedEvents: 5 },
      { id: 3, name: 'Dr. Anita Desai', specialization: 'Data Science', currentWorkload: 75, maxWorkload: 100, allocatedEvents: 6 },
      { id: 4, name: 'Prof. Suresh Patel', specialization: 'Database Systems', currentWorkload: 40, maxWorkload: 100, allocatedEvents: 3 },
      { id: 5, name: 'Dr. Meena Singh', specialization: 'Machine Learning', currentWorkload: 92, maxWorkload: 100, allocatedEvents: 7 }
    ];

    // Mock events data
    const mockEvents = [
      {
        id: 1,
        name: 'AI & ML Workshop',
        type: 'FDP',
        startDate: '2024-11-25',
        endDate: '2024-11-27',
        sessions: 6,
        venue: 'Conference Hall A',
        status: 'allocated',
        workloadPoints: 15
      },
      {
        id: 2,
        name: 'Data Science SDP',
        type: 'SDP',
        startDate: '2024-12-01',
        endDate: '2024-12-05',
        sessions: 10,
        venue: 'Lab 201',
        status: 'pending',
        workloadPoints: 20
      },
      {
        id: 3,
        name: 'Campus Recruitment Training',
        type: 'CRT',
        startDate: '2024-12-10',
        endDate: '2024-12-15',
        sessions: 8,
        venue: 'Auditorium B',
        status: 'pending',
        workloadPoints: 18
      },
      {
        id: 4,
        name: 'React Advanced Workshop',
        type: 'FDP',
        startDate: '2024-12-08',
        endDate: '2024-12-10',
        sessions: 5,
        venue: 'Lab 305',
        status: 'allocated',
        workloadPoints: 12
      },
      {
        id: 5,
        name: 'Python Programming SDP',
        type: 'SDP',
        startDate: '2024-11-28',
        endDate: '2024-12-02',
        sessions: 8,
        venue: 'Lab 202',
        status: 'pending',
        workloadPoints: 16
      }
    ];

    // Mock allocations
    const mockAllocations = [
      { id: 1, eventId: 1, facultyId: 1, eventName: 'AI & ML Workshop', facultyName: 'Dr. Priya Sharma', allocatedOn: '2024-11-15' },
      { id: 2, eventId: 4, facultyId: 2, eventName: 'React Advanced Workshop', facultyName: 'Prof. Rajesh Kumar', allocatedOn: '2024-11-18' }
    ];

    setFaculty(mockFaculty);
    setEvents(mockEvents);
    setAllocations(mockAllocations);
    setFilteredEvents(mockEvents);
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    setFilteredEvents(filtered);
  }, [searchQuery, filterStatus, events]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleAllocate = () => {
    if (!selectedEvent || !selectedFaculty) {
      showToast('Please select both event and faculty', 'error');
      return;
    }

    const selectedFacultyData = faculty.find(f => f.id === selectedFaculty);
    const selectedEventData = events.find(e => e.id === selectedEvent);

    if (selectedFacultyData.currentWorkload + selectedEventData.workloadPoints > selectedFacultyData.maxWorkload) {
      showToast('Faculty workload exceeds maximum capacity!', 'error');
      return;
    }

    const newAllocation = {
      id: allocations.length + 1,
      eventId: selectedEvent,
      facultyId: selectedFaculty,
      eventName: selectedEventData.name,
      facultyName: selectedFacultyData.name,
      allocatedOn: new Date().toISOString().split('T')[0]
    };

    setAllocations([...allocations, newAllocation]);
    
    setEvents(events.map(e => 
      e.id === selectedEvent ? { ...e, status: 'allocated' } : e
    ));

    setFaculty(faculty.map(f =>
      f.id === selectedFaculty ? { 
        ...f, 
        currentWorkload: f.currentWorkload + selectedEventData.workloadPoints,
        allocatedEvents: f.allocatedEvents + 1
      } : f
    ));

    showToast('Faculty allocated successfully!', 'success');
    closeModal();
  };

  const handleRemoveAllocation = (allocationId) => {
    if (window.confirm('Are you sure you want to remove this allocation?')) {
      const allocation = allocations.find(a => a.id === allocationId);
      const event = events.find(e => e.id === allocation.eventId);
      const facultyMember = faculty.find(f => f.id === allocation.facultyId);

      setAllocations(allocations.filter(a => a.id !== allocationId));
      
      setEvents(events.map(e =>
        e.id === allocation.eventId ? { ...e, status: 'pending' } : e
      ));

      setFaculty(faculty.map(f =>
        f.id === allocation.facultyId ? {
          ...f,
          currentWorkload: f.currentWorkload - event.workloadPoints,
          allocatedEvents: f.allocatedEvents - 1
        } : f
      ));

      showToast('Allocation removed successfully!', 'success');
    }
  };

  const openAllocationModal = (event) => {
    setSelectedEvent(event.id);
    setSelectedFaculty(null);
    setShowAllocationModal(true);
  };

  const closeModal = () => {
    setShowAllocationModal(false);
    setSelectedEvent(null);
    setSelectedFaculty(null);
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 90) return { bg: '#FEE2E2', color: '#991B1B', label: 'Overloaded' };
    if (workload >= 70) return { bg: '#FEF3C7', color: '#92400E', label: 'High' };
    if (workload >= 50) return { bg: '#DBEAFE', color: '#1E40AF', label: 'Moderate' };
    return { bg: '#D1FAE5', color: '#065F46', label: 'Available' };
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: '#FEF3C7', color: '#92400E', icon: <FiAlertCircle size={14} /> },
      allocated: { bg: '#D1FAE5', color: '#065F46', icon: <FiCheckCircle size={14} /> }
    };
    return styles[status] || styles.pending;
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
            <h1 style={styles.pageTitle}>Faculty Allocation</h1>
            <p style={styles.pageSubtitle}>Assign faculty to events and manage workload distribution</p>
          </div>
        </div>

        {/* Workload Overview */}
        <div style={styles.workloadSection}>
          <h3 style={styles.sectionTitle}><FiTrendingUp size={20} /> Faculty Workload Overview</h3>
          <div style={styles.workloadGrid}>
            {faculty.map(f => {
              const workloadInfo = getWorkloadColor(f.currentWorkload);
              return (
                <div key={f.id} style={styles.workloadCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
                  <div style={styles.workloadHeader}>
                    <div>
                      <div style={styles.facultyName}>{f.name}</div>
                      <div style={styles.facultySpec}>{f.specialization}</div>
                    </div>
                    <div style={{...styles.workloadBadge, backgroundColor: workloadInfo.bg, color: workloadInfo.color}}>
                      {workloadInfo.label}
                    </div>
                  </div>
                  <div style={styles.workloadProgress}>
                    <div style={styles.workloadBar}>
                      <div style={{...styles.workloadFill, width: `${f.currentWorkload}%`, backgroundColor: f.currentWorkload >= 90 ? '#EF4444' : f.currentWorkload >= 70 ? '#F59E0B' : '#10B981'}}></div>
                    </div>
                    <span style={styles.workloadText}>{f.currentWorkload}/{f.maxWorkload} points</span>
                  </div>
                  <div style={styles.workloadStats}>
                    <div style={styles.workloadStatItem}>
                      <FiCalendar size={16} color="#6B7280" />
                      <span>{f.allocatedEvents} events</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events & Allocations */}
        <div style={styles.mainGrid}>
          {/* Events Section */}
          <div style={styles.eventsSection}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}><FiCalendar size={20} /> Events</h3>
              <div style={styles.filterControls}>
                <div style={styles.searchBox}>
                  <FiSearch size={16} color="#6B7280" />
                  <input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
                </div>
                <div style={styles.filterButtons}>
                  {['all', 'pending', 'allocated'].map(status => (
                    <button key={status} onClick={() => setFilterStatus(status)} style={{ ...styles.filterBtn, backgroundColor: filterStatus === status ? '#4F46E5' : '#FFFFFF', color: filterStatus === status ? '#FFFFFF' : '#6B7280', border: filterStatus === status ? 'none' : '1px solid #E5E7EB' }} onMouseEnter={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; } }} onMouseLeave={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={styles.eventsList}>
              {filteredEvents.length === 0 ? (
                <div style={styles.emptyState}>
                  <FiCalendar size={48} color="#9CA3AF" />
                  <p>No events found</p>
                </div>
              ) : (
                filteredEvents.map(event => {
                  const statusStyle = getStatusStyle(event.status);
                  const isAllocated = allocations.some(a => a.eventId === event.id);
                  const allocatedFaculty = isAllocated ? allocations.find(a => a.eventId === event.id) : null;
                  return (
                    <div key={event.id} style={styles.eventCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
                      <div style={styles.eventHeader}>
                        <div>
                          <div style={styles.eventName}>{event.name}</div>
                          <div style={styles.eventMeta}>
                            <span style={{...styles.eventTypeBadge, backgroundColor: event.type === 'FDP' ? '#4F46E5' : event.type === 'SDP' ? '#10B981' : '#F59E0B'}}>{event.type}</span>
                            <span style={styles.eventDate}>{event.startDate} to {event.endDate}</span>
                          </div>
                        </div>
                        <div style={{...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color}}>
                          {statusStyle.icon}
                          <span>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
                        </div>
                      </div>
                      <div style={styles.eventDetails}>
                        <div style={styles.eventDetailItem}>
                          <FiClock size={14} color="#6B7280" />
                          <span>{event.sessions} sessions</span>
                        </div>
                        <div style={styles.eventDetailItem}>
                          <FiTarget size={14} color="#6B7280" />
                          <span>{event.workloadPoints} workload points</span>
                        </div>
                      </div>
                      {isAllocated ? (
                        <div style={styles.allocatedInfo}>
                          <FiUserPlus size={16} color="#10B981" />
                          <span>Assigned to: <strong>{allocatedFaculty.facultyName}</strong></span>
                        </div>
                      ) : (
                        <button onClick={() => openAllocationModal(event)} style={styles.allocateBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                          <FiUserPlus size={16} /> Allocate Faculty
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Current Allocations Section */}
          <div style={styles.allocationsSection}>
            <h3 style={styles.sectionTitle}><FiUsers size={20} /> Current Allocations ({allocations.length})</h3>
            <div style={styles.allocationsList}>
              {allocations.length === 0 ? (
                <div style={styles.emptyState}>
                  <FiUsers size={48} color="#9CA3AF" />
                  <p>No allocations yet</p>
                </div>
              ) : (
                allocations.map(allocation => (
                  <div key={allocation.id} style={styles.allocationCard} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}>
                    <div style={styles.allocationHeader}>
                      <div>
                        <div style={styles.allocationEvent}>{allocation.eventName}</div>
                        <div style={styles.allocationFaculty}>{allocation.facultyName}</div>
                      </div>
                      <button onClick={() => handleRemoveAllocation(allocation.id)} style={styles.removeBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}>
                        <FiX size={16} />
                      </button>
                    </div>
                    <div style={styles.allocationDate}>Allocated on: {allocation.allocatedOn}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Allocation Modal */}
        {showAllocationModal && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Allocate Faculty to Event</h3>
                <button onClick={closeModal} style={styles.closeBtn} onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}>
                  <FiX size={20} />
                </button>
              </div>
              <div style={styles.modalBody}>
                <div style={styles.selectedEventInfo}>
                  <h4>Selected Event:</h4>
                  <p style={{fontWeight: '600', color: '#1F2937', margin: '4px 0'}}>{events.find(e => e.id === selectedEvent)?.name}</p>
                  <div style={{fontSize: '14px', color: '#6B7280'}}>
                    <span>{events.find(e => e.id === selectedEvent)?.sessions} sessions</span> • 
                    <span>{events.find(e => e.id === selectedEvent)?.workloadPoints} workload points</span>
                  </div>
                </div>
                <div style={styles.facultySelection}>
                  <h4 style={{marginBottom: '16px'}}>Select Faculty:</h4>
                  <div style={styles.facultyGrid}>
                    {faculty.map(f => {
                      const workloadInfo = getWorkloadColor(f.currentWorkload);
                      const selectedEventData = events.find(e => e.id === selectedEvent);
                      const willExceed = f.currentWorkload + (selectedEventData?.workloadPoints || 0) > f.maxWorkload;
                      const isSelected = selectedFaculty === f.id;
                      return (
                        <div key={f.id} onClick={() => !willExceed && setSelectedFaculty(f.id)} style={{ ...styles.facultyCard, borderColor: isSelected ? '#4F46E5' : '#E5E7EB', backgroundColor: isSelected ? '#EEF2FF' : willExceed ? '#FEE2E2' : '#FFFFFF', cursor: willExceed ? 'not-allowed' : 'pointer', opacity: willExceed ? 0.6 : 1 }} onMouseEnter={(e) => { if (!willExceed) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)'; } }} onMouseLeave={(e) => { if (!willExceed) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; } }}>
                          <div style={styles.facultyCardHeader}>
                            <div>
                              <div style={styles.facultyCardName}>{f.name}</div>
                              <div style={styles.facultyCardSpec}>{f.specialization}</div>
                            </div>
                            {isSelected && <FiCheckCircle size={20} color="#4F46E5" />}
                          </div>
                          <div style={{...styles.workloadBadge, backgroundColor: workloadInfo.bg, color: workloadInfo.color, marginTop: '8px'}}>
                            {workloadInfo.label}
                          </div>
                          <div style={styles.workloadProgress}>
                            <div style={styles.workloadBar}>
                              <div style={{...styles.workloadFill, width: `${f.currentWorkload}%`, backgroundColor: f.currentWorkload >= 90 ? '#EF4444' : f.currentWorkload >= 70 ? '#F59E0B' : '#10B981'}}></div>
                            </div>
                            <span style={styles.workloadText}>{f.currentWorkload}/{f.maxWorkload}</span>
                          </div>
                          {willExceed && (
                            <div style={styles.exceedWarning}>
                              <FiAlertCircle size={14} />
                              <span>Exceeds capacity</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button onClick={closeModal} style={styles.cancelBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  Cancel
                </button>
                <button onClick={handleAllocate} disabled={!selectedFaculty} style={{...styles.submitBtn, opacity: !selectedFaculty ? 0.5 : 1, cursor: !selectedFaculty ? 'not-allowed' : 'pointer'}} onMouseEnter={(e) => { if (selectedFaculty) { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; } }} onMouseLeave={(e) => { if (selectedFaculty) { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                  <FiSave size={16} /> Allocate
                </button>
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
  workloadSection: {
    marginBottom: '24px'
  },
  mainGrid: {
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
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  workloadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px'
  },
  workloadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  workloadHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '16px'
  },
  facultyName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '4px'
  },
  facultySpec: {
    fontSize: '13px',
    color: '#6B7280'
  },
  workloadBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  workloadProgress: {
    marginBottom: '12px'
  },
  workloadBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '6px'
  },
  workloadFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  },
  workloadText: {
    fontSize: '13px',
    color: '#6B7280',
    fontWeight: '500'
  },
  workloadStats: {
    display: 'flex',
    gap: '12px'
  },
  workloadStatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#374151'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px'
  },
  eventsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    marginBottom: '20px'
  },
  filterControls: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    flexWrap: 'wrap'
  },
  searchBox: {
    flex: 1,
    minWidth: '200px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
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
  filterButtons: {
    display: 'flex',
    gap: '8px'
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '600px',
    overflowY: 'auto'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#6B7280'
  },
  eventCard: {
    padding: '16px',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px'
  },
  eventName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '8px'
  },
  eventMeta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  eventTypeBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '600'
  },
  eventDate: {
    fontSize: '13px',
    color: '#6B7280'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600'
  },
  eventDetails: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px'
  },
  eventDetailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6B7280'
  },
  allocatedInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#D1FAE5',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#065F46'
  },
  allocateBtn: {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '8px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  allocationsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  allocationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '600px',
    overflowY: 'auto'
  },
  allocationCard: {
    padding: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    transition: 'all 0.2s ease'
  },
  allocationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '8px'
  },
  allocationEvent: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '4px'
  },
  allocationFaculty: {
    fontSize: '13px',
    color: '#6B7280'
  },
  removeBtn: {
    padding: '6px',
    backgroundColor: '#FEE2E2',
    border: 'none',
    borderRadius: '6px',
    color: '#DC2626',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  allocationDate: {
    fontSize: '12px',
    color: '#9CA3AF'
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
  selectedEventInfo: {
    padding: '16px',
    backgroundColor: '#EEF2FF',
    borderRadius: '10px',
    marginBottom: '24px'
  },
  facultySelection: {
    marginBottom: '16px'
  },
  facultyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '12px'
  },
  facultyCard: {
    padding: '16px',
    border: '2px solid',
    borderRadius: '10px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  facultyCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px'
  },
  facultyCardName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937'
  },
  facultyCardSpec: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '2px'
  },
  exceedWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    padding: '8px',
    backgroundColor: '#FEE2E2',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#991B1B',
    fontWeight: '500'
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    padding: '24px',
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
  }
};

export default FacultyAllocation;
