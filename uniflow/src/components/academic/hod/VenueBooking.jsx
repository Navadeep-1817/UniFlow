import React, { useState, useEffect } from 'react';
import HODTopNav from './HODTopNav';
import { FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiAlertCircle, FiX, FiEdit, FiTrash2, FiFilter, FiSearch, FiUsers, FiPlus } from 'react-icons/fi';

const VenueBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const mockBookings = [
      { id: 1, venueName: 'Conference Hall A', venueType: 'Seminar Hall', capacity: 100, eventName: 'AI Workshop', eventType: 'FDP', requestedBy: 'Dr. Priya Sharma', department: 'CSE', date: '2024-12-15', startTime: '09:00', endTime: '17:00', attendees: 60, purpose: 'Faculty Development Program on AI', status: 'pending', requestedOn: '2024-11-20' },
      { id: 2, venueName: 'Computer Lab 1', venueType: 'Lab', capacity: 60, eventName: 'Python Workshop', eventType: 'SDP', requestedBy: 'Prof. Rajesh Kumar', department: 'CSE', date: '2024-12-18', startTime: '10:00', endTime: '16:00', attendees: 50, purpose: 'Student skill development', status: 'approved', requestedOn: '2024-11-18' },
      { id: 3, venueName: 'Auditorium', venueType: 'Auditorium', capacity: 300, eventName: 'Tech Fest', eventType: 'Event', requestedBy: 'Student Council', department: 'CSE', date: '2024-12-25', startTime: '09:00', endTime: '18:00', attendees: 250, purpose: 'Annual technical festival', status: 'approved', requestedOn: '2024-11-15' },
      { id: 4, venueName: 'Seminar Room 201', venueType: 'Classroom', capacity: 40, eventName: 'Guest Lecture', eventType: 'Workshop', requestedBy: 'Dr. Anita Desai', department: 'CSE', date: '2024-12-10', startTime: '14:00', endTime: '16:00', attendees: 35, purpose: 'Industry expert session', status: 'rejected', rejectionReason: 'Venue already booked', requestedOn: '2024-11-10' }
    ];
    setBookings(mockBookings);
  }, []);

  const showToast = (message, type = 'success') => { setToast({ show: true, message, type }); setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000); };
  
  const handleApprove = (id) => { setBookings(bookings.map(b => b.id === id ? { ...b, status: 'approved' } : b)); showToast('Booking approved!'); };
  const handleReject = (id) => { const reason = prompt('Rejection reason:'); if (reason) { setBookings(bookings.map(b => b.id === id ? { ...b, status: 'rejected', rejectionReason: reason } : b)); showToast('Booking rejected!', 'error'); } };
  const handleCancel = (id) => { if (window.confirm('Cancel this booking?')) { setBookings(bookings.filter(b => b.id !== id)); showToast('Booking cancelled!'); } };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: '#FEF3C7', color: '#92400E', icon: <FiClock size={14} /> };
      case 'approved': return { bg: '#D1FAE5', color: '#065F46', icon: <FiCheckCircle size={14} /> };
      case 'rejected': return { bg: '#FEE2E2', color: '#991B1B', icon: <FiAlertCircle size={14} /> };
      default: return { bg: '#F3F4F6', color: '#6B7280', icon: <FiClock size={14} /> };
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch = b.venueName.toLowerCase().includes(searchQuery.toLowerCase()) || b.eventName.toLowerCase().includes(searchQuery.toLowerCase()) || b.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={styles.container}>
      <HODTopNav />
      {toast.show && <div style={{...styles.toast, backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444'}}>{toast.message}</div>}
      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div><h1 style={styles.pageTitle}>Venue Booking</h1><p style={styles.pageSubtitle}>Manage venue reservations for events</p></div>
        </div>
        <div style={styles.statsRow}>
          {[{icon: <FiMapPin size={24} />, value: bookings.length, label: 'Total Bookings', bg: '#EEF2FF', color: '#4F46E5'}, {icon: <FiClock size={24} />, value: bookings.filter(b => b.status === 'pending').length, label: 'Pending', bg: '#FEF3C7', color: '#F59E0B'}, {icon: <FiCheckCircle size={24} />, value: bookings.filter(b => b.status === 'approved').length, label: 'Approved', bg: '#D1FAE5', color: '#10B981'}, {icon: <FiAlertCircle size={24} />, value: bookings.filter(b => b.status === 'rejected').length, label: 'Rejected', bg: '#FEE2E2', color: '#EF4444'}].map((stat, i) => (
            <div key={i} style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}><div style={{...styles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div><div style={styles.statContent}><div style={styles.statValue}>{stat.value}</div><div style={styles.statLabel}>{stat.label}</div></div></div>
          ))}
        </div>
        <div style={styles.controlsBar}>
          <div style={styles.searchBox}><FiSearch size={18} color="#6B7280" /><input type="text" placeholder="Search venue, event, or requester..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} /></div>
          <div style={styles.filterGroup}><FiFilter size={16} /><span style={{fontSize: '14px', fontWeight: '600'}}>Status:</span><div style={styles.filterButtons}>{['all', 'pending', 'approved', 'rejected'].map(status => (<button key={status} onClick={() => setFilterStatus(status)} style={{...styles.filterBtn, backgroundColor: filterStatus === status ? '#4F46E5' : '#FFF', color: filterStatus === status ? '#FFF' : '#6B7280', border: filterStatus === status ? 'none' : '1px solid #E5E7EB'}} onMouseEnter={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1.05)'; }}} onMouseLeave={(e) => { if (filterStatus !== status) { e.currentTarget.style.backgroundColor = '#FFF'; e.currentTarget.style.transform = 'scale(1)'; }}}>{status.charAt(0).toUpperCase() + status.slice(1)}</button>))}</div></div>
        </div>
        <div style={styles.bookingsList}>
          {filteredBookings.length === 0 ? <div style={styles.emptyState}><FiMapPin size={48} color="#9CA3AF" /><p>No bookings found</p></div> : filteredBookings.map(booking => {
            const statusStyle = getStatusColor(booking.status);
            return (
              <div key={booking.id} style={styles.bookingCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
                <div style={styles.bookingHeader}>
                  <div>
                    <h3 style={styles.venueName}><FiMapPin size={18} /> {booking.venueName}</h3>
                    <div style={styles.venueMeta}><span style={styles.venueType}>{booking.venueType}</span><span style={styles.capacity}>Capacity: {booking.capacity}</span></div>
                  </div>
                  <div style={{...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color}}>{statusStyle.icon}<span>{booking.status}</span></div>
                </div>
                <div style={styles.eventInfo}>
                  <h4 style={styles.eventName}>{booking.eventName}</h4>
                  <p style={styles.purpose}>{booking.purpose}</p>
                  <div style={styles.bookingDetails}>
                    <div style={styles.detailItem}><FiCalendar size={14} color="#6B7280" /><span>{booking.date}</span></div>
                    <div style={styles.detailItem}><FiClock size={14} color="#6B7280" /><span>{booking.startTime} - {booking.endTime}</span></div>
                    <div style={styles.detailItem}><FiUsers size={14} color="#6B7280" /><span>{booking.attendees} attendees</span></div>
                  </div>
                  <div style={styles.requesterInfo}>
                    <span>Requested by: <strong>{booking.requestedBy}</strong></span>
                    <span>Department: {booking.department}</span>
                  </div>
                </div>
                <div style={styles.bookingFooter}>
                  <div style={styles.requestDate}>Requested on: {booking.requestedOn}</div>
                  <div style={styles.actionButtons}>
                    {booking.status === 'pending' && (<><button onClick={() => handleApprove(booking.id)} style={styles.approveBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#10B981'; e.currentTarget.style.transform = 'scale(1)'; }}><FiCheckCircle size={14} /> Approve</button><button onClick={() => handleReject(booking.id)} style={styles.rejectBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DC2626'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#EF4444'; e.currentTarget.style.transform = 'scale(1)'; }}><FiAlertCircle size={14} /> Reject</button></>)}
                    <button onClick={() => handleCancel(booking.id)} style={styles.cancelBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}><FiTrash2 size={16} /></button>
                  </div>
                </div>
                {booking.status === 'rejected' && booking.rejectionReason && (<div style={styles.rejectionNotice}><FiAlertCircle size={14} /><span>Reason: {booking.rejectionReason}</span></div>)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  content: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
  toast: { position: 'fixed', top: '20px', right: '20px', padding: '16px 24px', borderRadius: '8px', color: '#FFF', fontWeight: '500', zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  pageHeader: { marginBottom: '24px' },
  pageTitle: { fontSize: '32px', fontWeight: '700', color: '#1F2937', margin: 0 },
  pageSubtitle: { fontSize: '16px', color: '#6B7280', margin: '8px 0 0 0' },
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
  filterBtn: { padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  bookingsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#6B7280', backgroundColor: '#FFF', borderRadius: '12px' },
  bookingCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  bookingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' },
  venueName: { fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' },
  venueMeta: { display: 'flex', gap: '16px', fontSize: '14px', color: '#6B7280' },
  venueType: { padding: '4px 12px', backgroundColor: '#EEF2FF', color: '#4F46E5', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  capacity: { fontWeight: '500' },
  statusBadge: { padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize' },
  eventInfo: { marginBottom: '16px' },
  eventName: { fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0' },
  purpose: { fontSize: '14px', color: '#6B7280', margin: '0 0 12px 0' },
  bookingDetails: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '12px' },
  detailItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#374151' },
  requesterInfo: { display: 'flex', gap: '20px', fontSize: '14px', color: '#6B7280', paddingTop: '12px', borderTop: '1px solid #F3F4F6' },
  bookingFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #E5E7EB' },
  requestDate: { fontSize: '13px', color: '#9CA3AF' },
  actionButtons: { display: 'flex', gap: '8px' },
  approveBtn: { padding: '8px 16px', backgroundColor: '#10B981', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  rejectBtn: { padding: '8px 16px', backgroundColor: '#EF4444', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  cancelBtn: { padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  rejectionNotice: { marginTop: '12px', padding: '12px', backgroundColor: '#FEE2E2', borderRadius: '8px', color: '#991B1B', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }
};

export default VenueBooking;
