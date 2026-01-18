export type PieceType = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";

export type Coordinate = [number, number];

export type Rotation = 0 | 90 | 180 | 270;

export interface Position {
    x: number;
    y: number;
}

export interface GridPosition {
    row: number;
    col: number;
}

export interface Piece {
    id: string;
    type: PieceType;
    color: string;
    x: number;
    y: number;
    rotation: Rotation;
    isSnapped: boolean;
    gridPosition?: GridPosition;
}

export interface DraggablePieceProps {
    id: string;
    type: PieceType;
    color: string;
    x: number;
    y: number;
    rotation: Rotation;
    isSnapped: boolean;
    showDebug: boolean;
    onRotate: () => void;
}

export interface GameBoardProps {
    gridWidth: number;
    gridHeight: number;
    x: number;
    y: number;
    showDebug: boolean;
}

export interface BoardConfig {
    gridWidth: number;
    gridHeight: number;
    x: number;
    y: number;
}
