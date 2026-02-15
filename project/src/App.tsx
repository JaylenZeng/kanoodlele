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
import { WinScreen } from './components/UI/WinScreen';

// load any previous progress the player made
const savedState = loadGameState();
const todaysSeed = getTodaysSeed();

const isRestoringState = savedState !== null && savedState.seed === todaysSeed;

const STARTING_STATE = isRestoringState
    ? { pieces: savedState.pieces, grid: savedState.grid }
    : generatePuzzle(INITIAL_PIECES, createInitialGrid());
const getInitialTime = (): number => {
    const preservedTime = sessionStorage.getItem('kanoodle-timer-preserve');
    if (preservedTime) {
        sessionStorage.removeItem('kanoodle-timer-preserve');
        return parseInt(preservedTime, 10);
    }
    return isRestoringState ? savedState.timer : 0;
};

const getInitialHasStarted = (): boolean => {
    const preserved = sessionStorage.getItem('kanoodle-started-preserve');
    if (preserved) {
        sessionStorage.removeItem('kanoodle-started-preserve');
        return preserved === 'true';
    }
    return isRestoringState ? savedState.hasStarted : false;
};

const getInitialTimerRunning = (): boolean => {
    const preserved = sessionStorage.getItem('kanoodle-timer-running-preserve');
    if (preserved) {
        sessionStorage.removeItem('kanoodle-timer-running-preserve');
        return preserved === 'true';
    }
    return isRestoringState ? (savedState.hasStarted && !savedState.isCompleted) : false;
};
   
export default function App(): ReactElement {
    const [grid, setGrid] = useState<Cell[][]>(STARTING_STATE.grid);
    const { pieces, updatePiecePosition, setPiecePosition, rotatePiece, reflectPiece, placePieceOnBoard, removePieceFromBoard } = useGameState(STARTING_STATE.pieces);
    const [isCompleted, setIsCompleted] = useState(isRestoringState ? savedState.isCompleted : false)
    const lastValidGridPosition = useRef<{ gridX: number; gridY: number } | null>(null);
    const [hasStarted, setHasStarted] = useState(getInitialHasStarted);
    const [timerRunning, setTimerRunning] = useState(getInitialTimerRunning);
    const [time, setTime] = useState(getInitialTime);
    const [showWinScreen, setShowWinScreen] = useState(false);
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
        sessionStorage.setItem('kanoodle-timer-preserve', time.toString());
        sessionStorage.setItem('kanoodle-started-preserve', 'true');
        sessionStorage.setItem('kanoodle-timer-running-preserve', timerRunning.toString());
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

        if (checkWinCondition(grid) && !isCompleted) {
            setIsCompleted(true);
            setTimerRunning(false);
            setShowWinScreen(true);
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

    const initializePiecePositions = useRef(isRestoringState);

    const updateBoardPiecePositions = (boardLeft: number, boardTop: number): void => {
        const boardWidth = BOARD_CONFIG.gridWidth * CELL_SIZE;
        const boardHeight = BOARD_CONFIG.gridHeight * CELL_SIZE;

        piecesRef.current.forEach((piece, index) => {
            if (piece.onBoard && piece.boardX !== undefined && piece.boardY !== undefined) {
                // Existing logic for pieces on the board
                const shape = getTransformedShape(piece.type, piece.rotation, piece.reflection);
                const minX = Math.min(...shape.map(([dx]) => dx));
                const minY = Math.min(...shape.map(([, dy]) => dy));

                const newX = boardLeft + (piece.boardX * CELL_SIZE) + (minX * CELL_SIZE) + BOARD_BORDER;
                const newY = boardTop + (piece.boardY * CELL_SIZE) + (minY * CELL_SIZE) + BOARD_BORDER;

                setPiecePosition(piece.id, newX, newY);
            }
            else if (!piece.onBoard && !initializePiecePositions.current) {
                // Position off-board pieces around the board
                // Left side pieces (first 6 by index in original array)
                const pieceIndex = INITIAL_PIECES.findIndex(p => p.id === piece.id);

                if (pieceIndex < 6) {
                    const col = pieceIndex < 3 ? 0 : 1;
                    const row = pieceIndex % 3;
                    const x = boardLeft - 220 + (col * 110);
                    const y = boardTop - 50 + (row * 140);
                    setPiecePosition(piece.id, x, y);
                }
                // Right side pieces (last 6)
                else {
                    const col = pieceIndex < 9 ? 0 : 1;
                    const row = (pieceIndex - 6) % 3;
                    const x = boardLeft + boardWidth + 30 + (col * 110);
                    const y = boardTop - 50 + (row * 140);
                    setPiecePosition(piece.id, x, y);
                }
            }
        });

        // Only initialize off-board positions once
        initializePiecePositions.current = true;
    };
    
    return (
        <div className={styles.container}>
            {!hasStarted && <IntroModal onPlay={handlePlay} />}
            {showWinScreen && <WinScreen time={time} onClose={() => setShowWinScreen(false)} />}
            <div className={styles.header}>
                <h1 className={styles.title}>Kanoodle Puzzle Game</h1>
                <p className={styles.description}>
                    Drag pieces around • Right-click to rotate • Shift + Right-click to reflect
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