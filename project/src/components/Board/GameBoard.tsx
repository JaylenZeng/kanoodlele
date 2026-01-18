import { type GameBoardProps } from "../../types/piece.types";
import { type ReactElement } from "react";
import {useDroppable} from "@dnd-kit/core"
import { CELL_SIZE } from "../../constants/piece.shapes";
import styles from "./GameBoard.module.css"

export function GameBoard({ gridWidth, gridHeight, x, y, showDebug }: GameBoardProps): ReactElement {
    const { setNodeRef } = useDroppable({
        id: 'game-board',
    });

    const boardStyle: React.CSSProperties = {
        left: `${x}px`,
        top: `${y}px`,
        width: `${gridWidth * CELL_SIZE}px`,
        height: `${gridHeight * CELL_SIZE}px`,
    };

    const debugBorderStyle: React.CSSProperties = {
        position: 'absolute',
        top: '-3px',
        left: '-3px',
        right: '-3px',
        bottom: '-3px',
        border: '3px solid lime',
        borderRadius: '8px',
        pointerEvents: 'none',
        boxSizing: 'border-box',
    };

    return (
        <div
            ref={setNodeRef}
            className={styles.board}
            style={boardStyle}
        >
            {showDebug && (
                <>
                    {/* Collision box outline */}
                    <div style={debugBorderStyle} />
                    {/* Board dimensions label */}
                    <div style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '0',
                        fontSize: '12px',
                        color: 'lime',
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                    }}>
                        Board: {gridWidth}×{gridHeight} | Position: ({x}, {y}) | Size: {gridWidth * CELL_SIZE}×{gridHeight * CELL_SIZE}px
                    </div>
                    {/* Grid coordinates - Row labels */}
                    {Array.from({ length: gridHeight }).map((_, row) => (
                        <div key={`row-${row}`} style={{
                            position: 'absolute',
                            left: '-25px',
                            top: `${row * CELL_SIZE + CELL_SIZE / 2 - 6}px`,
                            fontSize: '10px',
                            color: '#666',
                            pointerEvents: 'none',
                        }}>
                            {row}
                        </div>
                    ))}
                    {/* Grid coordinates - Column labels */}
                    {Array.from({ length: gridWidth }).map((_, col) => (
                        <div key={`col-${col}`} style={{
                            position: 'absolute',
                            left: `${col * CELL_SIZE + CELL_SIZE / 2 - 5}px`,
                            top: '-20px',
                            fontSize: '10px',
                            color: '#666',
                            pointerEvents: 'none',
                        }}>
                            {col}
                        </div>
                    ))}
                </>
            )}
            {/* Grid cells */}
            {Array.from({ length: gridHeight }).map((_, row) => (
                Array.from({ length: gridWidth }).map((_, col) => (
                    <div
                        key={`${row}-${col}`}
                        className={styles.gridCell}
                        style={{
                            left: `${col * CELL_SIZE}px`,
                            top: `${row * CELL_SIZE}px`,
                            width: `${CELL_SIZE}px`,
                            height: `${CELL_SIZE}px`,
                        }}
                    />
                ))
            ))}
        </div>
    );
}
