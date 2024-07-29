import React from 'react';
import { Link } from 'react-router-dom';
import './SideNav.css'; // Import CSS for styling

const SideNav = () => {
  return (
    <nav className="sidenav">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/snake">Snake</Link></li>
      </ul>
    </nav>
  );
};

export default SideNav;
