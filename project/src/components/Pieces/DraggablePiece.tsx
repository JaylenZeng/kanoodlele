import { type ReactElement } from "react";
import { type DraggablePieceProps } from "../../types/piece.types";
import { useDraggable } from '@dnd-kit/core'
import { getRotatedShape } from "../../utils/rotations";
import { CELL_SIZE } from "../../constants/piece.shapes";
import styles from "./DraggablePiece.module.css"

export function DraggablePiece({
    id,
    type,
    color,
    x,
    y,
    rotation,
    onRotate
}: DraggablePieceProps): ReactElement {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
    });

    const rotatedShape = getRotatedShape(type, rotation);

    // Calculate bounding box of the piece
    const minX = Math.min(...rotatedShape.map(([dx]) => dx));
    const maxX = Math.max(...rotatedShape.map(([dx]) => dx));
    const minY = Math.min(...rotatedShape.map(([, dy]) => dy));
    const maxY = Math.max(...rotatedShape.map(([, dy]) => dy));

    const pieceWidth = (maxX - minX + 1) * CELL_SIZE;
    const pieceHeight = (maxY - minY + 1) * CELL_SIZE;

    const handleContextMenu = (e: React.MouseEvent): void => {
        e.preventDefault();
        onRotate();
    };

    const handleDoubleClick = (): void => {
        onRotate();
    };

    const containerStyle: React.CSSProperties = {
        left: `${x}px`,
        top: `${y}px`,
        width: `${pieceWidth}px`,
        height: `${pieceHeight}px`,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        zIndex: isDragging ? 1000 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            className={`${styles.pieceContainer} ${isDragging ? styles.dragging : ''}`}
            style={containerStyle}
            onContextMenu={handleContextMenu}
            onDoubleClick={handleDoubleClick}
            {...listeners}
            {...attributes}
        >
            {rotatedShape.map(([dx, dy], index) => (
                <div
                    key={index}
                    className={`${styles.cell} ${index === 0 ? styles.rootCell : ''}`}
                    style={{
                        backgroundColor: color,
                        left: `${(dx - minX) * CELL_SIZE}px`,
                        top: `${(dy - minY) * CELL_SIZE}px`,
                        width: `${CELL_SIZE}px`,
                        height: `${CELL_SIZE}px`,
                    }}
                />
            ))}
            {/* <div className={styles.pieceLabel}>
                {type}
            </div> */}
        </div>
    );
}