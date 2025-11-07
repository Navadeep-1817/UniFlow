import React, { useState } from 'react';
import { FiAward, FiTrendingUp, FiUsers, FiTarget, FiDownload, FiPrinter, FiFilter, FiSearch, FiBarChart2, FiCalendar, FiEye } from 'react-icons/fi';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const AthleticsReport = () => {
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('academic-year');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const athletesData = [
    { id: 1, rollNo: 'CS2021001', name: 'Rahul Sharma', department: 'Computer Science', sport: 'Cricket', 
      eventsParticipated: 12, wins: 8, medals: { gold: 2, silver: 3, bronze: 1 }, totalMedals: 6,
      bestPerformance: 'Inter-College Championship - Gold', ranking: 1, averageScore: 8.5,
      recentEvents: ['State Championship', 'Inter-University Match', 'Annual Sports Meet'] },
    { id: 2, rollNo: 'EC2021045', name: 'Priya Verma', department: 'Electronics', sport: 'Athletics', 
      eventsParticipated: 15, wins: 12, medals: { gold: 5, silver: 4, bronze: 2 }, totalMedals: 11,
      bestPerformance: '100m Sprint - 11.2s (Gold)', ranking: 1, averageScore: 9.2,
      recentEvents: ['National Athletics Meet', 'State Championship', 'Zone Level Competition'] },
    { id: 3, rollNo: 'ME2021078', name: 'Arjun Kumar', department: 'Mechanical', sport: 'Football', 
      eventsParticipated: 10, wins: 6, medals: { gold: 1, silver: 2, bronze: 2 }, totalMedals: 5,
      bestPerformance: 'District Tournament - Silver', ranking: 2, averageScore: 7.8,
      recentEvents: ['Inter-College Football', 'District Championship', 'Friendly Match'] },
    { id: 4, rollNo: 'CS2021089', name: 'Sneha Reddy', department: 'Computer Science', sport: 'Badminton', 
      eventsParticipated: 18, wins: 14, medals: { gold: 4, silver: 5, bronze: 3 }, totalMedals: 12,
      bestPerformance: 'State Singles - Gold', ranking: 1, averageScore: 8.9,
      recentEvents: ['State Badminton Championship', 'Inter-University Tournament', 'Zone Competition'] },
    { id: 5, rollNo: 'EC2021056', name: 'Vikram Singh', department: 'Electronics', sport: 'Basketball', 
      eventsParticipated: 14, wins: 9, medals: { gold: 3, silver: 2, bronze: 1 }, totalMedals: 6,
      bestPerformance: 'Inter-College Finals - Gold', ranking: 1, averageScore: 8.3,
      recentEvents: ['State Basketball League', 'Inter-College Tournament', 'Regional Championship'] }
  ];

  const sportCategories = ['All Sports', 'Cricket', 'Athletics', 'Football', 'Badminton', 'Basketball', 'Chess', 'Table Tennis'];
  
  const overallStats = {
    totalAthletes: athletesData.length,
    totalEvents: athletesData.reduce((sum, a) => sum + a.eventsParticipated, 0),
    totalMedals: athletesData.reduce((sum, a) => sum + a.totalMedals, 0),
    goldMedals: athletesData.reduce((sum, a) => sum + a.medals.gold, 0),
    averagePerformance: (athletesData.reduce((sum, a) => sum + a.averageScore, 0) / athletesData.length).toFixed(1)
  };

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleDownloadReport = () => {
    showToast('Report downloaded successfully!');
  };

  const handlePrintReport = () => {
    showToast('Opening print dialog...');
    window.print();
  };

  const handleViewDetails = (athlete) => {
    setSelectedAthlete(athlete);
    setShowDetailsModal(true);
  };

  const filteredAthletes = athletesData.filter(athlete => {
    const matchesSport = selectedSport === 'all' || athlete.sport === selectedSport;
    const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         athlete.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const getRankBadgeColor = (ranking) => {
    if (ranking === 1) return { bg: colors.warningLight, color: colors.warning };
    if (ranking === 2) return { bg: colors.gray200, color: colors.gray600 };
    if (ranking === 3) return { bg: colors.errorLight, color: colors.error };
    return { bg: colors.infoLight, color: colors.info };
  };

  return (
    <div style={commonStyles.container}>
      {toast.show && <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>{toast.message}</div>}
      
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>Athletics Performance Report</h1>
            <p style={commonStyles.pageSubtitle}>Comprehensive athlete statistics, scores, and performance analysis</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handlePrintReport} style={{ ...commonStyles.secondaryBtn, display: 'flex', alignItems: 'center', gap: '8px' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray200; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; e.currentTarget.style.transform = 'scale(1)'; }}>
              <FiPrinter size={16} /> Print
            </button>
            <button onClick={handleDownloadReport} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
              <FiDownload size={16} /> Download Report
            </button>
          </div>
        </div>

        {/* Overall Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <FiUsers size={24} />, value: overallStats.totalAthletes, label: 'Total Athletes', bg: colors.primaryLight, color: colors.primary },
            { icon: <FiCalendar size={24} />, value: overallStats.totalEvents, label: 'Events Participated', bg: colors.infoLight, color: colors.info },
            { icon: <FiTarget size={24} />, value: overallStats.totalMedals, label: 'Total Medals', bg: colors.successLight, color: colors.success },
            { icon: <FiAward size={24} />, value: overallStats.goldMedals, label: 'Gold Medals', bg: colors.warningLight, color: colors.warning },
            { icon: <FiTrendingUp size={24} />, value: overallStats.averagePerformance, label: 'Avg Performance', bg: colors.errorLight, color: colors.error }
          ].map((stat, i) => (
            <div key={i} style={commonStyles.statCard} onMouseEnter={hoverEffects.statCardHover} onMouseLeave={hoverEffects.statCardLeave}>
              <div style={{...commonStyles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div>
              <div style={commonStyles.statContent}>
                <div style={commonStyles.statValue}>{stat.value}</div>
                <div style={commonStyles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div style={commonStyles.card}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
            <div style={commonStyles.searchBox}>
              <FiSearch size={18} color={colors.gray500} />
              <input type="text" placeholder="Search by name or roll number..." value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: colors.gray800 }} />
            </div>
            
            <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} 
              style={{ ...commonStyles.input, flex: '0 0 200px' }}>
              <option value="all">All Sports</option>
              {sportCategories.slice(1).map(sport => <option key={sport} value={sport}>{sport}</option>)}
            </select>

            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} 
              style={{ ...commonStyles.input, flex: '0 0 200px' }}>
              <option value="academic-year">Academic Year 2024</option>
              <option value="semester">Current Semester</option>
              <option value="quarter">Last Quarter</option>
              <option value="month">Last Month</option>
            </select>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setViewMode('table')} 
                style={{ padding: '8px 16px', backgroundColor: viewMode === 'table' ? colors.primary : colors.gray100,
                  color: viewMode === 'table' ? colors.white : colors.gray700, border: 'none', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s ease' }}>
                Table View
              </button>
              <button onClick={() => setViewMode('cards')} 
                style={{ padding: '8px 16px', backgroundColor: viewMode === 'cards' ? colors.primary : colors.gray100,
                  color: viewMode === 'cards' ? colors.white : colors.gray700, border: 'none', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s ease' }}>
                Card View
              </button>
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: colors.gray50, borderBottom: `2px solid ${colors.gray200}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>Rank</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>Roll No</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>Department</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>Sport</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>Events</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>Medals</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>Avg Score</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAthletes.map((athlete, index) => {
                    const rankColors = getRankBadgeColor(athlete.ranking);
                    return (
                      <tr key={athlete.id} style={{ borderBottom: `1px solid ${colors.gray200}`, transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.gray50}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '12px' }}>
                          <span style={{ ...commonStyles.badge, ...rankColors }}>#{athlete.ranking}</span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: colors.gray700 }}>{athlete.rollNo}</td>
                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{athlete.name}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: colors.gray600 }}>{athlete.department}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ ...commonStyles.badge, backgroundColor: colors.primaryLight, color: colors.primary }}>{athlete.sport}</span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{athlete.eventsParticipated}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: colors.warning }}>🥇{athlete.medals.gold}</span>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: colors.gray500 }}>🥈{athlete.medals.silver}</span>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: colors.error }}>🥉{athlete.medals.bronze}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '700', color: colors.success }}>{athlete.averageScore}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button onClick={() => handleViewDetails(athlete)} 
                            style={{ padding: '6px 12px', backgroundColor: colors.primaryLight, border: 'none', borderRadius: '6px',
                              color: colors.primary, cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex',
                              alignItems: 'center', gap: '4px', margin: '0 auto', transition: 'all 0.2s ease' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.color = colors.white; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primaryLight; e.currentTarget.style.color = colors.primary; }}>
                            <FiEye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Card View */}
          {viewMode === 'cards' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {filteredAthletes.map(athlete => {
                const rankColors = getRankBadgeColor(athlete.ranking);
                return (
                  <div key={athlete.id} style={{ ...commonStyles.card, padding: '20px' }} 
                    onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.gray800, margin: '0 0 4px 0' }}>{athlete.name}</h3>
                        <p style={{ fontSize: '13px', color: colors.gray500, margin: 0 }}>{athlete.rollNo} • {athlete.department}</p>
                      </div>
                      <span style={{ ...commonStyles.badge, ...rankColors }}>Rank #{athlete.ranking}</span>
                    </div>
                    
                    <div style={{ padding: '12px', backgroundColor: colors.primaryLight, borderRadius: '8px', marginBottom: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: colors.primary, marginBottom: '4px' }}>{athlete.sport}</div>
                      <div style={{ fontSize: '12px', color: colors.primaryDark }}>Specialty Sport</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ padding: '10px', backgroundColor: colors.gray50, borderRadius: '6px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: colors.info }}>{athlete.eventsParticipated}</div>
                        <div style={{ fontSize: '11px', color: colors.gray600 }}>Events</div>
                      </div>
                      <div style={{ padding: '10px', backgroundColor: colors.gray50, borderRadius: '6px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: colors.success }}>{athlete.totalMedals}</div>
                        <div style={{ fontSize: '11px', color: colors.gray600 }}>Medals</div>
                      </div>
                      <div style={{ padding: '10px', backgroundColor: colors.gray50, borderRadius: '6px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: colors.warning }}>{athlete.averageScore}</div>
                        <div style={{ fontSize: '11px', color: colors.gray600 }}>Avg Score</div>
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: colors.successLight, borderRadius: '6px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: colors.successDark, marginBottom: '4px' }}>🏆 Best Performance</div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: colors.gray700 }}>{athlete.bestPerformance}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: colors.warning }}>🥇 {athlete.medals.gold}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: colors.gray500 }}>🥈 {athlete.medals.silver}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: colors.error }}>🥉 {athlete.medals.bronze}</span>
                    </div>

                    <button onClick={() => handleViewDetails(athlete)} style={{ ...commonStyles.primaryBtn, width: '100%' }}
                      onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                      <FiEye size={16} /> View Full Report
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Report Modal */}
        {showDetailsModal && selectedAthlete && (
          <div style={commonStyles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
            <div style={{ ...commonStyles.modalContent, maxWidth: '900px', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={(e) => e.stopPropagation()}>
              <div style={commonStyles.modalHeader}>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: colors.gray800, margin: '0 0 4px 0' }}>{selectedAthlete.name}</h3>
                  <p style={{ fontSize: '14px', color: colors.gray600, margin: 0 }}>{selectedAthlete.rollNo} • {selectedAthlete.department}</p>
                </div>
                <button onClick={() => setShowDetailsModal(false)} 
                  style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                  <FiTarget size={20} style={{ transform: 'rotate(45deg)' }} />
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  {[
                    { label: 'Sport', value: selectedAthlete.sport, bg: colors.primaryLight, color: colors.primary },
                    { label: 'Events', value: selectedAthlete.eventsParticipated, bg: colors.infoLight, color: colors.info },
                    { label: 'Wins', value: selectedAthlete.wins, bg: colors.successLight, color: colors.success },
                    { label: 'Avg Score', value: selectedAthlete.averageScore, bg: colors.warningLight, color: colors.warning }
                  ].map((stat, i) => (
                    <div key={i} style={{ padding: '16px', backgroundColor: stat.bg, borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: stat.color }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '20px', backgroundColor: colors.gray50, borderRadius: '10px', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: colors.gray800, margin: '0 0 16px 0' }}>Medal Tally</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '40px', marginBottom: '8px' }}>🥇</div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: colors.warning }}>{selectedAthlete.medals.gold}</div>
                      <div style={{ fontSize: '13px', color: colors.gray600 }}>Gold</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '40px', marginBottom: '8px' }}>🥈</div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: colors.gray500 }}>{selectedAthlete.medals.silver}</div>
                      <div style={{ fontSize: '13px', color: colors.gray600 }}>Silver</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '40px', marginBottom: '8px' }}>🥉</div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: colors.error }}>{selectedAthlete.medals.bronze}</div>
                      <div style={{ fontSize: '13px', color: colors.gray600 }}>Bronze</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '20px', backgroundColor: colors.successLight, borderRadius: '10px', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: colors.successDark, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiAward size={18} /> Best Performance
                  </h4>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: colors.gray800, margin: 0 }}>{selectedAthlete.bestPerformance}</p>
                </div>

                <div style={{ padding: '20px', backgroundColor: colors.white, border: `1px solid ${colors.gray200}`, borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: colors.gray800, margin: '0 0 12px 0' }}>Recent Events</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedAthlete.recentEvents.map((event, i) => (
                      <div key={i} style={{ padding: '10px', backgroundColor: colors.gray50, borderRadius: '6px', fontSize: '14px', color: colors.gray700 }}>
                        • {event}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleticsReport;
