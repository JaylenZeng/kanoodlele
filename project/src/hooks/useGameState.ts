import React from 'react';
import {type Piece, type Position, type GridPosition} from '../types/piece.types';
import { getNextRotation } from '../utils/rotations';

export function useGameState(initialPieces: Piece[]) {
    const [pieces, setPieces] = React.useState<Piece[]>(initialPieces);

    const updatePiecePosition = (
        id: string,
        deltaX: number,
        deltaY: number,
        shouldSnap: boolean,
        snappedPosition?: Position,
        gridPosition?: GridPosition
    ): void => {
        setPieces((prevPieces: Piece[]) =>
            prevPieces.map((piece: Piece) => {
                if (piece.id !== id) return piece;

                if (shouldSnap && snappedPosition) {
                    return {
                        ...piece,
                        x: snappedPosition.x,
                        y: snappedPosition.y,
                        isSnapped: true,
                        gridPosition,
                    };
                }

                return {
                    ...piece,
                    x: piece.x + deltaX,
                    y: piece.y + deltaY,
                    isSnapped: false,
                    gridPosition: undefined,
                };
            })
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