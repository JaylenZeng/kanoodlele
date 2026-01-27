export interface Position {
    x: number;
    y: number;
}

export interface Piece {
    id: string;
    type: PieceType;
    color: string;
    x: number;
    y: number;
    rotation: Rotation;
    reflection: boolean;
    onBoard: boolean;
    boardX?: number;
    boardY?: number;
}

export interface DraggablePieceProps {
    piece: Piece;
    onRotate: () => void;
    onReflect: () => void;
}

export type PieceType =
    | "A" | "B" | "C" | "D" | "E" | "F"
    | "G" | "H" | "I" | "J" | "K" | "L"

export type Coordinate = [number, number];

export type Rotation = 0 | 90 | 180 | 270;
