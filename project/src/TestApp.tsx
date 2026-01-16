import React, { type ReactElement } from 'react';
import { DndContext } from '@dnd-kit/core';
import { DraggablePiece } from './components/Pieces/DraggablePiece';
import { useGameState } from './hooks/useGameState';
import { useDragAndDropSetup } from './hooks/useDragAndDrop';
import { INITIAL_PIECES } from './constants/game.constants';
import { type Piece } from './types/piece.types';
import styles from './App.module.css';

export default function App(): ReactElement {
    const { pieces, updatePiecePosition, rotatePiece } = useGameState(INITIAL_PIECES);
    const { sensors, handleDragEnd } = useDragAndDropSetup(updatePiecePosition);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Kanoodle Puzzle Game</h1>
                <p className={styles.description}>
                    Drag pieces around • Right-click or double-click to rotate
                </p>
            </div>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
    );
}