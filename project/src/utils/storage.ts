import { type Piece } from "../types/piece.types";
import { type Cell } from "../types/board.types";

export interface GameState {
    seed: number;
    pieces: Piece[];
    grid: Cell[][]
    timer: number
    isCompleted: boolean
}

const STORAGE_KEY = 'kanoodle-game-state'

export function saveGameState(state: GameState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadGameState(): GameState | null {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
}

export function resetGameState(): void {
    localStorage.removeItem(STORAGE_KEY);
}