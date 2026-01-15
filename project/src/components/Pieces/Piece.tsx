import { useDraggable } from '@dnd-kit/core';
import styles from './Piece.module.css';

export type PieceType =
    | "A" | "B" | "C" | "D" | "E" | "F"
    | "G" | "H" | "I" | "J" | "K" | "L"

type Coordinate = [dx: number, dy: number];

export const PIECE_SHAPES: Record<PieceType, Coordinate[]> = {
    "A": [[0, 0], [1, 0], [1, 1], [1, 2]],
    "B": [[0, 0], [1, 0], [1, 1], [0, 1], [1, 2]],
    "C": [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3]],
    "D": [[0, 0], [1, 0], [1, -1], [1, 1], [1, 2]],
    "E": [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]],
    "F": [[0, 0], [1, 0], [1, 1]],
    "G": [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    "H": [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]],
    "I": [[0, 0], [0, -1], [1, -1], [2, -1], [2, 0]],
    "J": [[0, 0], [0, 1], [0, 2], [0, 3]],
    "K": [[0, 0], [1, 0], [1, 1], [0, 1]],
    "L": [[0, 0], [1, 0], [1, 1], [1, -1], [2, 0]],
};

export const CELL_SIZE = 30;

export function assemblePieceShape(type: PieceType, color: string) {
    const coordinates = PIECE_SHAPES[type] ?? [];

    // Calculate bounding box
    const minX = Math.min(...coordinates.map(([dx]) => dx));
    const maxX = Math.max(...coordinates.map(([dx]) => dx));
    const minY = Math.min(...coordinates.map(([, dy]) => dy));
    const maxY = Math.max(...coordinates.map(([, dy]) => dy));

    const width = (maxX - minX + 1) * CELL_SIZE;
    const height = (maxY - minY + 1) * CELL_SIZE;

    // Calculate root cell position (where [0,0] is located)
    const rootPosition = {
        left: (0 - minX) * CELL_SIZE,
        top: (maxY - 0) * CELL_SIZE,
    };

    // Create visual cells
    const cells = coordinates.map(([dx, dy], index) => {
        const isRoot = dx === 0 && dy === 0;

        return (
            <div
                key={index}
                className={`${styles.pieceCell} ${isRoot ? styles.rootCell : ''}`}
                style={{
                    left: `${(dx - minX) * CELL_SIZE}px`,
                    top: `${(maxY - dy) * CELL_SIZE}px`,
                    width: `${CELL_SIZE}px`,
                    height: `${CELL_SIZE}px`,
                    backgroundColor: color,
                }}
            />
        );
    });

    return { width, height, rootPosition, cells };
}

export interface PieceProps {
    type: PieceType
    rotation: number;
    reflection: boolean;
    color: string;
}

export default function Piece({ type, rotation, reflection, color }: PieceProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `piece-${type}`,
        data: {
            type,
        }
    });

    const getTransform = () => {
        const baseTransform = `rotate(${rotation * 90}deg)${reflection ? ' scaleX(-1)' : ''}`;
        return transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0) ${baseTransform}`
            : baseTransform;
    };

    const { width, height, rootPosition, cells } = assemblePieceShape(type, color);

    return (
        <div
            {...listeners}
            {...attributes}
            className={`${styles.pieceContainer} ${isDragging ? styles.dragging : ''}`}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: getTransform(),
            }}
        >
            {/* Root cell - invisible but used for collision detection */}
            <div
                ref={setNodeRef}
                className={styles.collisionRoot}
                style={{
                    left: `${rootPosition.left}px`,
                    top: `${rootPosition.top}px`,
                    width: `${CELL_SIZE}px`,
                    height: `${CELL_SIZE}px`,
                }}
            />

            {/* Visual representation of the piece */}
            {cells}
        </div>
    );
}