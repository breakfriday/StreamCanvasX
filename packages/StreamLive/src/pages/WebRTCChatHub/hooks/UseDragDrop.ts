import React, { useRef, useEffect, useCallback } from 'react';


const useDragDrop = (ref: React.RefObject<HTMLElement>, hasDraggableChidren: boolean) => {
  const dragItemRef = useRef<HTMLElement>();

  const handleDragStart = useCallback((event: React.DragEvent<HTMLElement>) => {
    dragItemRef.current = event.currentTarget;
    // console.log('handleDragStart  event.currentTarget', event.currentTarget);
  }, [dragItemRef]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (!ref.current) {
      return;
    }
    const dropItem = event.currentTarget;
    // console.log('handleDrop  event.currentTarget', event.currentTarget);
    if (!dragItemRef.current) {
      return;
    }
    const dragItem = dragItemRef.current;

    if (dragItem === dropItem) {
      return;
    }

    const dragItemNext = dragItem.nextElementSibling;
    const dropItemNext = dropItem.nextElementSibling;

    ref.current.insertBefore(dragItem, dropItemNext);
    ref.current.insertBefore(dropItem, dragItemNext);

    dragItemRef.current = undefined;
  }, [ref]);

  useEffect(() => {
    if (ref.current && hasDraggableChidren) {
      ref.current.addEventListener('dragover', (event: DragEvent) => {
        event.preventDefault();
      });
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('dragover', (event: DragEvent) => {
          event.preventDefault();
        });
      }
    };
  }, [ref, hasDraggableChidren]);

  return { handleDragStart, handleDrop };
};

export default useDragDrop;