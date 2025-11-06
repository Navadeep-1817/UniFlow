import React, { useState, useEffect } from 'react';

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  const handleSubmitLeave = (leaveData) => {
    console.log('Submitting leave request:', leaveData);
    // Request substitution if unavailable
  };

  return (
    <div className="leave-request">
      <h2>Leave Request</h2>
      <div className="leave-form">
        <h3>Request Leave</h3>
        <input type="date" placeholder="From Date" />
        <input type="date" placeholder="To Date" />
        <select>
          <option value="">Select Session to Miss</option>
        </select>
        <select>
          <option value="">Suggest Substitute Faculty</option>
        </select>
        <textarea placeholder="Reason for Leave"></textarea>
        <button onClick={handleSubmitLeave}>Submit Request</button>
      </div>
      <div className="leave-history">
        <h3>Leave History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Duration</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Substitute</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map(request => (
              <tr key={request.id}>
                <td>{request.date}</td>
                <td>{request.duration}</td>
                <td>{request.reason}</td>
                <td>{request.status}</td>
                <td>{request.substitute}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequest;
