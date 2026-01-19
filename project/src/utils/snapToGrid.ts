import { type Modifier } from '@dnd-kit/core';
import { CELL_SIZE } from '../constants/piece.shapes';
import { BOARD_BORDER } from '../constants/game.constants';

export const snapToGridOnBoard: Modifier = ({ transform, over, draggingNodeRect }) => {
    if (over?.id === 'game-board' && over.rect) {
        const boardLeft = over.rect.left + BOARD_BORDER;
        const boardTop = over.rect.top + BOARD_BORDER;

        // Get the current position of the dragged element
        const currentX = draggingNodeRect?.left ?? 0;
        const currentY = draggingNodeRect?.top ?? 0;

        // Calculate where the piece would be after transform
        const targetX = currentX + transform.x;
        const targetY = currentY + transform.y;

        // Calculate position relative to board
        const relativeX = targetX - boardLeft;
        const relativeY = targetY - boardTop;

        // Snap to grid relative to board
        const snappedRelativeX = Math.round(relativeX / CELL_SIZE) * CELL_SIZE;
        const snappedRelativeY = Math.round(relativeY / CELL_SIZE) * CELL_SIZE;

        // Convert back to transform values
        const snappedX = snappedRelativeX - relativeX + transform.x;
        const snappedY = snappedRelativeY - relativeY + transform.y;

        return {
            ...transform,
            x: snappedX,
            y: snappedY,
        };
    }

    return transform;
};