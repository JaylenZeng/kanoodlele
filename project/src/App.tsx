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
import { type GameState, saveGameState, loadGameState, resetGameState } from './utils/storage';
import { getTodaysSeed } from './game/random';
import { checkWinCondition } from './game/GameController';
import { ResetButton } from './components/UI/ResetButton';
import { IntroModal } from './components/UI/IntroModal';
import { Timer } from './components/UI/Timer';

// load any previous progress the player made
const savedState = loadGameState();
const todaysSeed = getTodaysSeed();

const isRestoringState = savedState !== null && savedState.seed === todaysSeed;

const STARTING_STATE = isRestoringState
    ? { pieces: savedState.pieces, grid: savedState.grid }
    : generatePuzzle(INITIAL_PIECES, createInitialGrid());

export default function App(): ReactElement {
    const [grid, setGrid] = useState<Cell[][]>(STARTING_STATE.grid);
    const { pieces, updatePiecePosition, setPiecePosition, rotatePiece, reflectPiece, placePieceOnBoard, removePieceFromBoard } = useGameState(STARTING_STATE.pieces);
    const [isCompleted, setIsCompleted] = useState(isRestoringState ? savedState.isCompleted : false)
    const lastValidGridPosition = useRef<{ gridX: number; gridY: number } | null>(null);
    const [hasStarted, setHasStarted] = useState(isRestoringState ? savedState.hasStarted : false);
    const [timerRunning, setTimerRunning] = useState(isRestoringState && savedState.hasStarted && !savedState.isCompleted);
    const [time, setTime] = useState(isRestoringState ? savedState.timer : 0);
    const hasInitialized = useRef(false);

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

    const handleReset = (): void => {
        resetGameState();
        window.location.reload();
    };

    const handlePlay = (): void => {
        setHasStarted(true);
        setTimerRunning(true);
    };

    const handleTimeUpdate = (newTime: number): void => {
        setTime(newTime);
    };

    const piecesRef = useRef(pieces);

    // Update the ref whenever pieces changes
    useEffect(() => {  
        piecesRef.current = pieces;

        // Skip saving on initial mount
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            return;
        }

        const newState: GameState = {
            seed: getTodaysSeed(),
            pieces: pieces,
            grid: grid,
            timer: time,
            isCompleted: checkWinCondition(grid),
            hasStarted: true
        }
        saveGameState(newState);
    }, [pieces, grid, time, hasStarted]);

    // for debugging piece and grid state
    // useEffect(() => {
    //     console.log('Piece state updated:', pieces);
    //     console.log("Grid updated:", grid)
    // }, [grid]);

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
    
    return (
        <div className={styles.container}>
            {!hasStarted && <IntroModal onPlay={handlePlay} />}
            <div className={styles.header}>
                <h1 className={styles.title}>Kanoodle Puzzle Game</h1>
                <p className={styles.description}>
                    Drag pieces around • Right-click or double-click to rotate
                </p>
                <ResetButton onReset={handleReset} />
                <Timer isRunning={timerRunning && !isCompleted} initialTime={time} onTimeUpdate={handleTimeUpdate} />
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