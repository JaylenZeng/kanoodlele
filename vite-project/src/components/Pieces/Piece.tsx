import { useDraggable } from '@dnd-kit/core';
import styles from './Piece.module.css';

export type PieceType =
    | "A" | "B" | "C" | "D" | "E" | "F"
    | "G" | "H" | "I" | "J" | "K" | "L"

type Coordinate = [dx: number, dy: number];

const PIECE_SHAPES: Record<PieceType, Coordinate[]> = {
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

function assemblePieceShape(type: PieceType, color: string) {
    const coordinates = PIECE_SHAPES[type] ?? [];

    const minX = Math.min(...coordinates.map(([dx]) => dx));
    const maxX = Math.max(...coordinates.map(([dx]) => dx));
    const minY = Math.min(...coordinates.map(([, dy]) => dy));
    const maxY = Math.max(...coordinates.map(([, dy]) => dy));

    const cellSize = 30;

    return {
        cells: coordinates.map(([dx, dy], index) => {
            const isRoot = dx === 0 && dy === 0;

            return (
                <div
                    key={index}
                    className={`${styles.pieceCell} ${isRoot ? styles.rootCell : ''}`}
                    style={{
                        left: `${(dx - minX) * cellSize}px`,
                        top: `${(maxY - dy) * cellSize}px`,
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        backgroundColor: color,
                    }}
                />
            );
        })
    };
}

interface PieceProps {
    type: PieceType
    rotation: number;
    reflection: boolean;
    color: string;
}

export default function Piece({ type, rotation, reflection, color }: PieceProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `piece-${type}`,
    });

    const getTransform = () => {
        const baseTransform = `rotate(${rotation * 90}deg)${reflection ? ' scaleX(-1)' : ''}`;

        if (transform) {
            return `translate3d(${transform.x}px, ${transform.y}px, 0) ${baseTransform}`;
        }

        return baseTransform;
    };

    const { cells } = assemblePieceShape(type, color);

    const coordinates = PIECE_SHAPES[type] ?? [];
    const minX = Math.min(...coordinates.map(([dx]) => dx));
    const maxX = Math.max(...coordinates.map(([dx]) => dx));
    const minY = Math.min(...coordinates.map(([, dy]) => dy));
    const maxY = Math.max(...coordinates.map(([, dy]) => dy));

    const cellSize = 30;
    const width = (maxX - minX + 1) * cellSize;
    const height = (maxY - minY + 1) * cellSize;

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
                    left: `${(0 - minX) * cellSize}px`,
                    top: `${(maxY - 0) * cellSize}px`,
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                }}
            />

            {/* Visual representation of the piece */}
            {cells}
        </div>
    );
}