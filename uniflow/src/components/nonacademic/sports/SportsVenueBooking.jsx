import React, { useState, useEffect } from 'react';

const SportsVenueBooking = () => {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);

  const handleBookVenue = (bookingData) => {
    console.log('Booking venue:', bookingData);
    // Book stadiums/grounds
  };

  return (
    <div className="sports-venue-booking">
      <h2>Sports Venue Booking</h2>
      <div className="booking-form">
        <h3>Book Venue</h3>
        <select>
          <option value="">Select Venue</option>
          {venues.map(venue => (
            <option key={venue.id} value={venue.id}>
              {venue.name} - {venue.sport}
            </option>
          ))}
        </select>
        <input type="date" />
        <input type="time" placeholder="Start Time" />
        <input type="time" placeholder="End Time" />
        <input type="text" placeholder="Purpose" />
        <button onClick={handleBookVenue}>Book Venue</button>
      </div>
      <div className="bookings-calendar">
        <h3>Venue Schedule</h3>
        <table>
          <thead>
            <tr>
              <th>Venue</th>
              <th>Date</th>
              <th>Time</th>
              <th>Purpose</th>
              <th>Booked By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.venueName}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>{booking.purpose}</td>
                <td>{booking.bookedBy}</td>
                <td>
                  <button>Cancel</button>
                  <button>Modify</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SportsVenueBooking;
