import React from 'react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button onClick={onConfirm} className="btn-confirm">
            Confirm
          </button>
          <button onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
