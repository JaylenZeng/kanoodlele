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
import { type CellProps } from "./components/Board/Cell";

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

// ---------- APP ----------
export default function App() {
  const [grid, setGrid] = useState<CellProps[][]>(createInitialGrid);
  const [droppedPieces, setDroppedPieces] = useState<(string | number)[]>([]);

  const [activePiece, setActivePiece] = useState<PieceType | null>(null);
  const [hoveredCell, setHoveredCell] =
    useState<{ row: number; col: number } | null>(null);

  // ---------- DRAG START ----------
  function handleDragStart(event: DragStartEvent) {
    setActivePiece(event.active.data.current?.type ?? null);
  }

  // ---------- DRAG OVER ----------
  function handleDragOver(event: DragOverEvent) {
    const over = event.over;
    if (!over || !over.id.toString().startsWith("cell-")) {
      setHoveredCell(null);
      return;
    }

    const [, row, col] = over.id.toString().split("-");
    setHoveredCell({ row: +row, col: +col });
  }

  // ---------- DRAG END ----------
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setHoveredCell(null);
    setActivePiece(null);

    if (!over || !over.id.toString().startsWith("cell-")) return;

    const type = active.data.current?.type as PieceType;
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

    if (!canPlace) return;

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
        };
      }

      return newGrid;
    });

    setDroppedPieces(prev => [...prev, active.id]);
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

      {/* Pieces */}
      {(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as PieceType[]).map(
        type =>
          !droppedPieces.includes(`piece-${type}`) && (
            <Piece
              key={type}
              type={type}
              rotation={0}
              reflection={false}
              color={getPieceColor(type)}
            />
          )
      )}
    </DndContext>
  );
}
