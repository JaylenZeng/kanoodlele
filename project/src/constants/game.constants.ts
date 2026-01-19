import {type Piece} from '../types/piece.types'
import { type BoardConfig } from '../types/board.types';

export const INITIAL_PIECES: Piece[] = [
    { id: 'piece-A', type: 'A', color: '#F49D3C', x: 90, y: 150, rotation: 0 },
    { id: 'piece-B', type: 'B', color: '#E8675C', x: 180, y: 150, rotation: 0 },
    { id: 'piece-C', type: 'C', color: '#3DB8E0', x: 270, y: 150, rotation: 0 },
    { id: 'piece-D', type: 'D', color: '#D6A8C8', x: 360, y: 150, rotation: 0 },
    { id: 'piece-E', type: 'E', color: '#B4D44C', x: 450, y: 150, rotation: 0 },
    { id: 'piece-F', type: 'F', color: '#FFFFFF', x: 90, y: 300, rotation: 0 },
    { id: 'piece-G', type: 'G', color: '#7FC4D8', x: 180, y: 300, rotation: 0 },
    { id: 'piece-H', type: 'H', color: '#E887AB', x: 270, y: 300, rotation: 0 },
    { id: 'piece-I', type: 'I', color: '#F4D03C', x: 360, y: 300, rotation: 0 },
    { id: 'piece-J', type: 'J', color: '#6B70A0', x: 450, y: 300, rotation: 0 },
    { id: 'piece-K', type: 'K', color: '#D8DC8C', x: 90, y: 450, rotation: 0 },
    { id: 'piece-L', type: 'L', color: '#C0BCAC', x: 180, y: 450, rotation: 0 },
];

export const BOARD_CONFIG: BoardConfig = {
    gridWidth: 11,
    gridHeight: 5,
};

export const BOARD_BORDER = 3;

export const CELL_SIZE = 30;