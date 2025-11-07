import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiUsers, FiDollarSign, FiBriefcase, FiAward, FiPieChart, FiBarChart2, FiFilter, FiDownload } from 'react-icons/fi';
import PlacementTopNav from './PlacementTopNav';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const PlacementAnalytics = () => {
  const [selectedBatch, setSelectedBatch] = useState('2024');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const analyticsData = {
    overview: {
      totalStudents: 450,
      placedStudents: 382,
      placementPercentage: 84.9,
      highestPackage: 45.0,
      averagePackage: 8.5,
      medianPackage: 7.2,
      companiesVisited: 120,
      offersReceived: 428
    },
    departmentWise: [
      { dept: 'Computer Science', total: 180, placed: 165, percentage: 91.7, avgPackage: 10.2 },
      { dept: 'Electronics', total: 120, placed: 102, percentage: 85.0, avgPackage: 7.8 },
      { dept: 'Mechanical', total: 90, placed: 72, percentage: 80.0, avgPackage: 6.5 },
      { dept: 'Civil', total: 60, placed: 43, percentage: 71.7, avgPackage: 5.8 }
    ],
    topRecruiters: [
      { company: 'TCS', offers: 45, avgPackage: 7.5 },
      { company: 'Infosys', offers: 38, avgPackage: 6.8 },
      { company: 'Wipro', offers: 32, avgPackage: 6.2 },
      { company: 'Amazon', offers: 12, avgPackage: 28.5 },
      { company: 'Microsoft', offers: 8, avgPackage: 35.0 },
      { company: 'Google', offers: 5, avgPackage: 45.0 }
    ],
    packageDistribution: [
      { range: '0-5 LPA', count: 85 },
      { range: '5-10 LPA', count: 180 },
      { range: '10-15 LPA', count: 75 },
      { range: '15-20 LPA', count: 28 },
      { range: '20+ LPA', count: 14 }
    ],
    monthlyTrend: [
      { month: 'Sep', offers: 25 },
      { month: 'Oct', offers: 48 },
      { month: 'Nov', offers: 92 },
      { month: 'Dec', offers: 135 },
      { month: 'Jan', offers: 78 },
      { month: 'Feb', offers: 50 }
    ]
  };

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleExport = () => {
    showToast('Analytics report exported successfully!');
  };

  const ProgressBar = ({ percentage, color }) => (
    <div style={{ width: '100%', height: '8px', backgroundColor: colors.gray200, borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: color, transition: 'width 0.3s ease' }} />
    </div>
  );

  const BarChart = ({ data, maxValue }) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', padding: '20px 0' }}>
      {data.map((item, i) => {
        const height = (item.count / maxValue) * 100;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.gray700 }}>{item.count}</div>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '100%', height: `${height}%`, backgroundColor: colors.primary, borderRadius: '6px 6px 0 0',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primaryDark; e.currentTarget.style.transform = 'scaleY(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.transform = 'scaleY(1)'; }} />
            </div>
            <div style={{ fontSize: '11px', color: colors.gray500, textAlign: 'center', wordBreak: 'break-word' }}>{item.range}</div>
          </div>
        );
      })}
    </div>
  );

  const LineChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.offers));
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '180px', padding: '20px 0' }}>
        {data.map((item, i) => {
          const height = (item.offers / maxValue) * 100;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: colors.success }}>{item.offers}</div>
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <div style={{ width: '60%', height: `${height}%`, backgroundColor: colors.success, borderRadius: '4px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = `0 4px 12px ${colors.success}40`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: colors.gray600 }}>{item.month}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={commonStyles.container}>
      <PlacementTopNav />
      {toast.show && <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>{toast.message}</div>}
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>Placement Analytics</h1>
            <p style={commonStyles.pageSubtitle}>Comprehensive placement insights and performance metrics</p>
          </div>
          <button onClick={handleExport} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
            <FiDownload size={18} /> Export Report
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiFilter size={16} color={colors.gray500} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Batch:</span>
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} 
              style={{ ...commonStyles.input, width: 'auto', padding: '8px 12px' }}>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>Department:</span>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} 
              style={{ ...commonStyles.input, width: 'auto', padding: '8px 12px' }}>
              <option value="all">All Departments</option>
              <option value="cse">Computer Science</option>
              <option value="ece">Electronics</option>
              <option value="mech">Mechanical</option>
              <option value="civil">Civil</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <FiTrendingUp size={24} />, value: `${analyticsData.overview.placementPercentage}%`, label: 'Placement Rate', 
              bg: colors.successLight, color: colors.success, subtitle: `${analyticsData.overview.placedStudents}/${analyticsData.overview.totalStudents} placed` },
            { icon: <FiDollarSign size={24} />, value: `₹${analyticsData.overview.highestPackage} L`, label: 'Highest Package', 
              bg: colors.primaryLight, color: colors.primary, subtitle: 'Top offer this year' },
            { icon: <FiAward size={24} />, value: `₹${analyticsData.overview.averagePackage} L`, label: 'Average Package', 
              bg: colors.infoLight, color: colors.info, subtitle: `Median: ₹${analyticsData.overview.medianPackage}L` },
            { icon: <FiBriefcase size={24} />, value: analyticsData.overview.companiesVisited, label: 'Companies Visited', 
              bg: colors.warningLight, color: colors.warning, subtitle: `${analyticsData.overview.offersReceived} offers` }
          ].map((stat, i) => (
            <div key={i} style={{ ...commonStyles.card, padding: '20px' }} onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: stat.bg, borderRadius: '10px' }}>{React.cloneElement(stat.icon, { color: stat.color })}</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: colors.gray800, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '12px', color: colors.gray500 }}>{stat.subtitle}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <div style={{ ...commonStyles.card, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', backgroundColor: colors.primaryLight, borderRadius: '8px' }}>
                <FiBarChart2 size={20} color={colors.primary} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Package Distribution</h3>
                <p style={{ fontSize: '13px', color: colors.gray500, margin: 0 }}>Student count by salary range</p>
              </div>
            </div>
            <BarChart data={analyticsData.packageDistribution} maxValue={Math.max(...analyticsData.packageDistribution.map(d => d.count))} />
          </div>

          <div style={{ ...commonStyles.card, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', backgroundColor: colors.successLight, borderRadius: '8px' }}>
                <FiTrendingUp size={20} color={colors.success} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Monthly Placement Trend</h3>
                <p style={{ fontSize: '13px', color: colors.gray500, margin: 0 }}>Offers received per month</p>
              </div>
            </div>
            <LineChart data={analyticsData.monthlyTrend} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
          <div style={{ ...commonStyles.card, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', backgroundColor: colors.infoLight, borderRadius: '8px' }}>
                <FiPieChart size={20} color={colors.info} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Department-wise Performance</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analyticsData.departmentWise.map((dept, i) => (
                <div key={i} style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px', 
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray50; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: colors.gray800 }}>{dept.dept}</div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: colors.success }}>₹{dept.avgPackage}L avg</span>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: colors.primary }}>{dept.percentage}%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: colors.gray500, marginBottom: '8px' }}>
                    <span>{dept.placed} placed</span>
                    <span>{dept.total} total</span>
                  </div>
                  <ProgressBar percentage={dept.percentage} color={dept.percentage > 85 ? colors.success : dept.percentage > 75 ? colors.warning : colors.error} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...commonStyles.card, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', backgroundColor: colors.warningLight, borderRadius: '8px' }}>
                <FiAward size={20} color={colors.warning} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Top Recruiters</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analyticsData.topRecruiters.map((recruiter, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px',
                  backgroundColor: colors.gray50, borderRadius: '8px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primaryLight; e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray50; e.currentTarget.style.transform = 'scale(1)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: colors.primary,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: colors.white }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: colors.gray800 }}>{recruiter.company}</div>
                      <div style={{ fontSize: '13px', color: colors.gray500 }}>{recruiter.offers} offers</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: colors.success }}>₹{recruiter.avgPackage}L</div>
                    <div style={{ fontSize: '12px', color: colors.gray500 }}>avg package</div>
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

export default PlacementAnalytics;
