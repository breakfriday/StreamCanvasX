import { useEffect, useRef, useState, useCallback } from 'react';

interface UseDragReturnType{
  style: {width: number; height: number};
  onMouseDown: (event: any)=>(void);
}

function useDrag(containerRef): UseDragReturnType {
  const [style, setStyle] = useState({ width: containerRef.clientWidth, height: containerRef.clientHeight });

  const elementRef = useRef<HTMLElement>();
  const positon = useRef({ x: 0, y: 0 }); // 指针在containerRef中的位置

  useEffect(() => {
    if (containerRef.current && !elementRef.current) {
      elementRef.current = containerRef.current;
    }
  }, [containerRef]);


  const onMouseDown = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    const { screenX, screenY } = event;
    const { clientHeight, clientWidth } = elementRef.current;
    // console.log(elementRef.current);
    console.log(event);
    const newstlye = { width: clientWidth, height: clientHeight };
    setStyle(newstlye);
    // console.log(newstlye.width, newstlye.height);

    // positon移动起始坐标轴
    positon.current = { x: screenX, y: screenY };

    const bindEvents = () => {
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseleave', onMouseUp);
    };

    const unbindEvents = () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseUp);
    };

    const onMouseUp = () => {
      unbindEvents();
    };

    const onMouseMove = (event) => {
      event.stopPropagation();
      event.preventDefault();
      const { screenX, screenY } = event;
      const width = style.width + screenX - positon.current.x;
      const height = style.height + screenY - positon.current.y;
      const newstlye = { width: width, height: height };
      setStyle(newstlye);
    };

    bindEvents();
  }, [style.height, style.width]);


  return { style, onMouseDown };
}
export default useDrag;