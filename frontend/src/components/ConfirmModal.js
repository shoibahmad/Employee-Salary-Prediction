import React, { useEffect } from 'react';
import './ConfirmModal.css';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="cm-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="cm-panel animate-in">
        <div className="cm-blob cm-blob-1" />
        <div className="cm-blob cm-blob-2" />
        
        <div className="cm-content">
          <div className={`cm-icon-box ${type}`}>
            {type === 'danger' ? '⚠️' : '❓'}
          </div>
          <h2 className="cm-title">{title}</h2>
          <p className="cm-message">{message}</p>
        </div>

        <div className="cm-actions">
          <button className="cm-btn cm-btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`cm-btn cm-btn-primary ${type}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
