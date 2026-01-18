import { CELL_SIZE } from "../constants/piece.shapes";
import { type BoardConfig, type Position, type GridPosition } from "../types/piece.types";

export function isOverBoard(x: number, y: number, boardConfig: BoardConfig): boolean {
    const { x: boardX, y: boardY, gridWidth, gridHeight } = boardConfig;
    const boardWidth = gridWidth * CELL_SIZE;
    const boardHeight = gridHeight * CELL_SIZE;

    return (
        x >= boardX &&
        x <= boardX + boardWidth &&
        y >= boardY &&
        y <= boardY + boardHeight
    );
}

export function snapToGrid(x: number, y: number, boardConfig: BoardConfig): Position {
    const { x: boardX, y: boardY } = boardConfig;

    const offsetX = x - boardX;
    const offsetY = y - boardY;

    const snappedCol = Math.round(offsetX / CELL_SIZE);
    const snappedRow = Math.round(offsetY / CELL_SIZE);

    return {
        x: boardX + snappedCol * CELL_SIZE,
        y: boardY + snappedRow * CELL_SIZE,
    };
}

export function getGridPosition(x: number, y: number, boardConfig: BoardConfig): GridPosition {
    const { x: boardX, y: boardY } = boardConfig;

    const offsetX = x - boardX;
    const offsetY = y - boardY;

    return {
        col: Math.round(offsetX / CELL_SIZE),
        row: Math.round(offsetY / CELL_SIZE),
    };
}

// Modifier for dnd-kit to snap during drag
export function createSnapToGridModifier(boardConfig: BoardConfig) {
    return ({ transform, draggingNodeRect, activeNodeRect }: any) => {
        if (!draggingNodeRect || !activeNodeRect) return transform;

        // Get the current position of the dragging element
        const currentX = activeNodeRect.left + transform.x;
        const currentY = activeNodeRect.top + transform.y;

        // Check if over board
        if (isOverBoard(currentX, currentY, boardConfig)) {
            // Calculate snapped position
            const snapped = snapToGrid(currentX, currentY, boardConfig);

            // Return transform adjusted to snap position
            return {
                ...transform,
                x: snapped.x - activeNodeRect.left,
                y: snapped.y - activeNodeRect.top,
            };
        }

        return transform;
    };
}