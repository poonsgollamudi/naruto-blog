import React from 'react'

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content confirm-modal">
        <h3>{message}</h3>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel">Cancel</button>
          <button onClick={onConfirm} className="delete">Delete</button>
        </div>
      </div>
    </div>
  )
}