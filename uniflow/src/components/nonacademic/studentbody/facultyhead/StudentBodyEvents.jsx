import React, { useState, useEffect } from 'react';
import FacultyHeadTopNav from './FacultyHeadTopNav';
import { styles } from './StudentBodyEventsStyles';
import { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiClock, FiEye, FiEdit, FiSearch, FiFilter, FiPlus, FiTrendingUp, FiCheckCircle, FiXCircle, FiActivity } from 'react-icons/fi';

const StudentBodyEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // TODO: Fetch events from API
        // const data = await fetchStudentBodyEvents();
        // setEvents(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return { bg: '#D1FAE5', text: '#065F46' };
      case 'Ongoing': return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'Upcoming': return { bg: '#FEF3C7', text: '#92400E' };
      case 'Cancelled': return { bg: '#FEE2E2', text: '#991B1B' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const getCategoryGradient = (category) => {
    switch(category) {
      case 'Technical': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'Cultural': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'Sports': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'Workshop': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      case 'Social Service': return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Technical': return '💻';
      case 'Cultural': return '🎭';
      case 'Sports': return '⚽';
      case 'Workshop': return '📚';
      case 'Social Service': return '🤝';
      default: return '📅';
    }
  };

  const filteredEvents = events.filter(event => {
    const statusMatch = activeTab === 'all' || event.status.toLowerCase() === activeTab;
    const categoryMatch = filterCategory === 'All' || event.category === filterCategory;
    const searchMatch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && categoryMatch && searchMatch;
  });

  const stats = {
    total: events.length,
    ongoing: events.filter(e => e.status === 'Ongoing').length,
    upcoming: events.filter(e => e.status === 'Upcoming').length,
    completed: events.filter(e => e.status === 'Completed').length,
    totalBudget: events.reduce((sum, e) => sum + e.budget, 0),
    totalSpent: events.reduce((sum, e) => sum + e.spent, 0),
    totalParticipants: events.reduce((sum, e) => sum + e.participants, 0)
  };

  if (isLoading) {
    return (
      <>
        <FacultyHeadTopNav />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading events...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <FacultyHeadTopNav />
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Student Body Events</h2>
            <p style={styles.subtitle}>{filteredEvents.length} events under supervision</p>
          </div>
          <button
            style={styles.addButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <FiPlus size={18} />
            Create New Event
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          {[
            { icon: '📊', label: 'Total Events', value: stats.total, color: '#4F46E5' },
            { icon: '🔄', label: 'Ongoing', value: stats.ongoing, color: '#3B82F6' },
            { icon: '📅', label: 'Upcoming', value: stats.upcoming, color: '#F59E0B' },
            { icon: '✅', label: 'Completed', value: stats.completed, color: '#10B981' },
            { icon: '💰', label: 'Total Budget', value: `₹${(stats.totalBudget / 1000).toFixed(0)}K`, color: '#8B5CF6' },
            { icon: '👥', label: 'Total Participants', value: stats.totalParticipants, color: '#EC4899' }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                ...styles.statCard,
                ...(hoveredStat === index ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={styles.statIcon}>{stat.icon}</div>
              <p style={styles.statLabel}>{stat.label}</p>
              <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.filtersContainer}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <FiSearch size={16} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search events or organizers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterGroup}>
            <FiFilter size={16} style={{ color: '#6B7280' }} />
            <label style={styles.filterLabel}>Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={styles.select}
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Workshop">Workshop</option>
              <option value="Social Service">Social Service</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabsHeader}>
            {[
              { key: 'all', label: 'All Events' },
              { key: 'ongoing', label: 'Ongoing' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'completed', label: 'Completed' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.key ? styles.tabActive : {})
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.color = '#4F46E5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.color = '#6B7280';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>No Events Found</h3>
            <p style={styles.emptyText}>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div style={styles.eventsGrid}>
            {filteredEvents.map((event) => {
              const statusColors = getStatusColor(event.status);
              const progress = event.expectedParticipants > 0 
                ? (event.participants / event.expectedParticipants) * 100 
                : 0;
              const budgetProgress = event.budget > 0 
                ? (event.spent / event.budget) * 100 
                : 0;

              return (
                <div
                  key={event.id}
                  style={{
                    ...styles.eventCard,
                    ...(hoveredCard === event.id ? styles.eventCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard(event.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Event Header */}
                  <div style={{
                    ...styles.eventHeader,
                    background: getCategoryGradient(event.category)
                  }}>
                    <div style={{
                      ...styles.statusBadge,
                      backgroundColor: statusColors.bg,
                      color: statusColors.text
                    }}>
                      {event.status.toUpperCase()}
                    </div>
                    <h3 style={styles.eventTitle}>{event.name}</h3>
                    <p style={styles.eventCategory}>
                      {getCategoryIcon(event.category)} {event.category} • {event.type}
                    </p>
                  </div>

                  {/* Event Body */}
                  <div style={styles.eventBody}>
                    <div style={styles.infoGrid}>
                      <div style={styles.infoItem}>
                        <FiCalendar size={16} style={{ ...styles.infoIcon, color: '#6B7280' }} />
                        <div style={styles.infoContent}>
                          <p style={styles.infoLabel}>Date</p>
                          <p style={styles.infoValue}>{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div style={styles.infoItem}>
                        <FiClock size={16} style={{ ...styles.infoIcon, color: '#6B7280' }} />
                        <div style={styles.infoContent}>
                          <p style={styles.infoLabel}>Time</p>
                          <p style={styles.infoValue}>{event.time}</p>
                        </div>
                      </div>
                      <div style={styles.infoItem}>
                        <FiMapPin size={16} style={{ ...styles.infoIcon, color: '#6B7280' }} />
                        <div style={styles.infoContent}>
                          <p style={styles.infoLabel}>Venue</p>
                          <p style={styles.infoValue}>{event.venue}</p>
                        </div>
                      </div>
                      <div style={styles.infoItem}>
                        <FiUsers size={16} style={{ ...styles.infoIcon, color: '#6B7280' }} />
                        <div style={styles.infoContent}>
                          <p style={styles.infoLabel}>Organizer</p>
                          <p style={styles.infoValue}>{event.organizer}</p>
                        </div>
                      </div>
                    </div>

                    {/* Participants Progress */}
                    <div style={styles.progressSection}>
                      <div style={styles.progressLabel}>
                        <span>Participants: {event.participants}/{event.expectedParticipants}</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div style={styles.progressBar}>
                        <div style={{
                          ...styles.progressFill,
                          width: `${progress}%`,
                          backgroundColor: progress >= 90 ? '#10B981' : progress >= 70 ? '#3B82F6' : '#F59E0B'
                        }} />
                      </div>
                    </div>

                    {/* Budget Progress */}
                    <div style={styles.progressSection}>
                      <div style={styles.progressLabel}>
                        <span>Budget: ₹{event.spent.toLocaleString()}/₹{event.budget.toLocaleString()}</span>
                        <span>{budgetProgress.toFixed(0)}%</span>
                      </div>
                      <div style={styles.progressBar}>
                        <div style={{
                          ...styles.progressFill,
                          width: `${budgetProgress}%`,
                          backgroundColor: budgetProgress >= 90 ? '#DC2626' : budgetProgress >= 70 ? '#F59E0B' : '#10B981'
                        }} />
                      </div>
                    </div>

                    {/* Tags */}
                    <div style={styles.tagsContainer}>
                      <div style={styles.tag}>
                        <FiUsers size={12} />
                        {event.teamName}
                      </div>
                      <div style={styles.tag}>
                        <FiDollarSign size={12} />
                        ₹{(event.budget / 1000).toFixed(0)}K
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={styles.eventActions}>
                      <button
                        style={{ ...styles.actionButton, ...styles.viewButton }}
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowDetailsModal(true);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#4338CA';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#4F46E5';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <FiEye size={16} />
                        View Details
                      </button>
                      <button
                        style={{ ...styles.actionButton, ...styles.editButton }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#E5E7EB';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F3F4F6';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <FiEdit size={16} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedEvent && (
          <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>{selectedEvent.name}</h3>
                  <p style={styles.modalSubtitle}>
                    {getCategoryIcon(selectedEvent.category)} {selectedEvent.category} • Organized by {selectedEvent.organizer}
                  </p>
                </div>
                <button
                  style={styles.closeButton}
                  onClick={() => setShowDetailsModal(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#111827';
                    e.currentTarget.style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6B7280';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  ×
                </button>
              </div>

              <div style={styles.modalContent}>
                {/* Event Details Grid */}
                <div style={styles.detailsGrid}>
                  <div style={styles.detailCard}>
                    <p style={styles.detailLabel}>Date & Time</p>
                    <p style={styles.detailValue}>{new Date(selectedEvent.date).toLocaleDateString()}</p>
                    <p style={styles.detailValue}>{selectedEvent.time}</p>
                  </div>
                  <div style={styles.detailCard}>
                    <p style={styles.detailLabel}>Venue</p>
                    <p style={styles.detailValue}>{selectedEvent.venue}</p>
                  </div>
                  <div style={styles.detailCard}>
                    <p style={styles.detailLabel}>Budget</p>
                    <p style={styles.detailValue}>₹{selectedEvent.budget.toLocaleString()}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280' }}>Spent: ₹{selectedEvent.spent.toLocaleString()}</p>
                  </div>
                  <div style={styles.detailCard}>
                    <p style={styles.detailLabel}>Participants</p>
                    <p style={styles.detailValue}>{selectedEvent.participants}/{selectedEvent.expectedParticipants}</p>
                  </div>
                </div>

                {/* Description */}
                <div style={styles.section}>
                  <h4 style={styles.sectionTitle}>Description</h4>
                  <p style={styles.sectionText}>{selectedEvent.description}</p>
                </div>

                {/* Objectives */}
                <div style={styles.section}>
                  <h4 style={styles.sectionTitle}>Objectives</h4>
                  <p style={styles.sectionText}>{selectedEvent.objectives}</p>
                </div>

                {/* Schedule */}
                <div style={styles.section}>
                  <h4 style={styles.sectionTitle}>Event Schedule</h4>
                  <div style={styles.timeline}>
                    {selectedEvent.schedule.map((item, index) => (
                      <div key={index} style={styles.timelineItem}>
                        <div style={styles.timelineDot}></div>
                        {index < selectedEvent.schedule.length - 1 && <div style={styles.timelineLine}></div>}
                        <p style={styles.timelineContent}><strong>{item.time}</strong> - {item.activity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Members */}
                <div style={styles.section}>
                  <h4 style={styles.sectionTitle}>Team Members</h4>
                  <div style={styles.participantsList}>
                    {selectedEvent.teamMembers.map((member, index) => (
                      <div key={index} style={styles.participantItem}>
                        <div style={styles.participantInfo}>
                          <div style={styles.participantAvatar}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p style={styles.participantName}>{member.name}</p>
                            <p style={styles.participantRole}>{member.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default StudentBodyEvents;
