import { type Coordinate, type PieceType, type Rotation} from "../types/piece.types";
import { PIECE_SHAPES } from "../constants/piece.shapes";

export function rotateCoordinate(coord: Coordinate, rotation: Rotation): Coordinate {
    const [dx, dy] = coord;

    switch (rotation) {
        case 0:
            return [dx, dy];
        case 90:
            return [-dy, dx];
        case 180:
            return [-dx, -dy];
        case 270:
            return [dy, -dx];
        default:
            return [dx, dy];
    }
}

export function getRotatedShape(type: PieceType, rotation: Rotation): Coordinate[] {
    const baseShape = PIECE_SHAPES[type];
    return baseShape.map(coord => rotateCoordinate(coord, rotation));
}

export function getNextRotation(current: Rotation): Rotation {
    const rotations: Rotation[] = [0, 90, 180, 270];
    const currentIndex = rotations.indexOf(current);
    const nextIndex = (currentIndex + 1) % rotations.length;
    return rotations[nextIndex];
}