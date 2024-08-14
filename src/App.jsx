import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import './App.css'; // Import your global CSS
import SnakeGame from './pages/SnakeGame/SnakeGame';
import Navbar from './components/Navbar';
import Tetris from './pages/Tetris/components/Tetris';
import Connect4 from './pages/Connect4/Connect4';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/snake" element={<SnakeGame />} />
            <Route path="/tetris" element={<Tetris />} />
            <Route path="/connect4" element={<Connect4 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
