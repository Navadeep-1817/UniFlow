import React, { useState, useEffect } from 'react';

const VenueApproval = () => {
  const [venueRequests, setVenueRequests] = useState([]);

  const handleApproveVenue = (requestId, status) => {
    console.log('Venue approval:', requestId, status);
    // Approve venue requests
  };

  return (
    <div className="venue-approval">
      <h2>Venue Approval Requests</h2>
      <div className="requests-list">
        {venueRequests.map(request => (
          <div key={request.id} className="venue-request-card">
            <h3>{request.venueName}</h3>
            <p>Event: {request.eventName}</p>
            <p>Requested by: {request.requestedBy}</p>
            <p>Date: {request.date}</p>
            <p>Time: {request.time}</p>
            <p>Duration: {request.duration} hours</p>
            <div className="approval-actions">
              <button onClick={() => handleApproveVenue(request.id, 'approved')}>
                Approve
              </button>
              <button onClick={() => handleApproveVenue(request.id, 'rejected')}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueApproval;
