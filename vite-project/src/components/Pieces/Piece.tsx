import { useDraggable } from '@dnd-kit/core';


export type PieceType =
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"   
    | "G"
    | "H"
    | "I"
    | "J"
    | "K"
    | "L"

/* Piece Shapes are assembled relative to a pivot point (0,0).
 * A Coordinate represents the dx, dy relative to that pivot point 
 * with positive x and y going right and up respectively.
*/

const PIECE_SHAPES: Record<PieceType, Coordinate[]> = {
    "A": [[0, 0], [1, 0], [1, 1], [1, 2]],
    "B": [[0, 0], [1, 0], [1, 1], [0, 1], [1, 2]],
    "C": [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3]],
    "D": [[0, 0], [1, 0], [1, -1], [1, 1], [1, 2]],
    "E": [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]],
    "F": [[0, 0], [1, 0], [1, 1]],
    "G": [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    "H": [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]],
    "I": [[0, 0], [0, -1], [1, -1], [2, -1], [2, 0]],
    "J": [[0, 0], [0, 1], [0, 2], [0, 3]],
    "K": [[0, 0], [1, 0], [1, 1], [0, 1]],
    "L": [[0, 0], [1, 0], [1, 1], [1, -1], [2, 0]],
};

function assemblePieceShape(type: PieceType) {
    const coordinates = PIECE_SHAPES[type] ?? [];
    return coordinates.map(([dx, dy], index) => (
        <div 
            key={index} 
            className="piece-cell" 
            data-dx={dx} 
            data-dy={dy}
            style={{
                '--dx': dx,
                '--dy': dy,
            } as React.CSSProperties}
        ></div>
    ));
}

type Coordinate = [dx: number, dy: number];

interface PieceProps {
    type: PieceType
    rotation: number;
    reflection: boolean;
    color: string;
}

export default function Piece({type, rotation, reflection, color}: PieceProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `piece-${type}`, // Unique ID for this piece
    });
    
    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="piece"
            style={{
                '--piece-color': color,
                transform: transform
                    ? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${rotation * 90}deg)`
                    : `rotate(${rotation * 90}deg)`,
            } as React.CSSProperties}
        >
            {assemblePieceShape(type)}
        </div>
    );
}