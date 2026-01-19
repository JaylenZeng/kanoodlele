export interface GameBoardProps {
    gridWidth: number;
    gridHeight: number;
    grid: Cell[][];
}

export interface BoardConfig {
    gridWidth: number;
    gridHeight: number;
}

export interface Cell {
    isOccupied: boolean;
}