import React, { type ReactElement, useState } from 'react';
import { DndContext, useDndMonitor } from '@dnd-kit/core';
import { DraggablePiece } from './components/Pieces/DraggablePiece';
import { GameBoard } from './components/Board/GameBoard';
import { useGameState } from './hooks/useGameState';
import { useDragAndDropSetup } from './hooks/useDragAndDrop';
import { INITIAL_PIECES, BOARD_CONFIG } from './constants/game.constants';
import { createInitialGrid } from './utils/gridUtils';
import { type Piece } from './types/piece.types';
import { type Cell } from './types/board.types'
import styles from './App.module.css';
import { snapToGridOnBoard } from './utils/snapToGrid';

function DebugOverlay() {
    const [collisionRect, setCollisionRect] = React.useState<DOMRect | null>(null);

    useDndMonitor({
        onDragMove(event) {
            // Log the collision rect being used
            console.log('Active rect:', event.active.rect.current.translated);
            console.log('Over:', event.over?.id, event.over?.rect);
        },
    });

    return null; // Or render a visual if needed
}

export default function App(): ReactElement {
    const { pieces, updatePiecePosition, rotatePiece } = useGameState(INITIAL_PIECES);
    const { sensors, handleDragEnd } = useDragAndDropSetup(updatePiecePosition, pieces);
    const [grid, setGrid] = useState<Cell[][]>(createInitialGrid);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Kanoodle Puzzle Game</h1>
                <p className={styles.description}>
                    Drag pieces around • Right-click or double-click to rotate
                </p>
            </div>

            <div className={styles.gameArea}>
                <DndContext
                    sensors={sensors}
                    modifiers={[snapToGridOnBoard]}
                    onDragEnd={handleDragEnd}
                >   

                    {/* <DebugOverlay /> */}
                    <GameBoard
                        gridWidth={BOARD_CONFIG.gridWidth}
                        gridHeight={BOARD_CONFIG.gridHeight}
                        grid={grid}
                    />

                    {pieces.map((piece: Piece) => (
                        <DraggablePiece
                            key={piece.id}
                            id={piece.id}
                            type={piece.type}
                            color={piece.color}
                            x={piece.x}
                            y={piece.y}
                            rotation={piece.rotation}
                            onRotate={() => rotatePiece(piece.id)}
                        />
                    ))}
                </DndContext>
            </div>
        </div>
    );
}