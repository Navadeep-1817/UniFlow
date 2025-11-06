import React, { useState, useEffect } from 'react';

const EventApproval = () => {
  const [pendingEvents, setPendingEvents] = useState([]);

  const handleApproval = (eventId, status, feedback) => {
    console.log('Event approval:', eventId, status);
    // Approve events proposed by team representative
  };

  return (
    <div className="event-approval">
      <h2>Event Approval Queue</h2>
      <div className="pending-events-list">
        {pendingEvents.map(event => (
          <div key={event.id} className="event-approval-card">
            <h3>{event.name}</h3>
            <p>Proposed by: {event.proposedBy}</p>
            <p>Date: {event.date}</p>
            <p>Budget Required: ₹{event.budget}</p>
            <p>Venue: {event.venue}</p>
            <div className="event-details">
              <h4>Description:</h4>
              <p>{event.description}</p>
            </div>
            <div className="approval-actions">
              <button onClick={() => handleApproval(event.id, 'approved', '')}>
                Approve
              </button>
              <button onClick={() => handleApproval(event.id, 'rejected', '')}>
                Reject
              </button>
              <button>Request Changes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventApproval;
