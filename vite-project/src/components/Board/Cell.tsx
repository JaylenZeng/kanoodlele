import React from "react";
import { useDroppable } from '@dnd-kit/core';
import styles from './Cell.module.css';

export type CellState =
    | "empty"
    | "occupied"
    | "preview-valid"
    | "preview-invalid";

export interface CellProps {
    id: string;
    state: CellState;
    color?: string;
}

export default function Cell({ id, state, color }: CellProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    const getBackgroundColor = () => {
        if (state === "occupied" && color) return color;
        if (state === "preview-valid") return "#90EE90";
        if (state === "preview-invalid") return "#FFB6C6";
        return "black";
    };

    return (
        <div
            ref={setNodeRef}
            className={`${styles.cell} ${isOver ? styles.cellHover : ''}`}
            style={{
                backgroundColor: getBackgroundColor(),
            }}
        >
            {state === "occupied" ? "" : ""}
        </div>
    );
}