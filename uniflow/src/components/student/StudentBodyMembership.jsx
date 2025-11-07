import React, { useState } from 'react';
import { FiUsers, FiUserPlus, FiUserMinus, FiAward, FiCalendar, FiBell, FiMail, FiPhone, FiMapPin, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { colors, commonStyles, hoverEffects } from '../../styles/globalStyles';

const StudentBodyMembership = () => {
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('available');
  
  const [availableBodies, setAvailableBodies] = useState([
    { id: 1, name: 'Student Activity Center (SAC)', category: 'General', description: 'Coordinates all student activities and cultural events across campus',
      facultyHead: 'Dr. Ramesh Kumar', memberCount: 250, joinedDate: null, myRole: null, isJoined: false,
      meetings: 'Every Friday 5:00 PM', contact: 'sac@university.edu', location: 'SAC Office, 2nd Floor' },
    { id: 2, name: 'National Service Scheme (NSS)', category: 'Social Service', description: 'Engages in community service and social welfare activities',
      facultyHead: 'Prof. Anjali Sharma', memberCount: 180, joinedDate: null, myRole: null, isJoined: false,
      meetings: 'Every Monday 4:00 PM', contact: 'nss@university.edu', location: 'NSS Hall' },
    { id: 3, name: 'IEEE Student Branch', category: 'Technical', description: 'Professional association for technical and engineering students',
      facultyHead: 'Dr. Suresh Babu', memberCount: 320, joinedDate: '2024-08-15', myRole: 'Member', isJoined: true,
      meetings: 'Every Tuesday 5:30 PM', contact: 'ieee@university.edu', location: 'CS Department' },
    { id: 4, name: 'Coding Club', category: 'Technical', description: 'Platform for competitive programming and software development',
      facultyHead: 'Dr. Priya Menon', memberCount: 275, joinedDate: '2024-09-01', myRole: 'Secretary', isJoined: true,
      meetings: 'Every Wednesday 6:00 PM', contact: 'codingclub@university.edu', location: 'Computer Lab 3' },
    { id: 5, name: 'Literary Society', category: 'Cultural', description: 'Promotes literature, debates, and creative writing',
      facultyHead: 'Dr. Kavita Reddy', memberCount: 150, joinedDate: null, myRole: null, isJoined: false,
      meetings: 'Every Thursday 5:00 PM', contact: 'literary@university.edu', location: 'Library Hall' },
    { id: 6, name: 'Sports Committee', category: 'Sports', description: 'Organizes inter-college sports events and tournaments',
      facultyHead: 'Coach Vikram Singh', memberCount: 200, joinedDate: null, myRole: null, isJoined: false,
      meetings: 'Every Saturday 4:00 PM', contact: 'sports@university.edu', location: 'Sports Complex' }
  ]);

  const [announcements] = useState([
    { id: 1, bodyName: 'IEEE Student Branch', title: 'Workshop on IoT', date: '2024-11-12', message: 'Mandatory for all members' },
    { id: 2, bodyName: 'Coding Club', title: 'Hackathon Planning Meeting', date: '2024-11-10', message: 'Secretary required to attend' },
    { id: 3, bodyName: 'Coding Club', title: 'New Project Assignments', date: '2024-11-08', message: 'Check your email for details' }
  ]);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleJoin = (bodyId) => {
    setAvailableBodies(bodies => bodies.map(body => 
      body.id === bodyId ? { ...body, isJoined: true, joinedDate: new Date().toISOString().split('T')[0], myRole: 'Member' } : body
    ));
    showToast('Successfully joined the club!');
  };

  const handleLeave = (bodyId) => {
    if (window.confirm('Are you sure you want to leave this club?')) {
      setAvailableBodies(bodies => bodies.map(body => 
        body.id === bodyId ? { ...body, isJoined: false, joinedDate: null, myRole: null } : body
      ));
      showToast('You have left the club');
    }
  };

  const myMemberships = availableBodies.filter(body => body.isJoined);
  const availableToJoin = availableBodies.filter(body => !body.isJoined);

  const stats = {
    total: availableBodies.length,
    joined: myMemberships.length,
    announcements: announcements.length,
    categories: [...new Set(availableBodies.map(b => b.category))].length
  };

  const getRoleBadgeColor = (role) => {
    const colors_map = {
      'President': { bg: colors.errorLight, color: colors.error },
      'Secretary': { bg: colors.warningLight, color: colors.warning },
      'Treasurer': { bg: colors.infoLight, color: colors.info },
      'Member': { bg: colors.successLight, color: colors.success }
    };
    return colors_map[role] || colors_map['Member'];
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Technical': return '💻';
      case 'Cultural': return '🎭';
      case 'Sports': return '⚽';
      case 'Social Service': return '🤝';
      default: return '📚';
    }
  };

  return (
    <div style={commonStyles.container}>
      {toast.show && <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>{toast.message}</div>}
      
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>Student Body Membership</h1>
            <p style={commonStyles.pageSubtitle}>Join clubs, associations, and student organizations</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <FiUsers size={24} />, value: stats.total, label: 'Total Clubs', bg: colors.primaryLight, color: colors.primary },
            { icon: <FiCheckCircle size={24} />, value: stats.joined, label: 'My Memberships', bg: colors.successLight, color: colors.success },
            { icon: <FiBell size={24} />, value: stats.announcements, label: 'Announcements', bg: colors.warningLight, color: colors.warning },
            { icon: <FiAward size={24} />, value: stats.categories, label: 'Categories', bg: colors.infoLight, color: colors.info }
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

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {[
            { value: 'available', label: 'Available Clubs', count: availableToJoin.length },
            { value: 'joined', label: 'My Memberships', count: myMemberships.length },
            { value: 'announcements', label: 'Announcements', count: announcements.length }
          ].map((tab) => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              style={{ padding: '12px 20px', backgroundColor: activeTab === tab.value ? colors.primary : colors.white,
                color: activeTab === tab.value ? colors.white : colors.gray700, border: `2px solid ${colors.primary}`,
                borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', display: 'flex',
                alignItems: 'center', gap: '8px', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { if (activeTab !== tab.value) { e.currentTarget.style.backgroundColor = colors.primaryLight; }}}
              onMouseLeave={(e) => { if (activeTab !== tab.value) { e.currentTarget.style.backgroundColor = colors.white; }}}>
              {tab.label} <span style={{ padding: '2px 8px', backgroundColor: activeTab === tab.value ? colors.white : colors.primaryLight,
                color: activeTab === tab.value ? colors.primary : colors.white, borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Available Clubs */}
        {activeTab === 'available' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {availableToJoin.length === 0 ? (
              <div style={{ ...commonStyles.card, textAlign: 'center', padding: '60px 20px', gridColumn: '1 / -1' }}>
                <FiCheckCircle size={48} color={colors.success} />
                <p style={{ color: colors.gray500, marginTop: '16px', fontSize: '16px' }}>You're a member of all available clubs!</p>
              </div>
            ) : availableToJoin.map(body => (
              <div key={body.id} style={commonStyles.card} onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '32px' }}>{getCategoryIcon(body.category)}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.gray800, margin: '0 0 4px 0' }}>{body.name}</h3>
                    <span style={{ ...commonStyles.badge, backgroundColor: colors.primaryLight, color: colors.primary }}>{body.category}</span>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: colors.gray600, margin: '0 0 16px 0', lineHeight: '1.6' }}>{body.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: colors.gray700 }}>
                    <FiUsers size={14} color={colors.primary} />
                    <span><strong>{body.memberCount}</strong> members</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: colors.gray700 }}>
                    <FiAward size={14} color={colors.primary} />
                    <span>{body.facultyHead}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: colors.gray700 }}>
                    <FiClock size={14} color={colors.primary} />
                    <span>{body.meetings}</span>
                  </div>
                </div>
                <button onClick={() => handleJoin(body.id)} style={{ ...commonStyles.primaryBtn, width: '100%' }}
                  onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                  <FiUserPlus size={16} /> Join Club
                </button>
              </div>
            ))}
          </div>
        )}

        {/* My Memberships */}
        {activeTab === 'joined' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {myMemberships.length === 0 ? (
              <div style={{ ...commonStyles.card, textAlign: 'center', padding: '60px 20px' }}>
                <FiAlertCircle size={48} color={colors.gray400} />
                <p style={{ color: colors.gray500, marginTop: '16px', fontSize: '16px' }}>You haven't joined any clubs yet</p>
                <button onClick={() => setActiveTab('available')} style={{ ...commonStyles.primaryBtn, marginTop: '16px' }}
                  onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                  Browse Available Clubs
                </button>
              </div>
            ) : myMemberships.map(body => (
              <div key={body.id} style={commonStyles.card}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '40px' }}>{getCategoryIcon(body.category)}</div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: colors.gray800, margin: '0 0 6px 0' }}>{body.name}</h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ ...commonStyles.badge, backgroundColor: colors.primaryLight, color: colors.primary }}>{body.category}</span>
                          <span style={{ ...commonStyles.badge, ...getRoleBadgeColor(body.myRole), textTransform: 'uppercase', fontSize: '11px' }}>
                            {body.myRole}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: colors.gray600, margin: '0 0 16px 0', lineHeight: '1.6' }}>{body.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                      <div><span style={{ fontSize: '12px', color: colors.gray500 }}>Joined:</span>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{new Date(body.joinedDate).toLocaleDateString()}</div></div>
                      <div><span style={{ fontSize: '12px', color: colors.gray500 }}>Members:</span>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{body.memberCount}</div></div>
                      <div><span style={{ fontSize: '12px', color: colors.gray500 }}>Faculty Head:</span>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{body.facultyHead}</div></div>
                      <div><span style={{ fontSize: '12px', color: colors.gray500 }}>Meetings:</span>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray800 }}>{body.meetings}</div></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '160px' }}>
                    <div style={{ padding: '12px', backgroundColor: colors.infoLight, borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: colors.infoDark, marginBottom: '6px', fontWeight: '600' }}>Contact</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: colors.gray700, marginBottom: '4px' }}>
                        <FiMail size={12} /> {body.contact}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: colors.gray700 }}>
                        <FiMapPin size={12} /> {body.location}
                      </div>
                    </div>
                    <button onClick={() => handleLeave(body.id)} style={{ padding: '10px 16px', backgroundColor: colors.errorLight, border: 'none',
                      borderRadius: '8px', color: colors.error, cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.error; e.currentTarget.style.color = colors.white; e.currentTarget.style.transform = 'scale(1.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.errorLight; e.currentTarget.style.color = colors.error; e.currentTarget.style.transform = 'scale(1)'; }}>
                      <FiUserMinus size={16} /> Leave Club
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Announcements */}
        {activeTab === 'announcements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {announcements.length === 0 ? (
              <div style={{ ...commonStyles.card, textAlign: 'center', padding: '60px 20px' }}>
                <FiBell size={48} color={colors.gray400} />
                <p style={{ color: colors.gray500, marginTop: '16px', fontSize: '16px' }}>No announcements at the moment</p>
              </div>
            ) : announcements.map(announcement => (
              <div key={announcement.id} style={{ ...commonStyles.card, borderLeft: `4px solid ${colors.primary}` }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ ...commonStyles.badge, backgroundColor: colors.primaryLight, color: colors.primary }}>
                        {announcement.bodyName}
                      </span>
                      <span style={{ fontSize: '12px', color: colors.gray500 }}>
                        <FiCalendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {new Date(announcement.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 8px 0' }}>
                      {announcement.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: colors.gray600, margin: 0 }}>{announcement.message}</p>
                  </div>
                  <FiBell size={24} color={colors.primary} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentBodyMembership;
