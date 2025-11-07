import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BrowseEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ type: 'all', department: 'all', dateFrom: '', dateTo: '' });
  const [viewMode, setViewMode] = useState('grid');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const mockEvents = [
      { id: 1, name: 'Tech Fest 2024', type: 'technical', department: 'Computer Science', date: '2024-11-10', time: '10:00 AM', venue: 'Main Auditorium', organizer: 'Technical Club', description: 'Annual technical festival with coding competitions, hackathons, and tech talks', seatsTotal: 500, seatsAvailable: 45, registrationDeadline: '2024-11-08', fee: 0, status: 'open', tags: ['coding', 'hackathon', 'competition'] },
      { id: 2, name: 'Workshop on AI/ML', type: 'workshop', department: 'Computer Science', date: '2024-11-07', time: '2:00 PM', venue: 'CS Lab Block', organizer: 'Tech Club', description: 'Hands-on workshop on Artificial Intelligence and Machine Learning basics', seatsTotal: 50, seatsAvailable: 12, registrationDeadline: '2024-11-06', fee: 100, status: 'open', tags: ['AI', 'ML', 'workshop'] },
      { id: 3, name: 'Annual Sports Meet', type: 'sports', department: 'Sports', date: '2024-11-08', time: '9:00 AM', venue: 'Sports Complex', organizer: 'Sports Committee', description: 'Inter-departmental sports competition including cricket, football, and athletics', seatsTotal: 300, seatsAvailable: 28, registrationDeadline: '2024-11-07', fee: 50, status: 'open', tags: ['sports', 'competition', 'athletics'] },
      { id: 4, name: 'Cultural Night', type: 'cultural', department: 'Student Affairs', date: '2024-11-15', time: '6:00 PM', venue: 'Open Air Theater', organizer: 'Cultural Committee', description: 'Evening of music, dance, and drama performances by students', seatsTotal: 1000, seatsAvailable: 250, registrationDeadline: '2024-11-13', fee: 0, status: 'open', tags: ['cultural', 'music', 'dance'] },
      { id: 5, name: 'Entrepreneurship Summit', type: 'seminar', department: 'MBA', date: '2024-11-20', time: '10:00 AM', venue: 'Convention Center', organizer: 'E-Cell', description: 'Summit featuring startup founders, investors, and industry experts', seatsTotal: 400, seatsAvailable: 85, registrationDeadline: '2024-11-18', fee: 200, status: 'open', tags: ['business', 'startup', 'seminar'] },
      { id: 6, name: 'Blood Donation Camp', type: 'social', department: 'Student Affairs', date: '2024-11-12', time: '9:00 AM', venue: 'Medical Center', organizer: 'NSS', description: 'Blood donation drive in collaboration with Red Cross', seatsTotal: 200, seatsAvailable: 45, registrationDeadline: '2024-11-11', fee: 0, status: 'open', tags: ['social service', 'health', 'donation'] },
      { id: 7, name: 'Web Development Bootcamp', type: 'workshop', department: 'Computer Science', date: '2024-11-25', time: '10:00 AM', venue: 'IT Lab', organizer: 'Tech Club', description: 'Intensive 3-day bootcamp on modern web development technologies', seatsTotal: 30, seatsAvailable: 5, registrationDeadline: '2024-11-22', fee: 500, status: 'open', tags: ['web dev', 'coding', 'workshop'] },
      { id: 8, name: 'Placement Drive - TCS', type: 'placement', department: 'Training & Placement', date: '2024-11-16', time: '8:00 AM', venue: 'Seminar Hall', organizer: 'T&P Cell', description: 'Campus recruitment drive by Tata Consultancy Services', seatsTotal: 250, seatsAvailable: 68, registrationDeadline: '2024-11-14', fee: 0, status: 'open', tags: ['placement', 'job', 'TCS'] }
    ];
    setEvents(mockEvents);
  }, []);

  const showToast = (message, type = 'success') => { setToast({ show: true, message, type }); setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000); };
  const handleLogout = () => { sessionStorage.clear(); localStorage.removeItem('token'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail'); navigate('/login'); };
  const getEventTypeColor = (type) => ({ technical: { bg: '#DBEAFE', color: '#1E40AF', icon: '💻' }, sports: { bg: '#FEF3C7', color: '#92400E', icon: '⚽' }, cultural: { bg: '#FCE7F3', color: '#9F1239', icon: '🎭' }, placement: { bg: '#D1FAE5', color: '#065F46', icon: '💼' }, workshop: { bg: '#E0E7FF', color: '#3730A3', icon: '📚' }, social: { bg: '#FED7AA', color: '#9A3412', icon: '🤝' }, seminar: { bg: '#F3E8FF', color: '#6B21A8', icon: '🎤' } }[type] || { bg: '#F3F4F6', color: '#374151', icon: '📅' });

  const filteredEvents = events.filter(event => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = event.name.toLowerCase().includes(searchLower) || event.description.toLowerCase().includes(searchLower) || event.organizer.toLowerCase().includes(searchLower) || event.tags.some(tag => tag.toLowerCase().includes(searchLower));
    if (!matchesSearch) return false;
    if (filters.type !== 'all' && event.type !== filters.type) return false;
    if (filters.department !== 'all' && event.department !== filters.department) return false;
    if (filters.dateFrom && event.date < filters.dateFrom) return false;
    if (filters.dateTo && event.date > filters.dateTo) return false;
    return true;
  });

  const handleRegisterClick = (event) => { setSelectedEvent(event); setShowRegisterModal(true); };
  const handleRegisterConfirm = () => { showToast(`Successfully registered for ${selectedEvent.name}!`); setShowRegisterModal(false); setSelectedEvent(null); setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, seatsAvailable: e.seatsAvailable - 1 } : e)); };
  const clearFilters = () => { setFilters({ type: 'all', department: 'all', dateFrom: '', dateTo: '' }); setSearchQuery(''); };

  const stats = { total: filteredEvents.length, freeEvents: filteredEvents.filter(e => e.fee === 0).length, closingSoon: filteredEvents.filter(e => { const deadline = new Date(e.registrationDeadline); const today = new Date(); const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)); return diffDays <= 2 && diffDays >= 0; }).length };

  return <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB',fontFamily:'system-ui'}}>
    {toast.show && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:toast.type==='error'?'#EF4444':'#10B981',color:'white',padding:'16px 24px',borderRadius:'8px',boxShadow:'0 4px 6px rgba(0,0,0,0.1)',zIndex:2000,fontSize:'14px',fontWeight:'600'}}>{toast.message}</div>}
    
    <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'20px 40px',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
      <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
        <div style={{fontSize:'24px',fontWeight:'bold',background:'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>UniFlow</div>
        <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',margin:0}}>Browse Events</h1>
      </div>
      <button style={{padding:'10px 20px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}} onClick={handleLogout}>Logout</button>
    </div>

    <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'0 40px',display:'flex',gap:'4px',overflowX:'auto',whiteSpace:'nowrap'}}>
      <button onClick={()=>navigate('/student/dashboard')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>🏠 Dashboard</button>
      <button onClick={()=>navigate('/student/browse-events')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid #4F46E5',fontSize:'13px',fontWeight:'600',color:'#4F46E5',cursor:'pointer',whiteSpace:'nowrap'}}>🔍 Browse Events</button>
      <button onClick={()=>navigate('/student/my-registrations')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>📋 My Registrations</button>
      <button onClick={()=>navigate('/student/my-teams')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>👥 My Teams</button>
      <button onClick={()=>navigate('/student/attendance')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>📊 Attendance</button>
      <button onClick={()=>navigate('/student/certificates')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>🎓 Certificates</button>
      <button onClick={()=>navigate('/student/notifications')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>🔔 Notifications</button>
      <button onClick={()=>navigate('/student/student-body')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>🎯 Student Body</button>
      <button onClick={()=>navigate('/student/placement-profile')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>💼 Placement</button>
      <button onClick={()=>navigate('/student/profile')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.color='#4F46E5';e.target.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.target.style.color='#6B7280';e.target.style.borderBottomColor='transparent';}}>👤 My Profile</button>
    </div>

    <div style={{padding:'40px'}}>
      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'20px 30px',marginBottom:'24px',border:'1px solid #E5E7EB',display:'flex',justifyContent:'space-around',gap:'20px'}}>
        {[{label:'Available Events',value:stats.total},{label:'Free Events',value:stats.freeEvents},{label:'Closing Soon',value:stats.closingSoon}].map((stat,i)=><div key={i} style={{textAlign:'center'}}><div style={{fontSize:'28px',fontWeight:'bold',color:'#4F46E5'}}>{stat.value}</div><div style={{fontSize:'13px',color:'#6B7280',marginTop:'4px'}}>{stat.label}</div></div>)}
      </div>

      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
        <h3 style={{fontSize:'16px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>🔍 Search & Filter Events</h3>
        <input type="text" placeholder="Search by event name, description, organizer, or tags..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} style={{width:'100%',padding:'12px 16px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',marginBottom:'20px',outline:'none'}}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'16px',marginBottom:'16px'}}>
          {[{label:'Event Type',options:['All Types','💻 Technical','⚽ Sports','🎭 Cultural','💼 Placement','📚 Workshop','🤝 Social','🎤 Seminar'],values:['all','technical','sports','cultural','placement','workshop','social','seminar'],key:'type'},{label:'Department',options:['All Departments','Computer Science','Electronics','Mechanical','Sports','Student Affairs','Training & Placement','MBA'],values:['all','Computer Science','Electronics','Mechanical','Sports','Student Affairs','Training & Placement','MBA'],key:'department'},{label:'From Date',type:'date',key:'dateFrom'},{label:'To Date',type:'date',key:'dateTo'}].map((f,i)=><div key={i} style={{display:'flex',flexDirection:'column',gap:'8px'}}><label style={{fontSize:'13px',fontWeight:'600',color:'#374151'}}>{f.label}</label>{f.type==='date'?<input type="date" style={{padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',outline:'none'}} value={filters[f.key]} onChange={(e)=>setFilters({...filters,[f.key]:e.target.value})}/>:<select style={{padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',backgroundColor:'white',cursor:'pointer',outline:'none'}} value={filters[f.key]} onChange={(e)=>setFilters({...filters,[f.key]:e.target.value})}>{f.options.map((opt,j)=><option key={j} value={f.values[j]}>{opt}</option>)}</select>}</div>)}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}>
          <button style={{padding:'10px 20px',backgroundColor:'white',border:'2px solid #E5E7EB',color:'#6B7280',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}} onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      <div style={{display:'flex',gap:'8px',marginBottom:'24px'}}>
        <button style={{padding:'8px 16px',fontSize:'14px',fontWeight:'600',borderRadius:'8px',border:'2px solid #E5E7EB',backgroundColor:viewMode==='grid'?'#4F46E5':'white',color:viewMode==='grid'?'white':'#6B7280',cursor:'pointer'}} onClick={()=>setViewMode('grid')}>⊞ Grid View</button>
        <button style={{padding:'8px 16px',fontSize:'14px',fontWeight:'600',borderRadius:'8px',border:'2px solid #E5E7EB',backgroundColor:viewMode==='list'?'#4F46E5':'white',color:viewMode==='list'?'white':'#6B7280',cursor:'pointer'}} onClick={()=>setViewMode('list')}>☰ List View</button>
      </div>

      {filteredEvents.length > 0 ? <div style={{display:'grid',gridTemplateColumns:viewMode==='grid'?'repeat(auto-fill, minmax(350px, 1fr))':'1fr',gap:'24px'}}>
        {filteredEvents.map(event => {
          const typeColors = getEventTypeColor(event.type);
          const seatsPercentage = ((event.seatsTotal - event.seatsAvailable) / event.seatsTotal) * 100;
          const isClosingSoon = new Date(event.registrationDeadline) - new Date() < 2 * 24 * 60 * 60 * 1000;
          
          return <div key={event.id} style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',border:'1px solid #E5E7EB',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
              <h4 style={{fontSize:'18px',fontWeight:'600',color:'#1F2937',margin:0}}>{typeColors.icon} {event.name}</h4>
              <span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:typeColors.bg,color:typeColors.color}}>{event.type.toUpperCase()}</span>
            </div>
            <p style={{fontSize:'14px',color:'#6B7280',marginBottom:'16px',lineHeight:'1.6'}}>{event.description}</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'12px',fontSize:'13px',color:'#6B7280',marginBottom:'16px'}}>
              <span>📅 {new Date(event.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>
              <span>⏰ {event.time}</span>
              <span>📍 {event.venue}</span>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'12px',fontSize:'13px',color:'#6B7280',marginBottom:'16px'}}>
              <span>🏢 {event.department}</span>
              <span>👥 {event.organizer}</span>
              <span>💰 {event.fee===0?'Free':`₹${event.fee}`}</span>
            </div>
            {isClosingSoon && <div style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:'#FEE2E2',color:'#991B1B',marginBottom:'12px',display:'inline-block'}}>⏰ Closes: {new Date(event.registrationDeadline).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</div>}
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px',padding:'12px',backgroundColor:'#F9FAFB',borderRadius:'8px'}}>
              <span style={{fontSize:'13px',fontWeight:'600',minWidth:'100px'}}>{event.seatsAvailable}/{event.seatsTotal} seats left</span>
              <div style={{flex:1,height:'8px',backgroundColor:'#E5E7EB',borderRadius:'4px',overflow:'hidden'}}><div style={{height:'100%',backgroundColor:'#4F46E5',width:`${seatsPercentage}%`}}></div></div>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'16px'}}>
              {event.tags.map((tag,i)=><span key={i} style={{padding:'4px 10px',backgroundColor:'#F3F4F6',color:'#6B7280',borderRadius:'12px',fontSize:'12px'}}>#{tag}</span>)}
            </div>
            <div style={{display:'flex',gap:'8px'}}>
              <button style={{flex:1,padding:'12px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}} onClick={()=>navigate(`/student/event/${event.id}`)}>📄 View Details</button>
              <button style={{flex:1,padding:'12px',backgroundColor:event.seatsAvailable===0?'#9CA3AF':'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:event.seatsAvailable===0?'not-allowed':'pointer'}} onClick={()=>handleRegisterClick(event)} disabled={event.seatsAvailable===0}>{event.seatsAvailable===0?'🔒 Fully Booked':'🎫 Register Now'}</button>
            </div>
          </div>;
        })}
      </div> : <div style={{textAlign:'center',padding:'60px 20px',backgroundColor:'white',borderRadius:'12px',border:'1px solid #E5E7EB'}}><div style={{fontSize:'48px',marginBottom:'16px'}}>🔍</div><h3 style={{fontSize:'18px',color:'#6B7280'}}>No events found</h3><p style={{color:'#9CA3AF'}}>Try adjusting your search or filters</p></div>}
    </div>

    {showRegisterModal && selectedEvent && <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowRegisterModal(false)}>
      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'500px',width:'90%'}} onClick={(e)=>e.stopPropagation()}>
        <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>🎫 Confirm Registration</h2>
        <p style={{color:'#6B7280',marginBottom:'8px'}}>Are you sure you want to register for:</p>
        <p style={{fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>{selectedEvent.name}</p>
        <div style={{padding:'16px',backgroundColor:'#F9FAFB',borderRadius:'8px',marginBottom:'24px'}}>
          <div style={{marginBottom:'8px'}}><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString('en-IN')}</div>
          <div style={{marginBottom:'8px'}}><strong>Time:</strong> {selectedEvent.time}</div>
          <div style={{marginBottom:'8px'}}><strong>Venue:</strong> {selectedEvent.venue}</div>
          <div><strong>Fee:</strong> {selectedEvent.fee===0?'Free':`₹${selectedEvent.fee}`}</div>
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}>
          <button style={{padding:'10px 20px',backgroundColor:'#F3F4F6',color:'#374151',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowRegisterModal(false)}>Cancel</button>
          <button style={{padding:'10px 20px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={handleRegisterConfirm}>Confirm Registration</button>
        </div>
      </div>
    </div>}
  </div>;
};

export default BrowseEvents;
