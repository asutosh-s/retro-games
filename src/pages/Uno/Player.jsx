import React from 'react';
import Card from './Card';
import './Board.css';

const Player = ({ player, onCardClick, className, boardRef, playerRef, centeredCard }) => {
  return (
    <div className={`player ${className}`} ref={playerRef}>
      <div className="player-name">{player.name}</div>
      <div className="player-deck">
        {player.cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            onClick={() => onCardClick(card)}
            boardRef={boardRef}
            isCentered={card === centeredCard}
            playerPosition={className}
          />
        ))}
      </div>
    </div>
  );
};

export default Player;
