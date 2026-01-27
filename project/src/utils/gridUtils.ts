import { BOARD_CONFIG } from "../constants/game.constants";
import { type Cell } from "../types/board.types";
import { type Piece } from "../types/piece.types";
import { getRotatedShape } from "./rotations";

export const createInitialGrid = (): Cell[][] =>
    Array.from({ length: BOARD_CONFIG.gridHeight }, () =>
        Array.from({ length: BOARD_CONFIG.gridWidth }, () => ({
            isOccupied: false,
        }))
    );


export function updateGrid(currGrid: Cell[][], rootX: number, rootY: number, piece: Piece ) {
    const coordinates = getRotatedShape(piece.type, piece.rotation);
    const newGrid = currGrid.map(r => r.map(c => ({ ...c })));

    for (const [dx, dy] of coordinates) {

        const c = rootX + dx;
        const r = rootY + dy;

        newGrid[r][c] = {
            isOccupied: true,
        };
    }

    return newGrid;
}

export function clearCells(currGrid: Cell[][], rootX: number, rootY: number, piece: Piece) {
    const coordinates = getRotatedShape(piece.type, piece.rotation);
    const newGrid = currGrid.map(r => r.map(c => ({ ...c })));

    for (const [dx, dy] of coordinates) {
        const c = rootX + dx;
        const r = rootY + dy;

        newGrid[r][c] = {
            isOccupied: false,
        };
    }
    return newGrid;
}

export function isValidPlacement(currGrid: Cell[][], rootX: number, rootY: number, piece: Piece): boolean {
    const coordinates = getRotatedShape(piece.type, piece.rotation);

    for (const [dx, dy] of coordinates) {
        const c = rootX + dx;
        const r = rootY + dy;

        // Check out of bounds first
        if (r < 0 || r >= BOARD_CONFIG.gridHeight || c < 0 || c >= BOARD_CONFIG.gridWidth) {
            return false;
        }

        // Then check if occupied
        if (currGrid[r][c].isOccupied) {
            return false;
        }
    }

    // All cells are valid
    return true;
}