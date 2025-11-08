import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DownloadCertificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // TODO: Fetch certificates from API
    // fetchCertificates();
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

  const getCertificateTypeColor = (type) => {
    const colors = {
      winner: { bg: '#FEF3C7', color: '#92400E', icon: '🏆', label: 'Winner' },
      participation: { bg: '#DBEAFE', color: '#1E40AF', icon: '🎓', label: 'Participation' },
      appreciation: { bg: '#FCE7F3', color: '#9F1239', icon: '⭐', label: 'Appreciation' },
      pending: { bg: '#F3F4F6', color: '#6B7280', icon: '⏳', label: 'Pending' }
    };
    return colors[type] || { bg: '#F3F4F6', color: '#374151', icon: '📜', label: type };
  };

  const handleDownload = (certificate) => {
    if (certificate.status === 'pending') {
      showToast('Certificate is not yet available. Please wait for event completion.', 'error');
      return;
    }
    showToast(`Downloading certificate: ${certificate.eventName}`);
    // Simulate download
    console.log('Downloading:', certificate.downloadUrl);
  };

  const handlePreview = (certificate) => {
    if (certificate.status === 'pending') {
      showToast('Certificate preview not available yet', 'error');
      return;
    }
    setSelectedCertificate(certificate);
    setShowPreviewModal(true);
  };

  const handleShare = (certificate) => {
    if (certificate.status === 'pending') {
      showToast('Cannot share pending certificate', 'error');
      return;
    }
    navigator.clipboard.writeText(certificate.validationUrl);
    showToast('Verification link copied to clipboard!');
  };

  const handleVerify = (certificate) => {
    if (certificate.status === 'pending') {
      showToast('Certificate not yet issued', 'error');
      return;
    }
    window.open(certificate.validationUrl, '_blank');
  };

  const filteredCertificates = certificates.filter(cert => {
    if (filter === 'all') return true;
    if (filter === 'issued') return cert.status === 'issued';
    if (filter === 'pending') return cert.status === 'pending';
    return cert.type === filter;
  });

  const stats = {
    total: certificates.filter(c => c.status === 'issued').length,
    winner: certificates.filter(c => c.type === 'winner' && c.status === 'issued').length,
    participation: certificates.filter(c => c.type === 'participation' && c.status === 'issued').length,
    pending: certificates.filter(c => c.status === 'pending').length
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB',fontFamily:'system-ui'}}>
      {toast.show && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:toast.type==='error'?'#EF4444':'#10B981',color:'white',padding:'16px 24px',borderRadius:'8px',boxShadow:'0 4px 6px rgba(0,0,0,0.1)',zIndex:2000}}>{toast.message}</div>}

      <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'20px 40px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          <div style={{fontSize:'24px',fontWeight:'bold',background:'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>UniFlow</div>
          <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',margin:0}}>My Certificates</h1>
        </div>
        <button style={{padding:'10px 20px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',cursor:'pointer'}} onClick={handleLogout}>Logout</button>
      </div>

      <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'0 40px',display:'flex',gap:'4px',overflowX:'auto'}}>
        <button onClick={()=>navigate('/student/dashboard')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🏠 Dashboard</button>
        <button onClick={()=>navigate('/student/browse-events')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🔍 Browse Events</button>
        <button onClick={()=>navigate('/student/my-registrations')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>📋 My Registrations</button>
        <button onClick={()=>navigate('/student/my-teams')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>👥 My Teams</button>
        <button onClick={()=>navigate('/student/attendance')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>📊 Attendance</button>
        <button onClick={()=>navigate('/student/certificates')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid #4F46E5',fontSize:'13px',fontWeight:'600',color:'#4F46E5',cursor:'pointer',backgroundColor:'transparent'}}>🎓 Certificates</button>
        <button onClick={()=>navigate('/student/notifications')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>🔔 Notifications</button>
        <button onClick={()=>navigate('/student/placement-profile')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>💼 Placement</button>
        <button onClick={()=>navigate('/student/profile')} style={{padding:'14px 16px',border:'none',borderBottom:'3px solid transparent',fontSize:'13px',fontWeight:'600',color:'#6B7280',cursor:'pointer',backgroundColor:'transparent'}}>👤 My Profile</button>
      </div>

      <div style={{padding:'40px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'20px',marginBottom:'32px'}}>
          {[
            {label:'Total Certificates',value:stats.total,icon:'🎓',color:'#4F46E5'},
            {label:'Winner Certificates',value:stats.winner,icon:'🏆',color:'#F59E0B'},
            {label:'Participation',value:stats.participation,icon:'📜',color:'#10B981'},
            {label:'Pending',value:stats.pending,icon:'⏳',color:'#6B7280'}
          ].map((s,i)=><div key={i} style={{backgroundColor:'white',borderRadius:'12px',padding:'20px',border:'1px solid #E5E7EB'}}><div style={{fontSize:'32px',marginBottom:'8px'}}>{s.icon}</div><h2 style={{fontSize:'28px',fontWeight:'bold',color:s.color,margin:'8px 0'}}>{s.value}</h2><p style={{fontSize:'13px',color:'#6B7280',margin:0}}>{s.label}</p></div>)}
        </div>

        <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
          <h3 style={{fontSize:'16px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>🔍 Filter Certificates</h3>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {[
              {label:'All Certificates',value:'all'},
              {label:'Issued',value:'issued'},
              {label:'🏆 Winner',value:'winner'},
              {label:'🎓 Participation',value:'participation'},
              {label:'⏳ Pending',value:'pending'}
            ].map((f,i)=><button key={i} onClick={()=>setFilter(f.value)} style={{padding:'10px 20px',backgroundColor:filter===f.value?'#4F46E5':'white',color:filter===f.value?'white':'#6B7280',border:'2px solid '+(filter===f.value?'#4F46E5':'#E5E7EB'),borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>{f.label}</button>)}
          </div>
        </div>

        {filteredCertificates.length > 0 ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(380px, 1fr))',gap:'24px'}}>
            {filteredCertificates.map(cert => {
              const typeColors = getCertificateTypeColor(cert.type);
              const isPending = cert.status === 'pending';
              
              return (
                <div key={cert.id} style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',border:'1px solid #E5E7EB',boxShadow:'0 1px 3px rgba(0,0,0,0.05)',opacity:isPending?0.7:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                    <div>
                      <h3 style={{fontSize:'18px',fontWeight:'600',color:'#1F2937',margin:'0 0 8px 0'}}>{cert.eventName}</h3>
                      <span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:typeColors.bg,color:typeColors.color}}>
                        {typeColors.icon} {typeColors.label}
                      </span>
                    </div>
                  </div>

                  {cert.position && (
                    <div style={{padding:'12px',backgroundColor:'#FEF3C7',borderRadius:'8px',marginBottom:'16px',border:'1px solid #FDE68A'}}>
                      <div style={{fontSize:'14px',fontWeight:'600',color:'#92400E'}}>🏆 {cert.position}</div>
                    </div>
                  )}

                  <p style={{fontSize:'14px',color:'#6B7280',marginBottom:'16px',lineHeight:'1.6'}}>{cert.description}</p>

                  <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'16px',padding:'12px',backgroundColor:'#F9FAFB',borderRadius:'8px'}}>
                    <div style={{fontSize:'13px',color:'#6B7280'}}><strong>Event Date:</strong> {new Date(cert.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>
                    {cert.issuedDate && <div style={{fontSize:'13px',color:'#6B7280'}}><strong>Issued On:</strong> {new Date(cert.issuedDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>}
                    <div style={{fontSize:'13px',color:'#6B7280'}}><strong>Issued By:</strong> {cert.issuedBy}</div>
                    {cert.certificateNumber && <div style={{fontSize:'13px',color:'#6B7280'}}><strong>Certificate No:</strong> <span style={{fontFamily:'monospace',color:'#4F46E5'}}>{cert.certificateNumber}</span></div>}
                    {cert.attendance !== null && <div style={{fontSize:'13px',color:'#6B7280'}}><strong>Attendance:</strong> {cert.attendance}%</div>}
                  </div>

                  {!isPending && (
                    <div style={{padding:'12px',backgroundColor:'#DBEAFE',borderRadius:'8px',marginBottom:'16px',border:'1px solid #93C5FD'}}>
                      <div style={{fontSize:'12px',color:'#1E40AF',marginBottom:'4px'}}>Verification Link</div>
                      <div style={{fontSize:'11px',color:'#1E40AF',fontFamily:'monospace',wordBreak:'break-all'}}>{cert.validationUrl}</div>
                    </div>
                  )}

                  <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                    <button 
                      style={{flex:1,padding:'10px',backgroundColor:isPending?'#9CA3AF':'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:isPending?'not-allowed':'pointer'}} 
                      onClick={()=>handleDownload(cert)}
                      disabled={isPending}
                    >
                      📥 Download
                    </button>
                    <button 
                      style={{flex:1,padding:'10px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:isPending?'not-allowed':'pointer'}} 
                      onClick={()=>handlePreview(cert)}
                      disabled={isPending}
                    >
                      👁️ Preview
                    </button>
                  </div>
                  <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                    <button 
                      style={{flex:1,padding:'10px',backgroundColor:'#10B981',color:'white',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:isPending?'not-allowed':'pointer'}} 
                      onClick={()=>handleShare(cert)}
                      disabled={isPending}
                    >
                      📤 Share Link
                    </button>
                    <button 
                      style={{flex:1,padding:'10px',backgroundColor:'white',color:'#10B981',border:'2px solid #10B981',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:isPending?'not-allowed':'pointer'}} 
                      onClick={()=>handleVerify(cert)}
                      disabled={isPending}
                    >
                      ✓ Verify
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'60px 20px',backgroundColor:'white',borderRadius:'12px',border:'1px solid #E5E7EB'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>🎓</div>
            <h3 style={{fontSize:'18px',color:'#6B7280'}}>No certificates found</h3>
            <p style={{color:'#9CA3AF',marginBottom:'24px'}}>Certificates will be issued after event completion and attendance verification</p>
            <button style={{padding:'12px 24px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>navigate('/student/browse-events')}>Browse Events</button>
          </div>
        )}
      </div>

      {showPreviewModal && selectedCertificate && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowPreviewModal(false)}>
          <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'800px',width:'90%',maxHeight:'90vh',overflowY:'auto'}} onClick={(e)=>e.stopPropagation()}>
            <h2 style={{fontSize:'20px',fontWeight:'600',marginBottom:'24px'}}>📜 Certificate Preview</h2>
            
            <div style={{padding:'40px',backgroundColor:'#F9FAFB',borderRadius:'12px',border:'2px solid #E5E7EB',marginBottom:'24px',textAlign:'center'}}>
              <div style={{fontSize:'48px',marginBottom:'16px'}}>🎓</div>
              <h3 style={{fontSize:'24px',fontWeight:'bold',color:'#1F2937',marginBottom:'8px'}}>Certificate of {getCertificateTypeColor(selectedCertificate.type).label}</h3>
              <p style={{fontSize:'16px',color:'#6B7280',marginBottom:'24px'}}>This is to certify that</p>
              <h2 style={{fontSize:'32px',fontWeight:'bold',color:'#4F46E5',marginBottom:'24px'}}>Rajesh Kumar</h2>
              <p style={{fontSize:'16px',color:'#6B7280',marginBottom:'16px'}}>has successfully {selectedCertificate.type === 'winner' ? 'won' : 'participated in'}</p>
              <h3 style={{fontSize:'24px',fontWeight:'600',color:'#1F2937',marginBottom:'24px'}}>{selectedCertificate.eventName}</h3>
              {selectedCertificate.position && (
                <div style={{padding:'12px 24px',backgroundColor:'#FEF3C7',borderRadius:'8px',display:'inline-block',marginBottom:'24px'}}>
                  <span style={{fontSize:'18px',fontWeight:'600',color:'#92400E'}}>🏆 {selectedCertificate.position}</span>
                </div>
              )}
              <div style={{marginTop:'32px',paddingTop:'24px',borderTop:'2px solid #E5E7EB'}}>
                <div style={{fontSize:'14px',color:'#6B7280',marginBottom:'8px'}}>Certificate No: {selectedCertificate.certificateNumber}</div>
                <div style={{fontSize:'14px',color:'#6B7280',marginBottom:'8px'}}>Date: {new Date(selectedCertificate.issuedDate).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</div>
                <div style={{fontSize:'14px',color:'#6B7280'}}>Issued By: {selectedCertificate.issuedBy}</div>
              </div>
            </div>

            <div style={{display:'flex',gap:'12px'}}>
              <button style={{flex:1,padding:'12px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>handleDownload(selectedCertificate)}>📥 Download PDF</button>
              <button style={{flex:1,padding:'12px',backgroundColor:'#F3F4F6',color:'#374151',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowPreviewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadCertificates;
