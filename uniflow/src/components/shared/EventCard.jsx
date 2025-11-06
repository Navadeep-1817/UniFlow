import React from 'react';

const EventCard = ({ event, onRegister, onViewDetails }) => {
  return (
    <div className="event-card">
      <div className="event-header">
        <h3>{event.name}</h3>
        <span className="event-type-badge">{event.type}</span>
      </div>
      <div className="event-body">
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Department:</strong> {event.department}</p>
      </div>
      <div className="event-footer">
        {onRegister && <button onClick={() => onRegister(event.id)}>Register</button>}
        {onViewDetails && <button onClick={() => onViewDetails(event.id)}>View Details</button>}
      </div>
    </div>
  );
};

export default EventCard;
