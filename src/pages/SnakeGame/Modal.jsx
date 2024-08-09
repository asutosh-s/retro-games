import React, { useEffect } from 'react';
import './Modal.css'; // Import CSS for modal styling

const Modal = ({ isOpen, onClose }) => {
  useEffect(() => {
    // Add event listener to detect clicks outside the modal
    const handleClickOutside = (event) => {
      if (event.target.className.includes('modal-overlay')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>X</button>
          <h2>Instructions</h2>
          <p>1. Click left right top bottom keys to play</p>
          <p>2. After every 100 score speed increases</p>
          <p>3. In game red foods appears which decreases speed</p>
          <p>4. Let the high score wins :)</p>
        </div>
      </div>
    )
  );
};

export default Modal;
