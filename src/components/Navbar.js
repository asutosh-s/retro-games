import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar">
      <div className="hamburger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      {isOpen && (
        <div className="dropdown">
          <a href="home" className="dropdown-link">Home</a>
          <a href="snake" className="dropdown-link">Snake Game</a>
          <a href="tetris" className="dropdown-link">Tetris</a>
          <a href="connect4" className="dropdown-link">Connect4</a>
          <a href="flappy" className="dropdown-link">Flappy Bird</a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
