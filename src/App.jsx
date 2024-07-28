import { useState, useRef, useEffect } from 'react';
import './App.css';
import Snake from './component/Snake';
import Food from './component/Food';

const initialSnake = {
  snake: [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 6, y: 0 },
  ],
  speed: 200,
  direction: "ArrowRight",
}

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
  const [direction, setDirection] = useState(initialSnake.direction)
  const [started, setStarted] = useState(false)
  const [gameover, setGameover] = useState(false)
  const [foodposition, setFoodposition] = useState(getFoodPosition())

  useEffect(() => {
    if (!started) return;

    for(let i=0; i<snake.length - 1; ++i) {
      for(let j=i+1; j<snake.length - 1; ++j) {
        if((snake[i].x === snake[j].x) && (snake[i].y === snake[j].y)) {
          setGameover(true);
          return;
        }
      }
    }

    const interval = setInterval(move, initialSnake.speed);
    return () => clearInterval(interval);
  })

  function move(key = direction) {
    const tmpSnake = [...snake];
    let x = tmpSnake[tmpSnake.length - 1].x, y = tmpSnake[tmpSnake.length - 1].y;
    switch (key) {
      case "ArrowRight":
        x += 3;
        if(x===99)  x=0;
        break;
      case "ArrowLeft":
        x -= 3;
        if(x===-3)  x=96;
        break;
      case "ArrowUp":
        y -= 3;
        if(y===-3)  y=96;
        break;
      case "ArrowDown":
        y += 3;
        if(y===99)  y=0;
        break;
      default:
        return;
    }

    tmpSnake.push({ x, y });

    if((foodposition.x !== x) || (foodposition.y!==y)) tmpSnake.shift();
    else setFoodposition(getFoodPosition());
    setSnake(tmpSnake);

    console.log(tmpSnake)
  }

  function doNotTakeDirection(key) {
    if(direction === "ArrowRight" && key === "ArrowLeft") {
      return true;
    }
    if(direction === "ArrowLeft" && key === "ArrowRight") {
      return true;
    }
    if(direction === "ArrowUp" && key === "ArrowDown") {
      return true;
    }
    if(direction === "ArrowDown" && key === "ArrowUp") {
      return true;
    }
  }

  return (
    <div 
      className="App" 
      onKeyDown={(e) => {
        if(doNotTakeDirection(e.key)) return;
        setDirection(e.key); 
        move(e.key);
      }} 
      ref={playgroundRef} tabIndex={0}
    >
      <Snake snake={snake} lastDirection={initialSnake.direction} />
      {
        started && <div className="count"> score : {(snake.length - 3) * 10} </div>
      }
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
          <Food position={foodposition} />
        </>
      }
    </div>
  );
}

export default App;
