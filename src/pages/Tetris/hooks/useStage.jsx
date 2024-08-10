import { useState, useEffect } from "react";

import { createStage } from "../components/gameHelpers";

export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage())
    const [rowsCleared, setRowsCleared] = useState(0)

    useEffect(() => {
        setRowsCleared(0);

        const sweepRows = newStage =>
            newStage.reduce((ack,row) => {
                if(row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prevValue => prevValue + 1)
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, [])

        const updateStage = prevStage => {
            // first flush the stage
            const newStage = prevStage.map(row => 
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
            );

            // then draw the tetromio
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if(value !== 0) {
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`
                        ]
                    }
                })
            });

            //check collision
            if(player.collided) {
                resetPlayer();
                return sweepRows(newStage);
            }

            return newStage;
        };

        setStage((prevStage) => updateStage(prevStage))
    }, [player, resetPlayer])

    return [stage, setStage, rowsCleared];
}