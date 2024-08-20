import './FlappyBird.css';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const FlappyBird = () => {

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const gridSize = isMobile ? 10 : 20;

    // Initialize the grid with 20 rows and 40 columns
    const initialGrid = () => {
        return Array.from({ length: 20 }, () => Array.from({ length: 40 }, () => 0));
    };

    const [grid, setGrid] = useState(initialGrid());
    const [flappyPos, setFlappyPos] = useState({ row: 5, col: 5 });
    const [gameOver, setGameOver] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [score, setScore] = useState(0);
    const [jumping, setJumping] = useState(false);
    const [jumpingDuration, setJumpingDuration] = useState(50); // Duration of jump
    const [jumpSpeed] = useState(3); // Speed of jumping
    const [fallSpeed] = useState(1); // Speed of falling

    const handleKeyDown = (event) => {
        if (event.key === ' ') {
            if (!jumping) {
                setJumping(true);
                setFlappyPos(prevPosition => {
                    const newRow = Math.max(prevPosition.row - jumpSpeed, 0);
                    return { row: newRow, col: prevPosition.col };
                });
            }
        }
    };

    const handleSpaceButton = () => {
        if (!gameStart || gameOver) return;
        if (!jumping) {
            setJumping(true);
            setFlappyPos(prevPosition => {
                const newRow = Math.max(prevPosition.row - jumpSpeed, 0);
                return { row: newRow, col: prevPosition.col };
            });
        }
    }

    const handleStartGame = () => {
        setGameOver(false);
        setGameStart(true);
        setScore(0);
    };

    const handleRestart = () => {
        setGameOver(false);
        setGameStart(true);
        setScore(0);
        setGrid(initialGrid());
        setFlappyPos({ row: 5, col: 5 });
    };

    const goDown = () => {
        setFlappyPos(prevPosition => {
            const newRow = Math.min(prevPosition.row + fallSpeed, 18);
            const newCol = prevPosition.col;
            return { row: newRow, col: newCol };
        });
    };

    const moveBoard = () => {
        setGrid(prevGrid => {
            const tempGrid = prevGrid.map(row => [...row]);

            for (let i = 0; i < tempGrid[0].length - 1; ++i) {
                for (let j = 0; j < tempGrid.length; ++j) {
                    tempGrid[j][i] = tempGrid[j][i + 1];
                }
            }

            for (let j = 0; j < tempGrid.length; ++j) {
                tempGrid[j][tempGrid[0].length - 1] = 0;
            }

            // if ((tempGrid[0][flappyPos.col - 1] === 1 && tempGrid[0][flappyPos.col - 2] === 1) || (tempGrid[grid.length - 1][flappyPos.col - 1] === 1 || tempGrid[grid.length - 1][flappyPos.col - 2] === 1)) {
                handleSetScore();
            // }

            return tempGrid;
        });
    };

    const handleGameOver = () => {
        setGameOver(true);
    };

    if ((flappyPos.row !== 0 && grid[flappyPos.row - 1][flappyPos.col + 1] !== 0) || (flappyPos.row !== 0 && grid[flappyPos.row + 1][flappyPos.col + 1] !== 0)) {
        if (!gameOver) {
            handleGameOver();
        }
    }

    const handleSetScore = () => {
        setScore(prev => prev + 1);
    };

    const addObstacle = () => {
        setGrid(prevGrid => {
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            const tempGrid = prevGrid.map(row => [...row]);

            for (let i = 0; i < tempGrid.length; ++i) {
                if (i < randomNumber || i >= (20 - (10 - randomNumber))) {
                    tempGrid[i][tempGrid[0].length - 1] = 1;
                    tempGrid[i][tempGrid[0].length - 2] = 1;
                } else {
                    tempGrid[i][tempGrid[0].length - 1] = 0;
                    tempGrid[i][tempGrid[0].length - 2] = 0;
                }
            }

            return tempGrid;
        });
    };

    useEffect(() => {
        if (!gameStart || gameOver) return;
        const playerInterval = setInterval(() => {
            if (!jumping) {
                goDown();
            }
        }, 200);
        return () => {
            clearInterval(playerInterval);
        };
    }, [gameStart, gameOver, jumping]);

    useEffect(() => {
        if (!gameStart || gameOver) return;
        const boardInterval = setInterval(moveBoard, 400);
        const obstacleInterval = setInterval(addObstacle, 3500);

        return () => {
            clearInterval(boardInterval);
            clearInterval(obstacleInterval);
        };
    }, [gameStart, gameOver]);

    useEffect(() => {
        if (!gameStart || gameOver) return;
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameOver, gameStart]);

    const translateX = flappyPos.col * gridSize;
    const translateY = flappyPos.row * gridSize;

    // Use effect to set jumping back to false after jump duration
    useEffect(() => {
        if (jumping) {
            const jumpTimer = setTimeout(() => {
                setJumping(false);
            }, jumpingDuration);

            return () => clearTimeout(jumpTimer);
        }
    }, [jumping]);

    return (
        <div className="flappy-game-area">
            <div className="flappy-score">Score : {score}</div>
            <div className='flappy-back'>
                <div className="flappy-grid">
                    {grid.map((row, rowIndex) =>
                        row.map((item, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`flappy-grid-item ${item !== 0 ? 'obstacle' : ''}`}
                                style={{
                                    transform: `translate(${colIndex * gridSize}px, ${rowIndex * gridSize}px)`,
                                }}
                            />
                        ))
                    )}
                    <div
                        className="flappy"
                        style={{
                            transform: `translate(${translateX}px, ${translateY}px)`,
                            transition: jumping ? 'transform 0.2s ease-out' : 'transform 0.5s ease',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                </div>
                {
                    !gameStart && <button className='flappy-start-button' onClick={() => handleStartGame()}>Start Game</button>
                }
                {
                    gameOver && <div className='flappy-game-over' onClick={() => handleStartGame()}>Flappy Dead :)</div>
                }
                {
                    gameOver && <button className='flappy-start-button' onClick={() => handleRestart()}>Restart</button>
                }
                {
                    isMobile && <button className='flappy-space-button' onClick={() => handleSpaceButton()}>Click to play</button>
                }
            </div>
        </div>
    );
};

export default FlappyBird;
