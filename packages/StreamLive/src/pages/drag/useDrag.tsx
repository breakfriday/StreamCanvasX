import { useEffect, useRef, useState } from 'react';

interface UseDragReturnType{
  style: number;
  onMouseDown: (event: any)=>(void);
  count: number;
}

function useDrag(containerRef): UseDragReturnType {
  const [style, setStyle] = useState(800);
  const [count, setCount] = useState(10);

  const elementRef = useRef<HTMLElement>();
  const positon = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current && !elementRef.current) {
      // alert(1233333);
      console.log(containerRef.current);
      elementRef.current = containerRef.current;
      console.log(elementRef.current?.clientWidth);
      setStyle(elementRef.current?.clientWidth);
    }
  }, [containerRef]);

  const onMouseDown = event => {
    // event.stopPropagation();
    // event.preventDefault();
    const { clientX, clientY } = event;
    const { clientHeight, clientWidth } = elementRef.current;
    // const { className } = event.target;
    const newstlye = clientWidth;

    setStyle(newstlye);
    console.log(style);
    console.log(newstlye);
    // console.log(newstlye.width, newstlye.height);
    // setStyle({ width: clientWidth, height: clientHeight });

    // element = document.getElementsByClassName(className)[0];
    // origin移动起始坐标轴
    positon.current = { x: clientX, y: clientY };
    const newCount = count + 1;
    setCount(newCount);
    // setCount(count => count + 1);

    // console.log('style', style.width, style.height);
    bindEvents();
  };


  const onMouseMove = event => {
    event.stopPropagation();
    event.preventDefault();
    // console.log(event);
    const { clientX, clientY } = event;
    const width = style + clientX - positon.current.x;
    // const height = style.height + clientY - positon.current.y;
    const newstlye = width;
    console.log('mousemove  style', style);
    console.log('mousemove  newstlye', newstlye);
    setStyle(newstlye);
    const newCount = count + 2;
    console.log('newCount', newCount);
    setCount(newCount);

    // element.style.width = `${width}px`;
    // element.style.height = `${height}px`;
  };


  const onMouseUp = event => {
    // const newwidth = style;
    // console.log('mouse up', newwidth);
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


  return { style, onMouseDown, count };
}
export default useDrag;