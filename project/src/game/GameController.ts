import { type Cell } from "../types/board.types";

export function checkWinCondition(grid: Cell[][]): boolean {
    return grid.every((row) =>
        row.every((cell) => cell.isOccupied)
    );
}