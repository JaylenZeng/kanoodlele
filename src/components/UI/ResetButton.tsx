import { type ReactElement } from 'react';
import styles from './ResetButton.module.css';

interface ResetButtonProps {
    onReset: () => void;
}

export function ResetButton({ onReset }: ResetButtonProps): ReactElement {
    const handleClick = (): void => {
        if (window.confirm('Are you sure you want to reset the puzzle? Your progress will be lost.')) {
            onReset();
        }
    };

    return (
        <button className={styles.resetButton} onClick={handleClick}>
            Reset Puzzle
        </button>
    );
}