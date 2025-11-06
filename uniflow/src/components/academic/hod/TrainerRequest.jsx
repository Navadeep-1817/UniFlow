import React, { useState } from 'react';

const TrainerRequest = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleSubmitRequest = (requestData) => {
    console.log('Submitting trainer request:', requestData);
    // Request external trainers for events
  };

  return (
    <div className="trainer-request">
      <h2>Trainer Request</h2>
      <button onClick={() => setShowForm(true)}>Request Trainer</button>
      {showForm && (
        <div className="request-form">
          <input type="text" placeholder="Trainer Name" />
          <input type="text" placeholder="Specialization" />
          <input type="date" placeholder="Required Date" />
          <textarea placeholder="Event Details"></textarea>
          <button onClick={handleSubmitRequest}>Submit Request</button>
        </div>
      )}
      <div className="requests-list">
        <h3>Pending Requests</h3>
        {requests.map(request => (
          <div key={request.id} className="request-card">
            <h4>{request.trainerName}</h4>
            <p>Status: {request.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerRequest;
