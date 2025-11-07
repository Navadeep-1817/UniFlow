import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiStar,
  FiTrendingUp,
  FiAlertCircle,
  FiMapPin,
  FiUsers
} from 'react-icons/fi';
import TrainerTopNav from './TrainerTopNav';

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('trainerToken');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    if (!token) {
      navigate('/trainer/login');
      return;
    }

    try {
      // Fetch statistics
      const statsRes = await fetch(`${API_BASE_URL}/trainers/statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }

      // Fetch profile
      const profileRes = await fetch(`${API_BASE_URL}/trainers/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.data);
      }

      // Fetch events
      const eventsRes = await fetch(`${API_BASE_URL}/trainers/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setUpcomingEvents(eventsData.data.upcoming.slice(0, 5));
        setOngoingEvents(eventsData.data.ongoing);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getEventStatusColor = (status) => {
    const colors = {
      Pending: '#F59E0B',
      Approved: '#10B981',
      Ongoing: '#3B82F6',
      Completed: '#6B7280',
      Cancelled: '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <TrainerTopNav />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <TrainerTopNav />

      <div style={styles.mainContent}>
        {/* Welcome Header */}
        <div style={styles.welcomeCard}>
          <div>
            <h1 style={styles.welcomeTitle}>Welcome back, {profile.name}!</h1>
            <p style={styles.welcomeSubtitle}>
              {profile.designation || 'Trainer'} • {profile.organization || 'External Trainer'}
            </p>
            {!stats.isVerified && (
              <div style={styles.verificationAlert}>
                <FiAlertCircle size={16} />
                <span>Your account is pending verification</span>
              </div>
            )}
          </div>
          <div style={styles.ratingBadge}>
            <FiStar size={24} color="#F59E0B" />
            <div style={styles.ratingText}>
              <div style={styles.ratingNumber}>{stats.averageRating?.toFixed(1) || '0.0'}</div>
              <div style={styles.ratingLabel}>{stats.totalRatings || 0} ratings</div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, borderLeft: '4px solid #4F46E5'}}>
            <div style={styles.statIcon}>
              <FiCalendar size={28} color="#4F46E5" />
            </div>
            <div>
              <div style={styles.statNumber}>{stats.totalEvents || 0}</div>
              <div style={styles.statLabel}>Total Events</div>
            </div>
          </div>

          <div style={{...styles.statCard, borderLeft: '4px solid #10B981'}}>
            <div style={styles.statIcon}>
              <FiCheckCircle size={28} color="#10B981" />
            </div>
            <div>
              <div style={styles.statNumber}>{stats.completedEvents || 0}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
          </div>

          <div style={{...styles.statCard, borderLeft: '4px solid #F59E0B'}}>
            <div style={styles.statIcon}>
              <FiClock size={28} color="#F59E0B" />
            </div>
            <div>
              <div style={styles.statNumber}>{stats.upcomingEvents || 0}</div>
              <div style={styles.statLabel}>Upcoming</div>
            </div>
          </div>

          <div style={{...styles.statCard, borderLeft: '4px solid #3B82F6'}}>
            <div style={styles.statIcon}>
              <FiTrendingUp size={28} color="#3B82F6" />
            </div>
            <div>
              <div style={styles.statNumber}>{stats.ongoingEvents || 0}</div>
              <div style={styles.statLabel}>Ongoing</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <button style={styles.actionBtn} onClick={() => navigate('/trainer/profile')}>
            <FiUsers size={20} />
            <span>View Profile</span>
          </button>
          <button style={styles.actionBtn} onClick={() => navigate('/trainer/events')}>
            <FiCalendar size={20} />
            <span>My Events</span>
          </button>
          <button style={styles.actionBtn} onClick={() => navigate('/trainer/schedule')}>
            <FiClock size={20} />
            <span>Schedule</span>
          </button>
        </div>

        {/* Ongoing Events */}
        {ongoingEvents.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <FiTrendingUp size={20} />
              Ongoing Events
            </h2>
            <div style={styles.eventsList}>
              {ongoingEvents.map((event) => (
                <div key={event._id} style={styles.eventCard}>
                  <div style={styles.eventHeader}>
                    <h3 style={styles.eventTitle}>{event.title}</h3>
                    <span style={{...styles.statusBadge, backgroundColor: getEventStatusColor(event.status)}}>
                      {event.status}
                    </span>
                  </div>
                  <div style={styles.eventDetails}>
                    <div style={styles.eventDetail}>
                      <FiCalendar size={14} />
                      <span>{formatDate(event.date.startDate)} - {formatDate(event.date.endDate)}</span>
                    </div>
                    <div style={styles.eventDetail}>
                      <FiMapPin size={14} />
                      <span>{event.venue?.name || 'TBD'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              <FiCalendar size={20} />
              Upcoming Events
            </h2>
            <button style={styles.viewAllLink} onClick={() => navigate('/trainer/events')}>
              View All
            </button>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div style={styles.eventsList}>
              {upcomingEvents.map((event) => (
                <div key={event._id} style={styles.eventCard}>
                  <div style={styles.eventHeader}>
                    <h3 style={styles.eventTitle}>{event.title}</h3>
                    <span style={{...styles.statusBadge, backgroundColor: getEventStatusColor(event.status)}}>
                      {event.status}
                    </span>
                  </div>
                  <div style={styles.eventDetails}>
                    <div style={styles.eventDetail}>
                      <FiCalendar size={14} />
                      <span>{formatDate(event.date.startDate)} - {formatDate(event.date.endDate)}</span>
                    </div>
                    <div style={styles.eventDetail}>
                      <FiMapPin size={14} />
                      <span>{event.venue?.name || 'TBD'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <FiCalendar size={48} color="#D1D5DB" />
              <p style={styles.emptyText}>No upcoming events</p>
              <p style={styles.emptySubtext}>Events assigned to you will appear here</p>
            </div>
          )}
        </div>
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
  mainContent: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #E5E7EB',
    borderTopColor: '#4F46E5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    margin: '0 0 8px 0'
  },
  welcomeSubtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: 0
  },
  verificationAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px',
    padding: '8px 12px',
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    borderRadius: '6px',
    fontSize: '14px'
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FEF3C7',
    borderRadius: '12px'
  },
  ratingText: {
    textAlign: 'center'
  },
  ratingNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#92400E'
  },
  ratingLabel: {
    fontSize: '12px',
    color: '#92400E'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  statIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1F2937'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6B7280',
    marginTop: '4px'
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 20px 0'
  },
  viewAllLink: {
    color: '#4F46E5',
    fontSize: '14px',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  eventsList: {
    display: 'grid',
    gap: '16px'
  },
  eventCard: {
    padding: '16px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px'
  },
  eventTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    margin: 0
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '600'
  },
  eventDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  eventDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6B7280'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 24px',
    textAlign: 'center'
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#6B7280',
    margin: '16px 0 8px 0'
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#9CA3AF',
    margin: 0
  }
};

export default TrainerDashboard;
