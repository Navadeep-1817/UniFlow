import React, { useState, useEffect } from 'react';

const EventExecution = () => {
  const [approvedEvents, setApprovedEvents] = useState([]);

  const handleStartEvent = (eventId) => {
    console.log('Starting event:', eventId);
    // Execute approved events
  };

  return (
    <div className="event-execution">
      <h2>Event Execution</h2>
      <div className="events-list">
        {approvedEvents.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <p>Date: {event.date}</p>
            <p>Venue: {event.venue}</p>
            <p>Status: {event.status}</p>
            <div className="event-actions">
              {event.status === 'approved' && (
                <button onClick={() => handleStartEvent(event.id)}>Start Event</button>
              )}
              {event.status === 'ongoing' && (
                <>
                  <button>Mark Attendance</button>
                  <button>Upload Photos</button>
                  <button>End Event</button>
                </>
              )}
              {event.status === 'completed' && (
                <>
                  <button>View Report</button>
                  <button>Collect Feedback</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventExecution;
