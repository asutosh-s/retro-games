import './FlappyBird.css';
import { useEffect, useState } from 'react';

// Initialize the grid with 20 rows and 40 columns
const initialGrid = () => {
    return Array.from({ length: 20 }, () => Array.from({ length: 40 }, () => 0));
};

const FlappyBird = () => {
    const [grid, setGrid] = useState(initialGrid());
    const [flappyPos, setFlappyPos] = useState({ row: 5, col: 5 });
    const [gameOver, setGameOver] = useState(false);
    const [gameStart, setGameStart] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === ' ') {
            setFlappyPos(prevPosition => {
                const newRow = Math.max(prevPosition.row - 1, 0);
                const newCol = prevPosition.col;
                if (grid[newRow][newCol] === 0) {
                    return { row: newRow, col: newCol };
                }
                return prevPosition;
            });
        }
    };

    const handleStartGame = () => {
        setGameOver(false)
        setGameStart(true)
    }

    const goDown = () => {
        setFlappyPos(prevPosition => {
            const newRow = Math.min(prevPosition.row + 1, 19);
            const newCol = prevPosition.col;
            if (grid[newRow][newCol] === 0) {
                return { row: newRow, col: newCol };
            }
            return prevPosition;
        });
    };

    const moveBoard = () => {
        setGrid(prevGrid => {
            const tempGrid = prevGrid.map(row => [...row]); // Deep copy of the grid

            for (let i = 0; i < tempGrid[0].length - 1; ++i) {
                for (let j = 0; j < tempGrid.length; ++j) {
                    tempGrid[j][i] = tempGrid[j][i + 1];
                }
            }

            for (let j = 0; j < tempGrid.length; ++j) {
                tempGrid[j][tempGrid[0].length - 1] = 0;
            }

            return tempGrid;
        });
    };

    const handleGameOver = () => {
        setGameOver(true);
    }

    // Check for collision with flappy
    if (flappyPos.row!==0 && grid[flappyPos.row-1][flappyPos.col] !== 0) {
        console.log("Flappy is dead");

        if(!gameOver) {
            handleGameOver();
        }
    }

    const addObstacle = () => {
        setGrid(prevGrid => {
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            const tempGrid = prevGrid.map(row => [...row]); // Deep copy of the grid

            for (let i = 0; i < tempGrid.length; ++i) {
                if (i < randomNumber || i >= (20 - (10 - randomNumber))) {
                    tempGrid[i][tempGrid[0].length - 1] = 1; // Place obstacle
                } else {
                    tempGrid[i][tempGrid[0].length - 1] = 0; // Clear other cells
                }
            }

            return tempGrid;
        });
    };

    // Set intervals for game logic
    useEffect(() => {
        if(!gameStart || gameOver) return;
        const playerInterval = setInterval(goDown, 300);
        const boardInterval = setInterval(moveBoard, 400);
        const obstacleInterval = setInterval(addObstacle, 3500);

        return () => {
            clearInterval(playerInterval);
            clearInterval(boardInterval);
            clearInterval(obstacleInterval);
        };
    }, [gameStart, gameOver]); // Empty dependency array to run only once on mount

    // Add and clean up the keydown event listener
    useEffect(() => {
        if(!gameStart || gameOver) return;
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameOver, gameStart]); // Empty dependency array to run only once on mount

    // Calculate the transform values for smooth movement
    const translateX = flappyPos.col * 20; // Adjust based on grid cell size and gap
    const translateY = flappyPos.row * 20;

    return (
        <div className="flappy-game-area">
            <div className="flappy-score"></div>
            <div className="flappy-grid">
                {grid.map((row, rowIndex) =>
                    row.map((item, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`flappy-grid-item ${item !== 0 ? 'obstacle' : ''}`}
                        />
                    ))
                )}
                <div
                    className="flappy"
                    style={{
                        transform: `translate(${translateX}px, ${translateY}px)`,
                        backgroundImage: 'url(/img/flappy.png)', // Adjust the path to your image
                        backgroundSize: 'contain', // Adjust to fit the image properly
                        backgroundRepeat: 'no-repeat', // Prevent repeating the image
                    }}
                />
            </div>
            {
                !gameStart && <button className='flappy-start-button' onClick={() => handleStartGame()}>Start Game</button>
            }
            {
                gameOver && <div className='flappy-game-over' onClick={() => handleStartGame()}>Flappy Dead :)</div>
            }
        </div>
    );
};

export default FlappyBird;
