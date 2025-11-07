import React, { useState } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiAlertCircle, FiCheck, FiUsers, FiFilter } from 'react-icons/fi';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const FixtureScheduling = () => {
  const [fixtures, setFixtures] = useState([
    { id: 1, title: 'Inter-College Cricket Match', sport: 'Cricket', type: 'Match', team1: 'CSE Warriors', team2: 'ECE Titans',
      date: '2024-11-15', time: '09:00 AM', venue: 'Main Ground', status: 'Scheduled', duration: '3 hours' },
    { id: 2, title: 'Basketball Practice Session', sport: 'Basketball', type: 'Practice', team1: 'University Team', team2: null,
      date: '2024-11-12', time: '05:00 PM', venue: 'Indoor Court', status: 'Scheduled', duration: '2 hours' },
    { id: 3, title: 'Football Tournament Finals', sport: 'Football', type: 'Tournament', team1: 'ME Strikers', team2: 'IT Thunder',
      date: '2024-11-20', time: '02:00 PM', venue: 'Sports Complex', status: 'Scheduled', duration: '2 hours' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingFixture, setEditingFixture] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterSport, setFilterSport] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    title: '', sport: '', type: 'Match', team1: '', team2: '', date: '', time: '', venue: '', duration: '', status: 'Scheduled'
  });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const checkConflict = (newFixture) => {
    return fixtures.some(f => f.id !== newFixture.id && f.venue === newFixture.venue && 
      f.date === newFixture.date && f.time === newFixture.time);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkConflict(formData)) {
      showToast('Schedule conflict detected! Venue already booked at this time.', 'error');
      return;
    }
    if (editingFixture) {
      setFixtures(fixtures.map(f => f.id === editingFixture.id ? { ...formData, id: editingFixture.id } : f));
      showToast('Fixture updated successfully!');
    } else {
      setFixtures([...fixtures, { ...formData, id: Date.now() }]);
      showToast('Fixture created successfully!');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', sport: '', type: 'Match', team1: '', team2: '', date: '', time: '', venue: '', duration: '', status: 'Scheduled' });
    setEditingFixture(null);
    setShowModal(false);
  };

  const handleEdit = (fixture) => {
    setEditingFixture(fixture);
    setFormData(fixture);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this fixture?')) {
      setFixtures(fixtures.filter(f => f.id !== id));
      showToast('Fixture deleted!');
    }
  };

  const filteredFixtures = fixtures.filter(f => 
    (filterType === 'all' || f.type === filterType) && (filterSport === 'all' || f.sport === filterSport)
  ).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

  const stats = {
    total: fixtures.length,
    matches: fixtures.filter(f => f.type === 'Match').length,
    practice: fixtures.filter(f => f.type === 'Practice').length,
    tournaments: fixtures.filter(f => f.type === 'Tournament').length
  };

  const getStatusColor = (status) => {
    const colors_map = { 'Scheduled': { bg: colors.infoLight, color: colors.info }, 
      'Completed': { bg: colors.successLight, color: colors.success }, 
      'Cancelled': { bg: colors.errorLight, color: colors.error } };
    return colors_map[status] || colors_map['Scheduled'];
  };

  return (
    <div style={commonStyles.container}>
      {toast.show && <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>{toast.message}</div>}
      
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div><h1 style={commonStyles.pageTitle}>Fixture Scheduling</h1>
            <p style={commonStyles.pageSubtitle}>Manage matches, tournaments, and practice sessions</p></div>
          <button onClick={() => setShowModal(true)} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
            <FiPlus size={18} /> Schedule Fixture</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[{ icon: <FiCalendar size={24} />, value: stats.total, label: 'Total Fixtures', bg: colors.primaryLight, color: colors.primary },
            { icon: <FiUsers size={24} />, value: stats.matches, label: 'Matches', bg: colors.successLight, color: colors.success },
            { icon: <FiClock size={24} />, value: stats.practice, label: 'Practice Sessions', bg: colors.warningLight, color: colors.warning },
            { icon: <FiMapPin size={24} />, value: stats.tournaments, label: 'Tournaments', bg: colors.errorLight, color: colors.error }
          ].map((stat, i) => (
            <div key={i} style={commonStyles.statCard} onMouseEnter={hoverEffects.statCardHover} onMouseLeave={hoverEffects.statCardLeave}>
              <div style={{...commonStyles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div>
              <div style={commonStyles.statContent}><div style={commonStyles.statValue}>{stat.value}</div>
                <div style={commonStyles.statLabel}>{stat.label}</div></div>
            </div>
          ))}
        </div>

        <div style={commonStyles.card}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ ...commonStyles.input, flex: '0 0 200px' }}>
              <option value="all">All Types</option><option value="Match">Matches</option>
              <option value="Practice">Practice</option><option value="Tournament">Tournaments</option>
            </select>
            <select value={filterSport} onChange={(e) => setFilterSport(e.target.value)} style={{ ...commonStyles.input, flex: '0 0 200px' }}>
              <option value="all">All Sports</option><option value="Cricket">Cricket</option><option value="Football">Football</option>
              <option value="Basketball">Basketball</option><option value="Badminton">Badminton</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredFixtures.map(fixture => {
              const statusColors = getStatusColor(fixture.status);
              return (
                <div key={fixture.id} style={commonStyles.card} onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.gray800, margin: '0 0 8px 0' }}>{fixture.title}</h3>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ ...commonStyles.badge, backgroundColor: colors.primaryLight, color: colors.primary }}>{fixture.sport}</span>
                        <span style={{ ...commonStyles.badge, backgroundColor: colors.infoLight, color: colors.info }}>{fixture.type}</span>
                        <span style={{ ...commonStyles.badge, ...statusColors }}>{fixture.status}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(fixture)} style={{ padding: '8px', backgroundColor: colors.primaryLight, border: 'none', borderRadius: '8px', color: colors.primary, cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.color = colors.white; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primaryLight; e.currentTarget.style.color = colors.primary; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <FiEdit2 size={16} /></button>
                      <button onClick={() => handleDelete(fixture.id)} style={{ padding: '8px', backgroundColor: colors.errorLight, border: 'none', borderRadius: '8px', color: colors.error, cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.error; e.currentTarget.style.color = colors.white; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.errorLight; e.currentTarget.style.color = colors.error; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <FiTrash2 size={16} /></button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                    <div><div style={{ fontSize: '12px', fontWeight: '600', color: colors.gray500, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiCalendar size={12} /> Date & Time</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{new Date(fixture.date).toLocaleDateString()} at {fixture.time}</div></div>
                    <div><div style={{ fontSize: '12px', fontWeight: '600', color: colors.gray500, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiMapPin size={12} /> Venue</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{fixture.venue}</div></div>
                    <div><div style={{ fontSize: '12px', fontWeight: '600', color: colors.gray500, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock size={12} /> Duration</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{fixture.duration}</div></div>
                  </div>
                  {fixture.team2 && (
                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: colors.successLight, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: colors.successDark }}>{fixture.team1}</span>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: colors.success }}>VS</span>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: colors.successDark }}>{fixture.team2}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {showModal && (
          <div style={commonStyles.modalOverlay} onClick={resetForm}>
            <div style={{ ...commonStyles.modalContent, maxWidth: '700px', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={(e) => e.stopPropagation()}>
              <div style={commonStyles.modalHeader}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: 0 }}>{editingFixture ? 'Edit' : 'Schedule'} Fixture</h3>
                <button onClick={resetForm} style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}><FiX size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Fixture Title *</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={commonStyles.input} /></div>
                  <div><label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Type *</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required style={commonStyles.input}>
                      <option value="Match">Match</option><option value="Practice">Practice Session</option><option value="Tournament">Tournament</option></select></div>
                  <div><label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Sport *</label>
                    <input type="text" value={formData.sport} onChange={(e) => setFormData({...formData, sport: e.target.value})} required style={commonStyles.input} /></div>
                  <div><label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Team 1 *</label>
                    <input type="text" value={formData.team1} onChange={(e) => setFormData({...formData, team1: e.target.value})} required style={commonStyles.input} /></div>
                  <div><label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Team 2 / Opponent</label>
                    <input type="text" value={formData.team2} onChange={(e) => setFormData({...formData, team2: e.target.value})} style={commonStyles.input} /></div>
                  <div><label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Date *</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required style={commonStyles.input} /></div>
                  <div><label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Time *</label>
                    <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required style={commonStyles.input} /></div>
                  <div><label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Venue *</label>
                    <input type="text" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} required style={commonStyles.input} /></div>
                  <div><label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Duration *</label>
                    <input type="text" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="e.g., 2 hours" required style={commonStyles.input} /></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${colors.gray200}` }}>
                  <button type="button" onClick={resetForm} style={commonStyles.secondaryBtn}>Cancel</button>
                  <button type="submit" style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                    <FiSave size={16} /> {editingFixture ? 'Update' : 'Schedule'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixtureScheduling;
