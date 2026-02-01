import { type ReactElement, useState, useEffect, useRef } from 'react';
import { DndContext } from '@dnd-kit/core';
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
import { generatePuzzle } from './game/puzzleGenerator';
import { CELL_SIZE } from './constants/piece.shapes';
import { BOARD_BORDER } from './constants/game.constants';
import { getTransformedShape } from './utils/rotations';

const STARTING_STATE = generatePuzzle(INITIAL_PIECES, createInitialGrid());

export default function App(): ReactElement {
    const [grid, setGrid] = useState<Cell[][]>(STARTING_STATE.grid);
    const { pieces, updatePiecePosition, setPiecePosition, rotatePiece, reflectPiece, placePieceOnBoard, removePieceFromBoard } = useGameState(STARTING_STATE.pieces);
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

    // this allows us to update the grid state to remove the piece from the board on transformation
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

    const piecesRef = useRef(pieces);

    // Update the ref whenever pieces changes
    useEffect(() => {
        piecesRef.current = pieces;
    }, [pieces]);

    const updateBoardPiecePositions = (boardLeft: number, boardTop: number): void => {
        // Use piecesRef.current instead of pieces
        piecesRef.current.forEach(piece => {
            if (piece.onBoard && piece.boardX !== undefined && piece.boardY !== undefined) {
                const shape = getTransformedShape(piece.type, piece.rotation, piece.reflection);
                const minX = Math.min(...shape.map(([dx]) => dx));
                const minY = Math.min(...shape.map(([, dy]) => dy));

                const newX = boardLeft + (piece.boardX * CELL_SIZE) + (minX * CELL_SIZE) + BOARD_BORDER;
                const newY = boardTop + (piece.boardY * CELL_SIZE) + (minY * CELL_SIZE) + BOARD_BORDER;

                setPiecePosition(piece.id, newX, newY);
            }
        });
    };
    // useEffect(() => {
    //     console.log('Piece state updated:', pieces);
    //     console.log("Grid updated:", grid)
    // }, [grid]);
 
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
                        onBoardPositionChange={updateBoardPiecePositions}
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