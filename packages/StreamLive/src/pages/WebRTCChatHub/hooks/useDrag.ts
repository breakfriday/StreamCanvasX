import { useEffect, useRef, useState } from 'react';

interface UseDragReturnType{
  style: {width: number; height: number};
  initDrag: (containerRef: HTMLElement)=>(void);
}

function useDrag(): UseDragReturnType {
  const [style, setStyle] = useState({ width: 800, height: 800 });

  const elementRef = useRef<HTMLElement>();
  const positon = useRef({ x: 0, y: 0 });

  const initDrag = (containerRef) => {
    if (containerRef.current && !elementRef.current) {
      // alert(1233333);
      console.log(containerRef.current);
      elementRef.current = containerRef.current;
      elementRef.current!.onmousedown = onMouseDown;
    }
  };

  const onMouseDown = event => {
    event.stopPropagation();
    event.preventDefault();
    const { clientX, clientY } = event;
    const { clientHeight, clientWidth } = elementRef.current;
    console.log(elementRef.current);
    console.log(event);
    // const { className } = event.target;
    const newstlye = { width: clientWidth, height: clientHeight };
    setStyle(newstlye);
    console.log(newstlye.width, newstlye.height);
    // setStyle({ width: clientWidth, height: clientHeight });

    // element = document.getElementsByClassName(className)[0];
    // origin移动起始坐标轴
    positon.current = { x: clientX, y: clientY };

    // console.log('style', style.width, style.height);
    bindEvents();
  };


  const onMouseMove = event => {
    event.stopPropagation();
    event.preventDefault();
    // console.log(event);
    const { clientX, clientY } = event;
    const width = style.width + clientX - positon.current.x;
    const height = style.height + clientY - positon.current.y;
    const newstlye = { width: width, height: height };
    setStyle(newstlye);
    // element.style.width = `${width}px`;
    // element.style.height = `${height}px`;
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

  return { style, initDrag };
}
export default useDrag;