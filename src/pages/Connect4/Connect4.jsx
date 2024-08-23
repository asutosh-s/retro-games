import { useState, useEffect } from 'react';
import io from 'socket.io-client';

import './Connect4.css';

const initialGrid = () => {
    return Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => 0))
}

const socket = io('https://socketconnect-lev2sq1q.b4a.run');

const Connect4 = () => {
    const [player, setPlayer] = useState(null);
    const [grid, setGrid] = useState(initialGrid())
    const [startGame, setStartGame] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [playerWin, setPlayerWin] = useState(0)

    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [join, setJoined] = useState(false);
    const [gameState, setGameState] = useState(null);

    useEffect(() => {
        socket.on('dataUpdate', ({startValue,playerWinValue,gameOverValue}) => {
            setStartGame(startValue);
            setPlayerWin(playerWinValue);
            setGameOver(gameOverValue);
        });

        socket.on('gridUpdate', (gridUpdate) => {
            console.log(gridUpdate);
            setGrid(gridUpdate);
        });

        socket.on('gameState', (state) => {
            setGameState(state);
        });

        socket.on('roomFull', () => {
            alert('The room is full.');
        });

        socket.on('gameStarted', () => {
            setStartGame(true);
        });

        socket.on('currentPlayer', (player) => {
            setPlayer(player);
        });

        return () => {
            socket.off('gameState');
            socket.off('turn');
            socket.off('roomFull');
            socket.off('waitingForOpponent');
            socket.off('startGame');
            socket.off('currentPlayer');
        };
    }, []);

    const joinRoom = () => {
        if (roomId && userName) {
            setJoined(true);
            socket.emit('joinRoom', { roomId, userName });
        } else {
            alert("Please enter RoomId and UserName to proceed :)");
        }
    };

    const handleClick = (clickedDot) => {
        if(player !== 1 && !startGame) {
            alert("Waiting for host to start");
            return;
        }
        if (!startGame || gameOver) return;
        if (gameState && player) {
            if (player === gameState.currentPlayer) {
                socket.emit('makeMove', roomId);
            } else {
                alert('It is not your turn!');
                return;
            }
        }
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
                    socket.emit('updateData', {roomId, startValue : false, playerWinValue : player, gameOverValue : true});
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
                    socket.emit('updateData', {roomId, startValue : false, playerWinValue : player, gameOverValue : true});
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
                        socket.emit('updateData', {roomId, startValue : false, playerWinValue : player, gameOverValue : true});
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
                        socket.emit('updateData', {roomId, startValue : false, playerWinValue : player, gameOverValue : true});
                    }
                }
            }
        }

        let flag = false;
        for (let j = 0; j < tempGrid.length; ++j) {
            for (let k = 0; k < tempGrid[0].length; ++k) {
                if (tempGrid[j][k] === 0) {
                    flag = true;
                }
            }
        }
        if (flag === false) {
            setGameOver(true);
            setStartGame(false)
            setPlayerWin(0)
            socket.emit('updateData', {roomId, startValue : false, playerWinValue : 0, gameOverValue : true});
        }

        // change grid after player click
        setGrid(tempGrid);

        socket.emit('updateGrid', {roomId, tempGrid});
        // toggle player 
        // setPlayer(prev => (prev === 1) ? 2 : 1);
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
        if(player === 1 && gameState !== null && gameState.players.length < 2) {
            alert("Waiting for all players to join");
            return;
        }
        setGrid(initialGrid());
        setStartGame(true);
        setPlayerWin(0);
        setGameOver(false);
        socket.emit('updateData', {roomId, startValue : true, playerWinValue : 0, gameOverValue : false});
        socket.emit('startGame', roomId);
        socket.emit('updateGrid', {roomId, tempGrid : initialGrid()});
    }

    const getTextBasedOnCondition = () => {
        if (gameOver) {
            if (playerWin === 0) {
                return 'Draw!!! Try Another one'
            } else {
                return `Player ${playerWin} Won :) Congrats`
            }
        } else {
            return gameState !== null ? `Turn of Player ${gameState.currentPlayer}` : '';
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
            if (gameState === null) {
                return 'connect4-player-info';
            } else if (gameState.currentPlayer === 1) {
                return 'connect4-player-info red';
            } else if (gameState.currentPlayer === 2) {
                return 'connect4-player-info yellow';
            }
        }
        return 'connect4-player-info';
    }

    return (
        <>
            {!join &&
                <div className="form-container">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="form-input"
                    />
                    <input
                        type="text"
                        placeholder="Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="form-input"
                    />
                    <button onClick={joinRoom} className="form-button">
                        Join Room
                    </button>
                </div>
            }
            <div className={`connect4-game-area ${!join ? 'blurred' : ''}`}>
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
                    !startGame && player === 1 && <button className='connect4-start-game' onClick={() => handleStartGame()}>Start Game</button>
                }
            </div>
        </>
    )
}

export default Connect4;