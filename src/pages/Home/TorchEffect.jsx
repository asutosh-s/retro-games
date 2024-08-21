// TorchEffect.js
import React, { useState, useEffect, useRef} from 'react';
import './TorchEffect.css'; // Import your CSS file

const TorchEffect = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="torch-effect"
      style={{
        background: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255, 255, 255, 0.2) 10%, rgba(0, 0, 0, 0.8) 80%)`,
      }}
    />
  );
};

export default TorchEffect;
