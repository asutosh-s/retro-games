import { useState } from 'react';

import './Connect4.css';

const initialGrid = () => {
    return Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => 0))
}

const Connect4 = () => {
    const [player, setPlayer] = useState(1);
    const [grid, setGrid] = useState(initialGrid())
    const [startGame, setStartGame] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [playerWin, setPlayerWin] = useState(0)

    const handleClick = (clickedDot) => {
        if (!startGame || gameOver) return;
        let tempGrid = grid;

        // check for already filled column
        if (grid[0][clickedDot] !== 0) {
            console.log("filled column " + clickedDot)
            return;
        }
        let i;
        for (i = 0; i <= tempGrid.length - 1; ++i) {
            if (tempGrid[i][clickedDot] !== 0) {
                break;
            }
        }
        tempGrid[i - 1][clickedDot] = player;

        // check for connect-4
        for (let j = 0; j <= tempGrid.length - 1; ++j) {
            for (let k = 0; k <= tempGrid[0].length - 4; ++k) {
                if ((tempGrid[j][k] === player) && (tempGrid[j][k + 1] === player) && (tempGrid[j][k + 2] === player) && (tempGrid[j][k + 3] === player)) {
                    setGameOver(true)
                    setPlayerWin(player)
                    setStartGame(false)
                }
            }
        }

        // check for connect-4
        for (let j = 0; j <= tempGrid[0].length - 1; ++j) {
            for (let k = 0; k <= tempGrid.length - 4; ++k) {
                if ((tempGrid[k][j] === player) && (tempGrid[k + 1][j] === player) && (tempGrid[k + 2][j] === player) && (tempGrid[k + 3][j] === player)) {
                    setGameOver(true)
                    setPlayerWin(player)
                    setStartGame(false)
                }
            }
        }

        // check for connect-4
        for (let j = 0; j <= tempGrid.length - 1; ++j) {
            for (let k = 0; k <= tempGrid[0].length - 1; ++k) {
                if (j + 3 < tempGrid.length && k + 3 < tempGrid[0].length) {
                    if ((tempGrid[j][k] === player) && (tempGrid[j + 1][k + 1] === player) && (tempGrid[j + 2][k + 2] === player) && (tempGrid[j + 3][k + 3] === player)) {
                        setGameOver(true)
                        setPlayerWin(player)
                        setStartGame(false)
                    }
                }
            }
        }

        // check for connect-4
        for (let j = 0; j <= tempGrid.length - 1; ++j) {
            for (let k = 0; k <= tempGrid[0].length - 1; ++k) {
                if (j - 3 >= 0 && k + 3 < tempGrid[0].length) {
                    if ((tempGrid[j][k] === player) && (tempGrid[j - 1][k + 1] === player) && (tempGrid[j - 2][k + 2] === player) && (tempGrid[j - 3][k + 3] === player)) {
                        setGameOver(true)
                        setPlayerWin(player)
                        setStartGame(false)
                    }
                }
            }
        }

        let flag = false;
        for(let j=0; j<tempGrid.length; ++j) {
            for(let k=0; k<tempGrid[0].length; ++k) {
                if(tempGrid[j][k] === 0) {
                    flag = true;
                }
            }
        }
        if(flag === false) {
            setGameOver(true);
            setStartGame(false)
        }

        // change grid after player click
        setGrid(tempGrid);
        // toggle player 
        setPlayer(prev => (prev === 1) ? 2 : 1);
    }

    const getClassNameForDot = (value) => {
        switch (value) {
            case 1:
                return 'connect4-dot red';
            case 2:
                return 'connect4-dot yellow';
            default:
                return 'connect4-dot white';
        }
    }

    const getClassNameForActionDot = () => {
        switch (player) {
            case 1:
                return 'connect4-action-dot red';
            case 2:
                return 'connect4-action-dot yellow';
            default:
                return 'connect4-action-dot';
        }
    }

    const handleStartGame = () => {
        setGrid(initialGrid())
        setPlayer(1)
        setStartGame(true)
        setPlayerWin(0)
        setGameOver(false)
    }

    const getTextBasedOnCondition = () => {
        if (gameOver) {
            if (playerWin === 0) {
                return 'Draw!!! Try Another one'
            } else {
                return `Player ${playerWin} Won :) Congrats`
            }
        } else {
            return `Turn of Player ${player}`
        }
    }

    const getClassNameForInfo = () => {
        if (gameOver) {
            if (playerWin === 0) {
                return 'connect4-player-info gray';
            } else if (playerWin === 1) {
                return 'connect4-player-info red';
            } else if (playerWin === 2) {
                return 'connect4-player-info yellow';
            }
        } else {
            if (player === 1) {
                return 'connect4-player-info red';
            } else if (player === 2) {
                return 'connect4-player-info yellow';
            }
        }
        return 'connect4-player-info';
    }

    return (
        <div className={`connect4-game-area ${!startGame ? 'blurred' : ''}`}>
            <div className={getClassNameForInfo()}>
                {
                    getTextBasedOnCondition()
                }
            </div>
            <div className='connect4-action-dots'>
                {
                    Array.from({ length: 7 }, (_, index) => <div className={getClassNameForActionDot()} onClick={() => handleClick(index)}></div>)
                }
            </div>
            <div className='connect4-game-board'>
                {
                    grid.map((row, rowIndex) => row.map((item, colIndex) => <div className={getClassNameForDot(item)}></div>))
                }
            </div>
            {
                !startGame && <button className='connect4-start-game' onClick={() => handleStartGame()}>Start Game</button>
            }
        </div>
    )
}

export default Connect4;