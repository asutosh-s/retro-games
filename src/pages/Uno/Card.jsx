import React, { useEffect, useRef } from 'react';
import './Board.css';

const Card = ({ card, onClick, isCentered, boardRef, playerPosition }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current && boardRef.current) {
      const cardElement = cardRef.current;
      const boardElement = boardRef.current;

      // Get dimensions and positions
      const boardRect = boardElement.getBoundingClientRect();
      const cardRect = cardElement.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;

      if (isCentered) {
        let translateX = 0;
        let translateY = 0;
        let rotation = 0;

        switch (playerPosition) {
          case 'player-top':
            // Center for top player
            translateX = (boardRect.width - cardWidth) / 2 - (cardRect.left - boardRect.left) + window.scrollX;
            translateY = (boardRect.height - cardHeight) / 2 - (cardRect.top - boardRect.top) + window.scrollY;
            rotation = 180;
            break;

          case 'player-bottom':
            // Center for bottom player
            translateX = (boardRect.width - cardWidth) / 2 - (cardRect.left - boardRect.left) + window.scrollX;
            translateY = (boardRect.height - cardHeight) / 2 - (cardRect.top - boardRect.top) + window.scrollY;
            rotation = 180; // Rotate 180 degrees
            break;

          case 'player-left':
            // Center for left player (90 degrees rotation)
            translateY = (boardRect.width - cardWidth) / 2 - (cardRect.left - boardRect.left) + window.scrollX;
            translateX = (boardRect.height - cardHeight) / 2 - (cardRect.top - boardRect.top) + window.scrollX;
            rotation = 90;
            break;

          case 'player-right':
            // Center for right player (-90 degrees rotation)
            translateY = -1 * ((boardRect.width - cardWidth) / 2 - (cardRect.left - boardRect.left) + window.scrollX);
            translateX = (boardRect.height - cardHeight) / 2 - (cardRect.top - boardRect.top) + window.scrollY;
            rotation = 90; // Rotate 90 degrees
            break;

          case 'card-top':
            // Center for top player
            translateX = (boardRect.width - cardWidth) / 2 - (cardRect.left - boardRect.left) + window.scrollX;
            translateY = (boardRect.height - cardHeight) / 2 - (cardRect.top - boardRect.top) + window.scrollY;
            rotation = 180;
            break;

          case 'card-bottom':
            // Center for bottom player
            // translateX = ((boardRect.width - cardWidth) + (boardRect.right - cardRect.left) + window.scrollX);
            translateX = (boardRect.width - cardWidth) / 2 - (cardRect.left - boardRect.left) + window.scrollX;
            translateY = (boardRect.height - cardHeight) / 2 - (cardRect.top - boardRect.top) + window.scrollY;
            rotation = 180; // Rotate 180 degrees
            break;

          case 'card-left':
            // Center for left player (90 degrees rotation)
            translateX = (boardRect.width - cardWidth) / 2 - (cardRect.left - boardRect.left) + window.scrollY;
            translateY = (boardRect.height - cardHeight) / 2 - (cardRect.top - boardRect.top) + window.scrollX;
            rotation = 90;
            break;

          case 'card-right':
            // Center for right player (-90 degrees rotation)
            translateY = ((boardRect.height - cardHeight) / 2 - (cardRect.top - boardRect.top) + window.scrollY);
            translateX = -1 * (((boardRect.width - cardWidth) / 2) + (boardRect.top - cardRect.top) + window.scrollX);
            rotation = 90; // Rotate 90 degrees
            break;

          default:
            break;
        }

        // Apply transform to center the card and rotate it
        cardElement.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
        // cardElement.style.zIndex = '10'; // Ensure it appears above other elements
      } else {
        // Reset transform if not centered
        cardElement.style.transform = '';
      }
    }
  }, [isCentered, boardRef, playerPosition]);

  return (
    <div
      className={`uno-card ${isCentered ? 'centered' : ''}`}
      onClick={onClick}
      ref={cardRef}
    >
      <img src={`/img/uno-img/${card.name}.png`} alt={card.name} />
    </div>
  );
};

export default Card;
