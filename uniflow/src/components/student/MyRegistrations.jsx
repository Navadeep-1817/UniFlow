import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyRegistrations = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // TODO: Fetch registrations from API
    // fetchRegistrations();
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

  const getEventTypeColor = (type) => {
    const colors = {
      technical: { bg: '#DBEAFE', color: '#1E40AF', icon: '💻' },
      sports: { bg: '#FEF3C7', color: '#92400E', icon: '⚽' },
      cultural: { bg: '#FCE7F3', color: '#9F1239', icon: '🎭' },
      workshop: { bg: '#E0E7FF', color: '#3730A3', icon: '📚' },
      social: { bg: '#FED7AA', color: '#9A3412', icon: '🤝' }
    };
    return colors[type] || { bg: '#F3F4F6', color: '#374151', icon: '📅' };
  };

  const getStatusColor = (status) => {
    return status === 'confirmed' 
      ? { bg: '#D1FAE5', color: '#065F46' }
      : { bg: '#FEE2E2', color: '#991B1B' };
  };

  const filteredRegistrations = registrations.filter(reg => {
    if (filter === 'all') return true;
    return reg.type === filter;
  });

  const handleCancelRegistration = (event) => {
    setSelectedEvent(event);
    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    setRegistrations(registrations.map(reg => 
      reg.id === selectedEvent.id 
        ? { ...reg, status: 'cancelled', cancellationDate: new Date().toISOString().split('T')[0], cancellationReason: 'Cancelled by user' }
        : reg
    ));
    showToast('Registration cancelled successfully');
    setShowCancelModal(false);
    setSelectedEvent(null);
  };

  const handleDownloadCertificate = (eventName) => {
    showToast(`🎓 Downloading certificate for ${eventName}...`, 'success');
    console.log('Downloading certificate for:', eventName);
  };

  const stats = {
    total: registrations.filter(r => r.status === 'confirmed').length,
    upcoming: registrations.filter(r => r.status === 'confirmed' && new Date(r.date) > new Date()).length,
    completed: registrations.filter(r => r.status === 'confirmed' && new Date(r.date) < new Date()).length,
    cancelled: registrations.filter(r => r.status === 'cancelled').length
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB',fontFamily:'system-ui'}}>
      {toast.show && (
        <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:toast.type==='error'?'#EF4444':'#10B981',color:'white',padding:'16px 24px',borderRadius:'8px',boxShadow:'0 4px 6px rgba(0,0,0,0.1)',zIndex:2000,fontSize:'14px',fontWeight:'600'}}>
          {toast.message}
        </div>
      )}

      <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'20px 40px',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          <div style={{fontSize:'24px',fontWeight:'bold',background:'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>UniFlow</div>
          <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',margin:0}}>My Registrations</h1>
        </div>
        <button style={{padding:'10px 20px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}} onClick={handleLogout}>Logout</button>
      </div>

      <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'0 40px',display:'flex',gap:'4px',overflowX:'auto'}}>
        <button onClick={()=>navigate('/student/dashboard')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>🏠 Dashboard</button>
        <button onClick={()=>navigate('/student/browse-events')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>🔍 Browse Events</button>
        <button onClick={()=>navigate('/student/my-registrations')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid #4F46E5',fontSize:'13px',fontWeight:'600',color:'#4F46E5',cursor:'pointer',backgroundColor:'transparent'}}>📋 My Registrations</button>
        <button onClick={()=>navigate('/student/my-teams')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>👥 My Teams</button>
        <button onClick={()=>navigate('/student/attendance')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>📊 Attendance</button>
        <button onClick={()=>navigate('/student/certificates')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>🎓 Certificates</button>
        <button onClick={()=>navigate('/student/notifications')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>🔔 Notifications</button>
        <button onClick={()=>navigate('/student/placement-profile')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>💼 Placement</button>
        <button onClick={()=>navigate('/student/profile')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>👤 My Profile</button>
      </div>

      <div style={{padding:'40px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'20px',marginBottom:'32px'}}>
          {[{label:'Total Registrations',value:stats.total,icon:'📋',color:'#4F46E5'},{label:'Upcoming Events',value:stats.upcoming,icon:'📅',color:'#10B981'},{label:'Completed Events',value:stats.completed,icon:'✅',color:'#6B7280'},{label:'Cancelled',value:stats.cancelled,icon:'❌',color:'#EF4444'}].map((stat,i)=><div key={i} style={{backgroundColor:'white',borderRadius:'12px',padding:'20px',border:'1px solid #E5E7EB'}}><div style={{fontSize:'32px',marginBottom:'8px'}}>{stat.icon}</div><h2 style={{fontSize:'28px',fontWeight:'bold',color:stat.color,margin:'8px 0'}}>{stat.value}</h2><p style={{fontSize:'13px',color:'#6B7280',margin:0}}>{stat.label}</p></div>)}
        </div>

        <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
          <h3 style={{fontSize:'16px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>🔍 Filter by Category</h3>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {[{label:'All Events',value:'all'},{label:'💻 Technical',value:'technical'},{label:'⚽ Sports',value:'sports'},{label:'🎭 Cultural',value:'cultural'},{label:'📚 Workshop',value:'workshop'},{label:'🤝 Social',value:'social'}].map((f,i)=><button key={i} onClick={()=>setFilter(f.value)} style={{padding:'10px 20px',backgroundColor:filter===f.value?'#4F46E5':'white',color:filter===f.value?'white':'#6B7280',border:'2px solid '+(filter===f.value?'#4F46E5':'#E5E7EB'),borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer',transition:'all 0.3s'}}>{f.label}</button>)}
          </div>
        </div>

        {filteredRegistrations.length > 0 ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(400px, 1fr))',gap:'24px'}}>
            {filteredRegistrations.map(reg => {
              const typeColors = getEventTypeColor(reg.type);
              const statusColors = getStatusColor(reg.status);
              const isPast = new Date(reg.date) < new Date();
              
              return (
                <div key={reg.id} style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',border:'1px solid #E5E7EB',boxShadow:'0 1px 3px rgba(0,0,0,0.05)',transition:'all 0.3s'}} onMouseOver={(e)=>e.currentTarget.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'} onMouseOut={(e)=>e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.05)'}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                    <h4 style={{fontSize:'18px',fontWeight:'600',color:'#1F2937',margin:0,display:'flex',alignItems:'center',gap:'8px'}}>
                      <span>{typeColors.icon}</span>
                      {reg.eventName}
                    </h4>
                    <span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:statusColors.bg,color:statusColors.color}}>
                      {reg.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'16px'}}>
                    <div style={{fontSize:'14px',color:'#6B7280',display:'flex',alignItems:'center',gap:'8px'}}>
                      <span>📅</span>
                      <span>{new Date(reg.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>
                      <span>⏰</span>
                      <span>{reg.time}</span>
                    </div>
                    <div style={{fontSize:'14px',color:'#6B7280',display:'flex',alignItems:'center',gap:'8px'}}>
                      <span>📍</span>
                      <span>{reg.venue}</span>
                    </div>
                    <div style={{fontSize:'14px',color:'#6B7280',display:'flex',alignItems:'center',gap:'8px'}}>
                      <span>👥</span>
                      <span>{reg.organizer}</span>
                    </div>
                    <div style={{fontSize:'14px',color:'#6B7280',display:'flex',alignItems:'center',gap:'8px'}}>
                      <span>🎫</span>
                      <span>Registration ID: {reg.registrationId}</span>
                    </div>
                    {reg.attendanceMarked && (
                      <div style={{fontSize:'14px',fontWeight:'600',color:'#10B981',display:'flex',alignItems:'center',gap:'8px'}}>
                        <span>📊</span>
                        <span>Attendance: {reg.attendancePercentage}%</span>
                      </div>
                    )}
                    {reg.certificateAvailable && (
                      <div style={{fontSize:'14px',fontWeight:'600',color:'#4F46E5',display:'flex',alignItems:'center',gap:'8px'}}>
                        <span>🎓</span>
                        <span>Certificate Available</span>
                      </div>
                    )}
                  </div>

                  <div style={{padding:'12px',backgroundColor:'#F9FAFB',borderRadius:'8px',marginBottom:'16px'}}>
                    <div style={{fontSize:'12px',color:'#6B7280',marginBottom:'4px'}}>Registered on</div>
                    <div style={{fontSize:'14px',fontWeight:'600',color:'#1F2937'}}>
                      {new Date(reg.registrationDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                    </div>
                  </div>

                  {reg.status === 'cancelled' && reg.cancellationReason && (
                    <div style={{padding:'12px',backgroundColor:'#FEE2E2',borderRadius:'8px',marginBottom:'16px'}}>
                      <div style={{fontSize:'12px',color:'#991B1B',marginBottom:'4px'}}>Cancellation Reason</div>
                      <div style={{fontSize:'14px',fontWeight:'600',color:'#991B1B'}}>{reg.cancellationReason}</div>
                    </div>
                  )}

                  <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                    {reg.certificateAvailable && (
                      <button style={{flex:1,padding:'10px 16px',backgroundColor:'#10B981',color:'white',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}} onClick={()=>handleDownloadCertificate(reg.eventName)}>🎓 Download Certificate</button>
                    )}
                    {reg.status === 'confirmed' && !isPast && (
                      <button style={{flex:1,padding:'10px 16px',backgroundColor:'#FEE2E2',color:'#991B1B',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}} onClick={()=>handleCancelRegistration(reg)}>❌ Cancel</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'60px 20px',backgroundColor:'white',borderRadius:'12px',border:'1px solid #E5E7EB'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>📋</div>
            <h3 style={{fontSize:'18px',color:'#6B7280'}}>No registrations found</h3>
            <p style={{color:'#9CA3AF',marginBottom:'24px'}}>You haven't registered for any {filter !== 'all' ? filter : ''} events yet</p>
            <button style={{padding:'12px 24px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}} onClick={()=>navigate('/student/browse-events')}>Browse Events</button>
          </div>
        )}
      </div>

      {showCancelModal && selectedEvent && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowCancelModal(false)}>
          <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'500px',width:'90%'}} onClick={(e)=>e.stopPropagation()}>
            <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>❌ Cancel Registration</h2>
            <p style={{color:'#6B7280',marginBottom:'16px'}}>Are you sure you want to cancel your registration for <strong>{selectedEvent.eventName}</strong>?</p>
            <div style={{padding:'16px',backgroundColor:'#FEF3C7',borderRadius:'8px',marginBottom:'24px',border:'1px solid #FDE68A'}}>
              <p style={{fontSize:'14px',color:'#92400E',margin:0}}>⚠️ This action cannot be undone. You may need to re-register if you change your mind.</p>
            </div>
            <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}>
              <button style={{padding:'10px 20px',backgroundColor:'#F3F4F6',color:'#374151',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowCancelModal(false)}>Keep Registration</button>
              <button style={{padding:'10px 20px',backgroundColor:'#EF4444',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={confirmCancellation}>Cancel Registration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
