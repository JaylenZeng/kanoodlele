import { useState } from 'react'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import './App.css'
import Board from './components/Board/Board'
import Piece from './components/Pieces/Piece'

function App() {
  const [droppedPieces, setDroppedPieces] = useState<(string | number)[]>([]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && over.id === 'board') {
      setDroppedPieces([...droppedPieces, active.id]);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <Board droppedPieces={droppedPieces} />
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
