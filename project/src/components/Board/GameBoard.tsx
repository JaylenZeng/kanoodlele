import { type GameBoardProps } from "../../types/board.types";
import { type ReactElement, useState, useEffect } from "react";
import { CELL_SIZE } from "../../constants/piece.shapes";
import { useDroppable } from "@dnd-kit/core";
import styles from "./GameBoard.module.css";

export function GameBoard({ gridWidth, gridHeight, onBoardPositionChange }: GameBoardProps): ReactElement {
    const { setNodeRef } = useDroppable({
        id: 'game-board',
    });

    const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateSize = () => {
            const parent = document.querySelector(`.${styles.board}`)?.parentElement;
            if (parent) {
                setParentSize({
                    width: parent.clientWidth,
                    height: parent.clientHeight,
                });

                const boardWidth = gridWidth * CELL_SIZE;
                const boardHeight = gridHeight * CELL_SIZE;
                const left = (parent.clientWidth - boardWidth) / 2;
                const top = (parent.clientHeight - boardHeight) / 2;
                onBoardPositionChange?.(left, top);
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridWidth, gridHeight]);  // Remove onBoardPositionChange from deps

    const boardWidth = gridWidth * CELL_SIZE;
    const boardHeight = gridHeight * CELL_SIZE;

    const boardStyle: React.CSSProperties = {
        width: `${boardWidth}px`,
        height: `${boardHeight}px`,
        left: `${(parentSize.width - boardWidth) / 2}px`,
        top: `${(parentSize.height - boardHeight) / 2}px`,
        // outline: isOver ? '4px solid lime' : '4px dashed red',
        // outlineOffset: '4px',
    };

    return (
        <div
            ref={setNodeRef}
            className={styles.board}
            style={boardStyle}
        >
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