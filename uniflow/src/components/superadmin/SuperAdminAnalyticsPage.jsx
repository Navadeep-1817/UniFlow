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
  FiGlobe,
  FiActivity,
  FiDatabase,
  FiShield
} from 'react-icons/fi';

const SuperAdminAnalyticsPage = () => {
  const navigate = useNavigate();

  // Mock data for Super Admin
  const stats = {
    totalUniversities: 12,
    totalUsers: 15420,
    totalEvents: 342,
    systemUptime: 99.8,
    activeEvents: 45,
    pendingApprovals: 23
  };

  const universityData = [
    { name: 'JNTU Hyderabad', students: 4500, percentage: 29, color: '#4F46E5' },
    { name: 'JNTU Kakinada', students: 3800, percentage: 25, color: '#10B981' },
    { name: 'JNTU Anantapur', students: 3200, percentage: 21, color: '#F59E0B' },
    { name: 'OU', students: 2500, percentage: 16, color: '#8B5CF6' },
    { name: 'Others', students: 1420, percentage: 9, color: '#EF4444' }
  ];

  const monthlyGrowth = [
    { month: 'Jan', users: 12500 },
    { month: 'Feb', users: 13200 },
    { month: 'Mar', users: 13800 },
    { month: 'Apr', users: 14500 },
    { month: 'May', users: 15000 },
    { month: 'Jun', users: 15420 }
  ];

  const eventCategories = [
    { category: 'Academic', count: 145, percentage: 42, color: '#4F46E5' },
    { category: 'Non-Academic', count: 103, percentage: 30, color: '#10B981' },
    { category: 'Sports', count: 58, percentage: 17, color: '#F59E0B' },
    { category: 'Cultural', count: 36, percentage: 11, color: '#8B5CF6' }
  ];

  const performanceMetrics = [
    { label: 'System Performance', value: 98, color: '#4F46E5' },
    { label: 'User Engagement', value: 87, color: '#10B981' },
    { label: 'Event Success Rate', value: 94, color: '#F59E0B' },
    { label: 'User Satisfaction', value: 92, color: '#EF4444' }
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
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Super Admin Analytics Dashboard</h1>
            <p style={styles.subtitle}>System-wide analytics and performance metrics</p>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
            <button 
              style={styles.backButton}
              onClick={() => navigate('/superadmin/dashboard')}
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
              <h3 style={styles.statTitle}>Universities</h3>
              <div style={{...styles.statIcon, backgroundColor: '#EEF2FF'}}>
                <FiGlobe size={20} color="#4F46E5" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.totalUniversities}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Active institutions
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Total Users</h3>
              <div style={{...styles.statIcon, backgroundColor: '#D1FAE5'}}>
                <FiUsers size={20} color="#10B981" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.totalUsers.toLocaleString()}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> +920 this month
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Total Events</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
                <FiCalendar size={20} color="#F59E0B" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.totalEvents}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> {stats.activeEvents} active
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>System Uptime</h3>
              <div style={{...styles.statIcon, backgroundColor: '#DBEAFE'}}>
                <FiActivity size={20} color="#3B82F6" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.systemUptime}%</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Excellent performance
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Active Events</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FCE7F3'}}>
                <FiCheckCircle size={20} color="#EC4899" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.activeEvents}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Ongoing events
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Pending Approvals</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
                <FiShield size={20} color="#F59E0B" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.pendingApprovals}</h2>
            <p style={styles.statChange}>
              <FiClock size={14} /> Requires attention
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '32px'}}>
          
          {/* University Distribution */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiPieChart size={18} /> University-wise Student Distribution
            </h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '32px'}}>
              <div style={{position: 'relative', width: '180px', height: '180px'}}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#F3F4F6" strokeWidth="28" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#4F46E5" strokeWidth="28" 
                    strokeDasharray="127 440" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#10B981" strokeWidth="28" 
                    strokeDasharray="110 440" strokeDashoffset="-127" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#F59E0B" strokeWidth="28" 
                    strokeDasharray="92 440" strokeDashoffset="-237" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#8B5CF6" strokeWidth="28" 
                    strokeDasharray="70 440" strokeDashoffset="-329" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#EF4444" strokeWidth="28" 
                    strokeDasharray="40 440" strokeDashoffset="-399" transform="rotate(-90 90 90)" />
                  <text x="90" y="85" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1F2937">15.4K</text>
                  <text x="90" y="105" textAnchor="middle" fontSize="12" fill="#6B7280">Users</text>
                </svg>
              </div>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {universityData.map((item, i) => (
                  <div key={i}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '10px', height: '10px', borderRadius: '2px', backgroundColor: item.color}}></div>
                        <span style={{fontSize: '13px', color: '#374151', fontWeight: '500'}}>{item.name}</span>
                      </div>
                      <span style={{fontSize: '13px', fontWeight: '600', color: '#1F2937'}}>{item.students}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Growth Trend */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiBarChart2 size={18} /> Monthly User Growth
            </h3>
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '220px', gap: '12px', padding: '0 20px'}}>
              {monthlyGrowth.map((data, i) => {
                const maxValue = Math.max(...monthlyGrowth.map(d => d.users));
                const height = (data.users / maxValue) * 100;
                return (
                  <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                    <div style={{fontSize: '11px', fontWeight: '600', color: '#10B981'}}>{(data.users / 1000).toFixed(1)}K</div>
                    <div 
                      style={{
                        width: '100%', 
                        maxWidth: '50px',
                        height: `${height}%`, 
                        background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
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
          
          {/* Event Categories */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiCalendar size={18} /> Event Categories Distribution
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0'}}>
              {eventCategories.map((item, i) => (
                <div key={i}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <div style={{width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color}}></div>
                      <span style={{fontSize: '14px', color: '#374151', fontWeight: '500'}}>{item.category}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <span style={{fontSize: '14px', fontWeight: '600', color: '#1F2937'}}>{item.count}</span>
                      <span style={{fontSize: '12px', color: '#6B7280'}}>({item.percentage}%)</span>
                    </div>
                  </div>
                  <div style={{height: '10px', backgroundColor: '#F3F4F6', borderRadius: '5px', overflow: 'hidden'}}>
                    <div 
                      style={{
                        height: '100%', 
                        width: `${item.percentage}%`, 
                        backgroundColor: item.color,
                        transition: 'width 0.5s ease'
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
              <FiTarget size={18} /> System Performance Metrics
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

export default SuperAdminAnalyticsPage;
