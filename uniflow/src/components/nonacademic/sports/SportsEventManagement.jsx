import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SportsTopNav from './SportsTopNav';
import { FiPlus, FiCalendar, FiMapPin, FiUsers, FiTrophy, FiEdit, FiTrash2, FiEye, FiFilter, FiSearch, FiX } from 'react-icons/fi';

const SportsEventManagement = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [newEvent, setNewEvent] = useState({
    name: '',
    sport: '',
    type: 'tournament',
    startDate: '',
    endDate: '',
    venue: '',
    description: '',
    maxTeams: 0,
    registrationDeadline: '',
    prizes: '',
    rules: ''
  });

  useEffect(() => {
    // TODO: Fetch events from API
    // fetchSportsEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.sport.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, filterType, filterStatus]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleCreateEvent = async () => {
    try {
      // TODO: API call to create event
      showToast('Event created successfully!');
      setShowCreateModal(false);
      setNewEvent({
        name: '',
        sport: '',
        type: 'tournament',
        startDate: '',
        endDate: '',
        venue: '',
        description: '',
        maxTeams: 0,
        registrationDeadline: '',
        prizes: '',
        rules: ''
      });
    } catch (error) {
      showToast('Failed to create event', 'error');
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== eventId));
      showToast('Event deleted successfully');
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      tournament: { bg: '#DBEAFE', text: '#1E40AF' },
      'sports-meet': { bg: '#FEF3C7', text: '#92400E' },
      'practice-session': { bg: '#D1FAE5', text: '#065F46' },
      championship: { bg: '#FCE7F3', text: '#9F1239' }
    };
    return colors[type] || colors.tournament;
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: { bg: '#DBEAFE', text: '#1E40AF' },
      ongoing: { bg: '#D1FAE5', text: '#065F46' },
      completed: { bg: '#F3F4F6', text: '#374151' },
      cancelled: { bg: '#FEE2E2', text: '#991B1B' }
    };
    return colors[status] || colors.upcoming;
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'system-ui'}}>
      {toast.show && (
        <div style={{position: 'fixed', top: '20px', right: '20px', backgroundColor: toast.type === 'error' ? '#EF4444' : '#10B981', color: 'white', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 2000}}>
          {toast.message}
        </div>
      )}

      <SportsTopNav />

      {/* Page Header */}
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '20px 40px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0}}>Event Management</h1>
            <p style={{fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0'}}>Create and manage sports events</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} style={{padding: '12px 24px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <FiPlus size={18} /> Create Event
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '20px 40px'}}>
        <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
          <div style={{flex: 1, minWidth: '300px', position: 'relative'}}>
            <FiSearch size={20} color="#9CA3AF" style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
            <input type="text" placeholder="Search events by name or sport..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{width: '100%', padding: '10px 10px 10px 40px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} />
          </div>
          
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{padding: '10px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer'}}>
            <option value="all">All Types</option>
            <option value="tournament">Tournament</option>
            <option value="sports-meet">Sports Meet</option>
            <option value="practice-session">Practice Session</option>
            <option value="championship">Championship</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{padding: '10px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer'}}>
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div style={{padding: '40px'}}>
        {filteredEvents.length === 0 ? (
          <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', border: '2px dashed #E5E7EB'}}>
            <FiCalendar size={48} color="#9CA3AF" style={{margin: '0 auto 16px'}} />
            <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0'}}>No events found</h3>
            <p style={{fontSize: '14px', color: '#6B7280', margin: '0 0 20px 0'}}>Create your first sports event to get started</p>
            <button onClick={() => setShowCreateModal(true)} style={{padding: '10px 20px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>
              Create Event
            </button>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px'}}>
            {filteredEvents.map((event) => {
              const typeColors = getEventTypeColor(event.type);
              const statusColors = getStatusColor(event.status);
              
              return (
                <div key={event.id} style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.3s', cursor: 'pointer'}} onMouseEnter={(e) => {e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)';}} onMouseLeave={(e) => {e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)';}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                    <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: 0}}>{event.name}</h3>
                    <span style={{padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', backgroundColor: statusColors.bg, color: statusColors.text}}>
                      {event.status}
                    </span>
                  </div>

                  <div style={{marginBottom: '16px'}}>
                    <span style={{padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', backgroundColor: typeColors.bg, color: typeColors.text}}>
                      {event.type}
                    </span>
                    <span style={{marginLeft: '8px', fontSize: '14px', color: '#6B7280'}}>• {event.sport}</span>
                  </div>

                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <FiCalendar size={16} color="#6B7280" />
                      <span style={{fontSize: '14px', color: '#6B7280'}}>{event.startDate} - {event.endDate}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <FiMapPin size={16} color="#6B7280" />
                      <span style={{fontSize: '14px', color: '#6B7280'}}>{event.venue}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <FiUsers size={16} color="#6B7280" />
                      <span style={{fontSize: '14px', color: '#6B7280'}}>{event.registeredTeams || 0} / {event.maxTeams} teams</span>
                    </div>
                  </div>

                  <div style={{display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid #E5E7EB'}}>
                    <button onClick={(e) => {e.stopPropagation(); setSelectedEvent(event); setShowDetailsModal(true);}} style={{flex: 1, padding: '8px', backgroundColor: '#EFF6FF', color: '#1E40AF', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'}}>
                      <FiEye size={14} /> View
                    </button>
                    <button onClick={(e) => {e.stopPropagation(); navigate(`/sports/event-edit/${event.id}`);}} style={{flex: 1, padding: '8px', backgroundColor: '#FEF3C7', color: '#92400E', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'}}>
                      <FiEdit size={14} /> Edit
                    </button>
                    <button onClick={(e) => {e.stopPropagation(); handleDeleteEvent(event.id);}} style={{padding: '8px 12px', backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}} onClick={() => setShowCreateModal(false)}>
          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto'}} onClick={(e) => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0}}>Create New Event</h2>
              <button onClick={() => setShowCreateModal(false)} style={{padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer'}}>
                <FiX size={24} color="#6B7280" />
              </button>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Event Name *</label>
                <input type="text" value={newEvent.name} onChange={(e) => setNewEvent({...newEvent, name: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} placeholder="e.g., Inter-College Basketball Tournament" />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Sport *</label>
                  <input type="text" value={newEvent.sport} onChange={(e) => setNewEvent({...newEvent, sport: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} placeholder="e.g., Basketball" />
                </div>
                
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Event Type *</label>
                  <select value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white'}}>
                    <option value="tournament">Tournament</option>
                    <option value="sports-meet">Sports Meet</option>
                    <option value="practice-session">Practice Session</option>
                    <option value="championship">Championship</option>
                  </select>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Start Date *</label>
                  <input type="date" value={newEvent.startDate} onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} />
                </div>
                
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>End Date *</label>
                  <input type="date" value={newEvent.endDate} onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} />
                </div>
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Venue *</label>
                <input type="text" value={newEvent.venue} onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} placeholder="e.g., Main Sports Complex" />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Max Teams *</label>
                  <input type="number" value={newEvent.maxTeams} onChange={(e) => setNewEvent({...newEvent, maxTeams: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} placeholder="16" />
                </div>
                
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Registration Deadline *</label>
                  <input type="date" value={newEvent.registrationDeadline} onChange={(e) => setNewEvent({...newEvent, registrationDeadline: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} />
                </div>
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Description</label>
                <textarea value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', minHeight: '80px'}} placeholder="Event description..." />
              </div>

              <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
                <button onClick={handleCreateEvent} style={{flex: 1, padding: '12px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>
                  Create Event
                </button>
                <button onClick={() => setShowCreateModal(false)} style={{flex: 1, padding: '12px', backgroundColor: '#F3F4F6', color: '#1F2937', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsEventManagement;
