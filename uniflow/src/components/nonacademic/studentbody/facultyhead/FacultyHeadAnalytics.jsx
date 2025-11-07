import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiCalendar, 
  FiCheckCircle, 
  FiAward,
  FiTarget,
  FiUsers,
  FiClock,
  FiDownload,
  FiArrowLeft,
  FiPieChart,
  FiDollarSign,
  FiActivity
} from 'react-icons/fi';

const FacultyHeadAnalytics = () => {
  const navigate = useNavigate();

  // Mock data for Faculty Head
  const stats = {
    totalTeams: 8,
    totalMembers: 124,
    eventsOrganized: 35,
    budgetUtilized: 85,
    attendanceRate: 91,
    pendingApprovals: 5
  };

  const teamPerformance = [
    { team: 'Tech Club', events: 10, percentage: 29, color: '#4F46E5' },
    { team: 'Cultural Committee', events: 9, percentage: 26, color: '#10B981' },
    { team: 'Sports Committee', events: 8, percentage: 23, color: '#F59E0B' },
    { team: 'Others', events: 8, percentage: 22, color: '#8B5CF6' }
  ];

  const monthlyEvents = [
    { month: 'Jan', events: 4 },
    { month: 'Feb', events: 7 },
    { month: 'Mar', events: 5 },
    { month: 'Apr', events: 8 },
    { month: 'May', events: 6 },
    { month: 'Jun', events: 9 }
  ];

  const budgetAllocation = [
    { category: 'Technical Events', amount: 35, color: '#4F46E5' },
    { category: 'Cultural Events', amount: 30, color: '#10B981' },
    { category: 'Sports Events', amount: 20, color: '#F59E0B' },
    { category: 'Others', amount: 15, color: '#8B5CF6' }
  ];

  const performanceMetrics = [
    { label: 'Event Success Rate', value: 94, color: '#4F46E5' },
    { label: 'Team Coordination', value: 88, color: '#10B981' },
    { label: 'Budget Management', value: 92, color: '#F59E0B' },
    { label: 'Student Engagement', value: 89, color: '#EF4444' }
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
      padding: '20px 40px'
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: 'transparent',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      transition: 'all 0.3s'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1F2937',
      margin: 0
    },
    subtitle: {
      fontSize: '14px',
      color: '#6B7280',
      margin: '4px 0 0 0'
    },
    content: {
      padding: '32px 40px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #E5E7EB'
    },
    statHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    statTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#6B7280',
      margin: 0
    },
    statIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1F2937',
      margin: '0 0 8px 0'
    },
    statChange: {
      fontSize: '13px',
      color: '#10B981',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    chartCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #E5E7EB'
    },
    chartTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Faculty Head Analytics Dashboard</h1>
            <p style={styles.subtitle}>Student body activities and performance metrics</p>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
            <button 
              style={styles.backButton}
              onClick={() => navigate('/student-body/faculty-head/dashboard')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <FiArrowLeft size={16} /> Back to Dashboard
            </button>
            <button 
              style={{...styles.backButton, backgroundColor: '#4F46E5', color: 'white', border: 'none'}}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338CA'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}>
              <FiDownload size={16} /> Export Report
            </button>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Summary Stats */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px'}}>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Total Teams</h3>
              <div style={{...styles.statIcon, backgroundColor: '#EEF2FF'}}>
                <FiUsers size={20} color="#4F46E5" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.totalTeams}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Active committees
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Total Members</h3>
              <div style={{...styles.statIcon, backgroundColor: '#D1FAE5'}}>
                <FiUsers size={20} color="#10B981" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.totalMembers}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Team members
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Events Organized</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
                <FiCalendar size={20} color="#F59E0B" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.eventsOrganized}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> This semester
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Budget Utilized</h3>
              <div style={{...styles.statIcon, backgroundColor: '#DBEAFE'}}>
                <FiDollarSign size={20} color="#3B82F6" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.budgetUtilized}%</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Of total budget
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Attendance Rate</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FCE7F3'}}>
                <FiCheckCircle size={20} color="#EC4899" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.attendanceRate}%</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Average attendance
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Pending Approvals</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
                <FiClock size={20} color="#F59E0B" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.pendingApprovals}</h2>
            <p style={styles.statChange}>
              <FiActivity size={14} /> Requires action
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '32px'}}>
          
          {/* Team Performance Distribution */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiPieChart size={18} /> Team-wise Event Distribution
            </h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '32px'}}>
              <div style={{position: 'relative', width: '180px', height: '180px'}}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#F3F4F6" strokeWidth="28" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#4F46E5" strokeWidth="28" 
                    strokeDasharray="128 440" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#10B981" strokeWidth="28" 
                    strokeDasharray="114 440" strokeDashoffset="-128" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#F59E0B" strokeWidth="28" 
                    strokeDasharray="101 440" strokeDashoffset="-242" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#8B5CF6" strokeWidth="28" 
                    strokeDasharray="97 440" strokeDashoffset="-343" transform="rotate(-90 90 90)" />
                  <text x="90" y="85" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1F2937">{stats.eventsOrganized}</text>
                  <text x="90" y="105" textAnchor="middle" fontSize="12" fill="#6B7280">Events</text>
                </svg>
              </div>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {teamPerformance.map((item, i) => (
                  <div key={i}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color}}></div>
                        <span style={{fontSize: '14px', color: '#374151', fontWeight: '500'}}>{item.team}</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '14px', fontWeight: '600', color: '#1F2937'}}>{item.events}</span>
                        <span style={{fontSize: '12px', color: '#6B7280'}}>({item.percentage}%)</span>
                      </div>
                    </div>
                    <div style={{height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden'}}>
                      <div style={{height: '100%', width: `${item.percentage}%`, backgroundColor: item.color}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Events Trend */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiBarChart2 size={18} /> Monthly Events Organized
            </h3>
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '220px', gap: '12px', padding: '0 20px'}}>
              {monthlyEvents.map((data, i) => {
                const maxValue = Math.max(...monthlyEvents.map(d => d.events));
                const height = (data.events / maxValue) * 100;
                return (
                  <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                    <div style={{fontSize: '13px', fontWeight: '600', color: '#4F46E5'}}>{data.events}</div>
                    <div 
                      style={{
                        width: '100%', 
                        maxWidth: '50px',
                        height: `${height}%`, 
                        background: 'linear-gradient(180deg, #4F46E5 0%, #4338CA 100%)',
                        borderRadius: '6px 6px 0 0', 
                        transition: 'all 0.3s',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scaleY(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scaleY(1)'}
                    ></div>
                    <div style={{fontSize: '12px', color: '#6B7280', fontWeight: '500'}}>{data.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Second Row Charts */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px'}}>
          
          {/* Budget Allocation */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiDollarSign size={18} /> Budget Allocation by Category
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0'}}>
              {budgetAllocation.map((item, i) => (
                <div key={i}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <span style={{fontSize: '14px', color: '#374151', fontWeight: '500'}}>{item.category}</span>
                    <span style={{fontSize: '16px', fontWeight: '700', color: item.color}}>{item.amount}%</span>
                  </div>
                  <div style={{height: '12px', backgroundColor: '#E5E7EB', borderRadius: '6px', overflow: 'hidden'}}>
                    <div 
                      style={{
                        height: '100%', 
                        width: `${item.amount}%`, 
                        backgroundColor: item.color, 
                        transition: 'width 0.5s ease',
                        borderRadius: '6px'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiTarget size={18} /> Performance Metrics
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0'}}>
              {performanceMetrics.map((metric, i) => (
                <div key={i}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <span style={{fontSize: '14px', color: '#374151', fontWeight: '500'}}>{metric.label}</span>
                    <span style={{fontSize: '16px', fontWeight: '700', color: metric.color}}>{metric.value}%</span>
                  </div>
                  <div style={{height: '12px', backgroundColor: '#E5E7EB', borderRadius: '6px', overflow: 'hidden'}}>
                    <div 
                      style={{
                        height: '100%', 
                        width: `${metric.value}%`, 
                        backgroundColor: metric.color, 
                        transition: 'width 0.5s ease',
                        borderRadius: '6px'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyHeadAnalytics;
