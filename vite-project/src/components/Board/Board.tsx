import { useDroppable } from '@dnd-kit/core';
import Cell from './Cell'

interface BoardProps {
    droppedPieces: (string | number)[];
}

export default function Board({ droppedPieces }: BoardProps) {
    const {isOver, setNodeRef} = useDroppable({
        id: 'board',
    });

    const style = {
        color: isOver ? 'green' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className="board">
            {Array.from({ length: 5 }).map((_, row: number) => (
                <div key={row} className="board-row">
                    {Array.from({ length: 11 }).map((_, col: number) => {
                        return (
                            <Cell/>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}