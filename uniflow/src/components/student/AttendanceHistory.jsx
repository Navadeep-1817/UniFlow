import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AttendanceHistory = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Mock attendance data
    const mockAttendance = [
      {
        id: 1,
        eventName: 'Hackathon 2024',
        eventId: 5,
        type: 'technical',
        category: 'non-academic',
        date: '2024-11-05',
        totalSessions: 3,
        attendedSessions: 3,
        percentage: 100,
        sessions: [
          { id: 1, name: 'Opening Ceremony', date: '2024-11-05', time: '8:00 AM', status: 'present' },
          { id: 2, name: 'Coding Round 1', date: '2024-11-05', time: '10:00 AM', status: 'present' },
          { id: 3, name: 'Final Presentation', date: '2024-11-05', time: '4:00 PM', status: 'present' }
        ],
        organizer: 'Tech Club',
        certificateEligible: true,
        semester: '2024-1'
      },
      {
        id: 2,
        eventName: 'Workshop on AI/ML',
        eventId: 2,
        type: 'workshop',
        category: 'academic',
        date: '2024-10-15',
        totalSessions: 4,
        attendedSessions: 3,
        percentage: 75,
        sessions: [
          { id: 1, name: 'Introduction to AI', date: '2024-10-15', time: '2:00 PM', status: 'present' },
          { id: 2, name: 'Machine Learning Basics', date: '2024-10-16', time: '2:00 PM', status: 'present' },
          { id: 3, name: 'Deep Learning', date: '2024-10-17', time: '2:00 PM', status: 'absent' },
          { id: 4, name: 'Practical Session', date: '2024-10-18', time: '2:00 PM', status: 'present' }
        ],
        organizer: 'CS Department',
        certificateEligible: true,
        semester: '2024-1'
      },
      {
        id: 3,
        eventName: 'Cultural Fest',
        eventId: 4,
        type: 'cultural',
        category: 'non-academic',
        date: '2024-10-28',
        totalSessions: 2,
        attendedSessions: 2,
        percentage: 100,
        sessions: [
          { id: 1, name: 'Inaugural Event', date: '2024-10-28', time: '6:00 PM', status: 'present' },
          { id: 2, name: 'Main Performances', date: '2024-10-28', time: '7:30 PM', status: 'present' }
        ],
        organizer: 'Cultural Committee',
        certificateEligible: true,
        semester: '2024-1'
      },
      {
        id: 4,
        eventName: 'Blood Donation Camp',
        eventId: 6,
        type: 'social',
        category: 'non-academic',
        date: '2024-09-20',
        totalSessions: 1,
        attendedSessions: 1,
        percentage: 100,
        sessions: [
          { id: 1, name: 'Blood Donation', date: '2024-09-20', time: '9:00 AM', status: 'present' }
        ],
        organizer: 'NSS',
        certificateEligible: true,
        semester: '2024-1'
      },
      {
        id: 5,
        eventName: 'Tech Talk Series',
        eventId: 7,
        type: 'seminar',
        category: 'academic',
        date: '2024-09-10',
        totalSessions: 5,
        attendedSessions: 4,
        percentage: 80,
        sessions: [
          { id: 1, name: 'Cloud Computing', date: '2024-09-10', time: '3:00 PM', status: 'present' },
          { id: 2, name: 'Blockchain Technology', date: '2024-09-12', time: '3:00 PM', status: 'present' },
          { id: 3, name: 'Cybersecurity Trends', date: '2024-09-14', time: '3:00 PM', status: 'absent' },
          { id: 4, name: 'IoT Applications', date: '2024-09-16', time: '3:00 PM', status: 'present' },
          { id: 5, name: 'AI in Industry', date: '2024-09-18', time: '3:00 PM', status: 'present' }
        ],
        organizer: 'Tech Club',
        certificateEligible: true,
        semester: '2024-1'
      },
      {
        id: 6,
        eventName: 'Sports Meet - Cricket',
        eventId: 3,
        type: 'sports',
        category: 'non-academic',
        date: '2024-08-25',
        totalSessions: 3,
        attendedSessions: 2,
        percentage: 67,
        sessions: [
          { id: 1, name: 'Practice Session', date: '2024-08-25', time: '7:00 AM', status: 'present' },
          { id: 2, name: 'Quarter Finals', date: '2024-08-26', time: '9:00 AM', status: 'absent' },
          { id: 3, name: 'Finals', date: '2024-08-27', time: '9:00 AM', status: 'present' }
        ],
        organizer: 'Sports Committee',
        certificateEligible: false,
        semester: '2024-1'
      }
    ];
    setAttendanceData(mockAttendance);
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
      social: { bg: '#FED7AA', color: '#9A3412', icon: '🤝' },
      seminar: { bg: '#F3E8FF', color: '#6B21A8', icon: '🎤' }
    };
    return colors[type] || { bg: '#F3F4F6', color: '#374151', icon: '📅' };
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return { bg: '#D1FAE5', color: '#065F46', label: 'Excellent' };
    if (percentage >= 75) return { bg: '#DBEAFE', color: '#1E40AF', label: 'Good' };
    if (percentage >= 60) return { bg: '#FEF3C7', color: '#92400E', label: 'Average' };
    return { bg: '#FEE2E2', color: '#991B1B', label: 'Poor' };
  };

  const filteredData = attendanceData.filter(record => {
    if (filter !== 'all' && record.category !== filter) return false;
    if (semesterFilter !== 'all' && record.semester !== semesterFilter) return false;
    return true;
  });

  const stats = {
    totalEvents: filteredData.length,
    totalSessions: filteredData.reduce((acc, r) => acc + r.totalSessions, 0),
    attendedSessions: filteredData.reduce((acc, r) => acc + r.attendedSessions, 0),
    overallPercentage: filteredData.length > 0 
      ? Math.round((filteredData.reduce((acc, r) => acc + r.attendedSessions, 0) / filteredData.reduce((acc, r) => acc + r.totalSessions, 0)) * 100)
      : 0,
    eligibleForCertificate: filteredData.filter(r => r.certificateEligible && r.percentage >= 75).length
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleExportData = () => {
    showToast('Attendance data exported successfully!');
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB',fontFamily:'system-ui'}}>
      {toast.show && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:toast.type==='error'?'#EF4444':'#10B981',color:'white',padding:'16px 24px',borderRadius:'8px',boxShadow:'0 4px 6px rgba(0,0,0,0.1)',zIndex:2000}}>{toast.message}</div>}

      <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'20px 40px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          <div style={{fontSize:'24px',fontWeight:'bold',background:'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>UniFlow</div>
          <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',margin:0}}>Attendance History</h1>
        </div>
        <button style={{padding:'10px 20px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',cursor:'pointer'}} onClick={handleLogout}>Logout</button>
      </div>

      <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'0 40px',display:'flex',gap:'4px',overflowX:'auto'}}>
        <button onClick={()=>navigate('/student/dashboard')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🏠 Dashboard</button>
        <button onClick={()=>navigate('/student/browse-events')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🔍 Browse Events</button>
        <button onClick={()=>navigate('/student/my-registrations')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>📋 My Registrations</button>
        <button onClick={()=>navigate('/student/my-teams')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>👥 My Teams</button>
        <button onClick={()=>navigate('/student/attendance')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid #4F46E5',fontSize:'13px',fontWeight:'600',color:'#4F46E5',cursor:'pointer',backgroundColor:'transparent'}}>📊 Attendance</button>
        <button onClick={()=>navigate('/student/certificates')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🎓 Certificates</button>
        <button onClick={()=>navigate('/student/feedback')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>💬 Feedback</button>
        <button onClick={()=>navigate('/student/notifications')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🔔 Notifications</button>
        <button onClick={()=>navigate('/student/student-body')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🎯 Student Body</button>
        <button onClick={()=>navigate('/student/placement-profile')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>💼 Placement</button>
        <button onClick={()=>navigate('/student/profile')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>👤 My Profile</button>
      </div>

      <div style={{padding:'40px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'20px',marginBottom:'32px'}}>
          {[
            {label:'Overall Attendance',value:`${stats.overallPercentage}%`,icon:'📊',color:getAttendanceColor(stats.overallPercentage).color},
            {label:'Events Attended',value:stats.totalEvents,icon:'📅',color:'#4F46E5'},
            {label:'Total Sessions',value:stats.totalSessions,icon:'🎯',color:'#10B981'},
            {label:'Sessions Attended',value:stats.attendedSessions,icon:'✅',color:'#059669'},
            {label:'Certificate Eligible',value:stats.eligibleForCertificate,icon:'🎓',color:'#8B5CF6'}
          ].map((s,i)=><div key={i} style={{backgroundColor:'white',borderRadius:'12px',padding:'20px',border:'1px solid #E5E7EB'}}><div style={{fontSize:'32px',marginBottom:'8px'}}>{s.icon}</div><h2 style={{fontSize:'28px',fontWeight:'bold',color:s.color,margin:'8px 0'}}>{s.value}</h2><p style={{fontSize:'13px',color:'#6B7280',margin:0}}>{s.label}</p></div>)}
        </div>

        <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px',flexWrap:'wrap',gap:'16px'}}>
            <h3 style={{fontSize:'16px',fontWeight:'600',color:'#1F2937',margin:0}}>🔍 Filter Attendance</h3>
            <button style={{padding:'10px 20px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={handleExportData}>📥 Export Data</button>
          </div>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            {[{label:'All Events',value:'all'},{label:'Academic',value:'academic'},{label:'Non-Academic',value:'non-academic'}].map((f,i)=><button key={i} onClick={()=>setFilter(f.value)} style={{padding:'10px 20px',backgroundColor:filter===f.value?'#4F46E5':'white',color:filter===f.value?'white':'#6B7280',border:'2px solid '+(filter===f.value?'#4F46E5':'#E5E7EB'),borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>{f.label}</button>)}
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div style={{backgroundColor:'white',borderRadius:'12px',border:'1px solid #E5E7EB',overflow:'hidden'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{backgroundColor:'#F9FAFB'}}>
                    {['Event Name','Type','Date','Sessions','Attended','Percentage','Status','Actions'].map((h,i)=><th key={i} style={{padding:'16px',textAlign:'left',fontSize:'13px',fontWeight:'600',color:'#374151',borderBottom:'1px solid #E5E7EB'}}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(record=>{
                    const typeColors = getEventTypeColor(record.type);
                    const attColors = getAttendanceColor(record.percentage);
                    return <tr key={record.id} style={{borderBottom:'1px solid #F3F4F6'}}>
                      <td style={{padding:'16px'}}>
                        <div style={{fontWeight:'600',color:'#1F2937',marginBottom:'4px'}}>{typeColors.icon} {record.eventName}</div>
                        <div style={{fontSize:'12px',color:'#6B7280'}}>{record.organizer}</div>
                      </td>
                      <td style={{padding:'16px'}}>
                        <span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:typeColors.bg,color:typeColors.color}}>
                          {record.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{padding:'16px',fontSize:'14px',color:'#6B7280'}}>
                        {new Date(record.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                      </td>
                      <td style={{padding:'16px',fontSize:'14px',fontWeight:'600',color:'#1F2937',textAlign:'center'}}>
                        {record.totalSessions}
                      </td>
                      <td style={{padding:'16px',fontSize:'14px',fontWeight:'600',color:'#10B981',textAlign:'center'}}>
                        {record.attendedSessions}
                      </td>
                      <td style={{padding:'16px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                          <div style={{flex:1,height:'8px',backgroundColor:'#E5E7EB',borderRadius:'4px',overflow:'hidden',minWidth:'60px'}}>
                            <div style={{height:'100%',backgroundColor:attColors.color,width:`${record.percentage}%`}}></div>
                          </div>
                          <span style={{fontSize:'14px',fontWeight:'600',color:attColors.color,minWidth:'45px'}}>{record.percentage}%</span>
                        </div>
                      </td>
                      <td style={{padding:'16px'}}>
                        <span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:attColors.bg,color:attColors.color}}>
                          {attColors.label}
                        </span>
                      </td>
                      <td style={{padding:'16px'}}>
                        <button style={{padding:'8px 16px',backgroundColor:'#DBEAFE',color:'#1E40AF',border:'none',borderRadius:'6px',fontSize:'12px',fontWeight:'600',cursor:'pointer'}} onClick={()=>handleViewDetails(record)}>📄 View Details</button>
                      </td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'60px 20px',backgroundColor:'white',borderRadius:'12px',border:'1px solid #E5E7EB'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>📊</div>
            <h3 style={{fontSize:'18px',color:'#6B7280'}}>No attendance records found</h3>
            <p style={{color:'#9CA3AF'}}>Attend events to build your attendance history</p>
          </div>
        )}
      </div>

      {showDetailsModal && selectedEvent && <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowDetailsModal(false)}>
        <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'700px',width:'90%',maxHeight:'90vh',overflowY:'auto'}} onClick={(e)=>e.stopPropagation()}>
          <h2 style={{fontSize:'20px',fontWeight:'600',marginBottom:'16px'}}>📊 Session-wise Attendance</h2>
          <div style={{marginBottom:'24px'}}>
            <h3 style={{fontSize:'18px',fontWeight:'600',color:'#1F2937',marginBottom:'8px'}}>{selectedEvent.eventName}</h3>
            <div style={{fontSize:'14px',color:'#6B7280'}}>
              <span>Organized by: {selectedEvent.organizer}</span> • 
              <span> {new Date(selectedEvent.date).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
          
          <div style={{padding:'16px',backgroundColor:'#F9FAFB',borderRadius:'8px',marginBottom:'24px'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'16px'}}>
              <div>
                <div style={{fontSize:'12px',color:'#6B7280',marginBottom:'4px'}}>Total Sessions</div>
                <div style={{fontSize:'20px',fontWeight:'600',color:'#1F2937'}}>{selectedEvent.totalSessions}</div>
              </div>
              <div>
                <div style={{fontSize:'12px',color:'#6B7280',marginBottom:'4px'}}>Attended</div>
                <div style={{fontSize:'20px',fontWeight:'600',color:'#10B981'}}>{selectedEvent.attendedSessions}</div>
              </div>
              <div>
                <div style={{fontSize:'12px',color:'#6B7280',marginBottom:'4px'}}>Percentage</div>
                <div style={{fontSize:'20px',fontWeight:'600',color:getAttendanceColor(selectedEvent.percentage).color}}>{selectedEvent.percentage}%</div>
              </div>
            </div>
          </div>

          <h4 style={{fontSize:'16px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>Session Details</h4>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {selectedEvent.sessions.map((session,i)=><div key={i} style={{padding:'16px',backgroundColor:session.status==='present'?'#D1FAE5':'#FEE2E2',borderRadius:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:'15px',fontWeight:'600',color:'#1F2937',marginBottom:'4px'}}>{session.name}</div>
                <div style={{fontSize:'13px',color:'#6B7280'}}>
                  {new Date(session.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})} • {session.time}
                </div>
              </div>
              <span style={{padding:'6px 16px',borderRadius:'12px',fontSize:'13px',fontWeight:'600',backgroundColor:session.status==='present'?'#065F46':'#991B1B',color:'white'}}>
                {session.status==='present'?'✓ Present':'✗ Absent'}
              </span>
            </div>)}
          </div>

          {selectedEvent.certificateEligible && selectedEvent.percentage >= 75 && (
            <div style={{marginTop:'24px',padding:'16px',backgroundColor:'#DBEAFE',borderRadius:'8px',border:'1px solid #93C5FD'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <span style={{fontSize:'24px'}}>🎓</span>
                <div>
                  <div style={{fontSize:'14px',fontWeight:'600',color:'#1E40AF'}}>Certificate Eligible</div>
                  <div style={{fontSize:'13px',color:'#1E40AF'}}>You are eligible for a certificate for this event!</div>
                </div>
              </div>
            </div>
          )}

          <button style={{width:'100%',marginTop:'24px',padding:'12px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowDetailsModal(false)}>Close</button>
        </div>
      </div>}
    </div>
  );
};

export default AttendanceHistory;
