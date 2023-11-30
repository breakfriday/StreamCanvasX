import { useEffect, useRef, useState } from 'react';

interface UseDragReturnType{
  style: {width: number; height: number};
  onMouseDown: (event: any)=>(void);
}

function useDrag(containerRef): UseDragReturnType {
  const [style, setStyle] = useState({ width: 0, height: 0 });

  const elementRef = useRef<HTMLElement>();
  const positon = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current && !elementRef.current) {
      elementRef.current = containerRef.current;
    }
  }, [containerRef]);

  const onMouseDown = event => {
    event.stopPropagation();
    event.preventDefault();
    const { clientX, clientY } = event;
    const { clientHeight, clientWidth } = elementRef.current;
    // console.log(elementRef.current);
    // console.log(event);
    const newstlye = { width: clientWidth, height: clientHeight };
    setStyle(newstlye);
    console.log(newstlye.width, newstlye.height);

    // positon移动起始坐标轴
    positon.current = { x: clientX, y: clientY };
    bindEvents();
  };


  const onMouseMove = event => {
    event.stopPropagation();
    event.preventDefault();
    const { clientX, clientY } = event;
    const width = style.width + clientX - positon.current.x;
    const height = style.height + clientY - positon.current.y;
    const newstlye = { width: width, height: height };
    setStyle(newstlye);
  };


  const onMouseUp = event => {
    unbindEvents();
  };


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

  useEffect(() => {
    return () => {
      unbindEvents();
    };
  }, []);

  return { style, onMouseDown };
}
export default useDrag;