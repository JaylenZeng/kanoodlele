import {useSensor, useSensors, MouseSensor, TouchSensor, type DragEndEvent} from '@dnd-kit/core'
import { type Piece } from '../types/piece.types';
import { CELL_SIZE } from '../constants/piece.shapes';
import { BOARD_BORDER } from '../constants/game.constants';
import { updateGrid } from '../utils/gridUtils';
import { type Cell } from '../types/board.types';

export function useDragAndDropSetup(updatePiecePosition: (id: string, deltaX: number, deltaY: number) => void, 
pieces: Piece[], grid: Cell[][], setGrid: (grid: Cell[][]) => void) {
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    const handleDragEnd = (event: DragEndEvent): void => {
        const { active, delta, over } = event;
        updatePiecePosition(active.id as string, delta.x, delta.y);

        if (over?.id === 'game-board') {
            const piece = pieces.find(p => p.id === event.active.id);
            if (piece) {
                const finalX = piece.x + delta.x;
                const finalY = piece.y + delta.y;
                // calculate the corresponding Cell that the root cell is placed
                let x = Math.abs(Math.floor((over.rect.left - finalX) / CELL_SIZE))
                let y = Math.abs(Math.floor(((over.rect.top - finalY) / CELL_SIZE) - BOARD_BORDER))
                
                setGrid(updateGrid(grid, x, y, piece));
            }
        }
    };

    return { sensors, handleDragEnd };
}