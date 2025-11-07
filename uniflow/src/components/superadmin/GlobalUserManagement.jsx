import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GlobalUserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ university: 'all', role: 'all', status: 'all', department: 'all' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Fetch real users from backend API
    const fetchUsers = async () => {
      // Check both localStorage and sessionStorage for token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/superadmin/users?limit=1000`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          // Map backend user data to component format
          const mappedUsers = data.data.map(user => ({
            id: user._id,
            firstName: user.name?.split(' ')[0] || user.name || 'N/A',
            lastName: user.name?.split(' ').slice(1).join(' ') || '',
            email: user.email,
            role: user.role,
            university: user.university?.name || 'N/A',
            department: user.department?.name || 'N/A',
            status: user.isActive ? 'active' : 'inactive',
            registeredDate: user.createdAt,
            approvedDate: user.approvedAt || user.createdAt,
            rollNumber: user.rollNumber || null,
            employeeId: user.employeeId || null,
            phone: user.phone || 'N/A'
          }));
          
          setUsers(mappedUsers);
          console.log(`Loaded ${mappedUsers.length} users from database`);
        } else {
          console.error('Invalid response format');
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]); // Set empty array instead of mock data
      }
    };

    fetchUsers();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };
  const handleLogout = () => { sessionStorage.clear(); localStorage.removeItem('token'); localStorage.removeItem('userRole'); localStorage.removeItem('userEmail'); navigate('/login'); };
  const getRoleBadgeColor = (role) => ({ student: { bg: '#DBEAFE', color: '#1E40AF' }, faculty: { bg: '#D1FAE5', color: '#065F46' }, academic_admin: { bg: '#FEF3C7', color: '#92400E' }, nonacademic_admin: { bg: '#FCE7F3', color: '#9F1239' }, superadmin: { bg: '#F3E8FF', color: '#6B21A8' } }[role] || { bg: '#F3F4F6', color: '#374151' });
  const getRoleDisplayName = (role) => ({ student: 'Student', faculty: 'Faculty', academic_admin: 'HOD', nonacademic_admin: 'Admin', superadmin: 'Super Admin' }[role] || role);

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = user.firstName.toLowerCase().includes(searchLower) || user.lastName.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower) || (user.rollNumber && user.rollNumber.toLowerCase().includes(searchLower)) || (user.employeeId && user.employeeId.toLowerCase().includes(searchLower));
    if (!matchesSearch) return false;
    if (filters.university !== 'all' && user.university !== filters.university) return false;
    if (filters.role !== 'all' && user.role !== filters.role) return false;
    if (filters.status !== 'all' && user.status !== filters.status) return false;
    if (filters.department !== 'all' && user.department !== filters.department) return false;
    return true;
  });

  const stats = { total: users.length, active: users.filter(u => u.status === 'active').length, inactive: users.filter(u => u.status === 'inactive').length, students: users.filter(u => u.role === 'student').length, faculty: users.filter(u => u.role === 'faculty').length, admins: users.filter(u => u.role.includes('admin')).length };
  const handleEditClick = (user) => { setSelectedUser(user); setEditFormData({ ...user }); setShowEditModal(true); };
  const handleDeleteClick = (user) => { setSelectedUser(user); setShowDeleteModal(true); };
  const handleStatusToggle = (userId) => { setUsers(users.map(user => { if (user.id === userId) { const newStatus = user.status === 'active' ? 'inactive' : 'active'; showToast(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`); return { ...user, status: newStatus }; } return user; })); };
  const handleEditSave = () => { setUsers(users.map(user => user.id === selectedUser.id ? { ...editFormData } : user)); showToast('User details updated successfully!'); setShowEditModal(false); setSelectedUser(null); };
  const handleDeleteConfirm = () => { setUsers(users.filter(user => user.id !== selectedUser.id)); showToast('User deleted successfully!', 'success'); setShowDeleteModal(false); setSelectedUser(null); };

  return <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB',fontFamily:'system-ui'}}>
    {toast.show && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:toast.type==='error'?'#EF4444':'#10B981',color:'white',padding:'16px 24px',borderRadius:'8px',boxShadow:'0 4px 6px rgba(0,0,0,0.1)',zIndex:2000,fontSize:'14px',fontWeight:'600'}}>{toast.message}</div>}
    <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'20px 40px',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
      <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
        <div style={{fontSize:'24px',fontWeight:'bold',background:'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>UniFlow</div>
        <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',margin:0}}>Super Admin - Global User Management</h1>
      </div>
      <button style={{padding:'10px 20px',backgroundColor:'white',color:'#4F46E5',border:'2px solid #4F46E5',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}} onClick={handleLogout}>Logout</button>
    </div>
    <div style={{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'0 40px',display:'flex',gap:'8px',overflowX:'auto'}}>
      <button onClick={()=>navigate('/superadmin/dashboard')} style={{padding:'16px 24px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'14px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap'}}>📊 Dashboard</button>
      <button onClick={()=>navigate('/superadmin/approval-queue')} style={{padding:'16px 24px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'14px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap'}}>✓ Approval Queue</button>
      <button onClick={()=>navigate('/superadmin/global-analytics')} style={{padding:'16px 24px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'14px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap'}}>📈 Global Analytics</button>
      <button onClick={()=>navigate('/superadmin/event-calendar')} style={{padding:'16px 24px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid transparent',fontSize:'14px',fontWeight:'600',color:'#6B7280',cursor:'pointer',whiteSpace:'nowrap'}}>📅 Event Calendar</button>
      <button onClick={()=>navigate('/superadmin/user-management')} style={{padding:'16px 24px',backgroundColor:'transparent',border:'none',borderBottom:'3px solid #4F46E5',fontSize:'14px',fontWeight:'600',color:'#4F46E5',cursor:'pointer',whiteSpace:'nowrap'}}>👥 User Management</button>
    </div>
    <div style={{padding:'40px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'16px',marginBottom:'32px'}}>
        {[{label:'Total Users',value:stats.total},{label:'Active Users',value:stats.active},{label:'Inactive Users',value:stats.inactive},{label:'Students',value:stats.students},{label:'Faculty',value:stats.faculty},{label:'Admins',value:stats.admins}].map((stat,i)=><div key={i} style={{backgroundColor:'white',borderRadius:'12px',padding:'20px',border:'1px solid #E5E7EB'}}><p style={{fontSize:'13px',color:'#6B7280',margin:0}}>{stat.label}</p><h2 style={{fontSize:'28px',fontWeight:'bold',color:'#4F46E5',margin:'8px 0'}}>{stat.value}</h2></div>)}
      </div>
      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'24px',marginBottom:'24px',border:'1px solid #E5E7EB'}}>
        <h3 style={{fontSize:'16px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>🔍 Search & Filter Users</h3>
        <input type="text" placeholder="Search by name, email, roll number, or employee ID..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} style={{width:'100%',padding:'12px 16px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',marginBottom:'20px',outline:'none'}}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'16px'}}>
          {[{label:'University',options:['All Universities','JNTU Hyderabad','JNTU Kakinada','Osmania University','Andhra University'],key:'university'},{label:'Role',options:['All Roles','Student','Faculty','HOD','Admin'],values:['all','student','faculty','academic_admin','nonacademic_admin'],key:'role'},{label:'Status',options:['All Status','Active','Inactive'],values:['all','active','inactive'],key:'status'},{label:'Department',options:['All Departments','Computer Science','Electronics','Mechanical','Civil Engineering','Training & Placement','Sports'],key:'department'}].map((f,i)=><div key={i}><label style={{fontSize:'13px',fontWeight:'600',color:'#374151'}}>{f.label}</label><select style={{width:'100%',padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',backgroundColor:'white',cursor:'pointer'}} value={filters[f.key]} onChange={(e)=>setFilters({...filters,[f.key]:e.target.value})}>{f.options.map((opt,j)=><option key={j} value={f.values?f.values[j]:opt.toLowerCase().replace(/ /g,'').replace('alluniversities','all').replace('allroles','all').replace('allstatus','all').replace('alldepartments','all')}>{opt}</option>)}</select></div>)}
        </div>
      </div>
      {filteredUsers.length > 0 ? <div style={{backgroundColor:'white',borderRadius:'12px',border:'1px solid #E5E7EB',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Name','Email','Role','University','Department','Status','Registered','Actions'].map((h,i)=><th key={i} style={{backgroundColor:'#F9FAFB',padding:'16px',textAlign:'left',fontSize:'13px',fontWeight:'600',color:'#374151',borderBottom:'1px solid #E5E7EB'}}>{h}</th>)}</tr></thead>
          <tbody>{filteredUsers.map(user=>{const roleColors=getRoleBadgeColor(user.role);return <tr key={user.id}>
            <td style={{padding:'16px',fontSize:'14px',color:'#6B7280',borderBottom:'1px solid #F3F4F6'}}><div style={{fontWeight:'600',color:'#1F2937'}}>{user.firstName} {user.lastName}</div><div style={{fontSize:'12px',color:'#9CA3AF',marginTop:'2px'}}>{user.rollNumber||user.employeeId||'-'}</div></td>
            <td style={{padding:'16px',fontSize:'14px',color:'#6B7280',borderBottom:'1px solid #F3F4F6'}}>{user.email}</td>
            <td style={{padding:'16px',fontSize:'14px',color:'#6B7280',borderBottom:'1px solid #F3F4F6'}}><span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:roleColors.bg,color:roleColors.color}}>{getRoleDisplayName(user.role)}</span></td>
            <td style={{padding:'16px',fontSize:'14px',color:'#6B7280',borderBottom:'1px solid #F3F4F6'}}>{user.university}</td>
            <td style={{padding:'16px',fontSize:'14px',color:'#6B7280',borderBottom:'1px solid #F3F4F6'}}>{user.department}</td>
            <td style={{padding:'16px',fontSize:'14px',color:'#6B7280',borderBottom:'1px solid #F3F4F6'}}><span style={{padding:'4px 12px',borderRadius:'12px',fontSize:'12px',fontWeight:'600',backgroundColor:user.status==='active'?'#D1FAE5':'#FEE2E2',color:user.status==='active'?'#065F46':'#991B1B'}}>{user.status.toUpperCase()}</span></td>
            <td style={{padding:'16px',fontSize:'14px',color:'#6B7280',borderBottom:'1px solid #F3F4F6'}}><div>{new Date(user.registeredDate).toLocaleDateString('en-IN')}</div><div style={{fontSize:'11px',color:'#9CA3AF'}}>Approved: {new Date(user.approvedDate).toLocaleDateString('en-IN')}</div></td>
            <td style={{padding:'16px',fontSize:'14px',color:'#6B7280',borderBottom:'1px solid #F3F4F6'}}><div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              <button style={{padding:'6px 12px',fontSize:'12px',fontWeight:'600',borderRadius:'6px',border:'none',cursor:'pointer',backgroundColor:'#DBEAFE',color:'#1E40AF'}} onClick={()=>handleEditClick(user)}>✏️ Edit</button>
              <button style={{padding:'6px 12px',fontSize:'12px',fontWeight:'600',borderRadius:'6px',border:'none',cursor:'pointer',backgroundColor:user.status==='active'?'#FEF3C7':'#D1FAE5',color:user.status==='active'?'#92400E':'#065F46'}} onClick={()=>handleStatusToggle(user.id)}>{user.status==='active'?'🔒 Deactivate':'✅ Activate'}</button>
              <button style={{padding:'6px 12px',fontSize:'12px',fontWeight:'600',borderRadius:'6px',border:'none',cursor:'pointer',backgroundColor:'#FEE2E2',color:'#991B1B'}} onClick={()=>handleDeleteClick(user)}>🗑️ Delete</button>
            </div></td>
          </tr>})}</tbody>
        </table>
      </div> : <div style={{textAlign:'center',padding:'60px 20px',color:'#6B7280',backgroundColor:'white',borderRadius:'12px',border:'1px solid #E5E7EB'}}><div style={{fontSize:'48px',marginBottom:'16px'}}>👥</div><h3 style={{fontSize:'18px'}}>No users found</h3><p>Try adjusting your search or filters</p></div>}
    </div>
    {showEditModal && <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowEditModal(false)}>
      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'600px',width:'90%',maxHeight:'90vh',overflowY:'auto'}} onClick={(e)=>e.stopPropagation()}>
        <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',marginBottom:'24px'}}>✏️ Edit User Details</h2>
        {[{label:'First Name',key:'firstName'},{label:'Last Name',key:'lastName'},{label:'Email',key:'email'},{label:'Phone',key:'phone'},{label:'Department',key:'department'}].map((field,i)=><div key={i} style={{marginBottom:'20px'}}><label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'8px'}}>{field.label}</label><input type="text" value={editFormData[field.key]||''} onChange={(e)=>setEditFormData({...editFormData,[field.key]:e.target.value})} style={{width:'100%',padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',outline:'none',boxSizing:'border-box'}}/></div>)}
        <div style={{marginBottom:'20px'}}><label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'8px'}}>Role</label><select value={editFormData.role||''} onChange={(e)=>setEditFormData({...editFormData,role:e.target.value})} style={{width:'100%',padding:'10px 12px',fontSize:'14px',border:'2px solid #E5E7EB',borderRadius:'8px',outline:'none',boxSizing:'border-box'}}><option value="student">Student</option><option value="faculty">Faculty</option><option value="academic_admin">HOD</option><option value="nonacademic_admin">Admin</option></select></div>
        <div style={{display:'flex',gap:'12px',justifyContent:'flex-end',marginTop:'24px'}}>
          <button style={{padding:'10px 20px',backgroundColor:'#F3F4F6',color:'#374151',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowEditModal(false)}>Cancel</button>
          <button style={{padding:'10px 20px',backgroundColor:'#4F46E5',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={handleEditSave}>Save Changes</button>
        </div>
      </div>
    </div>}
    {showDeleteModal && <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000}} onClick={()=>setShowDeleteModal(false)}>
      <div style={{backgroundColor:'white',borderRadius:'12px',padding:'32px',maxWidth:'500px',width:'90%'}} onClick={(e)=>e.stopPropagation()}>
        <h2 style={{fontSize:'20px',fontWeight:'600',color:'#1F2937',marginBottom:'16px'}}>🗑️ Delete User</h2>
        <p style={{color:'#6B7280',marginBottom:'24px'}}>Are you sure you want to delete <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>? This action cannot be undone.</p>
        <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}>
          <button style={{padding:'10px 20px',backgroundColor:'#F3F4F6',color:'#374151',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShowDeleteModal(false)}>Cancel</button>
          <button style={{padding:'10px 20px',backgroundColor:'#EF4444',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer'}} onClick={handleDeleteConfirm}>Delete User</button>
        </div>
      </div>
    </div>}
  </div>;
};

export default GlobalUserManagement;
