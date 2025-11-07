import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Mock event details
    const mockEvent = {
      id: 1,
      name: 'Tech Fest 2024',
      type: 'technical',
      department: 'Computer Science',
      date: '2024-11-10',
      endDate: '2024-11-12',
      time: '10:00 AM',
      venue: 'Main Auditorium',
      organizer: 'Technical Club',
      organizerContact: 'techclub@jntu.ac.in',
      coordinators: [
        { name: 'Dr. Ramesh Kumar', role: 'Faculty Coordinator', contact: 'ramesh@jntu.ac.in' },
        { name: 'Amit Sharma', role: 'Student Coordinator', contact: 'amit.cs21@jntu.ac.in' }
      ],
      description: 'Annual technical festival featuring coding competitions, hackathons, tech talks, and project exhibitions.',
      fullDescription: 'Tech Fest 2024 is the premier technical event bringing together students, industry experts, and innovators. Features cutting-edge technologies including AI, Blockchain, IoT, and Cloud Computing.',
      seatsTotal: 500,
      seatsAvailable: 45,
      registrationDeadline: '2024-11-08',
      fee: 0,
      prizes: ['1st Prize: ₹50,000', '2nd Prize: ₹30,000', '3rd Prize: ₹20,000', 'Participation Certificates'],
      schedule: [
        { day: 'Day 1 - Nov 10', time: '10:00 AM', activity: 'Inauguration Ceremony', venue: 'Main Auditorium' },
        { day: 'Day 1 - Nov 10', time: '12:30 PM', activity: 'Hackathon Round 1', venue: 'CS Lab Block' },
        { day: 'Day 2 - Nov 11', time: '9:00 AM', activity: 'Project Exhibition', venue: 'Exhibition Hall' },
        { day: 'Day 3 - Nov 12', time: '10:00 AM', activity: 'Hackathon Finals', venue: 'Main Auditorium' }
      ],
      rules: [
        'Participants must carry valid college ID card',
        'Teams of 2-4 members for hackathon',
        'Individual participation for coding competitions',
        'Laptops mandatory for technical events',
        'Follow code of conduct'
      ],
      eligibility: [
        'Open to all undergraduate and postgraduate students',
        'Prior programming experience recommended',
        'Team members from same institution'
      ],
      requirements: ['Laptop with required software', 'College ID card', 'GitHub account', 'Valid email ID'],
      tags: ['coding', 'hackathon', 'AI'],
      status: 'open'
    };
    setEvent(mockEvent);
  }, [eventId]);

  const showToast = (msg, type = 'success') => { setToast({ show: true, message: msg, type }); setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000); };
  const handleLogout = () => { sessionStorage.clear(); localStorage.removeItem('token'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail'); navigate('/login'); };
  const getTypeColor = (type) => ({ technical: { bg: '#DBEAFE', color: '#1E40AF', icon: '💻' }, sports: { bg: '#FEF3C7', color: '#92400E', icon: '⚽' }, cultural: { bg: '#FCE7F3', color: '#9F1239', icon: '🎭' } }[type] || { bg: '#F3F4F6', color: '#374151', icon: '📅' });

  if (!event) return <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{textAlign:'center'}}><div style={{fontSize:'48px'}}>📅</div><h2>Event not found</h2></div></div>;

  const typeColors = getTypeColor(event.type);

  return <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB',fontFamily:'system-ui'}}>
    {toast.show && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:toast.type==='error'?'#EF4444':'#10B981',color:'white',padding:'16px 24px',borderRadius:'8px',boxShadow:'0 4px 6px rgba(0,0,0,0.1)',zIndex:2000}}>{toast.message}</div>}
    
    <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'20px 40px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
        <div style={{fontSize:'24px',fontWeight:'bold',background:'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>UniFlow</div>
        <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',margin:0}}>Event Details</h1>
      </div>
      <button style={{padding:'10px 20px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',cursor:'pointer'}} onClick={handleLogout}>Logout</button>
    </div>

    <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'0 40px',display:'flex',gap:'4px',overflowX:'auto'}}>
      <button onClick={()=>navigate('/student/dashboard')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🏠 Dashboard</button>
      <button onClick={()=>navigate('/student/browse-events')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid #4F46E5',fontSize:'13px',fontWeight:'600',color:'#4F46E5',cursor:'pointer',backgroundColor:'transparent'}}>🔍 Browse Events</button>
      <button onClick={()=>navigate('/student/my-registrations')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>📋 My Registrations</button>
      <button onClick={()=>navigate('/student/my-teams')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>👥 My Teams</button>
      <button onClick={()=>navigate('/student/attendance')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>📊 Attendance</button>
      <button onClick={()=>navigate('/student/certificates')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🎓 Certificates</button>
      <button onClick={()=>navigate('/student/notifications')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🔔 Notifications</button>
      <button onClick={()=>navigate('/student/student-body')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🎯 Student Body</button>
      <button onClick={()=>navigate('/student/placement-profile')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>💼 Placement</button>
      <button onClick={()=>navigate('/student/profile')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>👤 My Profile</button>
    </div>

    <div style={{padding:'40px',maxWidth:'1200px',margin:'0 auto'}}>
      <button style={{padding:'10px 16px',backgroundColor:'white',color:'#6B7280',border:'2px solid #E5E7EB',borderRadius:'8px',marginBottom:'24px',cursor:'pointer'}} onClick={()=>navigate('/student/browse-events')}>← Back to Events</button>

      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
          <span style={{fontSize:'36px'}}>{typeColors.icon}</span>
          <h1 style={{fontSize:'32px',fontWeight:'bold',color:'#1F2937',margin:0}}>{event.name}</h1>
          <span style={{padding:'6px 16px',borderRadius:'12px',fontSize:'14px',fontWeight:'600',backgroundColor:typeColors.bg,color:typeColors.color}}>{event.type.toUpperCase()}</span>
        </div>
        <p style={{fontSize:'16px',color:'#6B7280',lineHeight:'1.6',marginBottom:'24px'}}>{event.description}</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))',gap:'16px',marginBottom:'24px'}}>
          {[{icon:'📅',label:'Date',value:`${new Date(event.date).toLocaleDateString('en-IN')} - ${new Date(event.endDate).toLocaleDateString('en-IN')}`},{icon:'⏰',label:'Time',value:event.time},{icon:'📍',label:'Venue',value:event.venue},{icon:'🏢',label:'Department',value:event.department},{icon:'👥',label:'Organizer',value:event.organizer},{icon:'💰',label:'Fee',value:event.fee===0?'Free':`₹${event.fee}`},{icon:'🎫',label:'Seats',value:`${event.seatsAvailable}/${event.seatsTotal}`},{icon:'⏳',label:'Deadline',value:new Date(event.registrationDeadline).toLocaleDateString('en-IN')}].map((m,i)=><div key={i} style={{padding:'12px',backgroundColor:'#F9FAFB',borderRadius:'8px',display:'flex',gap:'12px'}}><span style={{fontSize:'20px'}}>{m.icon}</span><div><div style={{fontSize:'12px',color:'#6B7280'}}>{m.label}</div><div style={{fontSize:'14px',fontWeight:'600',color:'#1F2937'}}>{m.value}</div></div></div>)}
        </div>

        <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
          <button style={{flex:1,minWidth:'200px',padding:'14px 24px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontSize:'16px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowRegisterModal(true)}>🎫 Register Now</button>
          <button style={{padding:'14px 24px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',cursor:'pointer'}}>📅 Add to Calendar</button>
          <button style={{padding:'14px 24px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',cursor:'pointer'}}>📤 Share</button>
        </div>
      </div>

      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
        <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>📝 About This Event</h2>
        <p style={{fontSize:'15px',color:'#4B5563',lineHeight:'1.8'}}>{event.fullDescription}</p>
      </div>

      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
        <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>📅 Event Schedule</h2>
        {event.schedule.map((s,i)=><div key={i} style={{padding:'16px',backgroundColor:'#F9FAFB',borderRadius:'8px',marginBottom:'12px',borderLeft:'4px solid #4F46E5'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}><span style={{fontSize:'14px',fontWeight:'600',color:'#4F46E5'}}>{s.day}</span><span style={{fontSize:'14px',fontWeight:'600',color:'#6B7280'}}>{s.time}</span></div><div style={{fontSize:'15px',fontWeight:'600',color:'#1F2937',marginBottom:'4px'}}>{s.activity}</div><div style={{fontSize:'14px',color:'#6B7280'}}>📍 {s.venue}</div></div>)}
      </div>

      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
        <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>📋 Rules & Regulations</h2>
        <ul style={{listStyle:'none',padding:0}}>
          {event.rules.map((r,i)=><li key={i} style={{padding:'12px 16px',backgroundColor:'#F9FAFB',borderRadius:'8px',marginBottom:'8px',display:'flex',gap:'12px'}}><span>✓</span><span style={{fontSize:'14px',color:'#4B5563'}}>{r}</span></li>)}
        </ul>
      </div>

      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
        <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>✅ Eligibility Criteria</h2>
        <ul style={{listStyle:'none',padding:0}}>
          {event.eligibility.map((e,i)=><li key={i} style={{padding:'12px 16px',backgroundColor:'#F9FAFB',borderRadius:'8px',marginBottom:'8px',display:'flex',gap:'12px'}}><span>👤</span><span style={{fontSize:'14px',color:'#4B5563'}}>{e}</span></li>)}
        </ul>
      </div>

      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
        <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>🎁 Prizes & Benefits</h2>
        <ul style={{listStyle:'none',padding:0}}>
          {event.prizes.map((p,i)=><li key={i} style={{padding:'12px 16px',backgroundColor:'#F9FAFB',borderRadius:'8px',marginBottom:'8px',display:'flex',gap:'12px'}}><span>🏆</span><span style={{fontSize:'14px',color:'#4B5563',fontWeight:'600'}}>{p}</span></li>)}
        </ul>
      </div>

      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
        <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>👨‍🏫 Event Coordinators</h2>
        {event.coordinators.map((c,i)=><div key={i} style={{padding:'16px',backgroundColor:'#F9FAFB',borderRadius:'8px',marginBottom:'12px'}}><div style={{fontSize:'16px',fontWeight:'600',color:'#1F2937',marginBottom:'4px'}}>{c.name}</div><div style={{fontSize:'14px',color:'#6B7280',marginBottom:'4px'}}>{c.role}</div><div style={{fontSize:'14px',color:'#4F46E5'}}>📧 {c.contact}</div></div>)}
      </div>
    </div>

    {showRegisterModal && <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowRegisterModal(false)}>
      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'500px',width:'90%'}} onClick={(e)=>e.stopPropagation()}>
        <h2 style={{fontSize:'20px',fontWeight:'600',marginBottom:'16px'}}>🎫 Confirm Registration</h2>
        <p style={{marginBottom:'16px'}}>Register for <strong>{event.name}</strong>?</p>
        <div style={{padding:'16px',backgroundColor:'#F9FAFB',borderRadius:'8px',marginBottom:'24px'}}>
          <div style={{marginBottom:'8px'}}><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-IN')}</div>
          <div style={{marginBottom:'8px'}}><strong>Venue:</strong> {event.venue}</div>
          <div><strong>Fee:</strong> {event.fee===0?'Free':`₹${event.fee}`}</div>
        </div>
        <div style={{display:'flex',gap:'12px'}}>
          <button style={{padding:'10px 20px',backgroundColor:'#F3F4F6',color:'#374151',border:'none',borderRadius:'8px',cursor:'pointer'}} onClick={()=>setShowRegisterModal(false)}>Cancel</button>
          <button style={{padding:'10px 20px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',cursor:'pointer'}} onClick={()=>{showToast('Successfully registered!');setShowRegisterModal(false);navigate('/student/my-registrations');}}>Confirm</button>
        </div>
      </div>
    </div>}
  </div>;
};

export default EventDetails;
