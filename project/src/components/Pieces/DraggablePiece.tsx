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
    isSnapped,
    showDebug,
    onRotate
}: DraggablePieceProps): ReactElement {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { x, y }, // Pass current position to dnd-kit
    });

    const rotatedShape = getRotatedShape(type, rotation);

    const handleContextMenu = (e: React.MouseEvent): void => {
        e.preventDefault();
        onRotate();
    };

    const handleDoubleClick = (): void => {
        onRotate();
    };

    // Calculate bounding box of the piece
    const minX = Math.min(...rotatedShape.map(([dx]) => dx));
    const maxX = Math.max(...rotatedShape.map(([dx]) => dx));
    const minY = Math.min(...rotatedShape.map(([, dy]) => dy));
    const maxY = Math.max(...rotatedShape.map(([, dy]) => dy));

    const boundingWidth = (maxX - minX + 1) * CELL_SIZE;
    const boundingHeight = (maxY - minY + 1) * CELL_SIZE;

    // Dynamic styles that depend on props/state
    const containerStyle: React.CSSProperties = {
        left: `${x}px`,
        top: `${y}px`,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        zIndex: isDragging ? 1000 : 1,
    };

    const debugBoxStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${minX * CELL_SIZE}px`,
        top: `${minY * CELL_SIZE}px`,
        width: `${boundingWidth}px`,
        height: `${boundingHeight}px`,
        border: '2px dashed red',
        pointerEvents: 'none',
        boxSizing: 'border-box',
    };

    const rootDebugStyle: React.CSSProperties = {
        position: 'absolute',
        left: '0',
        top: '0',
        width: `${CELL_SIZE}px`,
        height: `${CELL_SIZE}px`,
        border: '2px solid blue',
        pointerEvents: 'none',
        boxSizing: 'border-box',
    };

    return (
        <div
            ref={setNodeRef}
            className={`${styles.pieceContainer} ${isDragging ? styles.dragging : ''} ${isSnapped ? styles.snapped : ''}`}
            style={containerStyle}
            onContextMenu={handleContextMenu}
            onDoubleClick={handleDoubleClick}
            {...listeners}
            {...attributes}
        >
            {showDebug && (
                <>
                    {/* Root position (blue box) */}
                    <div style={rootDebugStyle} />
                    {/* Bounding box (red dashed) */}
                    <div style={debugBoxStyle} />
                    {/* Coordinate label */}
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '0',
                        fontSize: '10px',
                        color: 'red',
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        padding: '2px 4px',
                        borderRadius: '2px',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                    }}>
                        ({Math.round(x)}, {Math.round(y)})
                    </div>
                </>
            )}
            {rotatedShape.map(([dx, dy], index) => (
                <div
                    key={index}
                    className={`${styles.cell} ${index === 0 ? styles.rootCell : ''}`}
                    style={{
                        backgroundColor: color,
                        left: `${dx * CELL_SIZE}px`,
                        top: `${dy * CELL_SIZE}px`,
                        width: `${CELL_SIZE}px`,
                        height: `${CELL_SIZE}px`,
                    }}
                />
            ))}
            <div className={styles.pieceLabel}>
                {type}
            </div>
        </div>
    );
}