import React, { useState } from 'react';

const FacultyAllocation = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleAllocateFaculty = (eventId, facultyId) => {
    console.log('Allocating faculty:', facultyId, 'to event:', eventId);
    // Assign faculty to events
  };

  return (
    <div className="faculty-allocation">
      <h2>Faculty Allocation</h2>
      <div className="allocation-form">
        <select onChange={(e) => setSelectedEvent(e.target.value)}>
          <option value="">Select Event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
        <select>
          <option value="">Select Faculty</option>
        </select>
        <button onClick={handleAllocateFaculty}>Allocate</button>
      </div>
      <div className="allocation-list">
        <h3>Current Allocations</h3>
        {/* Display current faculty allocations */}
      </div>
    </div>
  );
};

export default FacultyAllocation;
