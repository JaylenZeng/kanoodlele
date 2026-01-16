import {useSensor, useSensors, MouseSensor, TouchSensor, type DragEndEvent} from '@dnd-kit/core'

export function useDragAndDropSetup(updatePiecePosition: (id: string, deltaX: number, deltaY: number) => void) {
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    const handleDragEnd = (event: DragEndEvent): void => {
        const { active, delta } = event;
        updatePiecePosition(active.id as string, delta.x, delta.y);
    };

    return { sensors, handleDragEnd };
}