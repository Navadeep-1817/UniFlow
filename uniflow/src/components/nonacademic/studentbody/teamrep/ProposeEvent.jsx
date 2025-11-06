import React, { useState } from 'react';

const ProposeEvent = () => {
  const [eventData, setEventData] = useState({
    name: '',
    type: '',
    date: '',
    venue: '',
    budget: '',
    description: ''
  });

  const handleSubmitProposal = (e) => {
    e.preventDefault();
    console.log('Submitting event proposal:', eventData);
    // Create event proposal (needs faculty approval)
  };

  return (
    <div className="propose-event">
      <h2>Propose New Event</h2>
      <form onSubmit={handleSubmitProposal}>
        <input
          type="text"
          placeholder="Event Name"
          value={eventData.name}
          onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
        />
        <select
          value={eventData.type}
          onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
        >
          <option value="">Select Event Type</option>
          <option value="cultural">Cultural</option>
          <option value="technical">Technical</option>
          <option value="sports">Sports</option>
          <option value="workshop">Workshop</option>
        </select>
        <input
          type="date"
          value={eventData.date}
          onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Venue"
          value={eventData.venue}
          onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
        />
        <input
          type="number"
          placeholder="Budget Required"
          value={eventData.budget}
          onChange={(e) => setEventData({ ...eventData, budget: e.target.value })}
        />
        <textarea
          placeholder="Event Description"
          value={eventData.description}
          onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
        />
        <button type="submit">Submit Proposal</button>
      </form>
    </div>
  );
};

export default ProposeEvent;
