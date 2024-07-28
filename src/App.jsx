import { useState, useRef, useEffect } from 'react';
import './App.css';
import Snake from './component/Snake';
import Food from './component/Food';
import Modal from './component/Modal';

const initialSnake = {
  snake: [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 6, y: 0 },
  ],
  speed: 380,
  direction: "ArrowRight",
}

const showSpeedFoodDuration = 7000;
const notShowSpeedFoodDuration = 15000;

function getFoodPosition() {
  const pos = { x: 0, y: 0 };
  let x = Math.floor(Math.random() * 96)
  let y = Math.floor(Math.random() * 96)
  pos.x = x - (x % 3)
  pos.y = y - (y % 3)
  return pos;
}

function App() {

  const playgroundRef = useRef()
  const [snake, setSnake] = useState(initialSnake.snake);
  const [snakespeed, setSnakespeed] = useState(initialSnake.speed)
  const [direction, setDirection] = useState(initialSnake.direction)
  const [started, setStarted] = useState(false)
  const [gameover, setGameover] = useState(false)
  const [foodposition, setFoodposition] = useState(getFoodPosition())
  const [speedfoodposition, setSpeedfoodposition] = useState(null)
  const [score, setScore] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!started) return;

    // Check for snake collision
    for (let i = 0; i < snake.length - 1; ++i) {
      for (let j = i + 1; j < snake.length; ++j) {
        if (snake[i].x === snake[j].x && snake[i].y === snake[j].y) {
          setGameover(true);
          return;
        }
      }
    }

    // Set up interval for snake movement
    const interval = setInterval(() => {
      // Move function should be defined elsewhere
      move();
    }, snakespeed);

    // Cleanup interval
    return () => {
      clearInterval(interval);
    };
  }, [started, snake, snakespeed]); // Add dependencies

  useEffect(() => {
    // Early exit if conditions are not met
    if (!started || snakespeed >= 300) {
      return;
    }

    let visible = false;
    // Set up a single interval to handle both showing and hiding
    const speedFoodInterval = setInterval(() => {
      setSpeedfoodposition((prevSpeedfoodposition) => {
        if (prevSpeedfoodposition === null) {
          return getFoodPosition();
        } else {
          return null;
        }
      })
    }, showSpeedFoodDuration);

    // Cleanup interval on component unmount or when dependencies change
    return () => {
      clearInterval(speedFoodInterval);
    };
  }, [started, snakespeed, showSpeedFoodDuration, notShowSpeedFoodDuration]);

  useEffect(() => {
    if (((score % 100 === 0) && (score !== 0)) && snakespeed > 100) {
      setSnakespeed((prevSnakespeed) => prevSnakespeed - 100)
    }
  }, [score])

  function move(key = direction) {
    const tmpSnake = [...snake];
    let x = tmpSnake[tmpSnake.length - 1].x, y = tmpSnake[tmpSnake.length - 1].y;
    switch (key) {
      case "ArrowRight":
        x += 3;
        if (x === 99) x = 0;
        break;
      case "ArrowLeft":
        x -= 3;
        if (x === -3) x = 96;
        break;
      case "ArrowUp":
        y -= 3;
        if (y === -3) y = 96;
        break;
      case "ArrowDown":
        y += 3;
        if (y === 99) y = 0;
        break;
      default:
        return;
    }

    tmpSnake.push({ x, y });

    if ((foodposition.x !== x) || (foodposition.y !== y)) tmpSnake.shift();
    else {
      setFoodposition(getFoodPosition());
      setScore((prevScore) => prevScore + 10)
    }
    setSnake(tmpSnake);

    if ((speedfoodposition !== null) && ((speedfoodposition.x === x) && (speedfoodposition.y === y))) {
      setSnakespeed((prevSnakespeed) => prevSnakespeed + 100);
      setSpeedfoodposition(null);
    }
  }

  function doNotTakeDirection(key) {
    if (direction === "ArrowRight" && key === "ArrowLeft") {
      return true;
    }
    if (direction === "ArrowLeft" && key === "ArrowRight") {
      return true;
    }
    if (direction === "ArrowUp" && key === "ArrowDown") {
      return true;
    }
    if (direction === "ArrowDown" && key === "ArrowUp") {
      return true;
    }
  }

  return (
    <div className='game-area'>
      <div className="count"> score : {score} </div>
      <div
        className="App"
        onKeyDown={(e) => {
          if (doNotTakeDirection(e.key)) return;
          setDirection(e.key);
          move(e.key);
        }}
        ref={playgroundRef} tabIndex={0}
      >
        <Snake snake={snake} lastDirection={initialSnake.direction} />
        {
          !started &&
          <>
            <button
              onClick={() => {
                setStarted(true)
                playgroundRef.current.focus();
              }} type="submit">
              Start
            </button>
            <div className='arrow-msg text'>Press arrow keys to play!</div>
          </>
        }
        {
          gameover &&
          <>
            <div className='game-over text'>Game over!</div>
            <button onClick={() => {
              setSnake(initialSnake.snake)
              setStarted(true)
              setGameover(false)
              setDirection(initialSnake.direction)
              playgroundRef.current.focus();
            }} type="submit">
              Restart
            </button>
          </>
        }
        {
          !gameover &&
          <>
            <Food position={foodposition} type="food" />
          </>
        }
        {
          !gameover && speedfoodposition !== null &&
          <>
            <Food position={speedfoodposition} type="speedfood" />
          </>
        }
      </div>
      <button onClick={openModal} className="open-modal-button">
        Instructions
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default App;
