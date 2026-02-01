import { getTodaysSeed, createSeededRandom, getRandomInt } from "./random";
import { type Piece } from "../types/piece.types";
import { type Cell } from "../types/board.types";
import { updateGrid } from "../utils/gridUtils";
import { BOARD_CONFIG } from "../constants/game.constants";

export function generatePuzzle(
    pieces: Piece[],
    grid: Cell[][]
): { pieces: Piece[], grid: Cell[][] } {
    const random = createSeededRandom(getTodaysSeed());

    const pieceIdx1 = getRandomInt(random, 0, 11);
    const pieceIdx2 = (getRandomInt(random, 0, 11));
    
    // const firstCol = getRandomInt(random, 0, BOARD_CONFIG.gridWidth - 1);   // 0-10
    // const firstRow = getRandomInt(random, 0, BOARD_CONFIG.gridHeight - 1);  // 0-4
    // const secondCol = getRandomInt(random, 0, BOARD_CONFIG.gridWidth - 1);
    // const secondRow = getRandomInt(random, 0, BOARD_CONFIG.gridHeight - 1);

    // Column (X) should be 0 to gridWidth-1 (0-10)
    // Row (Y) should be 0 to gridHeight-1 (0-4)
    const firstCol = 1;
    const firstRow = 1;
    const secondCol = 5;
    const secondRow = 2;

    // Place piece1 and piece2 on board, adjust states accordingly
    const newPieces = pieces.map((piece, index) => {
        if (index === pieceIdx1) {
            return {
                ...piece,
                onBoard: true,
                boardX: firstCol,
                boardY: firstRow,
                locked: true,
            };
        }
        if (index === pieceIdx2) {
            return {
                ...piece,
                onBoard: true,
                boardX: secondCol,
                boardY: secondRow,
                locked: true,
            };
        }
        return piece;
    });


    // this includes locking the pieces and setting onBoard, boardX, and boardY
    let newGrid = updateGrid(grid, firstCol, firstRow, newPieces[pieceIdx1]);
    newGrid = updateGrid(newGrid, secondCol, secondRow, newPieces[pieceIdx2]);

    return { pieces: newPieces, grid: newGrid };
}