import React, { type ReactElement } from 'react';
import { DndContext, type DragOverEvent, type DragEndEvent } from '@dnd-kit/core';
import { DraggablePiece } from './components/Pieces/DraggablePiece';
import { useGameState } from './hooks/useGameState';
import { useDragAndDropSetup } from './hooks/useDragAndDrop';
import { INITIAL_PIECES, BOARD_CONFIG } from './constants/game.constants';
import { type Piece } from './types/piece.types';
import { GameBoard } from './components/Board/GameBoard.tsx'
import { isOverBoard, snapToGrid, getGridPosition } from './utils/gridSnapping.ts';
import { getRotatedShape } from './utils/rotations.ts';
import { CELL_SIZE } from './constants/piece.shapes.ts';
import styles from './App.module.css';

export default function App(): ReactElement {
    const { pieces, updatePiecePosition, rotatePiece } = useGameState(INITIAL_PIECES);
    const { sensors, handleDragEnd, handleDragMove, snapModifier } = useDragAndDropSetup(updatePiecePosition);
    const [showDebug, setShowDebug] = React.useState(true);
    const [dragState, setDragState] = React.useState<{ pieceId: string; x: number; y: number } | null>(null);

    const handleDragMoveWithPreview = (event: DragOverEvent): void => {
        handleDragMove(event);

        if (event.active && event.delta) {
            const activePiece = pieces.find(p => p.id === event.active.id);
            if (activePiece) {
                const currentX = activePiece.x + event.delta.x;
                const currentY = activePiece.y + event.delta.y;
                setDragState({ pieceId: event.active.id as string, x: currentX, y: currentY });
            }
        }
    };

    const handleDragEndWithClear = (event: DragEndEvent): void => {
        handleDragEnd(event);
        setDragState(null);
    };

    // Calculate snap preview
    const snapPreview = React.useMemo(() => {
        if (!dragState || !showDebug) return null;

        const piece = pieces.find(p => p.id === dragState.pieceId);
        if (!piece) return null;

        if (isOverBoard(dragState.x, dragState.y, BOARD_CONFIG)) {
            const snapped = snapToGrid(dragState.x, dragState.y, BOARD_CONFIG);
            const gridPos = getGridPosition(dragState.x, dragState.y, BOARD_CONFIG);
            return { ...snapped, gridPos, type: piece.type, rotation: piece.rotation };
        }
        return null;
    }, [dragState, pieces, showDebug]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Kanoodle Puzzle Game</h1>
                <p className={styles.description}>
                    Drag pieces around • Right-click or double-click to rotate • Pieces snap to grid when nearby
                </p>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <input
                        type="checkbox"
                        checked={showDebug}
                        onChange={(e) => setShowDebug(e.target.checked)}
                    />
                    Show debug boxes
                </label>
            </div>

            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEndWithClear}
                onDragMove={handleDragMoveWithPreview}
                modifiers={[snapModifier]}
            >
                <GameBoard
                    gridWidth={BOARD_CONFIG.gridWidth}
                    gridHeight={BOARD_CONFIG.gridHeight}
                    x={BOARD_CONFIG.x}
                    y={BOARD_CONFIG.y}
                    showDebug={showDebug}
                />

                {/* Snap preview ghost */}
                {snapPreview && (
                    <div style={{
                        position: 'absolute',
                        left: `${snapPreview.x}px`,
                        top: `${snapPreview.y}px`,
                        pointerEvents: 'none',
                        zIndex: 999,
                    }}>
                        {getRotatedShape(snapPreview.type, snapPreview.rotation).map(([dx, dy], index) => (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    left: `${dx * CELL_SIZE}px`,
                                    top: `${dy * CELL_SIZE}px`,
                                    width: `${CELL_SIZE}px`,
                                    height: `${CELL_SIZE}px`,
                                    backgroundColor: 'rgba(255, 255, 0, 0.3)',
                                    border: '2px dashed orange',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        ))}
                        <div style={{
                            position: 'absolute',
                            top: '-25px',
                            left: '0',
                            fontSize: '11px',
                            color: 'orange',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            whiteSpace: 'nowrap',
                        }}>
                            Snap: ({snapPreview.x}, {snapPreview.y}) Grid: ({snapPreview.gridPos.col}, {snapPreview.gridPos.row})
                        </div>
                    </div>
                )}

                {pieces.map((piece: Piece) => (
                    <DraggablePiece
                        key={piece.id}
                        id={piece.id}
                        type={piece.type}
                        color={piece.color}
                        x={piece.x}
                        y={piece.y}
                        rotation={piece.rotation}
                        isSnapped={piece.isSnapped}
                        showDebug={showDebug}
                        onRotate={() => rotatePiece(piece.id)}
                    />
                ))}
            </DndContext>
        </div>
    );
}