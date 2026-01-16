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
}

export interface DraggablePieceProps {
    id: string;
    type: PieceType;
    color: string;
    x: number;
    y: number;
    rotation: Rotation;
    onRotate: () => void;
}

export type PieceType =
    | "A" | "B" | "C" | "D" | "E" | "F"
    | "G" | "H" | "I" | "J" | "K" | "L"

export type Coordinate = [number, number];

export type Rotation = 0 | 90 | 180 | 270;
