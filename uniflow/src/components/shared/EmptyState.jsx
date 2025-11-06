import React from 'react';

const EmptyState = ({ title, message, action }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📭</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && (
        <button onClick={action.onClick}>{action.label}</button>
      )}
    </div>
  );
};

export default EmptyState;
