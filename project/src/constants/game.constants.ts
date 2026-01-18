import {type Piece, type BoardConfig} from '../types/piece.types'

export const INITIAL_PIECES: Piece[] = [
    { id: 'piece-A', type: 'A', color: '#e74c3c', x: 50, y: 150, rotation: 90, isSnapped: false },
    { id: 'piece-B', type: 'B', color: '#3498db', x: 150, y: 150, rotation: 0, isSnapped: false },
    { id: 'piece-F', type: 'F', color: '#2ecc71', x: 280, y: 150, rotation: 0, isSnapped: false },
    { id: 'piece-J', type: 'J', color: '#f39c12', x: 380, y: 150, rotation: 0, isSnapped: false },
    { id: 'piece-K', type: 'K', color: '#9b59b6', x: 480, y: 150, rotation: 0, isSnapped: false },
];

export const BOARD_CONFIG: BoardConfig = {
    gridWidth: 11,
    gridHeight: 5,
    x: 100,
    y: 250,
};