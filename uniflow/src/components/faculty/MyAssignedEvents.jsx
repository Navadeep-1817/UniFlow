import React, { useState, useEffect } from 'react';

const MyAssignedEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events assigned by HOD/Placement
  }, []);

  return (
    <div className="my-assigned-events">
      <h2>My Assigned Events</h2>
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <p>Type: {event.type}</p>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
            <p>Venue: {event.venue}</p>
            <p>Assigned by: {event.assignedBy}</p>
            <button>View Details</button>
            <button>Manage Sessions</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAssignedEvents;
