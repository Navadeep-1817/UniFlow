import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GlobalEventCalendar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    organizer: 'all',
    type: 'all',
    subType: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [organizers, setOrganizers] = useState([]);
  const [subTypes, setSubTypes] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    if (!token) {
      console.error('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/superadmin/events`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Fetched events:', data.count, data.data);
        setEvents(data.data || []);
        
        // Extract unique organizers and subTypes
        const uniqueOrganizers = [...new Set(data.data.map(e => e.organizer?.name).filter(Boolean))];
        const uniqueSubTypes = [...new Set(data.data.map(e => e.subType).filter(Boolean))];
        setOrganizers(uniqueOrganizers);
        setSubTypes(uniqueSubTypes);
      } else {
        console.error('Failed to fetch events:', response.status);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.date.startDate);
    const endDate = new Date(event.date.endDate);
    
    if (event.status === 'Cancelled' || event.status === 'Rejected') {
      return event.status;
    }
    
    if (now < startDate) return 'Upcoming';
    if (now > endDate) return 'Completed';
    if (now >= startDate && now <= endDate) return 'Ongoing';
    return event.status || 'Upcoming';
  };

  const getEventTypeColor = (type, subType) => {
    const colors = {
      Academic: { bg: '#DBEAFE', color: '#1E40AF', icon: '�' },
      NonAcademic: { bg: '#FCE7F3', color: '#9F1239', icon: '🎭' },
      Sports: { bg: '#FEF3C7', color: '#92400E', icon: '⚽' },
      Placement: { bg: '#D1FAE5', color: '#065F46', icon: '💼' }
    };
    
    if (subType === 'Sports') return colors.Sports;
    if (type === 'Academic') return colors.Academic;
    return colors.NonAcademic;
  };

  const getStatusBadge = (status) => {
    const badges = {
      Upcoming: { bg: '#DBEAFE', color: '#1E40AF', text: 'Upcoming' },
      Ongoing: { bg: '#D1FAE5', color: '#065F46', text: 'Ongoing' },
      Completed: { bg: '#F3F4F6', color: '#6B7280', text: 'Completed' },
      Cancelled: { bg: '#FEE2E2', color: '#991B1B', text: 'Cancelled' },
      Rejected: { bg: '#FEE2E2', color: '#991B1B', text: 'Rejected' },
      Pending: { bg: '#FEF3C7', color: '#92400E', text: 'Pending Approval' },
      Draft: { bg: '#F3F4F6', color: '#6B7280', text: 'Draft' }
    };
    return badges[status] || badges.Upcoming;
  };

  const filteredEvents = events.filter(event => {
    const eventStatus = getEventStatus(event);
    
    // Tab filter
    if (activeTab !== 'all') {
      if (eventStatus.toLowerCase() !== activeTab.toLowerCase()) return false;
    }

    // Organizer filter
    if (filters.organizer !== 'all') {
      const eventOrganizer = event.organizer?.name || '';
      if (eventOrganizer !== filters.organizer) return false;
    }

    // Type filter (Academic/NonAcademic)
    if (filters.type !== 'all' && event.type !== filters.type) return false;

    // SubType filter
    if (filters.subType !== 'all' && event.subType !== filters.subType) return false;

    // Status filter
    if (filters.status !== 'all' && event.status !== filters.status) return false;

    // Date range filter
    if (filters.dateFrom) {
      const eventStart = new Date(event.date.startDate);
      const filterStart = new Date(filters.dateFrom);
      if (eventStart < filterStart) return false;
    }
    
    if (filters.dateTo) {
      const eventEnd = new Date(event.date.endDate);
      const filterEnd = new Date(filters.dateTo);
      if (eventEnd > filterEnd) return false;
    }

    return true;
  });

  const stats = {
    total: events.length,
    upcoming: events.filter(e => getEventStatus(e) === 'Upcoming').length,
    ongoing: events.filter(e => getEventStatus(e) === 'Ongoing').length,
    completed: events.filter(e => getEventStatus(e) === 'Completed').length
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
    statsBar: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px 30px',
      marginBottom: '24px',
      border: '1px solid #E5E7EB',
      display: 'flex',
      justifyContent: 'space-around',
      gap: '20px',
      flexWrap: 'wrap'
    },
    statItem: {
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#4F46E5'
    },
    statLabel: {
      fontSize: '13px',
      color: '#6B7280',
      marginTop: '4px'
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
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
    filterSection: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      border: '1px solid #E5E7EB'
    },
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    filterLabel: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151'
    },
    select: {
      padding: '10px 12px',
      fontSize: '14px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#1F2937',
      cursor: 'pointer',
      outline: 'none'
    },
    input: {
      padding: '10px 12px',
      fontSize: '14px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#1F2937',
      outline: 'none'
    },
    eventsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: '20px'
    },
    eventCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'all 0.3s'
    },
    eventHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    eventTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      margin: 0
    },
    badge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'inline-block'
    },
    eventDetails: {
      marginTop: '16px'
    },
    detailRow: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#6B7280',
      gap: '8px'
    },
    detailLabel: {
      fontWeight: '600',
      color: '#374151',
      minWidth: '120px',
      flexShrink: 0
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #E5E7EB'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.logo}>UniFlow</div>
            <h1 style={styles.title}>Super Admin - Global Event Calendar</h1>
          </div>
        </div>
        <div style={styles.content}>
          <div style={{...styles.emptyState, padding: '100px 20px'}}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>⏳</div>
            <h3 style={{fontSize: '18px', color: '#6B7280'}}>Loading events...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>UniFlow</div>
          <h1 style={styles.title}>Super Admin - Global Event Calendar</h1>
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
        {[
          { label: '📊 Dashboard', path: '/superadmin/dashboard' },
          { label: '✓ Approval Queue', path: '/superadmin/approval-queue' },
          { label: '📈 Global Analytics', path: '/superadmin/global-analytics' },
          { label: '📅 Event Calendar', path: '/superadmin/event-calendar', active: true },
          { label: '👥 User Management', path: '/superadmin/user-management' }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            style={{
              padding: '16px 24px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: item.active ? '3px solid #4F46E5' : '3px solid transparent',
              fontSize: '14px',
              fontWeight: '600',
              color: item.active ? '#4F46E5' : '#6B7280',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              if (!item.active) {
                e.target.style.color = '#4F46E5';
                e.target.style.borderBottomColor = '#4F46E5';
              }
            }}
            onMouseOut={(e) => {
              if (!item.active) {
                e.target.style.color = '#6B7280';
                e.target.style.borderBottomColor = 'transparent';
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Stats Bar */}
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{stats.total}</div>
            <div style={styles.statLabel}>Total Events</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{stats.upcoming}</div>
            <div style={styles.statLabel}>Upcoming</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{stats.ongoing}</div>
            <div style={styles.statLabel}>Ongoing</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>{stats.completed}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
        </div>

        {/* Status Tabs */}
        <div style={styles.tabs}>
          {[
            { value: 'all', label: `🔍 All Events (${stats.total})` },
            { value: 'upcoming', label: `🔜 Upcoming (${stats.upcoming})` },
            { value: 'ongoing', label: `▶️ Ongoing (${stats.ongoing})` },
            { value: 'completed', label: `✅ Completed (${stats.completed})` }
          ].map(tab => (
            <button
              key={tab.value}
              style={{...styles.tab, ...(activeTab === tab.value && styles.activeTab)}}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.filterSection}>
          <h3 style={{fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '16px'}}>
            🔍 Filters
          </h3>
          <div style={styles.filterGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Organizer</label>
              <select 
                style={styles.select}
                value={filters.organizer}
                onChange={(e) => handleFilterChange('organizer', e.target.value)}
              >
                <option value="all">All Organizers</option>
                {organizers.map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Sub Type</label>
              <select 
                style={styles.select}
                value={filters.subType}
                onChange={(e) => handleFilterChange('subType', e.target.value)}
              >
                <option value="all">All Sub Types</option>
                {subTypes.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Status</label>
              <select 
                style={styles.select}
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Event Type</label>
              <select 
                style={styles.select}
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Academic">📚 Academic</option>
                <option value="NonAcademic">🎭 Non-Academic</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>From Date</label>
              <input 
                type="date"
                style={styles.input}
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>To Date</label>
              <input 
                type="date"
                style={styles.input}
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div style={styles.eventsGrid}>
            {filteredEvents.map((event, idx) => {
              const typeColors = getEventTypeColor(event.type, event.subType);
              const eventStatus = getEventStatus(event);
              const statusBadge = getStatusBadge(eventStatus);
              
              return (
                <div 
                  key={event._id || idx} 
                  style={styles.eventCard}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={styles.eventHeader}>
                    <h3 style={styles.eventTitle}>
                      {typeColors.icon} {event.title}
                    </h3>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: statusBadge.bg,
                      color: statusBadge.color
                    }}>
                      {statusBadge.text}
                    </span>
                  </div>

                  <p style={{color: '#6B7280', fontSize: '14px', lineHeight: '1.6', margin: '12px 0 0 0'}}>
                    {event.description?.substring(0, 150)}{event.description?.length > 150 ? '...' : ''}
                  </p>

                  <div style={styles.eventDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📅 Start Date:</span>
                      <span>{new Date(event.date.startDate).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📅 End Date:</span>
                      <span>{new Date(event.date.endDate).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>🏛️ University:</span>
                      <span>{event.university?.name || 'N/A'}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>� Organized by:</span>
                      <span>{event.organizer?.name || 'N/A'}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>� Venue:</span>
                      <span>{event.venue?.name || event.mode || 'N/A'}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>� Created By:</span>
                      <span>{event.createdBy?.name || 'N/A'} ({event.createdBy?.role || 'N/A'})</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>🎟️ Registrations:</span>
                      <span style={{fontWeight: '600', color: '#4F46E5'}}>
                        {event.registration?.currentParticipants || 0} / {event.registration?.maxParticipants || 'Unlimited'}
                      </span>
                    </div>
                  </div>

                  <div style={{marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                    <div style={{
                      padding: '6px 12px',
                      backgroundColor: typeColors.bg,
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: typeColors.color
                    }}>
                      {event.type}
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      {event.subType}
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      backgroundColor: '#EEF2FF',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#4338CA'
                    }}>
                      {event.eventCode}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>📅</div>
            <h3 style={{fontSize: '18px', color: '#6B7280', marginBottom: '8px'}}>
              No events found
            </h3>
            <p style={{color: '#9CA3AF', fontSize: '14px'}}>
              {activeTab !== 'all' ? `No ${activeTab} events match your filters.` : 'No events match your filters.'} Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalEventCalendar;
