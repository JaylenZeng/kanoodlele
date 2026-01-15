import { useState } from 'react'
import { DndContext, type DragEndEvent, rectIntersection } from '@dnd-kit/core'
import './App.css'
import Board from './components/Board/Board'
import Piece from './components/Pieces/Piece'
import { type CellProps } from './components/Board/Cell';

function App() {
  const [droppedPieces, setDroppedPieces] = useState<(string | number)[]>([]);
  const [grid, setGrid] = useState<CellProps[][]>(() =>
    Array.from({ length: 5 }, (_, row) =>
      Array.from({ length: 11 }, (_, col) => ({
        id: `cell-${row}-${col}`,
        state: "empty" as const,
        color: undefined
      }))
    )
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && over.id.toString().startsWith('cell-')) {
      setDroppedPieces([...droppedPieces, active.id]);

      const [_, row, col] = over.id.toString().split('-');

      setGrid(prev => {
        const newGrid = prev.map(r => r.map(c => ({ ...c })));
        newGrid[parseInt(row)][parseInt(col)] = {
          ...newGrid[parseInt(row)][parseInt(col)],
          state: "occupied",
          color: getPieceColor(active.id.toString())
        };
        return newGrid;
      });
    }
  }

  function getPieceColor(pieceId: string): string {
    const colorMap: Record<string, string> = {
      'piece-A': 'orange',
      'piece-B': 'red',
      'piece-C': 'darkblue',
      'piece-D': 'beige',
      'piece-E': 'darkgreen',
      'piece-F': 'white',
      'piece-G': 'lightblue',
      'piece-H': 'pink',
      'piece-I': 'yellow',
      'piece-J': 'purple',
      'piece-K': 'lightgreen',
      'piece-L': 'gray',
    };
    return colorMap[pieceId] || 'gray';
  }

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={rectIntersection}  // Add this line
    >
      <div>
        <Board droppedPieces={droppedPieces} grid={grid} />
        {!droppedPieces.includes('piece-A') && <Piece type="A" rotation={0} reflection={false} color="orange" />}
        {!droppedPieces.includes('piece-B') && <Piece type="B" rotation={0} reflection={false} color="red" />}
        {!droppedPieces.includes('piece-C') && <Piece type="C" rotation={0} reflection={false} color="darkblue" />}
        {!droppedPieces.includes('piece-D') && <Piece type="D" rotation={0} reflection={false} color="beige" />}
        {!droppedPieces.includes('piece-E') && <Piece type="E" rotation={0} reflection={false} color="darkgreen" />}
        {!droppedPieces.includes('piece-F') && <Piece type="F" rotation={0} reflection={false} color="white" />}
        {!droppedPieces.includes('piece-G') && <Piece type="G" rotation={0} reflection={false} color="lightblue" />}
        {!droppedPieces.includes('piece-H') && <Piece type="H" rotation={0} reflection={false} color="pink" />}
        {!droppedPieces.includes('piece-I') && <Piece type="I" rotation={0} reflection={false} color="yellow" />}
        {!droppedPieces.includes('piece-J') && <Piece type="J" rotation={0} reflection={false} color="purple" />}
        {!droppedPieces.includes('piece-K') && <Piece type="K" rotation={0} reflection={false} color="lightgreen" />}
        {!droppedPieces.includes('piece-L') && <Piece type="L" rotation={0} reflection={false} color="gray" />}
      </div>
    </DndContext>
  )
}

export default App