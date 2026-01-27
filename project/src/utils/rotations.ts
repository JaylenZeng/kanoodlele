import { type Coordinate, type Piece, type PieceType, type Rotation} from "../types/piece.types";
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

export function reflectCoordinates(coord: Coordinate, reflection: boolean): Coordinate {
    const [dx, dy] = coord;

    if (reflection) {
        return [-dx, dy];
    }
    else {
        return [dx, dy];
    }
}

export function getTransformedShape(type: PieceType, rotation: Rotation, reflection: boolean): Coordinate[] {
    // First reflect
    const reflectedShape = getReflectedShape(type, reflection);

    // then rotate
    return reflectedShape.map(coord => rotateCoordinate(coord, rotation));
}

export function getReflectedShape(type: PieceType, reflection: boolean): Coordinate[] {
    const baseShape = PIECE_SHAPES[type];
    return baseShape.map(coord => reflectCoordinates(coord, reflection))
}

export function getNextRotation(current: Rotation): Rotation {
    const rotations: Rotation[] = [0, 90, 180, 270];
    const currentIndex = rotations.indexOf(current);
    const nextIndex = (currentIndex + 1) % rotations.length;
    return rotations[nextIndex];
}