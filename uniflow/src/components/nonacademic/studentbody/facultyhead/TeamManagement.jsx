import React, { useState, useEffect } from 'react';
import FacultyHeadTopNav from './FacultyHeadTopNav';
import { styles } from './TeamManagementStyles';
import { FiUsers, FiUserPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiEye, FiSettings, FiAward, FiMail, FiPhone, FiCheckCircle, FiClock } from 'react-icons/fi';

const mockTeams = [
  {
    id: 1, name: 'Tech Club', category: 'Technical', lead: 'Rahul Sharma', totalMembers: 15, activeEvents: 3, completedEvents: 5, status: 'Active',
    description: 'Organizing technical events, hackathons, and workshops',
    members: [
      { id: 1, name: 'Rahul Sharma', role: 'Team Lead', email: 'rahul@example.com', phone: '+91 98765 43210', joinDate: '2023-08-01', status: 'Active' },
      { id: 2, name: 'Priya Patel', role: 'Event Coordinator', email: 'priya@example.com', phone: '+91 98765 43211', joinDate: '2023-08-05', status: 'Active' },
      { id: 3, name: 'Amit Kumar', role: 'Technical Head', email: 'amit@example.com', phone: '+91 98765 43212', joinDate: '2023-08-10', status: 'Active' }
    ]
  },
  {
    id: 2, name: 'Cultural Committee', category: 'Cultural', lead: 'Priya Patel', totalMembers: 20, activeEvents: 2, completedEvents: 8, status: 'Active',
    description: 'Managing cultural festivals, dance, music, and drama events',
    members: [
      { id: 1, name: 'Priya Patel', role: 'Festival Director', email: 'priya@example.com', phone: '+91 98765 43211', joinDate: '2023-07-01', status: 'Active' },
      { id: 2, name: 'Sneha Reddy', role: 'Stage Manager', email: 'sneha@example.com', phone: '+91 98765 43213', joinDate: '2023-07-05', status: 'Active' }
    ]
  },
  {
    id: 3, name: 'Sports Council', category: 'Sports', lead: 'Amit Kumar', totalMembers: 12, activeEvents: 1, completedEvents: 6, status: 'Active',
    description: 'Coordinating sports events, tournaments, and fitness activities',
    members: [
      { id: 1, name: 'Amit Kumar', role: 'Sports Secretary', email: 'amit@example.com', phone: '+91 98765 43212', joinDate: '2023-07-01', status: 'Active' }
    ]
  }
];

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '', phone: '' });

  useEffect(() => {
    setTimeout(() => { setTeams(mockTeams); setIsLoading(false); }, 800);
  }, []);

  const getCategoryGradient = (category) => {
    const gradients = {
      'Technical': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Cultural': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Sports': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Entrepreneurship': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'Social Service': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };
    return gradients[category] || gradients['Technical'];
  };

  const getRoleBadgeColor = (role) => {
    if (role.includes('Lead') || role.includes('President') || role.includes('Director')) return { bg: '#DBEAFE', text: '#1E40AF' };
    if (role.includes('Head') || role.includes('Manager')) return { bg: '#D1FAE5', text: '#065F46' };
    if (role.includes('Coordinator')) return { bg: '#FEF3C7', text: '#92400E' };
    return { bg: '#F3F4F6', text: '#374151' };
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role || !newMember.email) {
      alert('Please fill in all required fields');
      return;
    }
    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          members: [...team.members, { id: team.members.length + 1, ...newMember, joinDate: new Date().toISOString().split('T')[0], status: 'Active' }],
          totalMembers: team.totalMembers + 1
        };
      }
      return team;
    });
    setTeams(updatedTeams);
    setNewMember({ name: '', role: '', email: '', phone: '' });
    setShowMemberModal(false);
    alert('Member added successfully!');
  };

  const handleRemoveMember = (teamId, memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      const updatedTeams = teams.map(team => {
        if (team.id === teamId) {
          return { ...team, members: team.members.filter(m => m.id !== memberId), totalMembers: team.totalMembers - 1 };
        }
        return team;
      });
      setTeams(updatedTeams);
      alert('Member removed successfully!');
    }
  };

  const filteredTeams = teams.filter(team => {
    const categoryMatch = filterCategory === 'All' || team.category === filterCategory;
    const searchMatch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) || team.lead.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const stats = {
    totalTeams: teams.length,
    totalMembers: teams.reduce((sum, t) => sum + t.totalMembers, 0),
    activeEvents: teams.reduce((sum, t) => sum + t.activeEvents, 0),
    completedEvents: teams.reduce((sum, t) => sum + t.completedEvents, 0)
  };

  if (isLoading) {
    return (
      <>
        <FacultyHeadTopNav />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading teams...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <FacultyHeadTopNav />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Team Management</h2>
            <p style={styles.subtitle}>{filteredTeams.length} teams under supervision</p>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.secondaryButton} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <FiSettings size={18} /> Settings
            </button>
            <button style={styles.primaryButton} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
              <FiUserPlus size={18} /> Create New Team
            </button>
          </div>
        </div>

        <div style={styles.statsGrid}>
          {[
            { icon: <FiUsers size={24} />, label: 'Total Teams', value: stats.totalTeams, color: '#4F46E5' },
            { icon: <FiUserPlus size={24} />, label: 'Total Members', value: stats.totalMembers, color: '#10B981' },
            { icon: <FiClock size={24} />, label: 'Active Events', value: stats.activeEvents, color: '#F59E0B' },
            { icon: <FiCheckCircle size={24} />, label: 'Completed Events', value: stats.completedEvents, color: '#8B5CF6' }
          ].map((stat, index) => (
            <div key={index} style={{ ...styles.statCard, ...(hoveredStat === index ? styles.statCardHover : {}) }} onMouseEnter={() => setHoveredStat(index)} onMouseLeave={() => setHoveredStat(null)}>
              <div style={{ ...styles.statIcon, backgroundColor: stat.color + '20', color: stat.color }}>{stat.icon}</div>
              <div>
                <p style={styles.statLabel}>{stat.label}</p>
                <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.filtersContainer}>
          <div style={styles.searchWrapper}>
            <FiSearch size={16} style={styles.searchIcon} />
            <input type="text" placeholder="Search teams or leads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.filterGroup}>
            <FiFilter size={16} style={{ color: '#6B7280' }} />
            <label style={styles.filterLabel}>Category:</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={styles.select}>
              <option value="All">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        {filteredTeams.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}><FiUsers size={64} /></div>
            <h3 style={styles.emptyTitle}>No Teams Found</h3>
            <p style={styles.emptyText}>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div style={styles.teamsGrid}>
            {filteredTeams.map((team) => (
              <div key={team.id} style={{ ...styles.teamCard, ...(hoveredCard === team.id ? styles.teamCardHover : {}) }} onMouseEnter={() => setHoveredCard(team.id)} onMouseLeave={() => setHoveredCard(null)}>
                <div style={{ ...styles.teamHeader, background: getCategoryGradient(team.category) }}>
                  <div style={styles.teamBadge}>{team.status.toUpperCase()}</div>
                  <h3 style={styles.teamTitle}>{team.name}</h3>
                  <p style={styles.teamCategory}><FiAward size={14} /> {team.category}</p>
                </div>
                <div style={styles.teamBody}>
                  <div style={styles.teamStats}>
                    <div style={styles.teamStatItem}>
                      <p style={styles.teamStatValue}>{team.totalMembers}</p>
                      <p style={styles.teamStatLabel}>Members</p>
                    </div>
                    <div style={styles.teamStatItem}>
                      <p style={styles.teamStatValue}>{team.activeEvents}</p>
                      <p style={styles.teamStatLabel}>Active</p>
                    </div>
                    <div style={styles.teamStatItem}>
                      <p style={styles.teamStatValue}>{team.completedEvents}</p>
                      <p style={styles.teamStatLabel}>Completed</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>Team Lead</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                      <div style={styles.memberAvatar}>{team.lead.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <p style={styles.memberName}>{team.lead}</p>
                        <p style={styles.memberRole}>Team Leader</p>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px', lineHeight: '1.5' }}>{team.description}</p>
                  <div style={styles.teamActions}>
                    <button style={{ ...styles.actionButton, ...styles.viewButton }} onClick={() => { setSelectedTeam(team); setShowTeamModal(true); }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <FiEye size={16} /> View Team
                    </button>
                    <button style={{ ...styles.actionButton, ...styles.manageButton }} onClick={() => { setSelectedTeam(team); setShowMemberModal(true); }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                      <FiUserPlus size={16} /> Add Member
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showTeamModal && selectedTeam && (
          <div style={styles.modalOverlay} onClick={() => setShowTeamModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>{selectedTeam.name}</h3>
                  <p style={styles.modalSubtitle}>{selectedTeam.category} • Led by {selectedTeam.lead}</p>
                </div>
                <button style={styles.closeButton} onClick={() => setShowTeamModal(false)} onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.transform = 'rotate(90deg)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.transform = 'rotate(0deg)'; }}>×</button>
              </div>
              <div style={styles.membersList}>
                <div style={styles.membersHeader}>
                  <h4 style={styles.membersTitle}>Team Members ({selectedTeam.members.length})</h4>
                  <button style={{ ...styles.iconButton, ...styles.editIconButton, width: 'auto', padding: '8px 16px', gap: '6px' }} onClick={() => { setShowTeamModal(false); setShowMemberModal(true); }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.color = '#FFFFFF'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#EEF2FF'; e.currentTarget.style.color = '#4F46E5'; }}>
                    <FiUserPlus size={14} /> Add Member
                  </button>
                </div>
                {selectedTeam.members.map((member) => {
                  const roleColors = getRoleBadgeColor(member.role);
                  return (
                    <div key={member.id} style={{ ...styles.memberItem, ...(hoveredMember === member.id ? styles.memberItemHover : {}) }} onMouseEnter={() => setHoveredMember(member.id)} onMouseLeave={() => setHoveredMember(null)}>
                      <div style={styles.memberInfo}>
                        <div style={styles.memberAvatar}>{member.name.split(' ').map(n => n[0]).join('')}</div>
                        <div style={styles.memberDetails}>
                          <p style={styles.memberName}>{member.name}</p>
                          <span style={{ ...styles.roleBadge, backgroundColor: roleColors.bg, color: roleColors.text }}>{member.role}</span>
                          <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '12px', color: '#6B7280' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiMail size={12} /> {member.email}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiPhone size={12} /> {member.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div style={styles.memberActions}>
                        <button style={{ ...styles.iconButton, ...styles.editIconButton }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#EEF2FF'; e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                          <FiEdit2 size={14} />
                        </button>
                        <button style={{ ...styles.iconButton, ...styles.deleteIconButton }} onClick={() => handleRemoveMember(selectedTeam.id, member.id)} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DC2626'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.transform = 'scale(1)'; }}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {showMemberModal && selectedTeam && (
          <div style={styles.modalOverlay} onClick={() => setShowMemberModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>Add Team Member</h3>
                  <p style={styles.modalSubtitle}>Adding to {selectedTeam.name}</p>
                </div>
                <button style={styles.closeButton} onClick={() => setShowMemberModal(false)} onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.transform = 'rotate(90deg)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.transform = 'rotate(0deg)'; }}>×</button>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input type="text" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} style={styles.input} placeholder="Enter member name" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Role/Position *</label>
                <input type="text" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} style={styles.input} placeholder="e.g., Event Coordinator" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} style={styles.input} placeholder="member@example.com" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input type="tel" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} style={styles.input} placeholder="+91 98765 43210" />
              </div>
              <div style={styles.modalActions}>
                <button style={styles.submitButton} onClick={handleAddMember} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>Add Member</button>
                <button style={styles.cancelButton} onClick={() => setShowMemberModal(false)} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D1D5DB'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </>
  );
};

export default TeamManagement;