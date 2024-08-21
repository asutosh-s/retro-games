import React, { useState, useEffect } from 'react';
import './Home.css';

import TypingEffect from './Typing';
import TorchEffect from './TorchEffect';

const Home = () => {
  return (
    <div className='home-area'>
      <TorchEffect />
      <TypingEffect className='home-name' text="HELLO, I am Asutosh!" speed={200} />
      <div className='home-brief'>software engineer</div>
    </div>
  );
};

export default Home;
