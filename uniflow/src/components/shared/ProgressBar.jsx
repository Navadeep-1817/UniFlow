import React from 'react';

const ProgressBar = ({ percentage, label, color = 'blue' }) => {
  return (
    <div className="progress-bar-container">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-bar">
        <div
          className={`progress-fill progress-${color}`}
          style={{ width: `${percentage}%` }}
        >
          <span className="progress-text">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
