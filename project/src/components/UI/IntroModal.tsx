import { type ReactElement } from "react";
import styles from './IntroModal.module.css';

interface IntroModalProps {
    onPlay: () => void;
}

export function IntroModal({ onPlay }: IntroModalProps): ReactElement {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h1 className={styles.title}>Kanoodle</h1>
                <p className={styles.subtitle}>Fill the board with all 12 pieces.</p>

                <div className={styles.rules}>
                    <h3>How to Play</h3>
                    <ul>
                        <li>Drag pieces onto the board</li>
                        <li>Right-click or double-click to rotate</li>
                        <li>Shift + right-click to flip</li>
                        <li>Gray pieces are locked and cannot be moved</li>
                        <li>Fill every cell to win!</li>
                    </ul>
                </div>

                <button className={styles.playButton} onClick={onPlay}>
                    Play
                </button>
            </div>
        </div>
    );
}