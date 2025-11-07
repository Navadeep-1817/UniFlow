import React, { useState, useEffect } from 'react';
import HODTopNav from './HODTopNav';
import { FiUserPlus, FiUsers, FiEdit, FiTrash2, FiX, FiSave, FiFilter, FiSearch, FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiBriefcase, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const TrainerRequest = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      showToast('Please login to continue', 'error');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching trainers from:', `${API_BASE_URL}/hod/trainers`);
      
      const response = await fetch(`${API_BASE_URL}/hod/trainers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Trainers response:', data);
      console.log('Trainers count:', data.count);
      console.log('Trainers data array:', data.data);
      
      if (response.ok && data.success) {
        console.log('Trainers received:', data.data);
        setTrainers(data.data || []);
      } else {
        console.error('Failed to fetch trainers:', data.message);
        showToast(data.message || 'Failed to fetch trainers', 'error');
        setTrainers([]);
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
      showToast('Unable to fetch trainers', 'error');
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => { 
    setToast({ show: true, message, type }); 
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000); 
  };

  const getStatusColor = (isVerified) => { 
    if (isVerified) {
      return { bg: '#D1FAE5', color: '#065F46', icon: <FiCheckCircle size={14} /> }; 
    }
    return { bg: '#FEF3C7', color: '#92400E', icon: <FiClock size={14} /> }; 
  };

  const filteredTrainers = trainers.filter(trainer => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'verified' && trainer.isVerified) ||
      (filterStatus === 'pending' && !trainer.isVerified);
    const matchesSearch = trainer.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         trainer.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trainer.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={styles.container}>
      <HODTopNav />
      {toast.show && <div style={{...styles.toast, backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444'}}>{toast.message}</div>}
      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Department Trainers</h1>
            <p style={styles.pageSubtitle}>View and manage trainers in your department</p>
          </div>
        </div>
        
        <div style={styles.statsRow}>
          {[
            {icon: <FiUsers size={24} />, value: trainers.length, label: 'Total Trainers', bg: '#EEF2FF', color: '#4F46E5'}, 
            {icon: <FiCheckCircle size={24} />, value: trainers.filter(t => t.isVerified).length, label: 'Verified', bg: '#D1FAE5', color: '#10B981'}, 
            {icon: <FiClock size={24} />, value: trainers.filter(t => !t.isVerified).length, label: 'Pending', bg: '#FEF3C7', color: '#F59E0B'},
            {icon: <FiBriefcase size={24} />, value: trainers.filter(t => t.eventsDelivered > 0).length, label: 'Active', bg: '#DBEAFE', color: '#3B82F6'}
          ].map((stat, i) => (
            <div key={i} style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
              <div style={{...styles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={styles.controlsBar}>
          <div style={styles.searchBox}>
            <FiSearch size={18} color="#6B7280" />
            <input type="text" placeholder="Search by name, organization, or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.filterGroup}>
            <FiFilter size={16} />
            <span>Status:</span>
            <div style={styles.filterButtons}>
              {['all', 'verified', 'pending'].map(status => (
                <button 
                  key={status} 
                  onClick={() => setFilterStatus(status)} 
                  style={{...styles.filterBtn, backgroundColor: filterStatus === status ? '#4F46E5' : '#FFF', color: filterStatus === status ? '#FFF' : '#6B7280'}} 
                  onMouseEnter={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; }}} 
                  onMouseLeave={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#FFF'; e.currentTarget.style.transform = 'scale(1)'; }}}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div style={styles.requestsList}>
          {loading ? (
            <div style={styles.emptyState}>
              <FiUsers size={48} color="#9CA3AF" />
              <p>Loading trainers...</p>
            </div>
          ) : filteredTrainers.length === 0 ? (
            <div style={styles.emptyState}>
              <FiUsers size={48} color="#9CA3AF" />
              <p>No trainers found in your department</p>
              <p style={{fontSize: '14px', color: '#9CA3AF', marginTop: '8px'}}>
                Trainers will appear here once they register with your department
              </p>
            </div>
          ) : (
            filteredTrainers.map(trainer => {
              const statusStyle = getStatusColor(trainer.isVerified);
              return (
                <div key={trainer._id} style={styles.requestCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
                  <div style={styles.requestHeader}>
                    <div>
                      <h3 style={styles.trainerName}>{trainer.name}</h3>
                      <div style={styles.trainerMeta}>
                        <span><FiBriefcase size={14} /> {trainer.organization || 'N/A'}</span>
                        <span>{trainer.designation || 'Trainer'}</span>
                      </div>
                    </div>
                    <div style={{...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color}}>
                      {statusStyle.icon}
                      <span>{trainer.isVerified ? 'Verified' : 'Pending'}</span>
                    </div>
                  </div>
                  
                  <div style={{marginTop: '16px'}}>
                    <div style={styles.programDetails}>
                      <div style={styles.detailItem}>
                        <FiMail size={14} />
                        <span>{trainer.email}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <FiPhone size={14} />
                        <span>{trainer.phone}</span>
                      </div>
                      {trainer.experience && (
                        <div style={styles.detailItem}>
                          <FiBriefcase size={14} />
                          <span>{trainer.experience} years experience</span>
                        </div>
                      )}
                    </div>
                    
                    {trainer.expertise && trainer.expertise.length > 0 && (
                      <div style={{marginTop: '12px'}}>
                        <strong style={{fontSize: '13px', color: '#6B7280'}}>Expertise: </strong>
                        <span style={{fontSize: '13px', color: '#374151'}}>
                          {trainer.expertise.map(e => e.domain).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div style={styles.requestFooter}>
                    <div style={{fontSize: '14px', color: '#6B7280'}}>
                      <strong>Events Delivered:</strong> {trainer.eventsDelivered || 0} | 
                      <strong style={{marginLeft: '12px'}}>Rating:</strong> {trainer.ratings?.averageRating?.toFixed(1) || 'N/A'} ⭐
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  content: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
  toast: { position: 'fixed', top: '20px', right: '20px', padding: '16px 24px', borderRadius: '8px', color: '#FFF', fontWeight: '500', zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  pageHeader: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  pageTitle: { fontSize: '32px', fontWeight: '700', color: '#1F2937', margin: 0 },
  pageSubtitle: { fontSize: '16px', color: '#6B7280', margin: '8px 0 0 0' },
  addBtn: { padding: '12px 24px', backgroundColor: '#4F46E5', border: 'none', borderRadius: '10px', color: '#FFF', cursor: 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  statIcon: { padding: '12px', borderRadius: '10px', flexShrink: 0 },
  statContent: { flex: 1 },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' },
  statLabel: { fontSize: '14px', color: '#6B7280' },
  controlsBar: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
  searchBox: { flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
  searchInput: { flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: '#1F2937' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  filterButtons: { display: 'flex', gap: '8px' },
  filterBtn: { padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', border: '1px solid #E5E7EB', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  requestsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#6B7280', backgroundColor: '#FFF', borderRadius: '12px' },
  requestCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  requestHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' },
  trainerName: { fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0' },
  trainerMeta: { display: 'flex', gap: '16px', fontSize: '14px', color: '#6B7280', alignItems: 'center' },
  statusBadge: { padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize' },
  programDetails: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' },
  detailItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280' },
  requestFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' },
  actionButtons: { display: 'flex', gap: '8px' },
  approveBtn: { padding: '8px 16px', backgroundColor: '#10B981', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  rejectBtn: { padding: '8px 16px', backgroundColor: '#EF4444', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  editBtn: { padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px', color: '#3B82F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  deleteBtn: { padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }
};

export default TrainerRequest;
