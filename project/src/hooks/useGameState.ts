import React from 'react';
import {type Piece} from '../types/piece.types';
import { getNextRotation } from '../utils/rotations';

export function useGameState(initialPieces: Piece[]) {
    const [pieces, setPieces] = React.useState<Piece[]>(initialPieces);

    const updatePiecePosition = (id: string, deltaX: number, deltaY: number): void => {
        setPieces((prevPieces: Piece[]) =>
            prevPieces.map((piece: Piece) =>
                piece.id === id
                    ? { ...piece, x: piece.x + deltaX, y: piece.y + deltaY }
                    : piece
            )
        );
    };

    const rotatePiece = (id: string): void => {
        setPieces((prevPieces: Piece[]) =>
            prevPieces.map((piece: Piece) =>
                piece.id === id
                    ? { ...piece, rotation: getNextRotation(piece.rotation) }
                    : piece
            )
        );
    };

    return { pieces, updatePiecePosition, rotatePiece };
}