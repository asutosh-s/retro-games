import React, { useState, useRef } from 'react';
import Card from './Card';
import Player from './Player';
import Modal from './Modal';
import './Board.css';

import { CardList } from './CardList';

const Board = () => {
    const [players, setPlayers] = useState([
        { name: 'Player 1', cards: [] },
        { name: 'Player 2', cards: [] },
        { name: 'Player 3', cards: [] },
        { name: 'Player 4', cards: [] }
    ]);

    const unoback = { name: 'UNO-Back', number: 100 };
    const [topCard, setTopCard] = useState(null);
    const [remainingCards, setRemainingCards] = useState([]);
    const [centeredCard, setCenteredCard] = useState(null);
    const [playerTurn, setPlayerTurn] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [rev, setRev] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [drawSequence, setDrawSequence] = useState({ active: false, playerToDraw: null, count: 0 });

    const closeModal = () => setIsModalOpen(false);

    const handleColorSelect = (color) => {
        console.log(color);
        setSelectedColor(color);
        closeModal();
    };

    const boardRef = useRef(null);
    const player1Ref = useRef(null);
    const player2Ref = useRef(null);
    const player3Ref = useRef(null);
    const player4Ref = useRef(null);

    const checkIfCardPlayable = (card) => {
        const cardSplit = card.name.split('-');
        if (cardSplit[0] === selectedColor || cardSplit[0] === 'color' || cardSplit[0] === 'pick') {
            return true;
        }

        const parts = topCard.name.split('-');
        const isDigit = /^\d$/.test(parts[1]);
        if (isDigit) {
            return (cardSplit[1] === parts[1]);
        }
        if(parts[1] === 'reverse' && cardSplit[1] === 'reverse') {
            return true;
        }
        if(parts[1] === 'skip' && cardSplit[1] === 'skip') {
            return true;
        }
        if(parts[1] === 'pick' && cardSplit[1] === 'pick') {
            return true;
        }

        return false;
    }

    const handleCardClick = (card) => {
        if (playerTurn !== card.number || centeredCard !== null) return;

        if (!checkIfCardPlayable(card)) return;

        setCenteredCard(card); // Set the clicked card as the centered card
        // console.log('Card clicked:', card);

        setTimeout(() => {
            setPlayers(prevPlayers => {
                // Clone the previous players state
                const updatedPlayers = [...prevPlayers];

                // Update the specific player’s cards
                const playerIndex = card.number;
                updatedPlayers[playerIndex] = {
                    ...updatedPlayers[playerIndex],
                    cards: updatedPlayers[playerIndex].cards.filter(cardItem => cardItem !== card)
                };

                return updatedPlayers;
            });
            setCenteredCard(null);
            setRemainingCards(prevCards => [...prevCards, topCard]);
            setTopCard(card);
            changeSelectedColor(card);
            checkForCardSpecialPower(card);
        }, 300);
    };

    const drawCard = (playerNumber, noOfCards) => {
        console.log(playerNumber, playerTurn);
        if (drawSequence.active || centeredCard !== null || playerTurn === null) return;
    
        const playerToDraw = (typeof playerNumber !== 'number') ? playerTurn : playerNumber;
        const tempRemainingCards = shufflecards(remainingCards);
    
        const drawOneCard = () => {
            setDrawSequence(prevSequence => {
                if (prevSequence.count < noOfCards) {
                    const tempCard = tempRemainingCards.splice(0, 1)[0];
                    tempCard.number = playerToDraw;
                    setCenteredCard(tempCard);
                    
                    // console.log('Drawing card:', tempCard);
    
                    setTimeout(() => {
                        setPlayers(prevPlayers => {
                            const updatedPlayers = [...prevPlayers];
                            console.log(updatedPlayers);
                            updatedPlayers[playerToDraw].cards.push(tempCard);
    
                            return updatedPlayers;
                        });
                        setCenteredCard(null);
                        setRemainingCards(tempRemainingCards);
                    }, 300);

                    drawOneCard(); // Draw the next card
    
                    // Update drawSequence count
                    return { ...prevSequence, count: prevSequence.count + 1 };
                } else {
                    // All cards drawn, update the turn
                    // setPlayerTurn(prevTurn => {
                    //     let newTurn = rev ? (prevTurn - 1 + 4) % 4 : (prevTurn + 1) % 4;
                    //     return newTurn;
                    // });
                    return { active: false, playerToDraw: null, count: 0 };
                }
            });
        };
    
        setDrawSequence({ active: true, playerToDraw, count: 0 });
        drawOneCard();
    };
    

    const checkForCardSpecialPower = (card) => {
        if (card.name.includes("reverse")) {
            setPlayerTurn(prevTurn => {
                if (rev === true) {
                    return ((prevTurn + 1) % 4);
                } else {
                    if (prevTurn - 1 < 0) {
                        return ((prevTurn - 1) + 4);
                    } else {
                        return (prevTurn - 1);
                    }
                }
            });
            setRev(prev => !prev);
        } else {
            let playerToDraw = playerTurn;

            if (rev === false) {
                playerToDraw = ((playerToDraw + 1) % 4);
            } else {
                if (playerToDraw - 1 < 0) {
                    playerToDraw = ((playerToDraw - 1) + 4);
                } else {
                    playerToDraw = (playerToDraw - 1);
                }
            }
            if(card.name === "pick-4") { 
                setPlayerTurn(prevTurn => {
                    let newTurn = rev ? (prevTurn - 1 + 4) % 4 : (prevTurn + 1) % 4;
                    return newTurn;
                });
                drawCard(playerToDraw, 4); 
            } else if(card.name.includes("pick-2")) { 
                setPlayerTurn(prevTurn => {
                    let newTurn = rev ? (prevTurn - 1 + 4) % 4 : (prevTurn + 1) % 4;
                    return newTurn;
                });
                drawCard(playerToDraw, 2); 
            } else if(card.name.includes("skip")) {
                setPlayerTurn(prevTurn => {
                    let newTurn = rev ? (prevTurn - 2 + 4) % 4 : (prevTurn + 2) % 4;
                    return newTurn;
                });
            } else {
                setPlayerTurn(playerToDraw);
            }
        }
    }

    const changeSelectedColor = (card) => {
        const cardColor = card.name.split('-');

        if (cardColor[0] === 'red' || cardColor[0] === 'yellow' || cardColor[0] === 'blue' || cardColor[0] === 'green') {
            setSelectedColor(cardColor[0]);
        } else if (cardColor[0] === 'pick' || cardColor[0] === 'color') {
            setIsModalOpen(true);
        }
    }

    // console.log(remainingCards.length);

    const shufflecards = (allCards) => {
        let shuffle = allCards.slice();
        for (let i = shuffle.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
        }
        return shuffle;
    };

    const getRandomCards = (allCards, num) => {
        const shuffle = shufflecards(allCards);
        const selected = shuffle.slice(0, num);
        const remaining = shuffle.slice(num);
        return { selected, remaining };
    };

    const startGame = () => {
        let allCards = CardList;
        const tempPlayers = [];
        for (let i = 0; i < 4; ++i) {
            const { selected: randomCards, remaining: remainingDeck } = getRandomCards(allCards, 7);
            const cardWithPlayerNumber = randomCards.map(card => ({
                ...card,
                number: i,
            }));
            tempPlayers.push({
                name: `Player ${i + 1}`,
                cards: [...cardWithPlayerNumber]
            });
            allCards = remainingDeck;
        }
        const topCard = allCards.splice(0, 1)[0];

        if (topCard.name.includes("color") || topCard.name.includes("pick-4")) {
            setIsModalOpen(true);
        } else {
            setSelectedColor(topCard.name.split('-')[0]);
        }

        setTopCard(topCard);
        setRemainingCards(allCards);
        setPlayers(tempPlayers);
        setGameStarted(true);
        setPlayerTurn(0);
        setRev(false);
    };

    const getDisplayInfo = () => {
        if (!gameStarted) {
            return 'Click Play to Start the Game'
        }
        if (playerTurn !== null) {
            return `Turn of player ${playerTurn + 1}`
        }
    }

    return (
        <div className='game-area'>
            {
                isModalOpen &&
                <>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        onColorSelect={handleColorSelect}
                    />
                </>
            }
            <div className='display-info'>
                {getDisplayInfo()}
            </div>
            <div className="board" ref={boardRef}>
                {
                    topCard &&
                    <div className="pile-center">
                        <Card card={topCard} onClick={() => { }} boardRef={boardRef} />
                    </div>
                }
                {
                    topCard &&
                    <div className='show-color'>
                        <div
                            key={selectedColor}
                            className="color-box"
                            style={{ backgroundColor: selectedColor }}
                        />
                    </div>
                }
                {
                    gameStarted &&
                    <button className='uno-uno'>
                        UNO
                    </button>
                }
                <div className="pile-bottom">
                    {
                        remainingCards.map((card, index) => (
                            <Card
                                key={index}
                                card={card}
                                onClick={() => { }}
                                boardRef={playerTurn === 0 ? player1Ref : playerTurn === 1 ? player2Ref : playerTurn === 2 ? player3Ref : player4Ref}
                                isCentered={card === centeredCard}
                                playerPosition={`card-${['top', 'right', 'bottom', 'left'][playerTurn]}`}
                            />
                        ))
                    }
                </div>
                <div className="bottom-card">
                    <Card card={unoback} onClick={() => drawCard(playerTurn, 1)} boardRef={boardRef} />
                </div>
                <div className="players">
                    {players.map((player, index) => (
                        <Player
                            key={index}
                            className={`player-${['top', 'right', 'bottom', 'left'][index]}`}
                            player={player}
                            onCardClick={handleCardClick}
                            boardRef={boardRef}
                            playerRef={index === 0 ? player1Ref : index === 1 ? player2Ref : index === 2 ? player3Ref : player4Ref}
                            centeredCard={centeredCard}
                        />
                    ))}
                </div>

            </div>

            <button className="start-game" onClick={startGame}>
                Play
            </button>
        </div>
    );
};

export default Board;
