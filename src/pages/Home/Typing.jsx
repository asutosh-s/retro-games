import React, { useState, useEffect } from 'react';
import './Typing.css'; // Make sure this path is correct

const TypingEffect = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(displayedText + text[index]);
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, text, displayedText, speed]);

  return (
    <div className="typing-container">
      {displayedText}
    </div>
  );
};

export default TypingEffect;
