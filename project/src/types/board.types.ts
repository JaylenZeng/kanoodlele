export interface GameBoardProps {
    gridWidth: number;
    gridHeight: number;
    grid: Cell[][];
    onBoardPositionChange?: (left: number, top: number) => void;
}

export interface BoardConfig {
    gridWidth: number;
    gridHeight: number;
}

export interface Cell {
    isOccupied: boolean;
}