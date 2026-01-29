import { type ReactElement } from "react";
import { type DraggablePieceProps } from "../../types/piece.types";
import { useDraggable } from '@dnd-kit/core'
import { getTransformedShape } from "../../utils/rotations";
import { CELL_SIZE } from "../../constants/piece.shapes";
import styles from "./DraggablePiece.module.css"

export function DraggablePiece({
    piece,
    onRotate,
    onReflect
}: DraggablePieceProps): ReactElement {
    const { id, type, color, x, y, rotation, reflection } = piece;
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
    });

    const rotatedShape = getTransformedShape(type, rotation, reflection);

    // Calculate bounding box of the piece
    const minX = Math.min(...rotatedShape.map(([dx]) => dx));
    const maxX = Math.max(...rotatedShape.map(([dx]) => dx));
    const minY = Math.min(...rotatedShape.map(([, dy]) => dy));
    const maxY = Math.max(...rotatedShape.map(([, dy]) => dy));

    const pieceWidth = (maxX - minX + 1) * CELL_SIZE;
    const pieceHeight = (maxY - minY + 1) * CELL_SIZE;

    const handleContextMenu = (e: React.MouseEvent): void => {
        e.preventDefault();
        if (e.shiftKey) {
            onReflect();  // Shift + Right-click to reflect
        } else {
            onRotate();   // Right-click to rotate
        }
    };

    const handleMouseDown = (e: React.MouseEvent): void => {
        if (e.button === 1 || (e.shiftKey && e.button === 0)) { // middle click
            console.log("click!")
            e.preventDefault
            onReflect();
        }
    }

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
            className={`${styles.pieceContainer} ${isDragging ? styles.dragging : ''} ${piece.onBoard ? styles.onBoard : styles.offBoard}`}
            style={containerStyle}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            {...listeners}
            {...attributes}
        >
            {rotatedShape.map(([dx, dy], index) => (
                <div
                    key={index}
                    className={`${styles.cell} ${index === 0 ? styles.rootCell : ''} ${piece.onBoard ? styles.cellOnBoard : styles.cellOffBoard}`}
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