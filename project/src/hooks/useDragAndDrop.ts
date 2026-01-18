import {useSensor, useSensors, MouseSensor, TouchSensor, type DragEndEvent, type DragOverEvent} from '@dnd-kit/core'
import {type Position, type GridPosition} from '../types/piece.types'
import { BOARD_CONFIG } from '../constants/game.constants';
import { snapToGrid } from '../utils/gridSnapping';
import { isOverBoard, getGridPosition, createSnapToGridModifier } from '../utils/gridSnapping';
import React from 'react'

export function useDragAndDropSetup(
    updatePiecePosition: (
        id: string,
        deltaX: number,
        deltaY: number,
        shouldSnap: boolean,
        snappedPosition?: Position,
        gridPosition?: GridPosition
    ) => void
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

    const snapModifier = React.useMemo(
        () => createSnapToGridModifier(BOARD_CONFIG),
        []
    );

    const handleDragMove = (event: DragOverEvent): void => {
        // This runs during dragging - could be used for visual feedback
    };

    const handleDragEnd = (event: DragEndEvent): void => {
        const { active, delta } = event;

        // Calculate the final position
        const activePiece = active.data.current as { x: number; y: number } | undefined;
        if (!activePiece) {
            updatePiecePosition(active.id as string, delta.x, delta.y, false);
            return;
        }

        const finalX = activePiece.x + delta.x;
        const finalY = activePiece.y + delta.y;

        // Check if over board and snap if so
        if (isOverBoard(finalX, finalY, BOARD_CONFIG)) {
            const snappedPos = snapToGrid(finalX, finalY, BOARD_CONFIG);
            const gridPos = getGridPosition(finalX, finalY, BOARD_CONFIG);
            updatePiecePosition(active.id as string, delta.x, delta.y, true, snappedPos, gridPos);
        } else {
            updatePiecePosition(active.id as string, delta.x, delta.y, false);
        }
    };

    return { sensors, handleDragEnd, handleDragMove, snapModifier };
}