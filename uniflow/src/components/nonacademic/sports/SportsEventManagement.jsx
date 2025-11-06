import React, { useState, useEffect } from 'react';

const SportsEventManagement = () => {
  const [events, setEvents] = useState([]);

  const handleCreateEvent = (eventData) => {
    console.log('Creating sports event:', eventData);
    // Organize tournaments, sports meets
  };

  return (
    <div className="sports-event-management">
      <h2>Sports Event Management</h2>
      <button onClick={() => console.log('Create Event')}>Create New Event</button>
      <div className="event-types">
        <button>Tournament</button>
        <button>Sports Meet</button>
        <button>Practice Session</button>
      </div>
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <p>Sport: {event.sport}</p>
            <p>Date: {event.date}</p>
            <p>Venue: {event.venue}</p>
            <p>Teams: {event.teamsCount}</p>
            <button>View Details</button>
            <button>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportsEventManagement;
