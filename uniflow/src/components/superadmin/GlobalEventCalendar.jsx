import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GlobalEventCalendar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    department: 'all',
    studentBody: 'all',
    university: 'all',
    eventType: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    // Mock events data - In real app, this would be API call
    const mockEvents = [
      {
        id: 1,
        name: 'Tech Fest 2024',
        university: 'JNTU Hyderabad',
        department: 'Computer Science',
        eventType: 'technical',
        studentBody: 'Technical Club',
        startDate: '2024-11-10',
        endDate: '2024-11-12',
        status: 'upcoming',
        description: 'Annual technical festival with coding competitions, hackathons, and tech talks',
        participants: 500,
        venue: 'Main Auditorium'
      },
      {
        id: 2,
        name: 'Annual Sports Meet',
        university: 'Osmania University',
        department: 'Sports',
        eventType: 'sports',
        studentBody: 'Sports Committee',
        startDate: '2024-11-08',
        endDate: '2024-11-09',
        status: 'ongoing',
        description: 'Inter-departmental sports competition',
        participants: 300,
        venue: 'Sports Complex'
      },
      {
        id: 3,
        name: 'Cultural Fest',
        university: 'JNTU Kakinada',
        department: 'Student Affairs',
        eventType: 'cultural',
        studentBody: 'Cultural Committee',
        startDate: '2024-10-28',
        endDate: '2024-10-30',
        status: 'completed',
        description: 'Three-day cultural extravaganza with dance, music, and drama',
        participants: 800,
        venue: 'Open Air Theater'
      },
      {
        id: 4,
        name: 'Placement Drive',
        university: 'Andhra University',
        department: 'Training & Placement',
        eventType: 'placement',
        studentBody: 'T&P Cell',
        startDate: '2024-11-15',
        endDate: '2024-11-16',
        status: 'upcoming',
        description: 'Campus recruitment drive by top companies',
        participants: 250,
        venue: 'Seminar Hall'
      },
      {
        id: 5,
        name: 'Workshop on AI/ML',
        university: 'JNTU Hyderabad',
        department: 'Computer Science',
        eventType: 'workshop',
        studentBody: 'Tech Club',
        startDate: '2024-11-07',
        endDate: '2024-11-07',
        status: 'ongoing',
        description: 'Hands-on workshop on Artificial Intelligence and Machine Learning',
        participants: 150,
        venue: 'CS Lab Block'
      },
      {
        id: 6,
        name: 'Blood Donation Camp',
        university: 'Osmania University',
        department: 'Student Affairs',
        eventType: 'social',
        studentBody: 'NSS',
        startDate: '2024-10-25',
        endDate: '2024-10-25',
        status: 'completed',
        description: 'Blood donation drive in collaboration with Red Cross',
        participants: 200,
        venue: 'Medical Center'
      },
      {
        id: 7,
        name: 'Entrepreneurship Summit',
        university: 'JNTU Kakinada',
        department: 'MBA',
        eventType: 'seminar',
        studentBody: 'E-Cell',
        startDate: '2024-11-20',
        endDate: '2024-11-21',
        status: 'upcoming',
        description: 'Summit featuring startup founders and investors',
        participants: 400,
        venue: 'Convention Center'
      },
      {
        id: 8,
        name: 'Chess Tournament',
        university: 'Andhra University',
        department: 'Sports',
        eventType: 'sports',
        studentBody: 'Sports Committee',
        startDate: '2024-11-08',
        endDate: '2024-11-10',
        status: 'ongoing',
        description: 'Inter-university chess championship',
        participants: 64,
        venue: 'Indoor Stadium'
      }
    ];

    setEvents(mockEvents);
  }, []);

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

  const getEventTypeColor = (type) => {
    const colors = {
      technical: { bg: '#DBEAFE', color: '#1E40AF', icon: '💻' },
      sports: { bg: '#FEF3C7', color: '#92400E', icon: '⚽' },
      cultural: { bg: '#FCE7F3', color: '#9F1239', icon: '🎭' },
      placement: { bg: '#D1FAE5', color: '#065F46', icon: '💼' },
      workshop: { bg: '#E0E7FF', color: '#3730A3', icon: '📚' },
      social: { bg: '#FED7AA', color: '#9A3412', icon: '🤝' },
      seminar: { bg: '#F3E8FF', color: '#6B21A8', icon: '🎤' }
    };
    return colors[type] || { bg: '#F3F4F6', color: '#374151', icon: '📅' };
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { bg: '#DBEAFE', color: '#1E40AF', text: 'Upcoming' },
      ongoing: { bg: '#D1FAE5', color: '#065F46', text: 'Ongoing' },
      completed: { bg: '#F3F4F6', color: '#6B7280', text: 'Completed' }
    };
    return badges[status] || badges.upcoming;
  };

  const filteredEvents = events.filter(event => {
    // Status filter (tab)
    if (event.status !== activeTab) return false;

    // Department filter
    if (filters.department !== 'all' && event.department !== filters.department) return false;

    // Student Body filter
    if (filters.studentBody !== 'all' && event.studentBody !== filters.studentBody) return false;

    // University filter
    if (filters.university !== 'all' && event.university !== filters.university) return false;

    // Event Type filter
    if (filters.eventType !== 'all' && event.eventType !== filters.eventType) return false;

    // Date range filter
    if (filters.dateFrom && event.startDate < filters.dateFrom) return false;
    if (filters.dateTo && event.endDate > filters.dateTo) return false;

    return true;
  });

  const stats = {
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
    total: events.length
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
      gap: '20px'
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
      alignItems: 'center',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#6B7280'
    },
    detailLabel: {
      fontWeight: '600',
      color: '#374151',
      width: '120px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #E5E7EB'
    }
  };

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
        <button
          onClick={() => navigate('/superadmin/dashboard')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#4F46E5';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
          }}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => navigate('/superadmin/approval-queue')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#4F46E5';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
          }}
        >
          ✓ Approval Queue
        </button>
        <button
          onClick={() => navigate('/superadmin/global-analytics')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#4F46E5';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
          }}
        >
          📈 Global Analytics
        </button>
        <button
          onClick={() => navigate('/superadmin/event-calendar')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid #4F46E5',
            fontSize: '14px',
            fontWeight: '600',
            color: '#4F46E5',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          📅 Event Calendar
        </button>
        <button
          onClick={() => navigate('/superadmin/user-management')}
          style={{
            padding: '16px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '3px solid transparent',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.color = '#4F46E5';
            e.target.style.borderBottomColor = '#4F46E5';
          }}
          onMouseOut={(e) => {
            e.target.style.color = '#6B7280';
            e.target.style.borderBottomColor = 'transparent';
          }}
        >
          👥 User Management
        </button>
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
          <button
            style={{...styles.tab, ...(activeTab === 'upcoming' && styles.activeTab)}}
            onClick={() => setActiveTab('upcoming')}
          >
            🔜 Upcoming ({stats.upcoming})
          </button>
          <button
            style={{...styles.tab, ...(activeTab === 'ongoing' && styles.activeTab)}}
            onClick={() => setActiveTab('ongoing')}
          >
            ▶️ Ongoing ({stats.ongoing})
          </button>
          <button
            style={{...styles.tab, ...(activeTab === 'completed' && styles.activeTab)}}
            onClick={() => setActiveTab('completed')}
          >
            ✅ Completed ({stats.completed})
          </button>
        </div>

        {/* Filters */}
        <div style={styles.filterSection}>
          <h3 style={{fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '16px'}}>
            🔍 Filters
          </h3>
          <div style={styles.filterGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>University</label>
              <select 
                style={styles.select}
                value={filters.university}
                onChange={(e) => handleFilterChange('university', e.target.value)}
              >
                <option value="all">All Universities</option>
                <option value="JNTU Hyderabad">JNTU Hyderabad</option>
                <option value="JNTU Kakinada">JNTU Kakinada</option>
                <option value="Osmania University">Osmania University</option>
                <option value="Andhra University">Andhra University</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Department</label>
              <select 
                style={styles.select}
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Sports">Sports</option>
                <option value="Student Affairs">Student Affairs</option>
                <option value="Training & Placement">Training & Placement</option>
                <option value="MBA">MBA</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Student Body</label>
              <select 
                style={styles.select}
                value={filters.studentBody}
                onChange={(e) => handleFilterChange('studentBody', e.target.value)}
              >
                <option value="all">All Student Bodies</option>
                <option value="Technical Club">Technical Club</option>
                <option value="Sports Committee">Sports Committee</option>
                <option value="Cultural Committee">Cultural Committee</option>
                <option value="T&P Cell">T&P Cell</option>
                <option value="NSS">NSS</option>
                <option value="E-Cell">E-Cell</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Event Type</label>
              <select 
                style={styles.select}
                value={filters.eventType}
                onChange={(e) => handleFilterChange('eventType', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="technical">💻 Technical</option>
                <option value="sports">⚽ Sports</option>
                <option value="cultural">🎭 Cultural</option>
                <option value="placement">💼 Placement</option>
                <option value="workshop">📚 Workshop</option>
                <option value="social">🤝 Social</option>
                <option value="seminar">🎤 Seminar</option>
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
            {filteredEvents.map(event => {
              const typeColors = getEventTypeColor(event.eventType);
              const statusBadge = getStatusBadge(event.status);
              
              return (
                <div key={event.id} style={styles.eventCard}>
                  <div style={styles.eventHeader}>
                    <div>
                      <h3 style={styles.eventTitle}>
                        {typeColors.icon} {event.name}
                      </h3>
                    </div>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: statusBadge.bg,
                      color: statusBadge.color
                    }}>
                      {statusBadge.text}
                    </span>
                  </div>

                  <p style={{color: '#6B7280', fontSize: '14px', lineHeight: '1.6', margin: '12px 0'}}>
                    {event.description}
                  </p>

                  <div style={styles.eventDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>🏫 University:</span>
                      <span>{event.university}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>🎓 Department:</span>
                      <span>{event.department}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>👥 Organized by:</span>
                      <span>{event.studentBody}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📅 Start Date:</span>
                      <span>{new Date(event.startDate).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📅 End Date:</span>
                      <span>{new Date(event.endDate).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>📍 Venue:</span>
                      <span>{event.venue}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>👤 Participants:</span>
                      <span style={{fontWeight: '600', color: '#4F46E5'}}>{event.participants}</span>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '16px',
                    padding: '8px 12px',
                    backgroundColor: typeColors.bg,
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: typeColors.color
                    }}>
                      {event.eventType.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>📅</div>
            <h3 style={{fontSize: '18px', color: '#6B7280', marginBottom: '8px'}}>
              No {activeTab} events found
            </h3>
            <p style={{color: '#9CA3AF', fontSize: '14px'}}>
              Try adjusting your filters or check other tabs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalEventCalendar;
