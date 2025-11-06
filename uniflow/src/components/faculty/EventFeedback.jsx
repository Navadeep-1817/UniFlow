import React, { useState, useEffect } from 'react';

const EventFeedback = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    // View feedback received
  }, [selectedEvent]);

  return (
    <div className="event-feedback">
      <h2>Event Feedback</h2>
      <select onChange={(e) => setSelectedEvent(e.target.value)}>
        <option value="">Select Event</option>
        {events.map(event => (
          <option key={event.id} value={event.id}>{event.name}</option>
        ))}
      </select>
      {selectedEvent && (
        <>
          <div className="feedback-summary">
            <div className="summary-card">
              <h3>Overall Rating</h3>
              <p>4.5/5</p>
            </div>
            <div className="summary-card">
              <h3>Total Responses</h3>
              <p>120</p>
            </div>
            <div className="summary-card">
              <h3>Response Rate</h3>
              <p>85%</p>
            </div>
          </div>
          <div className="feedback-list">
            <h3>Student Feedback</h3>
            {feedback.map(item => (
              <div key={item.id} className="feedback-item">
                <p><strong>Rating:</strong> {item.rating}/5</p>
                <p><strong>Comment:</strong> {item.comment}</p>
                <p><small>By: {item.studentName} on {item.date}</small></p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventFeedback;
