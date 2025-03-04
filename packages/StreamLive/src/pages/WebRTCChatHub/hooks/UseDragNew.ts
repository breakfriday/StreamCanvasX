import React, { useRef, useEffect, useCallback } from 'react';

type ResizeOptions = 'width' | 'height' | 'both';

interface UseDragOptions {
    resize: ResizeOptions;
}

// useDrag Hook
const useDrag = (ref: React.RefObject<HTMLElement>, handleRef: React.RefObject<HTMLElement>, options: UseDragOptions, shoudHandle: boolean) => {
    const startPos = useRef({ x: 0, y: 0 });
    const startSize = useRef({ width: 0, height: 0 });
    const startLeft = useRef(0);

    const handleMouseDown = useCallback((event: MouseEvent) => {
        startPos.current = { x: event.clientX, y: event.clientY };
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            startSize.current = {
                width: rect.width,
                height: rect.height,
            };
            startLeft.current = rect.left;
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [ref]);

    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (ref.current) {
            const dx = event.clientX - startPos.current.x;
            const dy = event.clientY - startPos.current.y;

            if (options.resize === 'width' || options.resize === 'both') {
                const newWidth = startSize.current.width - dx;
                const newLeft = startLeft.current + dx;

                ref.current.style.width = `${Math.max(0, newWidth)}px`;
             //   ref.current.style.left = `${Math.max(0, newLeft)}px`;
            }

            // Handle height resizing
            if (options.resize === 'height' || options.resize === 'both') {
                const newHeight = startSize.current.height + dy;

                ref.current.style.height = `${Math.max(0, newHeight)}px`;
            }
        }
    }, [ref, options.resize]);

    const handleMouseUp = useCallback(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, []);

    useEffect(() => {
        if (handleRef.current && shoudHandle === true) {
            handleRef.current.addEventListener('mousedown', handleMouseDown);
        }

        return () => {
            if (handleRef.current) {
                handleRef.current.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }, [handleRef, handleMouseDown, shoudHandle]);

    return {};
};

export default useDrag;
