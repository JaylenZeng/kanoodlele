import React from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import styles from "./Cell.module.css";

export type CellState = "empty" | "occupied" | "preview-valid" | "preview-invalid";

export interface CellProps {
    id: string;
    state: CellState;
    color?: string;
    pieceId?: string;
}

interface CellComponentProps extends CellProps {
    // no event handlers in useDraggable
}

export default function Cell({ id, state, color, pieceId }: CellComponentProps) {
    // ---------- Droppable for placing pieces ----------
    const { isOver, setNodeRef: setDroppableRef } = useDroppable({ id });

    // ---------- Draggable if there is a piece ----------
    const draggable = useDraggable({
        id: pieceId ?? "",
        data: { type: pieceId?.slice(-1) }, // e.g., "A" - "L"
        disabled: !pieceId,
    });

    const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = draggable;

    // ---------- Merge refs ----------
    const ref = (node: HTMLElement | null) => {
        setDroppableRef(node);
        setDraggableRef(node);
    };

    const getBackgroundColor = () => {
        if (state === "occupied" && color) return color;
        if (state === "preview-valid") return "#90EE90";
        if (state === "preview-invalid") return "#FFB6C6";
        return "black";
    };

    const transformStyle = transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined;

    return (
        <div
            ref={ref}
            {...attributes}
            {...listeners}
            className={`${styles.cell} ${isOver ? styles.cellHover : ""} ${isDragging ? styles.dragging : ""}`}
            style={{
                backgroundColor: getBackgroundColor(),
                transform: transformStyle,
            }}
        />
    );
}
