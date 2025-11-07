import React, { useState, useEffect } from 'react';
import FacultyHeadTopNav from './FacultyHeadTopNav';
import { styles } from './TeamPerformanceReviewStyles';
import { FiTrendingUp, FiTrendingDown, FiAward, FiUsers, FiCalendar, FiStar, FiEye, FiDownload, FiTarget, FiCheckCircle, FiActivity, FiBarChart2 } from 'react-icons/fi';

const mockTeamsPerformance = [
  {
    id: 1, name: 'Tech Club', lead: 'Rahul Sharma', category: 'Technical',
    eventsCompleted: 8, totalParticipants: 1250, avgRating: 4.6, budgetEfficiency: 92,
    achievements: [
      { icon: '🏆', text: 'Best Technical Event Award 2024', color: '#F59E0B' },
      { icon: '⭐', text: 'Highest Participant Satisfaction', color: '#10B981' },
      { icon: '🎯', text: 'Budget Optimization Excellence', color: '#3B82F6' }
    ],
    feedback: [
      { text: 'Excellent organization and technical content quality', author: 'Dr. Kumar' },
      { text: 'Great engagement with students and industry experts', author: 'Prof. Sharma' }
    ],
    performanceScore: 94, trend: 'up', trendValue: '+12%'
  },
  {
    id: 2, name: 'Cultural Committee', lead: 'Priya Patel', category: 'Cultural',
    eventsCompleted: 12, totalParticipants: 2800, avgRating: 4.8, budgetEfficiency: 88,
    achievements: [
      { icon: '🎭', text: 'Most Attended Cultural Event', color: '#EC4899' },
      { icon: '🌟', text: 'Outstanding Creative Excellence', color: '#8B5CF6' },
      { icon: '👥', text: 'Maximum Student Engagement', color: '#10B981' }
    ],
    feedback: [
      { text: 'Spectacular cultural showcase with diverse performances', author: 'Dr. Patel' },
      { text: 'Impressive coordination and event management', author: 'Prof. Singh' }
    ],
    performanceScore: 96, trend: 'up', trendValue: '+8%'
  },
  {
    id: 3, name: 'Sports Council', lead: 'Amit Kumar', category: 'Sports',
    eventsCompleted: 6, totalParticipants: 980, avgRating: 4.4, budgetEfficiency: 85,
    achievements: [
      { icon: '⚽', text: 'Inter-College Sports Championship', color: '#3B82F6' },
      { icon: '🏅', text: 'Best Sports Infrastructure Utilization', color: '#F59E0B' }
    ],
    feedback: [
      { text: 'Well-organized sports events with great sportsmanship', author: 'Coach Reddy' },
      { text: 'Good participation and competitive spirit', author: 'Dr. Kumar' }
    ],
    performanceScore: 88, trend: 'up', trendValue: '+5%'
  },
  {
    id: 4, name: 'E-Cell', lead: 'Sneha Reddy', category: 'Entrepreneurship',
    eventsCompleted: 5, totalParticipants: 650, avgRating: 4.5, budgetEfficiency: 90,
    achievements: [
      { icon: '💡', text: 'Successful Startup Pitch Competition', color: '#10B981' },
      { icon: '🚀', text: 'Industry Collaboration Excellence', color: '#3B82F6' }
    ],
    feedback: [
      { text: 'Great initiative in promoting entrepreneurship', author: 'Dr. Mehta' },
      { text: 'Valuable industry connections established', author: 'Prof. Gupta' }
    ],
    performanceScore: 90, trend: 'up', trendValue: '+15%'
  }
];

const TeamPerformanceReview = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('This Month');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [hoveredAchievement, setHoveredAchievement] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setTimeout(() => { setTeams(mockTeamsPerformance); setIsLoading(false); }, 800);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleGenerateReport = (team) => {
    showNotification(`📊 Generating performance report for ${team.name}. Download will start shortly...`, 'success');
    console.log('Generating report for:', team);
  };

  const handleExportAllReports = () => {
    showNotification(`📦 Exporting reports for all ${teams.length} teams. Download will start shortly...`, 'success');
    console.log('Exporting all reports');
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      'Technical': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Cultural': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Sports': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Entrepreneurship': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    };
    return gradients[category] || gradients['Technical'];
  };

  const getPerformanceBadge = (score) => {
    if (score >= 90) return { label: 'Excellent', bg: '#D1FAE5', text: '#065F46' };
    if (score >= 80) return { label: 'Good', bg: '#DBEAFE', text: '#1E40AF' };
    if (score >= 70) return { label: 'Average', bg: '#FEF3C7', text: '#92400E' };
    return { label: 'Needs Improvement', bg: '#FEE2E2', text: '#991B1B' };
  };

  const overallMetrics = {
    totalEvents: teams.reduce((sum, t) => sum + t.eventsCompleted, 0),
    totalParticipants: teams.reduce((sum, t) => sum + t.totalParticipants, 0),
    avgRating: (teams.reduce((sum, t) => sum + t.avgRating, 0) / teams.length || 0).toFixed(1),
    avgEfficiency: Math.round(teams.reduce((sum, t) => sum + t.budgetEfficiency, 0) / teams.length || 0)
  };

  if (isLoading) {
    return (
      <>
        <FacultyHeadTopNav />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading performance data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <FacultyHeadTopNav />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Team Performance Review</h2>
            <p style={styles.subtitle}>Comprehensive performance analysis and insights</p>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.primaryButton} onClick={handleExportAllReports} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
              <FiDownload size={18} /> Export Report
            </button>
          </div>
        </div>

        {/* Overall Metrics */}
        <div style={styles.metricsGrid}>
          {[
            { icon: <FiCalendar size={28} />, label: 'Total Events', value: overallMetrics.totalEvents, change: '+18%', trend: 'up', color: '#4F46E5' },
            { icon: <FiUsers size={28} />, label: 'Total Participants', value: overallMetrics.totalParticipants.toLocaleString(), change: '+24%', trend: 'up', color: '#10B981' },
            { icon: <FiStar size={28} />, label: 'Average Rating', value: overallMetrics.avgRating + '/5', change: '+0.3', trend: 'up', color: '#F59E0B' },
            { icon: <FiTarget size={28} />, label: 'Budget Efficiency', value: overallMetrics.avgEfficiency + '%', change: '+5%', trend: 'up', color: '#8B5CF6' }
          ].map((metric, index) => (
            <div key={index} style={{ ...styles.metricCard, ...(hoveredMetric === index ? styles.metricCardHover : {}) }} onMouseEnter={() => setHoveredMetric(index)} onMouseLeave={() => setHoveredMetric(null)}>
              <div style={{ ...styles.metricIcon, backgroundColor: metric.color + '20', color: metric.color }}>{metric.icon}</div>
              <p style={styles.metricLabel}>{metric.label}</p>
              <p style={{ ...styles.metricValue, color: metric.color }}>{metric.value}</p>
              <p style={{ ...styles.metricChange, color: metric.trend === 'up' ? '#10B981' : '#DC2626' }}>
                {metric.trend === 'up' ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
                {metric.change} from last period
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.filtersContainer}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Period:</label>
            <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)} style={styles.select}>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabsHeader}>
            {['all', 'top-performers', 'needs-attention'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }} onMouseEnter={(e) => { if (activeTab !== tab) e.currentTarget.style.color = '#4F46E5'; }} onMouseLeave={(e) => { if (activeTab !== tab) e.currentTarget.style.color = '#6B7280'; }}>
                {tab === 'all' && 'All Teams'}
                {tab === 'top-performers' && 'Top Performers'}
                {tab === 'needs-attention' && 'Needs Attention'}
              </button>
            ))}
          </div>
        </div>

        {/* Teams Grid */}
        <div style={styles.teamsGrid}>
          {teams.filter(team => {
            if (activeTab === 'top-performers') return team.performanceScore >= 90;
            if (activeTab === 'needs-attention') return team.performanceScore < 80;
            return true;
          }).map((team) => {
            const badge = getPerformanceBadge(team.performanceScore);
            return (
              <div key={team.id} style={{ ...styles.teamCard, ...(hoveredCard === team.id ? styles.teamCardHover : {}) }} onMouseEnter={() => setHoveredCard(team.id)} onMouseLeave={() => setHoveredCard(null)}>
                <div style={{ ...styles.teamHeader, background: getCategoryGradient(team.category) }}>
                  <div style={{ ...styles.performanceBadge, backgroundColor: badge.bg, color: badge.text }}>
                    <FiAward size={14} /> {badge.label}
                  </div>
                  <h3 style={styles.teamName}>{team.name}</h3>
                  <p style={styles.teamLead}><FiUsers size={14} /> Led by {team.lead}</p>
                </div>

                <div style={styles.teamBody}>
                  {/* Performance Metrics */}
                  <div style={styles.performanceMetrics}>
                    <div style={styles.performanceItem}>
                      <p style={{ ...styles.performanceValue, color: '#4F46E5' }}>{team.eventsCompleted}</p>
                      <p style={styles.performanceLabel}>Events</p>
                    </div>
                    <div style={styles.performanceItem}>
                      <p style={{ ...styles.performanceValue, color: '#10B981' }}>{team.totalParticipants}</p>
                      <p style={styles.performanceLabel}>Participants</p>
                    </div>
                    <div style={styles.performanceItem}>
                      <p style={{ ...styles.performanceValue, color: '#F59E0B' }}>{team.avgRating}/5</p>
                      <p style={styles.performanceLabel}>Rating</p>
                    </div>
                    <div style={styles.performanceItem}>
                      <p style={{ ...styles.performanceValue, color: '#8B5CF6' }}>{team.budgetEfficiency}%</p>
                      <p style={styles.performanceLabel}>Efficiency</p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div style={styles.ratingSection}>
                    <p style={styles.ratingLabel}>Overall Performance</p>
                    <div style={styles.ratingStars}>
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} size={20} fill={i < Math.floor(team.avgRating) ? '#F59E0B' : 'none'} color="#F59E0B" />
                      ))}
                    </div>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressFill, width: `${team.performanceScore}%`, backgroundColor: team.performanceScore >= 90 ? '#10B981' : team.performanceScore >= 80 ? '#3B82F6' : '#F59E0B' }} />
                    </div>
                  </div>

                  {/* Achievements */}
                  <div style={styles.achievementsList}>
                    {team.achievements.map((achievement, index) => (
                      <div key={index} style={{ ...styles.achievementItem, ...(hoveredAchievement === `${team.id}-${index}` ? styles.achievementItemHover : {}) }} onMouseEnter={() => setHoveredAchievement(`${team.id}-${index}`)} onMouseLeave={() => setHoveredAchievement(null)}>
                        <div style={{ ...styles.achievementIcon, backgroundColor: achievement.color + '20', color: achievement.color }}>
                          {achievement.icon}
                        </div>
                        <p style={styles.achievementText}>{achievement.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Trend */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: team.trend === 'up' ? '#10B981' : '#DC2626', fontWeight: '600', fontSize: '14px' }}>
                      {team.trend === 'up' ? <FiTrendingUp size={20} /> : <FiTrendingDown size={20} />}
                      {team.trendValue}
                    </div>
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>vs last period</span>
                  </div>

                  {/* Actions */}
                  <div style={styles.actionButtons}>
                    <button style={{ ...styles.actionButton, ...styles.viewButton }} onClick={() => { setSelectedTeam(team); setShowDetailsModal(true); }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <FiEye size={16} /> View Details
                    </button>
                    <button style={{ ...styles.actionButton, ...styles.reportButton }} onClick={() => handleGenerateReport(team)} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                      <FiBarChart2 size={16} /> Report
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedTeam && (
          <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>{selectedTeam.name} - Performance Report</h3>
                  <p style={styles.modalSubtitle}>Led by {selectedTeam.lead} • {selectedTeam.category}</p>
                </div>
                <button style={styles.closeButton} onClick={() => setShowDetailsModal(false)} onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.transform = 'rotate(90deg)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.transform = 'rotate(0deg)'; }}>×</button>
              </div>

              {/* Performance Metrics Grid */}
              <div style={styles.detailsGrid}>
                <div style={styles.detailCard}>
                  <p style={styles.detailLabel}>Performance Score</p>
                  <p style={{ ...styles.detailValue, color: '#4F46E5' }}>{selectedTeam.performanceScore}%</p>
                </div>
                <div style={styles.detailCard}>
                  <p style={styles.detailLabel}>Events Completed</p>
                  <p style={{ ...styles.detailValue, color: '#10B981' }}>{selectedTeam.eventsCompleted}</p>
                </div>
                <div style={styles.detailCard}>
                  <p style={styles.detailLabel}>Total Participants</p>
                  <p style={{ ...styles.detailValue, color: '#F59E0B' }}>{selectedTeam.totalParticipants.toLocaleString()}</p>
                </div>
                <div style={styles.detailCard}>
                  <p style={styles.detailLabel}>Budget Efficiency</p>
                  <p style={{ ...styles.detailValue, color: '#8B5CF6' }}>{selectedTeam.budgetEfficiency}%</p>
                </div>
              </div>

              {/* Achievements Section */}
              <div style={styles.section}>
                <h4 style={styles.sectionTitle}>Key Achievements</h4>
                {selectedTeam.achievements.map((achievement, index) => (
                  <div key={index} style={styles.achievementItem}>
                    <div style={{ ...styles.achievementIcon, backgroundColor: achievement.color + '20', color: achievement.color }}>
                      {achievement.icon}
                    </div>
                    <p style={styles.achievementText}>{achievement.text}</p>
                  </div>
                ))}
              </div>

              {/* Feedback Section */}
              <div style={styles.feedbackSection}>
                <h4 style={styles.feedbackTitle}>Faculty Feedback</h4>
                {selectedTeam.feedback.map((item, index) => (
                  <div key={index} style={styles.feedbackItem}>
                    <p style={styles.feedbackText}>"{item.text}"</p>
                    <p style={styles.feedbackAuthor}>— {item.author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notification Toast */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: notification.type === 'success' ? '#10B981' : '#DC2626',
            color: '#FFFFFF',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '500px',
            animation: 'slideInRight 0.3s ease-out'
          }}>
            <div style={{ fontSize: '20px' }}>
              {notification.type === 'success' ? '✓' : '✕'}
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>
              {notification.message}
            </div>
            <button
              onClick={() => setNotification(null)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1); } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </>
  );
};

export default TeamPerformanceReview;
