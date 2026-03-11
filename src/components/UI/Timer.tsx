import { type ReactElement, useState, useEffect } from 'react';
import styles from './Timer.module.css';

interface TimerProps {
    isRunning: boolean;
    initialTime?: number;
    onTimeUpdate?: (time: number) => void;
}

export function Timer({ isRunning, initialTime = 0, onTimeUpdate }: TimerProps): ReactElement {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTime(prev => {
                const newTime = prev + 1;
                onTimeUpdate?.(newTime);
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, onTimeUpdate]);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
        <div className={styles.timer}>
            {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
    );
}