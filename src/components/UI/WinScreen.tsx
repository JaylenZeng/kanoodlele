import { type ReactElement } from 'react';
import styles from './WinScreen.module.css';

interface WinScreenProps {
    time: number;
    onClose: () => void;
}

export function WinScreen({ time, onClose }: WinScreenProps): ReactElement {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h1 className={styles.title}>🎉 You Win! 🎉</h1>
                <p className={styles.message}>You completed today's puzzle!</p>

                <div className={styles.timeContainer}>
                    <span className={styles.timeLabel}>Your Time</span>
                    <span className={styles.time}>
                        {minutes}:{seconds.toString().padStart(2, '0')}
                    </span>
                </div>

                <button className={styles.closeButton} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}