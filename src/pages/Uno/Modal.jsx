// src/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, onColorSelect }) => {
  if (!isOpen) return null;

  const handleColorClick = (color) => {
    onColorSelect(color);
    onClose();
  };

  const handleOverlayClick = (e) => {
    // Prevent closing when clicking inside the modal content
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={handleOverlayClick}>
        <div className="color-options">
          {['red', 'green', 'blue', 'yellow'].map((color) => (
            <div
              key={color}
              className="color-box"
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
