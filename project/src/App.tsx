import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  rectIntersection,
} from "@dnd-kit/core";

import Board from "./components/Board/Board";
import Piece, { type PieceType, PIECE_SHAPES } from "./components/Pieces/Piece";
import FreePiece from "./components/Pieces/FreePiece";
import { type CellProps } from "./components/Board/Cell";

// ---------- FREE PIECE STATE ----------
interface FreePieceState {
  id: string;
  type: PieceType;
  x: number;
  y: number;
  rotation: number;
  reflection: boolean;
}

// ---------- INITIAL GRID ----------
const createInitialGrid = (): CellProps[][] =>
  Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 11 }, (_, col) => ({
      id: `cell-${row}-${col}`,
      state: "empty",
    }))
  );

// ---------- PREVIEW COMPUTATION ----------
function computePreviewGrid(
  grid: CellProps[][],
  root: { row: number; col: number },
  type: PieceType
): CellProps[][] {
  const coordinates = PIECE_SHAPES[type];
  const rows = grid.length;
  const cols = grid[0].length;

  const canPlace = coordinates.every(([dx, dy]) => {
    const r = root.row - dy;
    const c = root.col + dx;
    return (
      r >= 0 &&
      r < rows &&
      c >= 0 &&
      c < cols &&
      grid[r][c].state === "empty"
    );
  });

  return grid.map((row, r) =>
    row.map((cell, c) => {
      const covered = coordinates.some(
        ([dx, dy]) => r === root.row - dy && c === root.col + dx
      );

      if (!covered || cell.state === "occupied") return cell;

      return {
        ...cell,
        state: canPlace ? "preview-valid" : "preview-invalid",
      };
    })
  );
}

// ---------- COLOR MAP ----------
function getPieceColor(type: PieceType): string {
  const colors: Record<PieceType, string> = {
    A: "orange",
    B: "red",
    C: "darkblue",
    D: "beige",
    E: "darkgreen",
    F: "white",
    G: "lightblue",
    H: "pink",
    I: "yellow",
    J: "purple",
    K: "lightgreen",
    L: "gray",
  };
  return colors[type];
}

// ---------- GET CELLS OF A PIECE ----------
function getPieceCells(grid: CellProps[][], pieceId: string) {
  const cells: { row: number; col: number }[] = [];
  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell.pieceId === pieceId) cells.push({ row: r, col: c });
    })
  );
  return cells;
}

// ---------- PICK UP PIECE ----------
function pickUpPiece(grid: CellProps[][], pieceId: string) {
  const newGrid = grid.map(r => r.map(c => ({ ...c })));
  const cells = getPieceCells(grid, pieceId);
  cells.forEach(({ row, col }) => {
    newGrid[row][col] = {
      ...newGrid[row][col],
      state: "empty",
      color: undefined,
      pieceId: undefined,
    };
  });
  return newGrid;
}

// ---------- APP ----------
export default function App() {
  const [grid, setGrid] = useState<CellProps[][]>(createInitialGrid);
  const [droppedPieces, setDroppedPieces] = useState<(string | number)[]>([]);

  const [activePiece, setActivePiece] = useState<PieceType | null>(null);
  const [hoveredCell, setHoveredCell] =
    useState<{ row: number; col: number } | null>(null);

  const [freePieces, setFreePieces] = useState<FreePieceState[]>([]);
  const [draggedFreePiece, setDraggedFreePiece] = useState<FreePieceState | null>(null);

  // ---------- DRAG EVENTS ----------
  function handleDragStart(event: DragStartEvent) {
    const pieceId = event.active.id;
    const type = event.active.data.current?.type as PieceType | undefined;

    // if piece on board → remove it
    if (grid.some(row => row.some(c => c.pieceId === pieceId))) {
      setGrid(prev => pickUpPiece(prev, pieceId.toString()));
      setDroppedPieces(prev => prev.filter(id => id !== pieceId));
    }

    // if piece is free-positioned → store it and remove it
    const freePiece = freePieces.find(p => p.id === pieceId);
    if (freePiece) {
      setDraggedFreePiece(freePiece);
      setFreePieces(prev => prev.filter(p => p.id !== pieceId));
    } else {
      setDraggedFreePiece(null);
    }

    setActivePiece(type ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const over = event.over;
    if (!over || !over.id.toString().startsWith("cell-")) {
      setHoveredCell(null);
      return;
    }

    const [, row, col] = over.id.toString().split("-");
    setHoveredCell({ row: +row, col: +col });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;
    const pieceId = active.id.toString();
    const type = active.data.current?.type as PieceType;

    setHoveredCell(null);
    setActivePiece(null);

    // Case 1: Dropped over grid cell
    if (over && over.id.toString().startsWith("cell-")) {
      const coordinates = PIECE_SHAPES[type];

      const [, rowStr, colStr] = over.id.toString().split("-");
      const rootRow = +rowStr;
      const rootCol = +colStr;

      // ---------- VALIDATION (SYNC) ----------
      const canPlace = coordinates.every(([dx, dy]) => {
        const r = rootRow - dy;
        const c = rootCol + dx;
        return (
          r >= 0 &&
          r < grid.length &&
          c >= 0 &&
          c < grid[0].length &&
          grid[r][c].state === "empty"
        );
      });

      if (canPlace) {
        // ---------- COMMIT ----------
        setGrid(prev => {
          const newGrid = prev.map(r => r.map(c => ({ ...c })));
          const color = getPieceColor(type);

          for (const [dx, dy] of coordinates) {
            const r = rootRow - dy;
            const c = rootCol + dx;
            newGrid[r][c] = {
              ...newGrid[r][c],
              state: "occupied",
              color,
              pieceId: pieceId,
            };
          }

          return newGrid;
        });

        setDroppedPieces(prev => [...prev, active.id]);
        return;
      }
    }

    // Case 2: Dropped outside grid or invalid placement → Free position
    if (delta) {
      // Calculate position: if piece was already free, use its previous position + delta
      // Otherwise, place it at a reasonable location based on where it was dragged
      let finalX: number;
      let finalY: number;

      if (draggedFreePiece) {
        // Piece was already free, update its position
        finalX = draggedFreePiece.x + delta.x;
        finalY = draggedFreePiece.y + delta.y;
      } else {
        // New free piece - place it based on viewport center + delta
        // This gives a reasonable default position
        finalX = window.innerWidth / 2 + delta.x;
        finalY = window.innerHeight / 2 + delta.y;
      }

      // Constrain to viewport bounds
      finalX = Math.max(0, Math.min(window.innerWidth - 150, finalX));
      finalY = Math.max(0, Math.min(window.innerHeight - 150, finalY));

      setFreePieces(prev => [
        ...prev,
        {
          id: pieceId,
          type,
          x: finalX,
          y: finalY,
          rotation: 0,
          reflection: false,
        }
      ]);
    }

    setDraggedFreePiece(null);
  }

  // ---------- DISPLAY GRID ----------
  const displayGrid =
    hoveredCell && activePiece
      ? computePreviewGrid(grid, hoveredCell, activePiece)
      : grid;

  // ---------- RENDER ----------
  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Board droppedPieces = {droppedPieces} grid = {displayGrid}/>

      {/* Sidebar Pieces */}
      {(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as PieceType[]).map(
        type => {
          const pieceId = `piece-${type}`;
          const isDropped = droppedPieces.includes(pieceId);
          const isFree = freePieces.some(p => p.id === pieceId);

          return !isDropped && !isFree && (
            <Piece
              key={type}
              type={type}
              rotation={0}
              reflection={false}
              color={getPieceColor(type)}
            />
          );
        }
      )}

      {/* Free-positioned pieces */}
      {freePieces.map(piece => (
        <FreePiece
          key={piece.id}
          id={piece.id}
          type={piece.type}
          x={piece.x}
          y={piece.y}
          rotation={piece.rotation}
          reflection={piece.reflection}
          color={getPieceColor(piece.type)}
        />
      ))}
    </DndContext>
  );
}
