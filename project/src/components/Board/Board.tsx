import Cell, { type CellProps } from './Cell'
import styles from './Board.module.css';

interface BoardProps {
    droppedPieces: (string | number)[];
    grid: CellProps[][];
}

export default function Board({ droppedPieces, grid }: BoardProps) {
    return (
        <div className={styles.board}>
            {grid.map((row, rowIdx) => (
                <div key={rowIdx} className={styles.boardRow}>
                    {row.map((cellProps) => (
                        <Cell
                            key={cellProps.id}
                            {...cellProps}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}