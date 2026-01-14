import React from "react";

// this is a Union type. It's like an ENUM
export type CellState =
    | "empty"
    | "occupied"
    | "preview-valid"
    | "preview-invalid";

interface Props {
    row:number;
    col:number;
    state:CellState;
    color?: string;
}

export default function Cell() {
    return(
        <div className="cell">X</div>
    )
}


 