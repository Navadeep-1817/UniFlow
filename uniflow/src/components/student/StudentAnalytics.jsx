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
  FiPieChart
} from 'react-icons/fi';

const StudentAnalytics = () => {
  const navigate = useNavigate();

  // TODO: Fetch analytics data from API
  const stats = {
    totalEvents: 0,
    attended: 0,
    certificates: 0,
    attendanceRate: 0,
    eventsRegistered: 0,
    upcomingEvents: 0
  };

  const eventTypeData = [];
  const monthlyData = [];
  const performanceMetrics = [];

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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmin(250px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
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
            <h1 style={styles.title}>My Analytics Dashboard</h1>
            <p style={styles.subtitle}>Comprehensive overview of your event participation and performance</p>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
            <button 
              style={styles.backButton}
              onClick={() => navigate('/student/dashboard')}
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
              <h3 style={styles.statTitle}>Total Events</h3>
              <div style={{...styles.statIcon, backgroundColor: '#EEF2FF'}}>
                <FiCalendar size={20} color="#4F46E5" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.totalEvents}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> +12% from last month
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Events Attended</h3>
              <div style={{...styles.statIcon, backgroundColor: '#D1FAE5'}}>
                <FiCheckCircle size={20} color="#10B981" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.attended}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Excellent participation
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Certificates</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
                <FiAward size={20} color="#F59E0B" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.certificates}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> {stats.certificates} earned
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Attendance Rate</h3>
              <div style={{...styles.statIcon, backgroundColor: '#DBEAFE'}}>
                <FiTarget size={20} color="#3B82F6" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.attendanceRate}%</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Great performance
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '32px'}}>
          
          {/* Event Type Distribution - Donut Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiPieChart size={18} /> Event Type Distribution
            </h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '32px'}}>
              {/* Donut Chart */}
              <div style={{position: 'relative', width: '180px', height: '180px'}}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  {/* Background circle */}
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#F3F4F6" strokeWidth="28" />
                  {/* Data segments */}
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#4F46E5" strokeWidth="28" 
                    strokeDasharray="176 440" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#10B981" strokeWidth="28" 
                    strokeDasharray="141 440" strokeDashoffset="-176" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#F59E0B" strokeWidth="28" 
                    strokeDasharray="88 440" strokeDashoffset="-317" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#8B5CF6" strokeWidth="28" 
                    strokeDasharray="35 440" strokeDashoffset="-405" transform="rotate(-90 90 90)" />
                  {/* Center text */}
                  <text x="90" y="85" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1F2937">{stats.totalEvents}</text>
                  <text x="90" y="105" textAnchor="middle" fontSize="12" fill="#6B7280">Events</text>
                </svg>
              </div>
              {/* Legend */}
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {eventTypeData.map((item, i) => (
                  <div key={i}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color}}></div>
                        <span style={{fontSize: '14px', color: '#374151', fontWeight: '500'}}>{item.type}</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '14px', fontWeight: '600', color: '#1F2937'}}>{item.count}</span>
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

          {/* Monthly Registration Trends - Bar Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiBarChart2 size={18} /> Monthly Registration Trends
            </h3>
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '220px', gap: '12px', padding: '0 20px'}}>
              {monthlyData.map((data, i) => {
                const maxValue = Math.max(...monthlyData.map(d => d.events));
                const height = (data.events / maxValue) * 100;
                return (
                  <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                    <div style={{fontSize: '13px', fontWeight: '600', color: '#4F46E5'}}>{data.events}</div>
                    <div 
                      style={{
                        width: '100%', 
                        maxWidth: '50px',
                        height: `${height}%`, 
                        backgroundColor: '#4F46E5', 
                        borderRadius: '6px 6px 0 0', 
                        transition: 'all 0.3s',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338CA'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}
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
          
          {/* Attendance Rate Circle */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiCheckCircle size={18} /> My Attendance Rate
            </h3>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px'}}>
              <div style={{position: 'relative', width: '200px', height: '200px'}}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#E5E7EB" strokeWidth="16" />
                  <circle 
                    cx="100" cy="100" r="85" fill="none" stroke="#10B981" strokeWidth="16" 
                    strokeDasharray="534" strokeDashoffset={534 - (534 * stats.attendanceRate / 100)} 
                    transform="rotate(-90 100 100)" 
                    strokeLinecap="round" 
                  />
                  <text x="100" y="95" textAnchor="middle" fontSize="40" fontWeight="bold" fill="#10B981">{stats.attendanceRate}%</text>
                  <text x="100" y="120" textAnchor="middle" fontSize="14" fill="#6B7280">Attendance</text>
                </svg>
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                  <span style={{fontSize: '14px', color: '#6B7280'}}>Events Attended</span>
                  <span style={{fontSize: '14px', fontWeight: '600', color: '#1F2937'}}>{stats.attended} / {stats.totalEvents}</span>
                </div>
                <div style={{height: '10px', backgroundColor: '#E5E7EB', borderRadius: '5px', overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${stats.attendanceRate}%`, backgroundColor: '#10B981'}}></div>
                </div>
              </div>
              <div style={{display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px'}}>
                <div style={{flex: 1, textAlign: 'center'}}>
                  <div style={{fontSize: '24px', fontWeight: '700', color: '#10B981'}}>{stats.attended}</div>
                  <div style={{fontSize: '12px', color: '#6B7280', marginTop: '4px'}}>Present</div>
                </div>
                <div style={{width: '1px', backgroundColor: '#E5E7EB'}}></div>
                <div style={{flex: 1, textAlign: 'center'}}>
                  <div style={{fontSize: '24px', fontWeight: '700', color: '#EF4444'}}>{stats.totalEvents - stats.attended}</div>
                  <div style={{fontSize: '12px', color: '#6B7280', marginTop: '4px'}}>Absent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiTarget size={18} /> Performance Overview
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

export default StudentAnalytics;
