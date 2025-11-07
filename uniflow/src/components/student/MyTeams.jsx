import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyTeams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [newTeam, setNewTeam] = useState({ name: '', eventId: '', maxMembers: 4, description: '' });
  const [joinCode, setJoinCode] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    // Mock teams data
    const mockTeams = [
      {
        id: 1,
        name: 'Code Warriors',
        eventId: 1,
        eventName: 'Tech Fest 2024 - Hackathon',
        teamCode: 'TF24-CW-5891',
        myRole: 'leader',
        createdDate: '2024-10-20',
        maxMembers: 4,
        currentMembers: 3,
        members: [
          { id: 1, name: 'Rajesh Kumar (You)', email: 'rajesh.kumar@jntu.ac.in', role: 'leader', joinedDate: '2024-10-20', rollNumber: 'CS21001' },
          { id: 2, name: 'Amit Sharma', email: 'amit.sharma@jntu.ac.in', role: 'member', joinedDate: '2024-10-21', rollNumber: 'CS21015' },
          { id: 3, name: 'Priya Singh', email: 'priya.singh@jntu.ac.in', role: 'member', joinedDate: '2024-10-22', rollNumber: 'CS21032' }
        ],
        status: 'active',
        description: 'Team for hackathon competition focused on AI/ML solutions'
      },
      {
        id: 2,
        name: 'Tech Innovators',
        eventId: 1,
        eventName: 'Tech Fest 2024 - Project Exhibition',
        teamCode: 'TF24-TI-2347',
        myRole: 'member',
        createdDate: '2024-10-18',
        maxMembers: 3,
        currentMembers: 3,
        members: [
          { id: 1, name: 'Sneha Reddy', email: 'sneha.reddy@jntu.ac.in', role: 'leader', joinedDate: '2024-10-18', rollNumber: 'CS21008' },
          { id: 2, name: 'Rajesh Kumar (You)', email: 'rajesh.kumar@jntu.ac.in', role: 'member', joinedDate: '2024-10-19', rollNumber: 'CS21001' },
          { id: 3, name: 'Karthik Nair', email: 'karthik.nair@jntu.ac.in', role: 'member', joinedDate: '2024-10-19', rollNumber: 'CS21045' }
        ],
        status: 'active',
        description: 'IoT project team for smart campus solutions'
      },
      {
        id: 3,
        name: 'Sports Squad Alpha',
        eventId: 3,
        eventName: 'Annual Sports Meet - Cricket',
        teamCode: 'SM24-SSA-8912',
        myRole: 'member',
        createdDate: '2024-10-25',
        maxMembers: 11,
        currentMembers: 9,
        members: [
          { id: 1, name: 'Vikram Patel', email: 'vikram.patel@jntu.ac.in', role: 'leader', joinedDate: '2024-10-25', rollNumber: 'ME21005' },
          { id: 2, name: 'Rajesh Kumar (You)', email: 'rajesh.kumar@jntu.ac.in', role: 'member', joinedDate: '2024-10-26', rollNumber: 'CS21001' }
        ],
        status: 'active',
        description: 'Cricket team representing CS department'
      }
    ];
    setTeams(mockTeams);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleCreateTeam = () => {
    if (!newTeam.name || !newTeam.eventId) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    const teamCode = `TF24-${newTeam.name.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`;
    const team = {
      id: teams.length + 1,
      name: newTeam.name,
      eventId: parseInt(newTeam.eventId),
      eventName: 'Tech Fest 2024',
      teamCode,
      myRole: 'leader',
      createdDate: new Date().toISOString().split('T')[0],
      maxMembers: parseInt(newTeam.maxMembers),
      currentMembers: 1,
      members: [{ id: 1, name: 'Rajesh Kumar (You)', email: 'rajesh.kumar@jntu.ac.in', role: 'leader', joinedDate: new Date().toISOString().split('T')[0], rollNumber: 'CS21001' }],
      status: 'active',
      description: newTeam.description
    };
    setTeams([...teams, team]);
    showToast(`Team "${newTeam.name}" created successfully! Team Code: ${teamCode}`);
    setShowCreateModal(false);
    setNewTeam({ name: '', eventId: '', maxMembers: 4, description: '' });
  };

  const handleJoinTeam = () => {
    if (!joinCode) {
      showToast('Please enter team code', 'error');
      return;
    }
    showToast('Successfully joined the team!');
    setShowJoinModal(false);
    setJoinCode('');
  };

  const handleInviteMember = () => {
    if (!inviteEmail) {
      showToast('Please enter email address', 'error');
      return;
    }
    showToast(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleLeaveTeam = (team) => {
    if (team.myRole === 'leader') {
      showToast('Team leader cannot leave. Please transfer leadership or delete the team.', 'error');
      return;
    }
    setTeams(teams.filter(t => t.id !== team.id));
    showToast('Left team successfully');
  };

  const handleDeleteTeam = (team) => {
    if (team.myRole !== 'leader') {
      showToast('Only team leader can delete the team', 'error');
      return;
    }
    setTeams(teams.filter(t => t.id !== team.id));
    showToast('Team deleted successfully');
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB',fontFamily:'system-ui'}}>
      {toast.show && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:toast.type==='error'?'#EF4444':'#10B981',color:'white',padding:'16px 24px',borderRadius:'8px',boxShadow:'0 4px 6px rgba(0,0,0,0.1)',zIndex:2000}}>{toast.message}</div>}

      <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'20px 40px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          <div style={{fontSize:'24px',fontWeight:'bold',background:'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>UniFlow</div>
          <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',margin:0}}>My Teams</h1>
        </div>
        <button style={{padding:'10px 20px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',cursor:'pointer'}} onClick={handleLogout}>Logout</button>
      </div>

      <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'0 40px',display:'flex',gap:'4px',overflowX:'auto'}}>
        <button onClick={()=>navigate('/student/dashboard')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🏠 Dashboard</button>
        <button onClick={()=>navigate('/student/browse-events')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🔍 Browse Events</button>
        <button onClick={()=>navigate('/student/my-registrations')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>📋 My Registrations</button>
        <button onClick={()=>navigate('/student/my-teams')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid #4F46E5',fontSize:'13px',fontWeight:'600',color:'#4F46E5',cursor:'pointer',backgroundColor:'transparent'}}>👥 My Teams</button>
        <button onClick={()=>navigate('/student/attendance')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>📊 Attendance</button>
        <button onClick={()=>navigate('/student/certificates')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🎓 Certificates</button>
        <button onClick={()=>navigate('/student/notifications')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🔔 Notifications</button>
        <button onClick={()=>navigate('/student/placement-profile')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>💼 Placement</button>
        <button onClick={()=>navigate('/student/profile')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>👤 My Profile</button>
      </div>

      <div style={{padding:'40px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'20px',marginBottom:'32px'}}>
          {[{label:'My Teams',value:teams.length,icon:'👥',color:'#4F46E5'},{label:'Teams as Leader',value:teams.filter(t=>t.myRole==='leader').length,icon:'👑',color:'#F59E0B'},{label:'Total Members',value:teams.reduce((acc,t)=>acc+t.currentMembers,0),icon:'👨‍👩‍👧‍👦',color:'#10B981'}].map((s,i)=><div key={i} style={{backgroundColor:'white',borderRadius:'12px',padding:'20px',border:'1px solid #E5E7EB'}}><div style={{fontSize:'32px',marginBottom:'8px'}}>{s.icon}</div><h2 style={{fontSize:'28px',fontWeight:'bold',color:s.color,margin:'8px 0'}}>{s.value}</h2><p style={{fontSize:'13px',color:'#6B7280',margin:0}}>{s.label}</p></div>)}
        </div>

        <div style={{display:'flex',gap:'12px',marginBottom:'24px'}}>
          <button style={{padding:'12px 24px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowCreateModal(true)}>➕ Create New Team</button>
          <button style={{padding:'12px 24px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowJoinModal(true)}>🔗 Join Team</button>
        </div>

        {teams.length > 0 ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(400px, 1fr))',gap:'24px'}}>
            {teams.map(team => (
              <div key={team.id} style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',border:'1px solid #E5E7EB',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                  <div>
                    <h3 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',margin:'0 0 8px 0'}}>{team.name}</h3>
                    <span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:team.myRole==='leader'?'#FEF3C7':'#DBEAFE',color:team.myRole==='leader'?'#92400E':'#1E40AF'}}>
                      {team.myRole==='leader'?'👑 Leader':'👤 Member'}
                    </span>
                  </div>
                </div>

                <div style={{padding:'12px',backgroundColor:'#F9FAFB',borderRadius:'8px',marginBottom:'16px'}}>
                  <div style={{fontSize:'12px',color:'#6B7280',marginBottom:'4px'}}>Team Code</div>
                  <div style={{fontSize:'16px',fontWeight:'600',color:'#4F46E5',fontFamily:'monospace'}}>{team.teamCode}</div>
                </div>

                <p style={{fontSize:'14px',color:'#6B7280',marginBottom:'16px'}}>{team.description}</p>

                <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'16px'}}>
                  <div style={{fontSize:'14px',color:'#6B7280'}}><strong>Event:</strong> {team.eventName}</div>
                  <div style={{fontSize:'14px',color:'#6B7280'}}><strong>Members:</strong> {team.currentMembers}/{team.maxMembers}</div>
                  <div style={{fontSize:'14px',color:'#6B7280'}}><strong>Created:</strong> {new Date(team.createdDate).toLocaleDateString('en-IN')}</div>
                </div>

                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
                  <div style={{flex:1,height:'8px',backgroundColor:'#E5E7EB',borderRadius:'4px',overflow:'hidden'}}>
                    <div style={{height:'100%',backgroundColor:'#4F46E5',width:`${(team.currentMembers/team.maxMembers)*100}%`}}></div>
                  </div>
                  <span style={{fontSize:'12px',color:'#6B7280',fontWeight:'600'}}>{Math.round((team.currentMembers/team.maxMembers)*100)}%</span>
                </div>

                <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  <button style={{flex:1,padding:'10px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}} onClick={()=>{setSelectedTeam(team);setShowMembersModal(true);}}>👥 View Members</button>
                  {team.myRole==='leader' && team.currentMembers<team.maxMembers && (
                    <button style={{flex:1,padding:'10px',backgroundColor:'#10B981',color:'white',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}} onClick={()=>{setSelectedTeam(team);setShowInviteModal(true);}}>✉️ Invite</button>
                  )}
                  {team.myRole==='leader'?(
                    <button style={{flex:1,padding:'10px',backgroundColor:'#EF4444',color:'white',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}} onClick={()=>handleDeleteTeam(team)}>🗑️ Delete</button>
                  ):(
                    <button style={{flex:1,padding:'10px',backgroundColor:'#FEE2E2',color:'#991B1B',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer'}} onClick={()=>handleLeaveTeam(team)}>🚪 Leave</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'60px 20px',backgroundColor:'white',borderRadius:'12px',border:'1px solid #E5E7EB'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>👥</div>
            <h3 style={{fontSize:'18px',color:'#6B7280'}}>No teams yet</h3>
            <p style={{color:'#9CA3AF',marginBottom:'24px'}}>Create a team or join an existing one to collaborate with other students</p>
            <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
              <button style={{padding:'12px 24px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowCreateModal(true)}>Create Team</button>
              <button style={{padding:'12px 24px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowJoinModal(true)}>Join Team</button>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowCreateModal(false)}>
        <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'500px',width:'90%',maxHeight:'90vh',overflowY:'auto'}} onClick={(e)=>e.stopPropagation()}>
          <h2 style={{fontSize:'20px',fontWeight:'600',marginBottom:'24px'}}>➕ Create New Team</h2>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'8px'}}>Team Name *</label>
            <input type="text" value={newTeam.name} onChange={(e)=>setNewTeam({...newTeam,name:e.target.value})} style={{width:'100%',padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',outline:'none',boxSizing:'border-box'}} placeholder="Enter team name"/>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'8px'}}>Event *</label>
            <select value={newTeam.eventId} onChange={(e)=>setNewTeam({...newTeam,eventId:e.target.value})} style={{width:'100%',padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',backgroundColor:'white',boxSizing:'border-box'}}>
              <option value="">Select Event</option>
              <option value="1">Tech Fest 2024</option>
              <option value="2">Annual Sports Meet</option>
              <option value="3">Cultural Fest</option>
            </select>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'8px'}}>Max Members *</label>
            <input type="number" min="2" max="15" value={newTeam.maxMembers} onChange={(e)=>setNewTeam({...newTeam,maxMembers:e.target.value})} style={{width:'100%',padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'8px'}}>Description</label>
            <textarea value={newTeam.description} onChange={(e)=>setNewTeam({...newTeam,description:e.target.value})} rows="3" style={{width:'100%',padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',outline:'none',resize:'vertical',boxSizing:'border-box'}} placeholder="Brief description of the team"/>
          </div>
          <div style={{display:'flex',gap:'12px'}}>
            <button style={{flex:1,padding:'10px 20px',backgroundColor:'#F3F4F6',color:'#374151',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowCreateModal(false)}>Cancel</button>
            <button style={{flex:1,padding:'10px 20px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={handleCreateTeam}>Create Team</button>
          </div>
        </div>
      </div>}

      {showJoinModal && <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowJoinModal(false)}>
        <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'500px',width:'90%'}} onClick={(e)=>e.stopPropagation()}>
          <h2 style={{fontSize:'20px',fontWeight:'600',marginBottom:'16px'}}>🔗 Join Team</h2>
          <p style={{fontSize:'14px',color:'#6B7280',marginBottom:'24px'}}>Enter the team code shared by your team leader to join</p>
          <input type="text" value={joinCode} onChange={(e)=>setJoinCode(e.target.value)} placeholder="Enter team code (e.g., TF24-CW-5891)" style={{width:'100%',padding:'12px 16px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',marginBottom:'24px',outline:'none',fontFamily:'monospace',boxSizing:'border-box'}}/>
          <div style={{display:'flex',gap:'12px'}}>
            <button style={{flex:1,padding:'10px 20px',backgroundColor:'#F3F4F6',color:'#374151',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowJoinModal(false)}>Cancel</button>
            <button style={{flex:1,padding:'10px 20px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={handleJoinTeam}>Join Team</button>
          </div>
        </div>
      </div>}

      {showInviteModal && selectedTeam && <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowInviteModal(false)}>
        <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'500px',width:'90%'}} onClick={(e)=>e.stopPropagation()}>
          <h2 style={{fontSize:'20px',fontWeight:'600',marginBottom:'16px'}}>✉️ Invite Member</h2>
          <p style={{fontSize:'14px',color:'#6B7280',marginBottom:'16px'}}>Team: <strong>{selectedTeam.name}</strong></p>
          <input type="email" value={inviteEmail} onChange={(e)=>setInviteEmail(e.target.value)} placeholder="Enter student email address" style={{width:'100%',padding:'12px 16px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',marginBottom:'24px',outline:'none',boxSizing:'border-box'}}/>
          <div style={{display:'flex',gap:'12px'}}>
            <button style={{flex:1,padding:'10px 20px',backgroundColor:'#F3F4F6',color:'#374151',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowInviteModal(false)}>Cancel</button>
            <button style={{flex:1,padding:'10px 20px',backgroundColor:'#10B981',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={handleInviteMember}>Send Invite</button>
          </div>
        </div>
      </div>}

      {showMembersModal && selectedTeam && <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowMembersModal(false)}>
        <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'600px',width:'90%',maxHeight:'90vh',overflowY:'auto'}} onClick={(e)=>e.stopPropagation()}>
          <h2 style={{fontSize:'20px',fontWeight:'600',marginBottom:'16px'}}>👥 Team Members - {selectedTeam.name}</h2>
          <p style={{fontSize:'14px',color:'#6B7280',marginBottom:'24px'}}>Team Code: <strong style={{fontFamily:'monospace',color:'#4F46E5'}}>{selectedTeam.teamCode}</strong></p>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {selectedTeam.members.map(member=><div key={member.id} style={{padding:'16px',backgroundColor:'#F9FAFB',borderRadius:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:'16px',fontWeight:'600',color:'#1F2937'}}>{member.name}</div>
                <div style={{fontSize:'13px',color:'#6B7280',marginTop:'4px'}}>{member.email}</div>
                <div style={{fontSize:'13px',color:'#6B7280'}}>Roll: {member.rollNumber} • Joined: {new Date(member.joinedDate).toLocaleDateString('en-IN')}</div>
              </div>
              <span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:member.role==='leader'?'#FEF3C7':'#DBEAFE',color:member.role==='leader'?'#92400E':'#1E40AF'}}>
                {member.role==='leader'?'👑 Leader':'👤 Member'}
              </span>
            </div>)}
          </div>
          <button style={{width:'100%',marginTop:'24px',padding:'12px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowMembersModal(false)}>Close</button>
        </div>
      </div>}
    </div>
  );
};

export default MyTeams;
