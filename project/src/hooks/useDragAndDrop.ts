import {useSensor, useSensors, MouseSensor, TouchSensor, type DragEndEvent} from '@dnd-kit/core'
import { type Piece } from '../types/piece.types';
import { CELL_SIZE } from '../constants/piece.shapes';
import { BOARD_BORDER } from '../constants/game.constants';
import { clearCells, updateGrid } from '../utils/gridUtils';
import { type Cell } from '../types/board.types';
import { getRotatedShape } from "../utils/rotations";


export function useDragAndDropSetup(
    updatePiecePosition: (id: string, deltaX: number, deltaY: number) => void, 
    pieces: Piece[], grid: Cell[][], setGrid: (grid: Cell[][]) => void,
    placePieceOnBoard: (id: string, rootX: number, rootY: number) => void,
    removePieceFromBoard: (id: string) => void
) {
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
        const piece = pieces.find(p => p.id === event.active.id);

        let newGrid = grid;

        if (piece?.onBoard) {
            if (piece.boardX && piece.boardY) {
                newGrid = clearCells(grid, piece.boardX, piece.boardY, piece);
                removePieceFromBoard(piece.id);
            }
        }

        if (over?.id === 'game-board') {
            if (piece) {
                const finalX = piece.x + delta.x;
                const finalY = piece.y + delta.y;
                // calculate the corresponding Cell that the root cell is placed
                let x = Math.abs(Math.floor((over.rect.left - finalX) / CELL_SIZE))
                let y = Math.abs(Math.floor(((over.rect.top - finalY) / CELL_SIZE) - BOARD_BORDER))
                
                const coordinates = getRotatedShape(piece.type, piece.rotation);
                const minX = Math.min(...coordinates.map(([dx]) => dx));
                const minY = Math.min(...coordinates.map(([, dy]) => dy));

                const actualRootX = x + Math.abs(minX);
                const actualRootY = y + Math.abs(minY);

                newGrid = updateGrid(newGrid, actualRootX, actualRootY, piece);
                placePieceOnBoard(piece.id, actualRootX, actualRootY)
            }
        }

        setGrid(newGrid);
    };

    return { sensors, handleDragEnd };
}