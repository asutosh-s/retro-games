import { useCallback, useState } from "react";

import { randomTetrominos, TETROMINOS } from "../components/tetrominos";
import { checkCollision, STAGE_WIDTH } from "../components/gameHelpers";

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos : {x : 0, y : 0},
        tetromino : TETROMINOS[0].shape,
        collided : false
    });

    const rotate = (matrix, dir) => {
        const rotatedTetro = matrix.map((_, index) => 
            matrix.map(col=> col[index])
        );
        if(dir > 0) {
            return rotatedTetro.map(row => row.reverse());
        } else {
            return rotatedTetro.reverse();
        }
    }

    const rotatePlayer = (stage, dir) => {
        const tempPlayer = JSON.parse(JSON.stringify(player));
        tempPlayer.tetromino = rotate(tempPlayer.tetromino, dir);

        const pos = tempPlayer.pos.x;
        let offset = 1;
        while(checkCollision(tempPlayer, stage, {x:0, y:0})) {
            tempPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if(offset > tempPlayer.tetromino[0].length) {
                tempPlayer.tetromino = rotate(tempPlayer.tetromino, -dir)
                tempPlayer.pos.x = pos;
                return;
            }
        }

        setPlayer(tempPlayer);
    }

    const updatePlayerPos = ({x, y, collided}) => {
        setPlayer((prev) => ({
            ...prev,
            pos : { x : prev.pos.x += x , y : prev.pos.y + y },
            collided
        }))
    }

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos : { x : STAGE_WIDTH / 2 - 2, y : 0},
            tetromino : randomTetrominos().shape,
            collided : false
        })
    }, [])

    return [player, updatePlayerPos, resetPlayer, rotatePlayer];
}