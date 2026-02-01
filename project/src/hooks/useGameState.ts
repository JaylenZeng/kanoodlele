import React from 'react';
import {type Piece, type PieceType} from '../types/piece.types';
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

    const setPiecePosition = (id: string, x: number, y: number): void => {
        setPieces((prevPieces: Piece[]) =>
            prevPieces.map((piece: Piece) =>
                piece.id === id
                    ? { ...piece, x, y }
                    : piece
            )
        );
    };

    const rotatePiece = (id: string): void => {
        setPieces((prevPieces: Piece[]) =>
            prevPieces.map((piece: Piece) =>
                piece.id === id
                    ? { ...piece, rotation: getNextRotation(piece.rotation), onBoard: false, boardX: undefined, boardY: undefined }
                    : piece
            )
        );
    };

    const reflectPiece = (id: string): void => {
        setPieces((prevPieces: Piece[]) =>
            prevPieces.map((piece: Piece) =>
                piece.id === id
                    ? { ...piece, reflection: !piece.reflection, onBoard: false, boardX: undefined, boardY: undefined }
                    : piece
            )
        );
    }

    function placePieceOnBoard(id: string, rootX: number, rootY: number) {
        setPieces((prevPieces: Piece[]) =>
            prevPieces.map((piece: Piece) => {
                if (piece.id !== id) return piece;
                return { ...piece, onBoard: true, boardX: rootX, boardY: rootY };
            })
        );
    }

    function removePieceFromBoard(id: string) {
        setPieces((prevPieces: Piece[]) =>
            prevPieces.map((piece: Piece) => {
                if (piece.id !== id) return piece;
                return { ...piece, onBoard: false, boardX: undefined, boardY: undefined };
            })
        );
    }

    return { pieces, updatePiecePosition, setPiecePosition, rotatePiece, reflectPiece, placePieceOnBoard, removePieceFromBoard };
}