import { type Modifier } from '@dnd-kit/core';
import { CELL_SIZE } from '../constants/piece.shapes';
import { BOARD_BORDER } from '../constants/game.constants';
import { type Piece } from '../types/piece.types';
import { type Cell } from '../types/board.types';
import { getTransformedShape } from './rotations';
import { isValidPlacement } from './gridUtils';
import { type RefObject } from 'react';

export const snapToGridOnBoard = (
    pieces: Piece[], 
    grid: Cell[][], 
    lastValidGridPosition: RefObject<{ gridX: number; gridY: number } | null>
): Modifier => ({ transform, over, active, draggingNodeRect }) => {
    if (over?.id === 'game-board' && over.rect && active) {
        const piece = pieces.find(p => p.id === active.id);

        if (!piece) {
            return transform;
        }

        // Get minX/minY from the rotated shape
        const coordinates = getTransformedShape(piece.type, piece.rotation, piece.reflection);
        const minX = Math.min(...coordinates.map(([dx]) => dx));
        const minY = Math.min(...coordinates.map(([, dy]) => dy));

        // Use draggingNodeRect (viewport coordinates) instead of piece position
        const currentX = draggingNodeRect?.left ?? 0;
        const currentY = draggingNodeRect?.top ?? 0;

        // Bounding box position after transform
        const targetX = currentX + transform.x;
        const targetY = currentY + transform.y;

        // Root cell position (offset from bounding box)
        const rootCellX = targetX + (-minX * CELL_SIZE);
        const rootCellY = targetY + (-minY * CELL_SIZE);

        // Root cell position relative to board
        const relativeX = rootCellX - (over.rect.left + BOARD_BORDER);
        const relativeY = rootCellY - (over.rect.top + BOARD_BORDER);

        // Snap root cell to grid
        const snappedRelativeX = Math.round(relativeX / CELL_SIZE) * CELL_SIZE;
        const snappedRelativeY = Math.round(relativeY / CELL_SIZE) * CELL_SIZE;
        
        // Calculate which grid cell the root would snap to
        const gridX = snappedRelativeX / CELL_SIZE;
        const gridY = snappedRelativeY / CELL_SIZE;

        // Check if placement is valid
        if (!isValidPlacement(grid, gridX, gridY, piece)) {
            lastValidGridPosition.current = null;
            return transform;
        }

        const snappedX = snappedRelativeX - relativeX + transform.x;
        const snappedY = snappedRelativeY - relativeY + transform.y;

        lastValidGridPosition.current = { gridX, gridY };

        return {
            ...transform,
            x: snappedX,
            y: snappedY,
        };
    }

    return transform;
};