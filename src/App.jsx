import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css'; // Import your global CSS
import SnakeGame from './pages/SnakeGame/SnakeGame';
import Navbar from './components/Navbar';
import Tetris from './pages/Tetris/components/Tetris';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/snake" element={<SnakeGame />} />
            <Route path="/tetris" element={<Tetris />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
