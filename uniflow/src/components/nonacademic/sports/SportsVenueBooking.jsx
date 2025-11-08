import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SportsTopNav from './SportsTopNav';
import { FiMapPin, FiCalendar, FiClock, FiUser, FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiFilter } from 'react-icons/fi';

const SportsVenueBooking = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterVenue, setFilterVenue] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [newBooking, setNewBooking] = useState({
    venueId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedParticipants: 0,
    equipment: '',
    notes: ''
  });

  useEffect(() => {
    // TODO: Fetch venues and bookings from API
    // fetchVenues();
    // fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    if (filterDate) {
      filtered = filtered.filter(booking => booking.date === filterDate);
    }

    if (filterVenue !== 'all') {
      filtered = filtered.filter(booking => booking.venueId === filterVenue);
    }

    setFilteredBookings(filtered);
  }, [bookings, filterDate, filterVenue]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleBookVenue = async () => {
    try {
      // TODO: API call to create booking
      showToast('Venue booked successfully!');
      setShowBookingModal(false);
      setNewBooking({
        venueId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedParticipants: 0,
        equipment: '',
        notes: ''
      });
    } catch (error) {
      showToast('Failed to book venue', 'error');
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.filter(b => b.id !== bookingId));
      showToast('Booking cancelled successfully');
    }
  };

  const getVenueTypeColor = (type) => {
    const colors = {
      stadium: { bg: '#DBEAFE', text: '#1E40AF', icon: '🏟️' },
      ground: { bg: '#D1FAE5', text: '#065F46', icon: '⚽' },
      court: { bg: '#FEF3C7', text: '#92400E', icon: '🏀' },
      hall: { bg: '#FCE7F3', text: '#9F1239', icon: '🏛️' },
      pool: { bg: '#E0E7FF', text: '#3730A3', icon: '🏊' }
    };
    return colors[type] || colors.ground;
  };

  const getBookingStatusColor = (status) => {
    const colors = {
      confirmed: { bg: '#D1FAE5', text: '#065F46' },
      pending: { bg: '#FEF3C7', text: '#92400E' },
      cancelled: { bg: '#FEE2E2', text: '#991B1B' }
    };
    return colors[status] || colors.confirmed;
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'system-ui'}}>
      {toast.show && (
        <div style={{position: 'fixed', top: '20px', right: '20px', backgroundColor: toast.type === 'error' ? '#EF4444' : '#10B981', color: 'white', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 2000}}>
          {toast.message}
        </div>
      )}

      <SportsTopNav />

      {/* Page Header */}
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '20px 40px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0}}>Venue Booking</h1>
            <p style={{fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0'}}>Book and manage sports venue reservations</p>
          </div>
          <button onClick={() => setShowBookingModal(true)} style={{padding: '12px 24px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <FiPlus size={18} /> Book Venue
          </button>
        </div>
      </div>

      <div style={{padding: '40px'}}>
        {/* Available Venues */}
        <div style={{marginBottom: '40px'}}>
          <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '20px'}}>Available Venues</h2>
          
          {venues.length === 0 ? (
            <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '2px dashed #E5E7EB'}}>
              <FiMapPin size={48} color="#9CA3AF" style={{margin: '0 auto 16px'}} />
              <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0'}}>No venues available</h3>
              <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>Contact administrator to add venues</p>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px'}}>
              {venues.map((venue) => {
                const typeColors = getVenueTypeColor(venue.type);
                
                return (
                  <div key={venue.id} style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.3s'}} onMouseEnter={(e) => {e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)';}} onMouseLeave={(e) => {e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)';}}>
                    <div style={{fontSize: '32px', marginBottom: '12px'}}>{typeColors.icon}</div>
                    <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0'}}>{venue.name}</h3>
                    <div style={{marginBottom: '16px'}}>
                      <span style={{padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', backgroundColor: typeColors.bg, color: typeColors.text}}>
                        {venue.type}
                      </span>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px'}}>
                      <div style={{fontSize: '14px', color: '#6B7280'}}>
                        <strong>Capacity:</strong> {venue.capacity} people
                      </div>
                      <div style={{fontSize: '14px', color: '#6B7280'}}>
                        <strong>Sports:</strong> {venue.sports?.join(', ') || 'N/A'}
                      </div>
                      <div style={{fontSize: '14px', color: '#6B7280'}}>
                        <strong>Facilities:</strong> {venue.facilities?.join(', ') || 'N/A'}
                      </div>
                    </div>
                    <button onClick={() => {setNewBooking({...newBooking, venueId: venue.id}); setShowBookingModal(true);}} style={{width: '100%', padding: '10px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>
                      Book This Venue
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bookings List */}
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: 0}}>My Bookings</h2>
            
            <div style={{display: 'flex', gap: '12px'}}>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{padding: '8px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} />
              
              <select value={filterVenue} onChange={(e) => setFilterVenue(e.target.value)} style={{padding: '8px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white'}}>
                <option value="all">All Venues</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>{venue.name}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div style={{backgroundColor: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '2px dashed #E5E7EB'}}>
              <FiCalendar size={48} color="#9CA3AF" style={{margin: '0 auto 16px'}} />
              <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0'}}>No bookings found</h3>
              <p style={{fontSize: '14px', color: '#6B7280', margin: 0}}>Book a venue to get started</p>
            </div>
          ) : (
            <div style={{backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB'}}>
                    <th style={{padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6B7280'}}>Venue</th>
                    <th style={{padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6B7280'}}>Date</th>
                    <th style={{padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6B7280'}}>Time</th>
                    <th style={{padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6B7280'}}>Purpose</th>
                    <th style={{padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6B7280'}}>Status</th>
                    <th style={{padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6B7280'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => {
                    const statusColors = getBookingStatusColor(booking.status);
                    
                    return (
                      <tr key={booking.id} style={{borderBottom: index < filteredBookings.length - 1 ? '1px solid #E5E7EB' : 'none'}}>
                        <td style={{padding: '16px', fontSize: '14px', color: '#1F2937', fontWeight: '500'}}>{booking.venueName}</td>
                        <td style={{padding: '16px', fontSize: '14px', color: '#6B7280'}}>{booking.date}</td>
                        <td style={{padding: '16px', fontSize: '14px', color: '#6B7280'}}>{booking.startTime} - {booking.endTime}</td>
                        <td style={{padding: '16px', fontSize: '14px', color: '#6B7280'}}>{booking.purpose}</td>
                        <td style={{padding: '16px'}}>
                          <span style={{padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', backgroundColor: statusColors.bg, color: statusColors.text}}>
                            {booking.status}
                          </span>
                        </td>
                        <td style={{padding: '16px'}}>
                          <div style={{display: 'flex', gap: '8px'}}>
                            {booking.status === 'confirmed' && (
                              <>
                                <button onClick={() => navigate(`/sports/booking-edit/${booking.id}`)} style={{padding: '6px 12px', backgroundColor: '#FEF3C7', color: '#92400E', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
                                  <FiEdit size={14} />
                                </button>
                                <button onClick={() => handleCancelBooking(booking.id)} style={{padding: '6px 12px', backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
                                  <FiTrash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}} onClick={() => setShowBookingModal(false)}>
          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto'}} onClick={(e) => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0}}>Book Venue</h2>
              <button onClick={() => setShowBookingModal(false)} style={{padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer'}}>
                <FiX size={24} color="#6B7280" />
              </button>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Venue *</label>
                <select value={newBooking.venueId} onChange={(e) => setNewBooking({...newBooking, venueId: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white'}}>
                  <option value="">Select Venue</option>
                  {venues.map(venue => (
                    <option key={venue.id} value={venue.id}>{venue.name} - {venue.type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Date *</label>
                <input type="date" value={newBooking.date} onChange={(e) => setNewBooking({...newBooking, date: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Start Time *</label>
                  <input type="time" value={newBooking.startTime} onChange={(e) => setNewBooking({...newBooking, startTime: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} />
                </div>
                
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>End Time *</label>
                  <input type="time" value={newBooking.endTime} onChange={(e) => setNewBooking({...newBooking, endTime: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} />
                </div>
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Purpose *</label>
                <input type="text" value={newBooking.purpose} onChange={(e) => setNewBooking({...newBooking, purpose: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} placeholder="e.g., Basketball Practice" />
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Expected Participants</label>
                <input type="number" value={newBooking.expectedParticipants} onChange={(e) => setNewBooking({...newBooking, expectedParticipants: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} placeholder="Number of participants" />
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Equipment Needed</label>
                <input type="text" value={newBooking.equipment} onChange={(e) => setNewBooking({...newBooking, equipment: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}} placeholder="e.g., Basketball, Scoreboard" />
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Additional Notes</label>
                <textarea value={newBooking.notes} onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})} style={{width: '100%', padding: '10px 12px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', minHeight: '80px'}} placeholder="Any special requirements..." />
              </div>

              <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
                <button onClick={handleBookVenue} style={{flex: 1, padding: '12px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>
                  Confirm Booking
                </button>
                <button onClick={() => setShowBookingModal(false)} style={{flex: 1, padding: '12px', backgroundColor: '#F3F4F6', color: '#1F2937', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsVenueBooking;
