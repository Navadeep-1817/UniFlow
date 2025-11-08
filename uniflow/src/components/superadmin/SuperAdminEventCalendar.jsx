import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuperAdminEventCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    eventType: '',
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    academic: 0,
    nonAcademic: 0,
    sports: 0,
    placement: 0
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filters]);

  const fetchEvents = async () => {
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
        setEvents(data.data || []);
        calculateStats(data.data || []);
      } else {
        console.error('Failed to fetch events:', response.status);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (eventData) => {
    const stats = {
      total: eventData.length,
      academic: eventData.filter(e => e.eventType === 'Academic').length,
      nonAcademic: eventData.filter(e => e.eventType === 'Non-Academic').length,
      sports: eventData.filter(e => e.eventType === 'Sports').length,
      placement: eventData.filter(e => e.eventType === 'Placement').length
    };
    setStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Filter by event type
    if (filters.eventType) {
      filtered = filtered.filter(e => e.eventType === filters.eventType);
    }

    // Filter by month and year
    filtered = filtered.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getMonth() === filters.month && eventDate.getFullYear() === filters.year;
    });

    setFilteredEvents(filtered);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (day) => {
    const dateStr = `${filters.year}-${String(filters.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter(e => {
      const eventDateStr = new Date(e.date).toISOString().split('T')[0];
      return eventDateStr === dateStr;
    });
  };

  const handleMonthChange = (direction) => {
    setFilters(prev => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;
      
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      } else if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
      
      return { ...prev, month: newMonth, year: newYear };
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(filters.month, filters.year);
    const firstDay = getFirstDayOfMonth(filters.month, filters.year);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={styles.emptyCell}></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = day === new Date().getDate() && 
                      filters.month === new Date().getMonth() && 
                      filters.year === new Date().getFullYear();
      
      days.push(
        <div
          key={day}
          style={{
            ...styles.dayCell,
            ...(isToday && styles.todayCell),
            ...(dayEvents.length > 0 && styles.hasEvents)
          }}
          onClick={() => setSelectedDate(day)}
        >
          <div style={styles.dayNumber}>{day}</div>
          {dayEvents.length > 0 && (
            <div style={styles.eventDots}>
              {dayEvents.slice(0, 3).map((event, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.eventDot,
                    backgroundColor: getEventTypeColor(event.eventType)
                  }}
                  title={event.name}
                />
              ))}
              {dayEvents.length > 3 && (
                <span style={styles.moreEvents}>+{dayEvents.length - 3}</span>
              )}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'Academic': '#4F46E5',
      'Non-Academic': '#10B981',
      'Sports': '#F59E0B',
      'Placement': '#EC4899',
      'Training': '#8B5CF6'
    };
    return colors[type] || '#6B7280';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
    backBtn: {
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
      padding: '40px',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    statNumber: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#4F46E5',
      margin: '8px 0'
    },
    statLabel: {
      fontSize: '13px',
      color: '#6B7280',
      margin: 0
    },
    controls: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '30px',
      border: '1px solid #E5E7EB',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    },
    monthNav: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    navBtn: {
      padding: '8px 16px',
      backgroundColor: '#F3F4F6',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      transition: 'all 0.3s'
    },
    monthTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      minWidth: '180px',
      textAlign: 'center'
    },
    filterGroup: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    select: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: '1px solid #D1D5DB',
      fontSize: '14px',
      color: '#374151',
      cursor: 'pointer'
    },
    calendarContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '10px'
    },
    dayHeader: {
      textAlign: 'center',
      padding: '12px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#6B7280',
      textTransform: 'uppercase'
    },
    dayCell: {
      minHeight: '100px',
      padding: '8px',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      backgroundColor: 'white'
    },
    emptyCell: {
      minHeight: '100px',
      padding: '8px'
    },
    todayCell: {
      backgroundColor: '#EEF2FF',
      borderColor: '#4F46E5'
    },
    hasEvents: {
      backgroundColor: '#F9FAFB'
    },
    dayNumber: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '4px'
    },
    eventDots: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      marginTop: '4px'
    },
    eventDot: {
      width: '100%',
      height: '4px',
      borderRadius: '2px'
    },
    moreEvents: {
      fontSize: '11px',
      color: '#6B7280',
      marginTop: '2px'
    },
    eventsList: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      marginTop: '30px',
      border: '1px solid #E5E7EB'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '20px'
    },
    eventItem: {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      transition: 'all 0.3s'
    },
    eventInfo: {
      flex: 1
    },
    eventName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '4px'
    },
    eventMeta: {
      fontSize: '13px',
      color: '#6B7280',
      marginTop: '4px'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    legend: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      marginTop: '20px',
      padding: '16px',
      backgroundColor: '#F9FAFB',
      borderRadius: '8px'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: '#374151'
    },
    legendColor: {
      width: '16px',
      height: '16px',
      borderRadius: '4px'
    }
  };

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>UniFlow</div>
          <h1 style={styles.title}>Event Calendar - All Events</h1>
        </div>
        <button
          style={styles.backBtn}
          onClick={() => navigate('/superadmin/dashboard')}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#4F46E5';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.color = '#4F46E5';
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div style={styles.content}>
        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Events</p>
            <h2 style={styles.statNumber}>{stats.total}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Academic Events</p>
            <h2 style={styles.statNumber}>{stats.academic}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Non-Academic</p>
            <h2 style={styles.statNumber}>{stats.nonAcademic}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Sports Events</p>
            <h2 style={styles.statNumber}>{stats.sports}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Placement Events</p>
            <h2 style={styles.statNumber}>{stats.placement}</h2>
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <div style={styles.monthNav}>
            <button
              style={styles.navBtn}
              onClick={() => handleMonthChange(-1)}
              onMouseOver={(e) => e.target.style.backgroundColor = '#E5E7EB'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#F3F4F6'}
            >
              ← Previous
            </button>
            <div style={styles.monthTitle}>
              {monthNames[filters.month]} {filters.year}
            </div>
            <button
              style={styles.navBtn}
              onClick={() => handleMonthChange(1)}
              onMouseOver={(e) => e.target.style.backgroundColor = '#E5E7EB'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#F3F4F6'}
            >
              Next →
            </button>
          </div>

          <div style={styles.filterGroup}>
            <label style={{ fontSize: '14px', color: '#6B7280' }}>Filter:</label>
            <select
              style={styles.select}
              value={filters.eventType}
              onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value }))}
            >
              <option value="">All Event Types</option>
              <option value="Academic">Academic</option>
              <option value="Non-Academic">Non-Academic</option>
              <option value="Sports">Sports</option>
              <option value="Placement">Placement</option>
              <option value="Training">Training</option>
            </select>
          </div>
        </div>

        {/* Calendar */}
        <div style={styles.calendarContainer}>
          <div style={styles.calendarGrid}>
            {dayHeaders.map(day => (
              <div key={day} style={styles.dayHeader}>{day}</div>
            ))}
            {renderCalendar()}
          </div>

          {/* Legend */}
          <div style={styles.legend}>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendColor, backgroundColor: '#4F46E5' }} />
              <span>Academic</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendColor, backgroundColor: '#10B981' }} />
              <span>Non-Academic</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendColor, backgroundColor: '#F59E0B' }} />
              <span>Sports</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendColor, backgroundColor: '#EC4899' }} />
              <span>Placement</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendColor, backgroundColor: '#8B5CF6' }} />
              <span>Training</span>
            </div>
          </div>
        </div>

        {/* Events List for selected date */}
        {selectedDate && (
          <div style={styles.eventsList}>
            <h3 style={styles.sectionTitle}>
              Events on {monthNames[filters.month]} {selectedDate}, {filters.year}
            </h3>
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map((event, idx) => (
                <div key={idx} style={styles.eventItem}>
                  <div style={styles.eventInfo}>
                    <div style={styles.eventName}>{event.name}</div>
                    <div style={styles.eventMeta}>
                      📍 {event.venue} | 👥 Capacity: {event.capacity}
                    </div>
                    <div style={styles.eventMeta}>
                      🏛️ {event.university?.name || 'N/A'} | 
                      {event.department?.name && ` 📚 ${event.department.name}`}
                      {event.studentBody?.name && ` 🎯 ${event.studentBody.name}`}
                    </div>
                    <div style={styles.eventMeta}>
                      Created by: {event.createdBy?.name} ({event.createdBy?.role})
                    </div>
                  </div>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: getEventTypeColor(event.eventType) + '20',
                      color: getEventTypeColor(event.eventType)
                    }}
                  >
                    {event.eventType}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: '40px' }}>
                No events scheduled for this date
              </p>
            )}
          </div>
        )}

        {/* All Events List */}
        <div style={styles.eventsList}>
          <h3 style={styles.sectionTitle}>
            All Events in {monthNames[filters.month]} {filters.year}
          </h3>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, idx) => (
              <div key={idx} style={styles.eventItem}>
                <div style={styles.eventInfo}>
                  <div style={styles.eventName}>{event.name}</div>
                  <div style={styles.eventMeta}>
                    📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.venue} | 👥 {event.capacity}
                  </div>
                  <div style={styles.eventMeta}>
                    🏛️ {event.university?.name || 'N/A'} |
                    {event.department?.name && ` 📚 ${event.department.name}`}
                    {event.studentBody?.name && ` 🎯 ${event.studentBody.name}`}
                  </div>
                  <div style={styles.eventMeta}>
                    Created by: {event.createdBy?.name} ({event.createdBy?.role})
                  </div>
                </div>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: getEventTypeColor(event.eventType) + '20',
                    color: getEventTypeColor(event.eventType)
                  }}
                >
                  {event.eventType}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '40px' }}>
              No events found for the selected filters
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminEventCalendar;
