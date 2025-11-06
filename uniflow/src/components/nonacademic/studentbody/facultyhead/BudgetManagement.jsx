import React, { useState, useEffect } from 'react';

const BudgetManagement = () => {
  const [budget, setBudget] = useState({
    total: 0,
    allocated: 0,
    utilized: 0,
    remaining: 0
  });
  const [allocations, setAllocations] = useState([]);

  const handleAllocateBudget = (eventId, amount) => {
    console.log('Allocating budget:', amount, 'to event:', eventId);
    // Allocate budget for events
  };

  return (
    <div className="budget-management">
      <h2>Budget Management</h2>
      <div className="budget-overview">
        <div className="budget-card">
          <h3>Total Budget</h3>
          <p>₹{budget.total}</p>
        </div>
        <div className="budget-card">
          <h3>Allocated</h3>
          <p>₹{budget.allocated}</p>
        </div>
        <div className="budget-card">
          <h3>Utilized</h3>
          <p>₹{budget.utilized}</p>
        </div>
        <div className="budget-card">
          <h3>Remaining</h3>
          <p>₹{budget.remaining}</p>
        </div>
      </div>
      <h3>Budget Allocations</h3>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Allocated</th>
            <th>Spent</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map(allocation => (
            <tr key={allocation.id}>
              <td>{allocation.eventName}</td>
              <td>₹{allocation.allocated}</td>
              <td>₹{allocation.spent}</td>
              <td>{allocation.status}</td>
              <td><button>View Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetManagement;
