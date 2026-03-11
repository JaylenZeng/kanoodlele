import { BOARD_CONFIG } from "../constants/game.constants";
import { type Cell } from "../types/board.types";
import { type Piece } from "../types/piece.types";
import { getTransformedShape } from "./rotations";

export const createInitialGrid = (): Cell[][] =>
    Array.from({ length: BOARD_CONFIG.gridHeight }, () =>
        Array.from({ length: BOARD_CONFIG.gridWidth }, () => ({
            isOccupied: false,
        }))
    );


export function updateGrid(currGrid: Cell[][], rootX: number, rootY: number, piece: Piece ) {
    const coordinates = getTransformedShape(piece.type, piece.rotation, piece.reflection);
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
    const coordinates = getTransformedShape(piece.type, piece.rotation, piece.reflection);
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
    // Reject negative zero
    if (Object.is(rootX, -0) || Object.is(rootY, -0)) {
        return false;
    }
    

    const coordinates = getTransformedShape(piece.type, piece.rotation, piece.reflection);

    for (const [dx, dy] of coordinates) {
        const c = rootX + dx;
        const r = rootY + dy;

        // Check out of bounds first
        if (r <= -1 || r >= BOARD_CONFIG.gridHeight || c <= -1 || c >= BOARD_CONFIG.gridWidth) {
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

export function hasImpossibleGaps(grid: Cell[][]): boolean {
    const visited: boolean[][] = grid.map(row => row.map(() => false));

    for (let r = 0; r < BOARD_CONFIG.gridHeight; r++) {
        for (let c = 0; c < BOARD_CONFIG.gridWidth; c++) {
            if (!grid[r][c].isOccupied && !visited[r][c]) {
                const groupSize = floodFill(grid, visited, r, c);
                if (groupSize > 0 && groupSize < 4) {
                    return true; // Found an impossible gap
                }
            }
        }
    }
    return false;
}

function floodFill(grid: Cell[][], visited: boolean[][], startR: number, startC: number): number {
    const stack: [number, number][] = [[startR, startC]];
    let count = 0;

    while (stack.length > 0) {
        const [r, c] = stack.pop()!;

        // Skip if out of bounds, already visited, or occupied
        if (r < 0 || r >= BOARD_CONFIG.gridHeight ||
            c < 0 || c >= BOARD_CONFIG.gridWidth ||
            visited[r][c] || grid[r][c].isOccupied) {
            continue;
        }

        visited[r][c] = true;
        count++;

        // Add adjacent cells (up, down, left, right)
        stack.push([r - 1, c]);
        stack.push([r + 1, c]);
        stack.push([r, c - 1]);
        stack.push([r, c + 1]);
    }

    return count;
}
