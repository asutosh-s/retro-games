import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { useLocation, Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sideNavRef = useRef(null);
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <div className='hamburger' onClick={toggleMenu}>
        <div className='line'></div>
        <div className='line'></div>
        <div className='line'></div>
      </div>
      <div className={`sidenav ${isOpen ? 'open' : ''}`} ref={sideNavRef}>
        <div className="logo">
          {/* <img src="logo.png" alt="Logo" /> */}
        </div>
        <Link to="/home" className={`dropdown-link ${currentPath === '/home' ? 'active' : ''}`} onClick={toggleMenu}>
          Home
        </Link>
        <Link to="/snake" className={`dropdown-link ${currentPath === '/snake' ? 'active' : ''}`} onClick={toggleMenu}>
          Snake Game
        </Link>
        <Link to="/tetris" className={`dropdown-link ${currentPath === '/tetris' ? 'active' : ''}`} onClick={toggleMenu}>
          Tetris
        </Link>
        <Link to="/connect4" className={`dropdown-link ${currentPath === '/connect4' ? 'active' : ''}`} onClick={toggleMenu}>
          Connect4
        </Link>
        <Link to="/flappy" className={`dropdown-link ${currentPath === '/flappy' ? 'active' : ''}`} onClick={toggleMenu}>
          Flappy Bird
        </Link>
        <Link to="/uno" className={`dropdown-link ${currentPath === '/uno' ? 'active' : ''}`} onClick={toggleMenu}>
          Uno
        </Link>
        <Link to="/draw" className={`dropdown-link ${currentPath === '/draw' ? 'active' : ''}`} onClick={toggleMenu}>
          Drawing Canvas
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
