import React, { useState, useEffect } from 'react';

const AttendanceTracking = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);

  const handleMarkAttendance = (studentId) => {
    console.log('Marking attendance for:', studentId);
    // Mark attendance for body events
  };

  return (
    <div className="attendance-tracking">
      <h2>Attendance Tracking</h2>
      <select onChange={(e) => setSelectedEvent(e.target.value)}>
        <option value="">Select Event</option>
        {events.map(event => (
          <option key={event.id} value={event.id}>{event.name}</option>
        ))}
      </select>
      {selectedEvent && (
        <div className="attendance-section">
          <h3>Mark Attendance</h3>
          <button>Scan QR Code</button>
          <button>Manual Entry</button>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map(attendee => (
                <tr key={attendee.id}>
                  <td>{attendee.rollNo}</td>
                  <td>{attendee.name}</td>
                  <td>{attendee.status}</td>
                  <td>
                    <button onClick={() => handleMarkAttendance(attendee.id)}>
                      Mark Present
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracking;
