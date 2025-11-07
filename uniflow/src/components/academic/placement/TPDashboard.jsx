import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiTrendingUp, FiDollarSign, FiCalendar, FiAward, FiTarget, FiBarChart2, FiArrowRight, FiCheckSquare, FiClipboard, FiFileText, FiUserCheck, FiXCircle, FiLogOut } from 'react-icons/fi';
import PlacementTopNav from './PlacementTopNav';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const TPDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user data/tokens
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    // Navigate to login page
    navigate('/login');
  };
  const [stats] = useState({
    totalCompanies: 120,
    activeDrives: 8,
    placedStudents: 382,
    unplacedStudents: 68,
    totalStudents: 450,
    placementPercentage: 84.9,
    highestPackage: 45.0,
    averagePackage: 8.5,
    crtSessions: 15,
    upcomingInterviews: 12,
        offerLetters: 428,
    pendingOffers: 35
  });

  const quickLinks = [
    { title: 'Companies', icon: <FiBriefcase size={20} />, color: colors.primary, bg: colors.primaryLight, path: '/placement/companies', desc: 'Manage partner companies' },
    { title: 'CRT Sessions', icon: <FiCalendar size={20} />, color: colors.success, bg: colors.successLight, path: '/placement/crt-sessions', desc: 'Training & preparation' },
    { title: 'Drives', icon: <FiTarget size={20} />, color: colors.warning, bg: colors.warningLight, path: '/placement/drives', desc: 'Campus recruitment drives' },
    { title: 'Interviews', icon: <FiUsers size={20} />, color: colors.info, bg: colors.infoLight, path: '/placement/interviews', desc: 'Schedule interviews' },
    { title: 'Offers', icon: <FiAward size={20} />, color: colors.success, bg: colors.successLight, path: '/placement/offers', desc: 'Manage job offers' },
    { title: 'Eligibility', icon: <FiCheckSquare size={20} />, color: colors.primary, bg: colors.primaryLight, path: '/placement/eligibility', desc: 'Set criteria rules' },
    { title: 'Student Status', icon: <FiClipboard size={20} />, color: colors.warning, bg: colors.warningLight, path: '/placement/student-status', desc: 'Track student progress' },
    { title: 'Analytics', icon: <FiBarChart2 size={20} />, color: colors.error, bg: colors.errorLight, path: '/placement/analytics', desc: 'View insights & reports' },
    { title: 'Reports', icon: <FiFileText size={20} />, color: colors.info, bg: colors.infoLight, path: '/placement/reports', desc: 'Generate reports' }
  ];

  const departmentData = [
    { dept: 'Computer Science', placed: 165, total: 180, percentage: 91.7 },
    { dept: 'Electronics', placed: 102, total: 120, percentage: 85.0 },
    { dept: 'Mechanical', placed: 72, total: 90, percentage: 80.0 },
    { dept: 'Civil', placed: 43, total: 60, percentage: 71.7 }
  ];

  const recentActivities = [
    { company: 'Amazon', type: 'Technical Interview', date: 'Today, 10:00 AM', status: 'Active', icon: <FiUsers size={16} /> },
    { company: 'Microsoft', type: 'Offer Released', date: 'Today, 9:15 AM', status: 'Completed', icon: <FiAward size={16} /> },
    { company: 'TCS', type: 'Campus Drive', date: 'Tomorrow, 2:00 PM', status: 'Scheduled', icon: <FiBriefcase size={16} /> },
    { company: 'Infosys', type: 'Pre-placement Talk', date: 'Nov 8, 11:00 AM', status: 'Upcoming', icon: <FiCalendar size={16} /> },
    { company: 'Wipro', type: 'Aptitude Test', date: 'Nov 10, 9:00 AM', status: 'Upcoming', icon: <FiTarget size={16} /> }
  ];

  const ProgressBar = ({ percentage, color }) => (
    <div style={{ width: '100%', height: '6px', backgroundColor: colors.gray200, borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: color, transition: 'width 0.5s ease' }} />
    </div>
  );

  const MiniChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.placed));
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px' }}>
        {data.map((item, i) => {
          const height = (item.placed / maxValue) * 100;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ width: '100%', height: `${height}%`, backgroundColor: colors.primary, borderRadius: '3px 3px 0 0',
                  transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryDark}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={commonStyles.container}>
      <PlacementTopNav />
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>Training & Placement Dashboard</h1>
            <p style={commonStyles.pageSubtitle}>Welcome back! Here's your placement operations overview</p>
          </div>
          <button onClick={handleLogout} 
            style={{ padding: '10px 20px', backgroundColor: colors.error, border: 'none', borderRadius: '8px', color: colors.white, 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', 
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 4px 12px ${colors.error}40`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <FiLogOut size={18} /> Logout
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <FiBriefcase size={24} />, value: stats.totalCompanies, label: 'Total Companies', bg: colors.primaryLight, color: colors.primary, subtitle: 'Active partnerships' },
            { icon: <FiUserCheck size={24} />, value: stats.placedStudents, label: 'Placed Students', bg: colors.successLight, color: colors.success, subtitle: `${stats.placementPercentage}% placement` },
            { icon: <FiXCircle size={24} />, value: stats.unplacedStudents, label: 'Unplaced Students', bg: colors.errorLight, color: colors.error, subtitle: `${stats.totalStudents} total` },
            { icon: <FiDollarSign size={24} />, value: `₹${stats.highestPackage}L`, label: 'Highest Package', bg: colors.warningLight, color: colors.warning, subtitle: `Avg: ₹${stats.averagePackage}L` },
            { icon: <FiTarget size={24} />, value: stats.activeDrives, label: 'Active Drives', bg: colors.infoLight, color: colors.info, subtitle: 'Ongoing recruitment' },
            { icon: <FiAward size={24} />, value: stats.offerLetters, label: 'Offers Received', bg: colors.successLight, color: colors.success, subtitle: `${stats.pendingOffers} pending` },
            { icon: <FiCalendar size={24} />, value: stats.crtSessions, label: 'CRT Sessions', bg: colors.primaryLight, color: colors.primary, subtitle: 'Training programs' },
            { icon: <FiUsers size={24} />, value: stats.upcomingInterviews, label: 'Interviews', bg: colors.warningLight, color: colors.warning, subtitle: 'Scheduled this week' }
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

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={commonStyles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Department-wise Placement</h2>
              <button onClick={() => navigate('/placement/analytics')} 
                style={{ padding: '8px 12px', backgroundColor: colors.primaryLight, border: 'none', borderRadius: '8px', color: colors.primary, 
                  cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.color = colors.white; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primaryLight; e.currentTarget.style.color = colors.primary; }}>
                View Details
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {departmentData.map((dept, i) => (
                <div key={i} style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px',
                  transition: 'all 0.2s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray50; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: colors.gray800 }}>{dept.dept}</span>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: colors.primary }}>{dept.percentage}%</span>
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

          <div style={commonStyles.card}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0' }}>Placement Trend</h2>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: colors.success, marginBottom: '4px' }}>{stats.placementPercentage}%</div>
              <div style={{ fontSize: '13px', color: colors.gray500 }}>Overall placement rate</div>
            </div>
            <MiniChart data={departmentData} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${colors.gray200}` }}>
              {departmentData.map((dept, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>{dept.dept.split(' ')[0]}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700 }}>{dept.placed}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div style={commonStyles.card}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0' }}>Quick Access</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {quickLinks.map((link, index) => (
                <div key={index} style={{ padding: '16px', backgroundColor: colors.white, border: `1px solid ${colors.gray200}`, borderRadius: '10px',
                  cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', gap: '8px' }}
                  onClick={() => navigate(link.path)}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${colors.gray300}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ padding: '10px', backgroundColor: link.bg, borderRadius: '8px', width: 'fit-content' }}>
                    {React.cloneElement(link.icon, { color: link.color })}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{link.title}</div>
                  <div style={{ fontSize: '12px', color: colors.gray500 }}>{link.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={commonStyles.card}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0' }}>Recent Activities</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivities.map((activity, index) => (
                <div key={index} style={{ padding: '12px', backgroundColor: colors.white, border: `1px solid ${colors.gray200}`, borderRadius: '8px',
                  transition: 'all 0.2s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.gray50}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.white}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ padding: '6px', backgroundColor: colors.primaryLight, borderRadius: '6px' }}>
                      {React.cloneElement(activity.icon, { color: colors.primary })}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{activity.company}</div>
                      <div style={{ fontSize: '12px', color: colors.gray500 }}>{activity.type}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: colors.gray500 }}>{activity.date}</span>
                    <span style={{ ...commonStyles.badge, fontSize: '11px',
                      backgroundColor: activity.status === 'Active' ? colors.successLight : activity.status === 'Completed' ? colors.infoLight : colors.warningLight,
                      color: activity.status === 'Active' ? colors.successDark : activity.status === 'Completed' ? colors.infoDark : colors.warningDark }}>
                      {activity.status}
                    </span>
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

export default TPDashboard;
