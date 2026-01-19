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

    const minX = Math.min(...coordinates.map(([dx]) => dx));
    const minY = Math.min(...coordinates.map(([, dy]) => dy));

    const newGrid = currGrid.map(r => r.map(c => ({ ...c })));

    for (const [dx, dy] of coordinates) {
        const actualRootX = rootX + Math.abs(minX)
        const actualRootY = rootY + Math.abs(minY)

        const c = actualRootX + dx;
        const r = actualRootY + dy;

        console.log('Trying to access cell:', r, c, 'Grid size:', currGrid.length, 'x', currGrid[0].length);
        newGrid[r][c] = {
            isOccupied: true,
        };
    }
    console.log(newGrid);
    return newGrid;
}