import React, { useState, useEffect } from 'react';

const VenueBooking = () => {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);

  const handleBookVenue = (venueId, date, time) => {
    console.log('Booking venue:', venueId, 'for', date, time);
    // Book rooms/labs for events
  };

  return (
    <div className="venue-booking">
      <h2>Venue Booking</h2>
      <div className="booking-form">
        <select>
          <option value="">Select Venue</option>
          {venues.map(venue => (
            <option key={venue.id} value={venue.id}>{venue.name}</option>
          ))}
        </select>
        <input type="date" />
        <input type="time" />
        <button onClick={handleBookVenue}>Book Venue</button>
      </div>
      <div className="bookings-list">
        <h3>Upcoming Bookings</h3>
        <table>
          <thead>
            <tr>
              <th>Venue</th>
              <th>Date</th>
              <th>Time</th>
              <th>Event</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.venueName}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>{booking.eventName}</td>
                <td><button>Cancel</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VenueBooking;
