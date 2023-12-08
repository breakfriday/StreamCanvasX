import React, { useRef, useEffect, useCallback } from 'react';


const useDragDrop = <T>(ref: React.RefObject<HTMLElement>, itemList: Array<T>, setItemList: React.Dispatch<React.SetStateAction<Array<T>>>) => {
  const dragItemRef = useRef<HTMLElement>();
  function exchange<T>(list: T[], fromIndex: number, toIndex: number): T[] {
    const copy = [...list];
    const from = copy[fromIndex];
    const to = copy[toIndex];
    if (from === to) {
      return copy;
    }

    copy.splice(fromIndex, 1, to);
    copy.splice(toIndex, 1, from);
    return copy;
  }

  const updateItemList = useCallback((from: number, to: number) => {
    if (!ref.current) {
      return;
    }
    const ordered = exchange(itemList, from, to);
    if (ordered === itemList) {
      return;
    }
    setItemList(ordered);
  }, [itemList]);

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
    const list = Array.from(ref.current.childNodes);
    const dropIndex = list.indexOf(dropItem);
    if (!dragItemRef.current) {
      return;
    }
    const dragIndex = list.indexOf(dragItemRef.current);
    if (dragIndex === dropIndex) {
      return;
    }
    updateItemList(dragIndex, dropIndex);
    dragItemRef.current = undefined;
  }, [updateItemList, ref]);

  useEffect(() => {
    if (ref.current) {
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
  }, [ref]);

  return { handleDragStart, handleDrop };
};

export default useDragDrop;