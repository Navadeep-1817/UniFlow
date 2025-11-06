import React from 'react';

const PendingApproval = () => {
  return (
    <div className="pending-approval-container">
      <h2>Account Pending Approval</h2>
      <p>Your registration is under review. You will be notified once approved.</p>
      <div className="status-icon">⏳</div>
    </div>
  );
};

export default PendingApproval;
