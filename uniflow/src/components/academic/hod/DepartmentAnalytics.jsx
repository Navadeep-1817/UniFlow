import React, { useState, useEffect } from 'react';
import HODTopNav from './HODTopNav';
import { FiTrendingUp, FiUsers, FiCalendar, FiAward, FiTarget, FiActivity, FiBarChart2, FiPieChart } from 'react-icons/fi';

const DepartmentAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const analytics = {
    eventSuccessRate: 92,
    studentParticipation: 87,
    facultyEngagement: 95,
    averageAttendance: 89,
    totalEvents: 48,
    completedEvents: 44,
    activeStudents: 420,
    totalStudents: 485,
    activeFaculty: 19,
    totalFaculty: 20
  };

  const eventTypes = [
    { type: 'FDP', count: 18, percentage: 37.5, color: '#4F46E5' },
    { type: 'SDP', count: 15, percentage: 31.25, color: '#10B981' },
    { type: 'CRT', count: 10, percentage: 20.83, color: '#F59E0B' },
    { type: 'Workshop', count: 5, percentage: 10.42, color: '#EF4444' }
  ];

  const monthlyTrends = [
    { month: 'Jan', events: 5, participants: 280, attendance: 85 },
    { month: 'Feb', events: 6, participants: 320, attendance: 88 },
    { month: 'Mar', events: 8, participants: 390, attendance: 92 },
    { month: 'Apr', events: 7, participants: 350, attendance: 87 },
    { month: 'May', events: 9, participants: 420, attendance: 90 },
    { month: 'Jun', events: 8, participants: 400, attendance: 89 }
  ];

  const topPerformers = [
    { name: 'Priya Patel', participation: 15, attendance: 98, performance: 95 },
    { name: 'Rahul Sharma', participation: 12, attendance: 96, performance: 92 },
    { name: 'Sneha Reddy', participation: 11, attendance: 94, performance: 90 },
    { name: 'Amit Kumar', participation: 10, attendance: 92, performance: 88 },
    { name: 'Vikas Singh', participation: 10, attendance: 90, performance: 85 }
  ];

  const maxParticipants = Math.max(...monthlyTrends.map(m => m.participants));

  return (
    <div style={styles.container}>
      <HODTopNav />
      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div><h1 style={styles.pageTitle}>Department Analytics</h1><p style={styles.pageSubtitle}>Comprehensive performance insights</p></div>
          <div style={styles.periodSelector}>
            {['week', 'month', 'year'].map(period => (
              <button key={period} onClick={() => setSelectedPeriod(period)} style={{...styles.periodBtn, backgroundColor: selectedPeriod === period ? '#4F46E5' : '#FFF', color: selectedPeriod === period ? '#FFF' : '#6B7280'}} onMouseEnter={(e) => { if (selectedPeriod !== period) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; }}} onMouseLeave={(e) => { if (selectedPeriod !== period) { e.currentTarget.style.backgroundColor = '#FFF'; e.currentTarget.style.transform = 'scale(1)'; }}}>{period.charAt(0).toUpperCase() + period.slice(1)}</button>
            ))}
          </div>
        </div>

        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={styles.kpiIcon}><FiTarget size={32} color="#4F46E5" /></div>
            <div style={styles.kpiContent}>
              <div style={styles.kpiValue}>{analytics.eventSuccessRate}%</div>
              <div style={styles.kpiLabel}>Event Success Rate</div>
              <div style={styles.progressBar}><div style={{...styles.progressFill, width: `${analytics.eventSuccessRate}%`, backgroundColor: '#4F46E5'}} /></div>
            </div>
          </div>
          <div style={styles.kpiCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={styles.kpiIcon}><FiUsers size={32} color="#10B981" /></div>
            <div style={styles.kpiContent}>
              <div style={styles.kpiValue}>{analytics.studentParticipation}%</div>
              <div style={styles.kpiLabel}>Student Participation</div>
              <div style={styles.progressBar}><div style={{...styles.progressFill, width: `${analytics.studentParticipation}%`, backgroundColor: '#10B981'}} /></div>
            </div>
          </div>
          <div style={styles.kpiCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={styles.kpiIcon}><FiActivity size={32} color="#F59E0B" /></div>
            <div style={styles.kpiContent}>
              <div style={styles.kpiValue}>{analytics.facultyEngagement}%</div>
              <div style={styles.kpiLabel}>Faculty Engagement</div>
              <div style={styles.progressBar}><div style={{...styles.progressFill, width: `${analytics.facultyEngagement}%`, backgroundColor: '#F59E0B'}} /></div>
            </div>
          </div>
          <div style={styles.kpiCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={styles.kpiIcon}><FiAward size={32} color="#EF4444" /></div>
            <div style={styles.kpiContent}>
              <div style={styles.kpiValue}>{analytics.averageAttendance}%</div>
              <div style={styles.kpiLabel}>Average Attendance</div>
              <div style={styles.progressBar}><div style={{...styles.progressFill, width: `${analytics.averageAttendance}%`, backgroundColor: '#EF4444'}} /></div>
            </div>
          </div>
        </div>

        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}><h3 style={styles.chartTitle}><FiBarChart2 size={20} /> Monthly Event Trends</h3></div>
            <div style={styles.barChart}>
              {monthlyTrends.map((data, i) => (
                <div key={i} style={styles.barGroup}>
                  <div style={styles.barContainer}>
                    <div style={{...styles.bar, height: `${(data.participants / maxParticipants) * 100}%`, backgroundColor: '#4F46E5'}} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scaleY(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scaleY(1)'; }}>
                      <div style={styles.barTooltip}>{data.participants}</div>
                    </div>
                  </div>
                  <div style={styles.barLabel}>{data.month}</div>
                  <div style={styles.barSubLabel}>{data.events} events</div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartHeader}><h3 style={styles.chartTitle}><FiPieChart size={20} /> Event Distribution</h3></div>
            <div style={styles.pieChartContainer}>
              <div style={styles.pieChart}>
                {eventTypes.map((type, i) => {
                  const prevPercentage = eventTypes.slice(0, i).reduce((sum, t) => sum + t.percentage, 0);
                  return (
                    <div key={i} style={{...styles.pieSlice, background: `conic-gradient(${type.color} 0% ${type.percentage}%, transparent ${type.percentage}%)`, transform: `rotate(${prevPercentage * 3.6}deg)`}} />
                  );
                })}
                <div style={styles.pieCenter}><div style={styles.pieCenterText}>{analytics.totalEvents}<br/><span style={{fontSize: '14px', color: '#6B7280'}}>Events</span></div></div>
              </div>
              <div style={styles.pieLegend}>
                {eventTypes.map((type, i) => (
                  <div key={i} style={styles.legendItem}>
                    <div style={{...styles.legendColor, backgroundColor: type.color}} />
                    <div style={styles.legendText}><span style={styles.legendLabel}>{type.type}</span><span style={styles.legendValue}>{type.count} ({type.percentage}%)</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.detailsGrid}>
          <div style={styles.detailCard}>
            <h3 style={styles.detailTitle}><FiTrendingUp size={18} /> Performance Summary</h3>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}><div style={styles.summaryLabel}>Total Events</div><div style={styles.summaryValue}>{analytics.totalEvents}</div></div>
              <div style={styles.summaryItem}><div style={styles.summaryLabel}>Completed</div><div style={styles.summaryValue}>{analytics.completedEvents}</div></div>
              <div style={styles.summaryItem}><div style={styles.summaryLabel}>Active Students</div><div style={styles.summaryValue}>{analytics.activeStudents}/{analytics.totalStudents}</div></div>
              <div style={styles.summaryItem}><div style={styles.summaryLabel}>Active Faculty</div><div style={styles.summaryValue}>{analytics.activeFaculty}/{analytics.totalFaculty}</div></div>
            </div>
          </div>

          <div style={styles.detailCard}>
            <h3 style={styles.detailTitle}><FiAward size={18} /> Top Performers</h3>
            <div style={styles.performersList}>
              {topPerformers.map((student, i) => (
                <div key={i} style={styles.performerItem}>
                  <div style={styles.performerRank}>#{i + 1}</div>
                  <div style={styles.performerInfo}>
                    <div style={styles.performerName}>{student.name}</div>
                    <div style={styles.performerStats}>
                      <span>{student.participation} events</span>
                      <span>•</span>
                      <span>{student.attendance}% attendance</span>
                    </div>
                  </div>
                  <div style={styles.performanceScore}>
                    <div style={{...styles.scoreCircle, background: `conic-gradient(${student.performance >= 90 ? '#10B981' : student.performance >= 80 ? '#3B82F6' : '#F59E0B'} ${student.performance * 3.6}deg, #E5E7EB 0deg)`}}>
                      <div style={styles.scoreCenter}>{student.performance}</div>
                    </div>
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

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  content: { padding: '24px', maxWidth: '1600px', margin: '0 auto' },
  pageHeader: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  pageTitle: { fontSize: '32px', fontWeight: '700', color: '#1F2937', margin: 0 },
  pageSubtitle: { fontSize: '16px', color: '#6B7280', margin: '8px 0 0 0' },
  periodSelector: { display: 'flex', gap: '8px', backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  periodBtn: { padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' },
  kpiCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '20px', alignItems: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  kpiIcon: { padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '12px' },
  kpiContent: { flex: 1 },
  kpiValue: { fontSize: '36px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' },
  kpiLabel: { fontSize: '14px', color: '#6B7280', marginBottom: '12px' },
  progressBar: { width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '4px', transition: 'width 1s ease' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' },
  chartCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  chartHeader: { marginBottom: '24px' },
  chartTitle: { fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' },
  barChart: { display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '250px', paddingTop: '20px' },
  barGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 },
  barContainer: { width: '100%', height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative' },
  bar: { width: '60%', backgroundColor: '#4F46E5', borderRadius: '8px 8px 0 0', position: 'relative', transition: 'all 0.3s ease', transformOrigin: 'bottom' },
  barTooltip: { position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1F2937', color: '#FFF', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  barLabel: { fontSize: '14px', fontWeight: '600', color: '#374151', marginTop: '8px' },
  barSubLabel: { fontSize: '12px', color: '#9CA3AF', marginTop: '2px' },
  pieChartContainer: { display: 'flex', gap: '32px', alignItems: 'center', justifyContent: 'center' },
  pieChart: { width: '200px', height: '200px', borderRadius: '50%', position: 'relative' },
  pieSlice: { position: 'absolute', width: '100%', height: '100%', borderRadius: '50%' },
  pieCenter: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', height: '120px', backgroundColor: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pieCenterText: { fontSize: '32px', fontWeight: '700', color: '#1F2937', textAlign: 'center' },
  pieLegend: { display: 'flex', flexDirection: 'column', gap: '12px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  legendColor: { width: '16px', height: '16px', borderRadius: '4px' },
  legendText: { display: 'flex', flexDirection: 'column', gap: '2px' },
  legendLabel: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  legendValue: { fontSize: '12px', color: '#6B7280' },
  detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' },
  detailCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  detailTitle: { fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  summaryItem: { padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
  summaryLabel: { fontSize: '14px', color: '#6B7280', marginBottom: '8px' },
  summaryValue: { fontSize: '24px', fontWeight: '700', color: '#1F2937' },
  performersList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  performerItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
  performerRank: { fontSize: '18px', fontWeight: '700', color: '#4F46E5', minWidth: '40px' },
  performerInfo: { flex: 1 },
  performerName: { fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' },
  performerStats: { fontSize: '13px', color: '#6B7280', display: 'flex', gap: '8px' },
  performanceScore: { flexShrink: 0 },
  scoreCircle: { width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  scoreCenter: { width: '46px', height: '46px', backgroundColor: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#1F2937' }
};

export default DepartmentAnalytics;
