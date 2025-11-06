import React from 'react';

const ApprovalStatus = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'green';
      case 'pending':
        return 'orange';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case 'approved':
        return '✓';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '✗';
      default:
        return '?';
    }
  };

  return (
    <div className={`approval-status status-${getStatusColor()}`}>
      <span className="status-icon">{getStatusIcon()}</span>
      <span className="status-text">{status}</span>
    </div>
  );
};

export default ApprovalStatus;
