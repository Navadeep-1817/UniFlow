import React, { useState, useEffect } from 'react';

const ResourceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleSubmitRequest = (requestData) => {
    console.log('Submitting resource request:', requestData);
    // Request resources/budget from faculty head
  };

  return (
    <div className="resource-request">
      <h2>Resource Requests</h2>
      <button onClick={() => setShowForm(true)}>New Request</button>
      {showForm && (
        <div className="request-form">
          <h3>Request Resources</h3>
          <select>
            <option value="">Select Type</option>
            <option value="budget">Budget</option>
            <option value="venue">Venue</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </select>
          <input type="text" placeholder="Item/Amount" />
          <textarea placeholder="Justification"></textarea>
          <input type="date" placeholder="Required By" />
          <button onClick={handleSubmitRequest}>Submit Request</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
      <div className="requests-list">
        <h3>My Requests</h3>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Details</th>
              <th>Requested On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.id}>
                <td>{request.type}</td>
                <td>{request.details}</td>
                <td>{request.requestedOn}</td>
                <td>{request.status}</td>
                <td><button>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceRequest;
