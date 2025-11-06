import React, { useState, useEffect } from 'react';

const StudentBodyEvents = () => {
  const [events, setEvents] = useState([]);
  const [eventType, setEventType] = useState('');

  const handleCreateEvent = (eventData) => {
    console.log('Creating student body event:', eventData);
    // Create cultural/technical/sports events
  };

  return (
    <div className="student-body-events">
      <h2>Student Body Events</h2>
      <button onClick={() => console.log('Create Event')}>Create New Event</button>
      <div className="event-type-filters">
        <button onClick={() => setEventType('cultural')}>Cultural</button>
        <button onClick={() => setEventType('technical')}>Technical</button>
        <button onClick={() => setEventType('sports')}>Sports</button>
      </div>
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <p>Type: {event.type}</p>
            <p>Date: {event.date}</p>
            <p>Status: {event.status}</p>
            <button>View Details</button>
            <button>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentBodyEvents;
