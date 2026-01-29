import React, { type ReactElement, useState, useEffect, useRef } from 'react';
import { DndContext, useDndMonitor } from '@dnd-kit/core';
import { DraggablePiece } from './components/Pieces/DraggablePiece';
import { GameBoard } from './components/Board/GameBoard';
import { useGameState } from './hooks/useGameState';
import { useDragAndDropSetup } from './hooks/useDragAndDrop';
import { INITIAL_PIECES, BOARD_CONFIG } from './constants/game.constants';
import { createInitialGrid, clearCells } from './utils/gridUtils';
import { type Piece } from './types/piece.types';
import { type Cell } from './types/board.types'
import styles from './App.module.css';
import { snapToGridOnBoard } from './utils/snapToGrid';

export default function App(): ReactElement {
    const { pieces, updatePiecePosition, rotatePiece, reflectPiece, placePieceOnBoard, removePieceFromBoard } = useGameState(INITIAL_PIECES);
    const [grid, setGrid] = useState<Cell[][]>(createInitialGrid);
    const lastValidGridPosition = useRef<{ gridX: number; gridY: number } | null>(null);

    const { sensors, handleDragStart, handleDragEnd } = useDragAndDropSetup(
        updatePiecePosition, 
        pieces, 
        grid, 
        setGrid, 
        placePieceOnBoard,
        removePieceFromBoard,
        lastValidGridPosition,
    );

    const handleRotatePiece = (id: string): void => {
        const piece = pieces.find(p => p.id === id);

        if (piece?.onBoard && piece.boardX !== undefined && piece.boardY !== undefined) {
            const newGrid = clearCells(grid, piece.boardX, piece.boardY, piece);
            setGrid(newGrid);
        }

        rotatePiece(id);
    };

    const handleReflectPiece = (id: string): void => {
        const piece = pieces.find(p => p.id === id);

        if (piece?.onBoard && piece.boardX !== undefined && piece.boardY !== undefined) {
            const newGrid = clearCells(grid, piece.boardX, piece.boardY, piece);
            setGrid(newGrid);
        }

        reflectPiece(id);
    };


    useEffect(() => {
        console.log('Piece state updated:', pieces);
        console.log("Grid updated:", grid)
    }, [grid]);

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
                    onDragStart={handleDragStart}
                    modifiers={[snapToGridOnBoard(pieces, grid, lastValidGridPosition)]}
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
                            key = {piece.id}
                            piece = {piece}
                            onRotate={() => handleRotatePiece(piece.id)}
                            onReflect={() => handleReflectPiece(piece.id)}
                        />
                    ))}
                </DndContext>
            </div>
        </div>
    );
}