import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, FiClock, FiMapPin, FiUsers, FiSearch, FiFilter, FiX,
  FiGrid, FiList, FiBookOpen, FiHome, FiClipboard, FiUser,
  FiAward, FiBarChart, FiBell, FiBriefcase, FiLogOut, FiCheck,
  FiCode, FiMusic, FiTrendingUp, FiBook, FiTarget, FiGlobe
} from 'react-icons/fi';
import axios from 'axios';

const BrowseEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ type: 'all', category: 'all', status: 'all' });
  const [viewMode, setViewMode] = useState('grid');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, events]);

  const fetchEvents = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/students/browse-events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Fetched events:', response.data);
      const eventsData = response.data.data || [];
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.response?.data?.message || 'Failed to fetch events');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = events;

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title?.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.subType?.toLowerCase().includes(searchLower)
      );
    }

    // Type filter (Academic/NonAcademic)
    if (filters.type !== 'all') {
      filtered = filtered.filter(event => event.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    setFilteredEvents(filtered);
  };

  const showToast = (message, type = 'success') => { 
    setToast({ show: true, message, type }); 
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000); 
  };
  
  const handleLogout = () => { 
    sessionStorage.clear(); 
    localStorage.clear();
    navigate('/login'); 
  };
  
  const getEventTypeIcon = (subType) => {
    const icons = {
      FDP: FiBook,
      SDP: FiTrendingUp,
      CRT: FiBriefcase,
      Workshop: FiCode,
      Seminar: FiTarget,
      Conference: FiGlobe,
      Webinar: FiGlobe,
      Sports: FiTarget,
      Cultural: FiMusic,
      Technical: FiCode,
      Social: FiUsers,
      Other: FiCalendar
    };
    return icons[subType] || FiCalendar;
  };

  const getEventTypeColor = (subType) => {
    const colors = {
      FDP: { bg: '#E0E7FF', color: '#3730A3' },
      SDP: { bg: '#FCE7F3', color: '#9F1239' },
      CRT: { bg: '#DBEAFE', color: '#1E40AF' },
      Workshop: { bg: '#D1FAE5', color: '#065F46' },
      Seminar: { bg: '#FED7AA', color: '#9A3412' },
      Conference: { bg: '#FEF3C7', color: '#92400E' },
      Webinar: { bg: '#E0E7FF', color: '#4338CA' },
      Sports: { bg: '#FEF3C7', color: '#92400E' },
      Cultural: { bg: '#FCE7F3', color: '#9F1239' },
      Technical: { bg: '#DBEAFE', color: '#1E40AF' },
      Social: { bg: '#FED7AA', color: '#9A3412' },
      Other: { bg: '#F3F4F6', color: '#374151' }
    };
    return colors[subType] || colors.Other;
  };

  const getStatusColor = (status) => {
    const colors = {
      Approved: { bg: '#D1FAE5', color: '#065F46' },
      Upcoming: { bg: '#DBEAFE', color: '#1E40AF' },
      Ongoing: { bg: '#FEF3C7', color: '#92400E' },
      Completed: { bg: '#F3F4F6', color: '#6B7280' },
      Cancelled: { bg: '#FEE2E2', color: '#991B1B' }
    };
    return colors[status] || colors.Upcoming;
  };

  const handleRegisterClick = (event) => { 
    setSelectedEvent(event); 
    setShowRegisterModal(true); 
  };
  
  const handleRegisterConfirm = () => { 
    showToast(`Successfully registered for ${selectedEvent.title}!`); 
    setShowRegisterModal(false); 
    setSelectedEvent(null); 
  };
  
  const clearFilters = () => { 
    setFilters({ type: 'all', category: 'all', status: 'all' }); 
    setSearchQuery(''); 
  };

  const stats = { 
    total: filteredEvents.length, 
    academic: filteredEvents.filter(e => e.type === 'Academic').length, 
    nonAcademic: filteredEvents.filter(e => e.type === 'NonAcademic').length
  };

  return <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB',fontFamily:'system-ui'}}>
    {toast.show && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:toast.type==='error'?'#EF4444':'#10B981',color:'white',padding:'16px 24px',borderRadius:'8px',boxShadow:'0 4px 6px rgba(0,0,0,0.1)',zIndex:2000,fontSize:'14px',fontWeight:'600',display:'flex',alignItems:'center',gap:'8px'}}><FiCheck size={18} />{toast.message}</div>}
    
    <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'20px 40px',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
      <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
        <div style={{fontSize:'24px',fontWeight:'bold',display:'flex',alignItems:'center',gap:'8px',color:'#4F46E5'}}><FiBookOpen size={28} />UniFlow</div>
        <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',margin:0}}>Browse Events</h1>
      </div>
      <button style={{padding:'10px 20px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}} onClick={handleLogout}><FiLogOut size={16} />Logout</button>
    </div>

    <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'0 40px',display:'flex',gap:'4px',overflowX:'auto',whiteSpace:'nowrap'}}>
      <button onClick={()=>navigate('/student/dashboard')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s',display:'flex',alignItems:'center',gap:'6px'}} onMouseOver={(e)=>{e.currentTarget.style.color='#4F46E5';e.currentTarget.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.currentTarget.style.color='#6B7280';e.currentTarget.style.borderBottomColor='transparent';}}><FiHome size={16} />Dashboard</button>
      <button onClick={()=>navigate('/student/browse-events')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid #4F46E5',fontSize:'13px',fontWeight:'600',color:'#4F46E5',cursor:'pointer',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:'6px'}}><FiSearch size={16} />Browse Events</button>
      <button onClick={()=>navigate('/student/my-registrations')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s',display:'flex',alignItems:'center',gap:'6px'}} onMouseOver={(e)=>{e.currentTarget.style.color='#4F46E5';e.currentTarget.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.currentTarget.style.color='#6B7280';e.currentTarget.style.borderBottomColor='transparent';}}><FiClipboard size={16} />My Registrations</button>
      <button onClick={()=>navigate('/student/my-teams')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s',display:'flex',alignItems:'center',gap:'6px'}} onMouseOver={(e)=>{e.currentTarget.style.color='#4F46E5';e.currentTarget.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.currentTarget.style.color='#6B7280';e.currentTarget.style.borderBottomColor='transparent';}}><FiUsers size={16} />My Teams</button>
      <button onClick={()=>navigate('/student/attendance')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s',display:'flex',alignItems:'center',gap:'6px'}} onMouseOver={(e)=>{e.currentTarget.style.color='#4F46E5';e.currentTarget.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.currentTarget.style.color='#6B7280';e.currentTarget.style.borderBottomColor='transparent';}}><FiBarChart size={16} />Attendance</button>
      <button onClick={()=>navigate('/student/certificates')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s',display:'flex',alignItems:'center',gap:'6px'}} onMouseOver={(e)=>{e.currentTarget.style.color='#4F46E5';e.currentTarget.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.currentTarget.style.color='#6B7280';e.currentTarget.style.borderBottomColor='transparent';}}><FiAward size={16} />Certificates</button>
      <button onClick={()=>navigate('/student/notifications')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s',display:'flex',alignItems:'center',gap:'6px'}} onMouseOver={(e)=>{e.currentTarget.style.color='#4F46E5';e.currentTarget.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.currentTarget.style.color='#6B7280';e.currentTarget.style.borderBottomColor='transparent';}}><FiBell size={16} />Notifications</button>
      <button onClick={()=>navigate('/student/placement-profile')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s',display:'flex',alignItems:'center',gap:'6px'}} onMouseOver={(e)=>{e.currentTarget.style.color='#4F46E5';e.currentTarget.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.currentTarget.style.color='#6B7280';e.currentTarget.style.borderBottomColor='transparent';}}><FiBriefcase size={16} />Placement</button>
      <button onClick={()=>navigate('/student/profile')} style={{padding:'14px 16px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.3s',display:'flex',alignItems:'center',gap:'6px'}} onMouseOver={(e)=>{e.currentTarget.style.color='#4F46E5';e.currentTarget.style.borderBottomColor='#4F46E5';}} onMouseOut={(e)=>{e.currentTarget.style.color='#6B7280';e.currentTarget.style.borderBottomColor='transparent';}}><FiUser size={16} />My Profile</button>
    </div>

    <div style={{padding:'40px'}}>
      {loading ? (
        <div style={{textAlign:'center',padding:'60px 20px',backgroundColor:'white',borderRadius:'12px',border:'1px solid #E5E7EB'}}>
          <div style={{fontSize:'18px',color:'#6B7280'}}>Loading events...</div>
        </div>
      ) : error ? (
        <div style={{textAlign:'center',padding:'60px 20px',backgroundColor:'white',borderRadius:'12px',border:'1px solid #E5E7EB'}}>
          <FiX size={48} color="#EF4444" />
          <h3 style={{fontSize:'18px',color:'#EF4444',marginTop:'16px'}}>{error}</h3>
        </div>
      ) : (
        <>
          <div style={{backgroundColor:'white',borderRadius:'12px',padding:'20px 30px',marginBottom:'24px',border:'1px solid #E5E7EB',display:'flex',justifyContent:'space-around',gap:'20px'}}>
            {[
              {label:'Total Events',value:stats.total,icon:FiCalendar,color:'#4F46E5'},
              {label:'Academic Events',value:stats.academic,icon:FiBook,color:'#10B981'},
              {label:'Non-Academic Events',value:stats.nonAcademic,icon:FiMusic,color:'#F59E0B'}
            ].map((stat,i)=><div key={i} style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'8px'}}>
              <stat.icon size={32} color={stat.color} />
              <div style={{fontSize:'28px',fontWeight:'bold',color:stat.color}}>{stat.value}</div>
              <div style={{fontSize:'13px',color:'#6B7280'}}>{stat.label}</div>
            </div>)}
          </div>

          <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
            <h3 style={{fontSize:'16px',fontWeight:'600',color:'#1F2937',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}><FiFilter size={20} />Search & Filter Events</h3>
            <div style={{position:'relative',marginBottom:'20px'}}>
              <FiSearch style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#9CA3AF'}} size={18} />
              <input type="text" placeholder="Search by event name, description, or type..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} style={{width:'100%',padding:'12px 12px 12px 40px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',outline:'none'}}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'16px',marginBottom:'16px'}}>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                <label style={{fontSize:'13px',fontWeight:'600',color:'#374151'}}>Event Type</label>
                <select style={{padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',backgroundColor:'white',cursor:'pointer',outline:'none'}} value={filters.type} onChange={(e)=>setFilters({...filters,type:e.target.value})}>
                  <option value="all">All Types</option>
                  <option value="Academic">Academic</option>
                  <option value="NonAcademic">Non-Academic</option>
                </select>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                <label style={{fontSize:'13px',fontWeight:'600',color:'#374151'}}>Category</label>
                <select style={{padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',backgroundColor:'white',cursor:'pointer',outline:'none'}} value={filters.category} onChange={(e)=>setFilters({...filters,category:e.target.value})}>
                  <option value="all">All Categories</option>
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="Inter-College">Inter-College</option>
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                <label style={{fontSize:'13px',fontWeight:'600',color:'#374151'}}>Status</label>
                <select style={{padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',backgroundColor:'white',cursor:'pointer',outline:'none'}} value={filters.status} onChange={(e)=>setFilters({...filters,status:e.target.value})}>
                  <option value="all">All Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:'12px',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:'13px',color:'#6B7280'}}>Showing <strong>{filteredEvents.length}</strong> of <strong>{events.length}</strong> events</div>
              <button style={{padding:'10px 20px',backgroundColor:'white',border:'2px solid #E5E7EB',color:'#6B7280',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}} onClick={clearFilters}><FiX size={16} />Clear Filters</button>
            </div>
          </div>
        </>
      )}

      {!loading && !error && (
        <>
          <div style={{display:'flex',gap:'8px',marginBottom:'24px'}}>
            <button style={{padding:'8px 16px',fontSize:'14px',fontWeight:'600',borderRadius:'8px',border:'2px solid #E5E7EB',backgroundColor:viewMode==='grid'?'#4F46E5':'white',color:viewMode==='grid'?'white':'#6B7280',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}} onClick={()=>setViewMode('grid')}><FiGrid size={16} />Grid View</button>
            <button style={{padding:'8px 16px',fontSize:'14px',fontWeight:'600',borderRadius:'8px',border:'2px solid #E5E7EB',backgroundColor:viewMode==='list'?'#4F46E5':'white',color:viewMode==='list'?'white':'#6B7280',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}} onClick={()=>setViewMode('list')}><FiList size={16} />List View</button>
          </div>

          {filteredEvents.length > 0 ? <div style={{display:'grid',gridTemplateColumns:viewMode==='grid'?'repeat(auto-fill, minmax(350px, 1fr))':'1fr',gap:'24px'}}>
            {filteredEvents.map(event => {
              const TypeIcon = getEventTypeIcon(event.subType);
              const typeColors = getEventTypeColor(event.subType);
              const statusColors = getStatusColor(event.status);
              const startDate = new Date(event.date?.startDate);
              const endDate = new Date(event.date?.endDate);
              const registrationFee = event.registration?.fees?.amount || 0;
              
              return <div key={event._id} style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',border:'1px solid #E5E7EB',boxShadow:'0 1px 3px rgba(0,0,0,0.05)',transition:'all 0.3s'}} onMouseEnter={(e)=>{e.currentTarget.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)';e.currentTarget.style.transform='translateY(-4px)';}} onMouseLeave={(e)=>{e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.05)';e.currentTarget.style.transform='translateY(0)';}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                  <h4 style={{fontSize:'18px',fontWeight:'600',color:'#1F2937',margin:0,display:'flex',alignItems:'center',gap:'8px',flex:1}}>
                    <TypeIcon size={20} color={typeColors.color} />
                    {event.title}
                  </h4>
                  <span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:typeColors.bg,color:typeColors.color}}>{event.subType}</span>
                </div>
                
                <div style={{display:'flex',gap:'8px',marginBottom:'12px',flexWrap:'wrap'}}>
                  <span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:statusColors.bg,color:statusColors.color}}>{event.status}</span>
                  <span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:'#F3F4F6',color:'#6B7280'}}>{event.type}</span>
                  <span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:'#EEF2FF',color:'#4F46E5'}}>{event.category}</span>
                </div>
                
                <p style={{fontSize:'14px',color:'#6B7280',marginBottom:'16px',lineHeight:'1.6',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{event.description}</p>
                
                <div style={{display:'flex',flexDirection:'column',gap:'10px',fontSize:'13px',color:'#6B7280',marginBottom:'16px',backgroundColor:'#F9FAFB',padding:'12px',borderRadius:'8px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <FiCalendar size={16} color='#4F46E5' />
                    <span><strong>Date:</strong> {startDate.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})} to {endDate.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <FiClock size={16} color='#4F46E5' />
                    <span><strong>Time:</strong> {event.time?.startTime} - {event.time?.endTime}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <FiMapPin size={16} color='#4F46E5' />
                    <span><strong>Venue:</strong> {event.venue?.name || event.mode}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <FiUsers size={16} color='#4F46E5' />
                    <span><strong>Mode:</strong> {event.mode}</span>
                  </div>
                </div>
                
                {event.registration?.isRequired && (
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px',padding:'12px',backgroundColor:registrationFee===0?'#D1FAE5':'#FEF3C7',borderRadius:'8px'}}>
                    <span style={{fontSize:'13px',fontWeight:'600',color:registrationFee===0?'#065F46':'#92400E'}}>
                      {registrationFee===0?'🎉 Free Event':`💰 Fee: ₹${registrationFee}`}
                    </span>
                  </div>
                )}
                
                <div style={{display:'flex',gap:'8px'}}>
                  <button style={{flex:1,padding:'12px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',transition:'all 0.2s'}} onClick={()=>navigate(`/student/event/${event._id}`)} onMouseEnter={(e)=>{e.currentTarget.style.backgroundColor='#EEF2FF';}} onMouseLeave={(e)=>{e.currentTarget.style.backgroundColor='white';}}><FiBookOpen size={16} />View Details</button>
                  <button style={{flex:1,padding:'12px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',transition:'all 0.2s'}} onClick={()=>handleRegisterClick(event)} onMouseEnter={(e)=>{e.currentTarget.style.backgroundColor='#4338CA';}} onMouseLeave={(e)=>{e.currentTarget.style.backgroundColor='#4F46E5';}}><FiCheck size={16} />Register Now</button>
                </div>
              </div>;
            })}
          </div> : <div style={{textAlign:'center',padding:'60px 20px',backgroundColor:'white',borderRadius:'12px',border:'1px solid #E5E7EB'}}>
            <FiSearch size={48} color='#9CA3AF' />
            <h3 style={{fontSize:'18px',color:'#6B7280',marginTop:'16px'}}>No events found</h3>
            <p style={{color:'#9CA3AF'}}>Try adjusting your search or filters</p>
          </div>}
        </>
      )}
    </div>

    {showRegisterModal && selectedEvent && <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowRegisterModal(false)}>
      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'500px',width:'90%'}} onClick={(e)=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
          <FiCheck size={24} color='#4F46E5' />
          <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',margin:0}}>Confirm Registration</h2>
        </div>
        <p style={{color:'#6B7280',marginBottom:'8px'}}>Are you sure you want to register for:</p>
        <p style={{fontWeight:'600',color:'#1F2937',marginBottom:'16px',fontSize:'18px'}}>{selectedEvent.title}</p>
        <div style={{padding:'16px',backgroundColor:'#F9FAFB',borderRadius:'8px',marginBottom:'24px'}}>
          <div style={{marginBottom:'12px',display:'flex',alignItems:'center',gap:'8px'}}>
            <FiCalendar size={16} color='#6B7280' />
            <span><strong>Date:</strong> {new Date(selectedEvent.date?.startDate).toLocaleDateString('en-IN')} to {new Date(selectedEvent.date?.endDate).toLocaleDateString('en-IN')}</span>
          </div>
          <div style={{marginBottom:'12px',display:'flex',alignItems:'center',gap:'8px'}}>
            <FiClock size={16} color='#6B7280' />
            <span><strong>Time:</strong> {selectedEvent.time?.startTime} - {selectedEvent.time?.endTime}</span>
          </div>
          <div style={{marginBottom:'12px',display:'flex',alignItems:'center',gap:'8px'}}>
            <FiMapPin size={16} color='#6B7280' />
            <span><strong>Venue:</strong> {selectedEvent.venue?.name || selectedEvent.mode}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span><strong>Fee:</strong> {selectedEvent.registration?.fees?.amount===0||!selectedEvent.registration?.fees?.amount?'Free':`₹${selectedEvent.registration?.fees?.amount}`}</span>
          </div>
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}>
          <button style={{padding:'10px 20px',backgroundColor:'#F3F4F6',color:'#374151',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}} onClick={()=>setShowRegisterModal(false)}><FiX size={16} />Cancel</button>
          <button style={{padding:'10px 20px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}} onClick={handleRegisterConfirm}><FiCheck size={16} />Confirm Registration</button>
        </div>
      </div>
    </div>}
  </div>;
};

export default BrowseEvents;
