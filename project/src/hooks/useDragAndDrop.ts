import {useSensor, useSensors, MouseSensor, TouchSensor, type DragEndEvent, type DragStartEvent} from '@dnd-kit/core'
import { type Piece } from '../types/piece.types';
import { clearCells, updateGrid } from '../utils/gridUtils';
import { type Cell } from '../types/board.types';
import { checkWinCondition } from '../game/GameController';


export function useDragAndDropSetup(
    updatePiecePosition: (id: string, deltaX: number, deltaY: number) => void, 
    pieces: Piece[], grid: Cell[][], setGrid: (grid: Cell[][]) => void,
    placePieceOnBoard: (id: string, rootX: number, rootY: number) => void,
    removePieceFromBoard: (id: string) => void,
    lastValidGridPosition: { current: { gridX: number, gridY: number } | null}
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

    const handleDragStart = (event: DragStartEvent): void => {
        const piece = pieces.find(p => p.id === event.active.id);

        lastValidGridPosition.current = null; // reset for next drag

        if (piece?.onBoard && piece.boardX !== undefined && piece.boardY !== undefined) {
            const newGrid = clearCells(grid, piece.boardX, piece.boardY, piece);
            setGrid(newGrid);
            removePieceFromBoard(piece.id);
        }
    };

    const handleDragEnd = (event: DragEndEvent): void => {
        const { active, delta } = event;
        updatePiecePosition(active.id as string, delta.x, delta.y);
        const piece = pieces.find(p => p.id === event.active.id);

        let newGrid = grid;

        // Only update grid if we have a valid snapped position
        if (piece && lastValidGridPosition.current) {
            const { gridX, gridY } = lastValidGridPosition.current;
            newGrid = updateGrid(newGrid, gridX, gridY, piece);
            placePieceOnBoard(piece.id, gridX, gridY);
        }

        lastValidGridPosition.current = null;
        setGrid(newGrid);

        if (checkWinCondition(newGrid)) {
            console.log("You win!")
        }
    };

    return { sensors, handleDragStart, handleDragEnd };
}