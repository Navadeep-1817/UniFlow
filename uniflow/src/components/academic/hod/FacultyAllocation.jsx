import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  FiRefreshCw,
  FiInfo
} from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FacultyAllocation = () => {
  const [events, setEvents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [participantSearchQuery, setParticipantSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEventType, setFilterEventType] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allocationType, setAllocationType] = useState('trainer'); // 'trainer' or 'faculty'
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch events, faculty, trainers, and students in parallel
      const [eventsRes, facultyRes, trainersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/hod/events`, config),
        axios.get(`${API_BASE_URL}/hod/faculty`, config),
        axios.get(`${API_BASE_URL}/hod/trainers`, config)
      ]);

      console.log('Events Response:', eventsRes.data);
      console.log('Faculty Response:', facultyRes.data);
      console.log('Trainers Response:', trainersRes.data);

      const eventsData = (eventsRes.data.data || eventsRes.data || []).map(event => {
        console.log('Event coordinators:', event.title, event.coordinators);
        return {
          id: event._id,
          name: event.title,
          type: event.type || 'Event',
          subType: event.subType || 'General',
          category: event.category || 'Department',
          startDate: new Date(event.date.startDate).toISOString().split('T')[0],
          endDate: new Date(event.date.endDate).toISOString().split('T')[0],
          venue: event.venue?.name || 'TBD',
          status: event.status.toLowerCase(),
          sessions: event.sessions?.length || 0,
          description: event.description || '',
          trainer: event.trainer,
          trainerId: event.trainer?._id,
          coordinators: event.coordinators || [],
          coordinatorIds: (event.coordinators || []).map(c => c._id || c),
          targetAudience: event.targetAudience || {},
          registrations: event.registrations || [],
          workloadPoints: event.workloadPoints || 10 // Default workload points per event
        };
      });
      
      const facultyData = (facultyRes.data.data || facultyRes.data || []).map(fac => ({
        id: fac._id,
        name: `${fac.firstName} ${fac.lastName}`,
        email: fac.email,
        phone: fac.phone || fac.phoneNumber || 'N/A',
        specialization: fac.specialization || 'General',
        department: fac.department?.name || 'N/A',
        currentWorkload: fac.currentWorkload || 0,
        maxWorkload: fac.maxWorkload || 100,
        allocatedEvents: fac.allocatedEvents || 0
      }));
      
      const trainersData = (trainersRes.data.data || trainersRes.data || []).map(trainer => ({
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone || 'N/A',
        organization: trainer.organization || 'N/A',
        expertise: trainer.expertise || [],
        type: trainer.type || 'External',
        isVerified: trainer.isVerified || false
      }));

      setEvents(eventsData);
      setFaculty(facultyData);
      setTrainers(trainersData);
      setFilteredEvents(eventsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
      setLoading(false);
      setEvents([]);
      setFaculty([]);
      setTrainers([]);
      setFilteredEvents([]);
    }
  };

  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.subType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    if (filterEventType !== 'all') {
      filtered = filtered.filter(e => {
        const eventSubType = e.subType.toLowerCase();
        if (filterEventType === 'fdp') return eventSubType.includes('fdp') || eventSubType.includes('faculty development');
        if (filterEventType === 'crt') return eventSubType.includes('crt') || eventSubType.includes('campus recruitment');
        if (filterEventType === 'sdp') return eventSubType.includes('sdp') || eventSubType.includes('student development');
        if (filterEventType === 'seminar') return eventSubType.includes('seminar') || eventSubType.includes('webinar') || eventSubType.includes('workshop');
        return true;
      });
    }

    setFilteredEvents(filtered);
  }, [searchQuery, filterStatus, filterEventType, events]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleAllocate = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      showToast('Authentication required', 'error');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Determine what needs to be allocated based on event type
      const eventDetails = selectedEventDetails;
      const eventSubType = eventDetails?.subType.toLowerCase() || '';
      
      // For FDP or CRT events - allocate trainer
      if (eventSubType.includes('fdp') || eventSubType.includes('faculty development') || 
          eventSubType.includes('crt') || eventSubType.includes('campus recruitment')) {
        
        if (!selectedTrainer) {
          showToast('Please select a trainer', 'error');
          return;
        }

        await axios.put(
          `${API_BASE_URL}/hod/events/${selectedEvent}/allocate-trainer`,
          { trainerId: selectedTrainer },
          config
        );

        showToast(`Trainer allocated to ${eventDetails.name} successfully!`, 'success');
      } 
      // For student-focused events (seminars, webinars, workshops, SDP) - allocate faculty
      else {
        if (selectedFaculty.length === 0) {
          showToast('Please select at least one faculty member', 'error');
          return;
        }

        // Create allocation records (you may need to create a backend endpoint for this)
        await axios.post(
          `${API_BASE_URL}/hod/events/${selectedEvent}/allocate-faculty`,
          { 
            facultyIds: selectedFaculty,
            allocationType: 'coordinator'
          },
          config
        );

        showToast(`Faculty allocated to ${eventDetails.name} successfully!`, 'success');
      }

      closeModal();
      await fetchAllData();
    } catch (error) {
      console.error('Error allocating:', error);
      showToast(error.response?.data?.message || 'Failed to allocate', 'error');
    }
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
    setSelectedEventDetails(event);
    setSelectedTrainer(event.trainerId || null);
    
    // Pre-select already allocated faculty
    setSelectedFaculty(event.coordinatorIds || []);
    setSelectedStudents([]);
    setParticipantSearchQuery('');
    
    // Determine allocation type based on event subType
    const eventSubType = event.subType.toLowerCase();
    if (eventSubType.includes('fdp') || eventSubType.includes('faculty development') ||
        eventSubType.includes('crt') || eventSubType.includes('campus recruitment')) {
      setAllocationType('trainer');
    } else {
      setAllocationType('faculty');
    }
    
    setShowAllocationModal(true);
  };

  const closeModal = () => {
    setShowAllocationModal(false);
    setSelectedEvent(null);
    setSelectedEventDetails(null);
    setSelectedTrainer(null);
    setSelectedFaculty([]);
    setSelectedStudents([]);
    setParticipantSearchQuery('');
  };

  const toggleFacultySelection = (facultyId) => {
    setSelectedFaculty(prev => {
      if (prev.includes(facultyId)) {
        return prev.filter(id => id !== facultyId);
      } else {
        return [...prev, facultyId];
      }
    });
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
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
          {loading ? (
            <div style={styles.emptyState}>
              <FiRefreshCw size={48} color="#9CA3AF" style={{animation: 'spin 1s linear infinite'}} />
              <p>Loading faculty workload...</p>
            </div>
          ) : faculty.length === 0 ? (
            <div style={styles.emptyState}>
              <FiUsers size={48} color="#9CA3AF" />
              <p>No faculty members found in your department</p>
              <p style={{fontSize: '14px', color: '#9CA3AF', marginTop: '8px'}}>Faculty members will appear here once they are added to your department</p>
            </div>
          ) : (
            <div style={styles.workloadGrid}>
              {faculty.map(f => {
                const workloadInfo = getWorkloadColor(f.currentWorkload || 0);
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
                        <div style={{...styles.workloadFill, width: `${Math.min((f.currentWorkload || 0), 100)}%`, backgroundColor: (f.currentWorkload || 0) >= 90 ? '#EF4444' : (f.currentWorkload || 0) >= 70 ? '#F59E0B' : '#10B981'}}></div>
                      </div>
                      <span style={styles.workloadText}>{f.currentWorkload || 0}/{f.maxWorkload || 100} points</span>
                    </div>
                    <div style={styles.workloadStats}>
                      <div style={styles.workloadStatItem}>
                        <FiCalendar size={16} color="#6B7280" />
                        <span>{f.allocatedEvents || 0} events</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                  <div style={{marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: '#6B7280'}}>Status:</div>
                  <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                    {['all', 'pending', 'allocated'].map(status => (
                      <button key={status} onClick={() => setFilterStatus(status)} style={{ ...styles.filterBtn, backgroundColor: filterStatus === status ? '#4F46E5' : '#FFFFFF', color: filterStatus === status ? '#FFFFFF' : '#6B7280', border: filterStatus === status ? 'none' : '1px solid #E5E7EB' }} onMouseEnter={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; } }} onMouseLeave={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1)'; } }}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div style={{marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: '#6B7280'}}>Event Type:</div>
                  <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                    {[
                      { value: 'all', label: 'All Types' },
                      { value: 'fdp', label: 'FDP' },
                      { value: 'crt', label: 'CRT' },
                      { value: 'sdp', label: 'SDP' },
                      { value: 'seminar', label: 'Seminar' }
                    ].map(type => (
                      <button 
                        key={type.value} 
                        onClick={() => setFilterEventType(type.value)} 
                        style={{ 
                          ...styles.filterBtn, 
                          backgroundColor: filterEventType === type.value ? '#10B981' : '#FFFFFF', 
                          color: filterEventType === type.value ? '#FFFFFF' : '#6B7280', 
                          border: filterEventType === type.value ? 'none' : '1px solid #E5E7EB' 
                        }} 
                        onMouseEnter={(e) => { 
                          if (filterEventType !== type.value) { 
                            e.currentTarget.style.backgroundColor = '#F3F4F6'; 
                            e.currentTarget.style.transform = 'scale(1.05)'; 
                          } 
                        }} 
                        onMouseLeave={(e) => { 
                          if (filterEventType !== type.value) { 
                            e.currentTarget.style.backgroundColor = '#FFFFFF'; 
                            e.currentTarget.style.transform = 'scale(1)'; 
                          } 
                        }}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
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
                  const eventSubType = event.subType.toLowerCase();
                  
                  // Determine allocation type based on event subType
                  const isTrainerEvent = eventSubType.includes('fdp') || 
                                        eventSubType.includes('faculty development') ||
                                        eventSubType.includes('crt') || 
                                        eventSubType.includes('campus recruitment');
                  
                  const isAllocated = isTrainerEvent ? !!event.trainer : (event.coordinators && event.coordinators.length > 0);
                  const allocatedTrainer = event.trainer;
                  const allocatedCoordinators = event.coordinators || [];
                  
                  return (
                    <div key={event.id} style={styles.eventCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
                      <div style={styles.eventHeader}>
                        <div>
                          <div style={styles.eventName}>{event.name}</div>
                          <div style={styles.eventMeta}>
                            <span style={{...styles.eventTypeBadge, backgroundColor: event.type === 'FDP' ? '#4F46E5' : event.type === 'SDP' ? '#10B981' : '#F59E0B'}}>{event.subType}</span>
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
                          {isTrainerEvent ? (
                            <span>Trainer: <strong>{allocatedTrainer?.name || 'TBD'}</strong></span>
                          ) : (
                            <span>Faculty: <strong>
                              {(() => {
                                if (allocatedCoordinators.length === 0) return 'No faculty assigned';
                                
                                const names = allocatedCoordinators
                                  .map(c => {
                                    // If it's a populated object with name
                                    if (c && typeof c === 'object' && c.name) {
                                      return c.name;
                                    }
                                    return null;
                                  })
                                  .filter(name => name);
                                
                                if (names.length > 0) {
                                  return names.join(', ');
                                } else {
                                  // If coordinators exist but not populated, show count
                                  return `${allocatedCoordinators.length} faculty member${allocatedCoordinators.length > 1 ? 's' : ''}`;
                                }
                              })()}
                            </strong></span>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => openAllocationModal(event)} style={styles.allocateBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                          <FiUserPlus size={16} /> {isTrainerEvent ? 'Allocate Trainer' : 'Allocate Faculty'}
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
                <h3 style={styles.modalTitle}>
                  {allocationType === 'trainer' ? 'Allocate Trainer to Event' : 'Allocate Faculty to Event'}
                </h3>
                <button onClick={closeModal} style={styles.closeBtn} onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}>
                  <FiX size={20} />
                </button>
              </div>
              <div style={styles.modalBody}>
                <div style={styles.selectedEventInfo}>
                  <h4>Selected Event:</h4>
                  <p style={{fontWeight: '600', color: '#1F2937', margin: '4px 0'}}>{selectedEventDetails?.name}</p>
                  <div style={{fontSize: '14px', color: '#6B7280', marginTop: '8px'}}>
                    <span><strong>Type:</strong> {selectedEventDetails?.subType}</span> • 
                    <span><strong>Duration:</strong> {selectedEventDetails?.startDate} to {selectedEventDetails?.endDate}</span>
                  </div>
                  <div style={{padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '8px', marginTop: '12px', fontSize: '13px'}}>
                    <FiInfo size={16} style={{display: 'inline', marginRight: '8px'}} />
                    {allocationType === 'trainer' ? (
                      <span><strong>Allocating Trainer:</strong> For FDP/CRT events, trainers provide expertise to faculty or students.</span>
                    ) : (
                      <span><strong>Allocating Faculty:</strong> For student events, faculty members coordinate and manage activities.</span>
                    )}
                  </div>
                </div>

                {allocationType === 'trainer' ? (
                  <div style={styles.facultySelection}>
                    <h4 style={{marginBottom: '16px'}}>Select Trainer:</h4>
                    {trainers.length === 0 ? (
                      <div style={{...styles.emptyState, padding: '20px'}}>
                        <FiUsers size={32} color="#9CA3AF" />
                        <p style={{fontSize: '14px'}}>No trainers available. Please register trainers first.</p>
                      </div>
                    ) : (
                      <div style={styles.facultyGrid}>
                        {trainers.map(t => {
                          const isSelected = selectedTrainer === t.id;
                          return (
                            <div key={t.id} onClick={() => setSelectedTrainer(t.id)} style={{ ...styles.facultyCard, borderColor: isSelected ? '#4F46E5' : '#E5E7EB', backgroundColor: isSelected ? '#EEF2FF' : '#FFFFFF', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
                              <div style={styles.facultyCardHeader}>
                                <div>
                                  <div style={styles.facultyCardName}>{t.name}</div>
                                  <div style={styles.facultyCardSpec}>{t.organization}</div>
                                  {!t.isVerified && (
                                    <div style={{fontSize: '11px', color: '#F59E0B', fontWeight: '600', marginTop: '4px'}}>
                                      Pending Verification
                                    </div>
                                  )}
                                </div>
                                {isSelected && <FiCheckCircle size={20} color="#4F46E5" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={styles.facultySelection}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                      <h4 style={{margin: 0}}>Select Faculty Coordinators:</h4>
                      {selectedEventDetails?.coordinators && selectedEventDetails.coordinators.length > 0 && (
                        <span style={{fontSize: '13px', color: '#6B7280', fontStyle: 'italic'}}>
                          Currently allocated: {selectedEventDetails.coordinators.length} faculty
                        </span>
                      )}
                    </div>
                    <div style={styles.searchBox}>
                      <FiSearch size={16} color="#6B7280" />
                      <input 
                        type="text" 
                        placeholder="Search faculty by name..." 
                        value={participantSearchQuery} 
                        onChange={(e) => setParticipantSearchQuery(e.target.value)} 
                        style={styles.searchInput} 
                      />
                    </div>
                    {faculty.length === 0 ? (
                      <div style={{...styles.emptyState, padding: '20px'}}>
                        <FiUsers size={32} color="#9CA3AF" />
                        <p style={{fontSize: '14px'}}>No faculty members found in your department.</p>
                      </div>
                    ) : (
                      <div style={styles.facultyGrid}>
                        {faculty
                          .filter(f => f.name.toLowerCase().includes(participantSearchQuery.toLowerCase()))
                          .map(f => {
                            const isSelected = selectedFaculty.includes(f.id);
                            return (
                              <div 
                                key={f.id} 
                                onClick={() => toggleFacultySelection(f.id)} 
                                style={{ ...styles.facultyCard, borderColor: isSelected ? '#10B981' : '#E5E7EB', backgroundColor: isSelected ? '#D1FAE5' : '#FFFFFF', cursor: 'pointer' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)'; }} 
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}
                              >
                                <div style={styles.facultyCardHeader}>
                                  <div>
                                    <div style={styles.facultyCardName}>{f.name}</div>
                                    <div style={styles.facultyCardSpec}>{f.specialization}</div>
                                    <div style={{fontSize: '11px', color: '#9CA3AF', marginTop: '4px'}}>
                                      {f.email}
                                    </div>
                                  </div>
                                  {isSelected && <FiCheckCircle size={20} color="#10B981" />}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                    {selectedFaculty.length > 0 && (
                      <div style={{marginTop: '12px', padding: '12px', backgroundColor: '#D1FAE5', borderRadius: '8px', fontSize: '13px', color: '#065F46'}}>
                        <strong>{selectedFaculty.length}</strong> faculty member(s) selected
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={styles.modalFooter}>
                <button onClick={closeModal} style={styles.cancelBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                  Cancel
                </button>
                <button 
                  onClick={handleAllocate} 
                  disabled={allocationType === 'trainer' ? !selectedTrainer : selectedFaculty.length === 0} 
                  style={{
                    ...styles.submitBtn, 
                    opacity: (allocationType === 'trainer' ? !selectedTrainer : selectedFaculty.length === 0) ? 0.5 : 1, 
                    cursor: (allocationType === 'trainer' ? !selectedTrainer : selectedFaculty.length === 0) ? 'not-allowed' : 'pointer'
                  }} 
                  onMouseEnter={(e) => { 
                    const isDisabled = allocationType === 'trainer' ? !selectedTrainer : selectedFaculty.length === 0;
                    if (!isDisabled) { 
                      e.currentTarget.style.backgroundColor = '#4338CA'; 
                      e.currentTarget.style.transform = 'scale(1.02)'; 
                    } 
                  }} 
                  onMouseLeave={(e) => { 
                    const isDisabled = allocationType === 'trainer' ? !selectedTrainer : selectedFaculty.length === 0;
                    if (!isDisabled) { 
                      e.currentTarget.style.backgroundColor = '#4F46E5'; 
                      e.currentTarget.style.transform = 'scale(1)'; 
                    } 
                  }}
                >
                  <FiSave size={16} /> 
                  {allocationType === 'trainer' 
                    ? (selectedEventDetails?.trainer ? 'Update Trainer' : 'Allocate Trainer')
                    : (selectedEventDetails?.coordinators && selectedEventDetails.coordinators.length > 0 
                        ? `Update Faculty (${selectedFaculty.length} selected)` 
                        : `Allocate ${selectedFaculty.length} Faculty`)
                  }
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
