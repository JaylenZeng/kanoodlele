import { getTodaysSeed, createSeededRandom, getRandomInt } from "./random";
import { type Piece } from "../types/piece.types";
import { type Cell } from "../types/board.types";
import { isValidPlacement, updateGrid, hasImpossibleGaps } from "../utils/gridUtils";
import { BOARD_CONFIG } from "../constants/game.constants";
import { type Rotation } from "../types/piece.types";

export function generatePuzzle(
    pieces: Piece[],
    grid: Cell[][]
): { pieces: Piece[], grid: Cell[][] } {
    const random = createSeededRandom(getTodaysSeed());
    // const random = createSeededRandom(1500);

    while (true) {
        const pieceIdx1 = getRandomInt(random, 0, 11);
        let pieceIdx2 = getRandomInt(random, 0, 11);
        while (pieceIdx2 === pieceIdx1) {
            pieceIdx2 = getRandomInt(random, 0, 11);
        }

        let firstCol = getRandomInt(random, 0, BOARD_CONFIG.gridWidth - 1);
        let firstRow = getRandomInt(random, 0, BOARD_CONFIG.gridHeight - 1);
        let secondCol = getRandomInt(random, 0, BOARD_CONFIG.gridWidth - 1);
        let secondRow = getRandomInt(random, 0, BOARD_CONFIG.gridHeight - 1);

        let newPiece1 = {
            ...pieces[pieceIdx1],
            onBoard: true,
            boardX: firstCol,
            boardY: firstRow,
            locked: true,
            rotation: getRandomInt(random, 0, 3) * 90 as Rotation,
            reflection: random() > 0.5,
        };

        while (!isValidPlacement(grid, newPiece1.boardX, newPiece1.boardY, newPiece1)) {
            newPiece1 = {
                ...newPiece1,
                boardX: getRandomInt(random, 0, BOARD_CONFIG.gridWidth - 1),
                boardY: getRandomInt(random, 0, BOARD_CONFIG.gridHeight - 1),
                rotation: getRandomInt(random, 0, 3) * 90 as Rotation,
                reflection: random() > 0.5,
            };
        }

        let newGrid = updateGrid(grid, newPiece1.boardX, newPiece1.boardY, newPiece1);

        let newPiece2 = {
            ...pieces[pieceIdx2],
            onBoard: true,
            boardX: secondCol,
            boardY: secondRow,
            locked: true,
            rotation: getRandomInt(random, 0, 3) * 90 as Rotation,
            reflection: random() > 0.5,
        };

        while (!isValidPlacement(newGrid, newPiece2.boardX, newPiece2.boardY, newPiece2)) {
            newPiece2 = {
                ...newPiece2,
                boardX: getRandomInt(random, 0, BOARD_CONFIG.gridWidth - 1),
                boardY: getRandomInt(random, 0, BOARD_CONFIG.gridHeight - 1),
                rotation: getRandomInt(random, 0, 3) * 90 as Rotation,
                reflection: random() > 0.5,
            };
        }

        newGrid = updateGrid(newGrid, newPiece2.boardX, newPiece2.boardY, newPiece2);

        // Check for impossible gaps - if none, we have a valid puzzle
        if (!hasImpossibleGaps(newGrid)) {
            const newPieces = pieces.map((piece, index) => {
                if (index === pieceIdx1) {
                    return newPiece1;
                }
                if (index === pieceIdx2) {
                    return newPiece2;
                }
                return piece;
            });

            return { pieces: newPieces, grid: newGrid };
        }

        // Otherwise, loop continues and generates a new puzzle attempt
    }
}