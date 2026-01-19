import { BOARD_CONFIG } from "../constants/game.constants";
import { type Cell } from "../types/board.types";

export const createInitialGrid = (): Cell[][] =>
    Array.from({ length: BOARD_CONFIG.gridHeight }, () =>
        Array.from({ length: BOARD_CONFIG.gridWidth }, () => ({
            isOccupied: false,
        }))
    );


export function setGrid(pieceID: string, ) {

}