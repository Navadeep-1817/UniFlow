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
  FiBriefcase,
  FiDollarSign,
  FiTrendingDown
} from 'react-icons/fi';

const PlacementAnalyticsPage = () => {
  const navigate = useNavigate();

  // Mock data for T&P
  const stats = {
    totalCompanies: 145,
    studentsPlaced: 520,
    placementRate: 78,
    avgPackage: 6.5,
    highestPackage: 28,
    activeDrives: 12
  };

  const companyTiers = [
    { tier: 'Dream', count: 25, percentage: 17, color: '#4F46E5' },
    { tier: 'Super Dream', count: 15, percentage: 10, color: '#10B981' },
    { tier: 'Good', count: 65, percentage: 45, color: '#F59E0B' },
    { tier: 'Core', count: 40, percentage: 28, color: '#8B5CF6' }
  ];

  const monthlyPlacements = [
    { month: 'Jan', placed: 45 },
    { month: 'Feb', placed: 62 },
    { month: 'Mar', placed: 58 },
    { month: 'Apr', placed: 95 },
    { month: 'May', placed: 120 },
    { month: 'Jun', placed: 140 }
  ];

  const packageDistribution = [
    { range: '3-5 LPA', students: 180, color: '#8B5CF6' },
    { range: '5-7 LPA', students: 150, color: '#F59E0B' },
    { range: '7-10 LPA', students: 120, color: '#10B981' },
    { range: '10+ LPA', students: 70, color: '#4F46E5' }
  ];

  const performanceMetrics = [
    { label: 'Placement Success Rate', value: 78, color: '#4F46E5' },
    { label: 'Company Satisfaction', value: 92, color: '#10B981' },
    { label: 'Student Satisfaction', value: 85, color: '#F59E0B' },
    { label: 'CRT Success Rate', value: 88, color: '#EF4444' }
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
            <h1 style={styles.title}>Training & Placement Analytics</h1>
            <p style={styles.subtitle}>Comprehensive placement statistics and insights</p>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
            <button 
              style={styles.backButton}
              onClick={() => navigate('/placement/dashboard')}
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
              <h3 style={styles.statTitle}>Total Companies</h3>
              <div style={{...styles.statIcon, backgroundColor: '#EEF2FF'}}>
                <FiBriefcase size={20} color="#4F46E5" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.totalCompanies}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Active recruiters
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Students Placed</h3>
              <div style={{...styles.statIcon, backgroundColor: '#D1FAE5'}}>
                <FiUsers size={20} color="#10B981" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.studentsPlaced}</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> This academic year
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Placement Rate</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
                <FiTarget size={20} color="#F59E0B" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.placementRate}%</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Excellent rate
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Avg Package</h3>
              <div style={{...styles.statIcon, backgroundColor: '#DBEAFE'}}>
                <FiDollarSign size={20} color="#3B82F6" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.avgPackage} LPA</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Average CTC
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Highest Package</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FCE7F3'}}>
                <FiAward size={20} color="#EC4899" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.highestPackage} LPA</h2>
            <p style={styles.statChange}>
              <FiTrendingUp size={14} /> Top offer
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statHeader}>
              <h3 style={styles.statTitle}>Active Drives</h3>
              <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
                <FiCalendar size={20} color="#F59E0B" />
              </div>
            </div>
            <h2 style={styles.statValue}>{stats.activeDrives}</h2>
            <p style={styles.statChange}>
              <FiClock size={14} /> Ongoing
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '32px'}}>
          
          {/* Company Tiers Distribution */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiPieChart size={18} /> Company Tiers Distribution
            </h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '32px'}}>
              <div style={{position: 'relative', width: '180px', height: '180px'}}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#F3F4F6" strokeWidth="28" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#4F46E5" strokeWidth="28" 
                    strokeDasharray="75 440" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#10B981" strokeWidth="28" 
                    strokeDasharray="44 440" strokeDashoffset="-75" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#F59E0B" strokeWidth="28" 
                    strokeDasharray="198 440" strokeDashoffset="-119" transform="rotate(-90 90 90)" />
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#8B5CF6" strokeWidth="28" 
                    strokeDasharray="123 440" strokeDashoffset="-317" transform="rotate(-90 90 90)" />
                  <text x="90" y="85" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1F2937">{stats.totalCompanies}</text>
                  <text x="90" y="105" textAnchor="middle" fontSize="12" fill="#6B7280">Companies</text>
                </svg>
              </div>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {companyTiers.map((item, i) => (
                  <div key={i}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color}}></div>
                        <span style={{fontSize: '14px', color: '#374151', fontWeight: '500'}}>{item.tier}</span>
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

          {/* Monthly Placements Trend */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiBarChart2 size={18} /> Monthly Placement Trends
            </h3>
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '220px', gap: '12px', padding: '0 20px'}}>
              {monthlyPlacements.map((data, i) => {
                const maxValue = Math.max(...monthlyPlacements.map(d => d.placed));
                const height = (data.placed / maxValue) * 100;
                return (
                  <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                    <div style={{fontSize: '13px', fontWeight: '600', color: '#10B981'}}>{data.placed}</div>
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
          
          {/* Package Distribution */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FiDollarSign size={18} /> Package Distribution
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0'}}>
              {packageDistribution.map((item, i) => {
                const total = packageDistribution.reduce((sum, p) => sum + p.students, 0);
                const percentage = Math.round((item.students / total) * 100);
                return (
                  <div key={i}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span style={{fontSize: '14px', color: '#374151', fontWeight: '500'}}>{item.range}</span>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <span style={{fontSize: '16px', fontWeight: '700', color: item.color}}>{item.students}</span>
                        <span style={{fontSize: '12px', color: '#6B7280'}}>({percentage}%)</span>
                      </div>
                    </div>
                    <div style={{height: '12px', backgroundColor: '#E5E7EB', borderRadius: '6px', overflow: 'hidden'}}>
                      <div 
                        style={{
                          height: '100%', 
                          width: `${percentage}%`, 
                          backgroundColor: item.color, 
                          transition: 'width 0.5s ease',
                          borderRadius: '6px'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
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

export default PlacementAnalyticsPage;
