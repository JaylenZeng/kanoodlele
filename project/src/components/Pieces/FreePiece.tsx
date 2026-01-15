import { useDraggable } from '@dnd-kit/core';
import styles from './Piece.module.css';
import { type PieceType, assemblePieceShape, CELL_SIZE } from './Piece';

export interface FreePieceProps {
    id: string;
    type: PieceType;
    x: number;
    y: number;
    rotation: number;
    reflection: boolean;
    color: string;
}

export default function FreePiece({ id, type, x, y, rotation, reflection, color }: FreePieceProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
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
            className={`${styles.pieceContainer} ${styles.freePiece} ${isDragging ? styles.dragging : ''}`}
            style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
                transform: getTransform(),
                zIndex: isDragging ? 1000 : 100,
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
