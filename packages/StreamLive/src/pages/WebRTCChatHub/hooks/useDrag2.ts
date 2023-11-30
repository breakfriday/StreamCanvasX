import { useEffect, useRef } from 'react';

interface UseDragReturnType{
  onMouseDown: (event: any)=>(void);
}

function useDrag({ changeWidth, changeHeight }): UseDragReturnType {
  const style = useRef({ width: 0, height: 0 });
  const positon = useRef({ x: 0, y: 0 });
  let element;

  const onMouseDown = event => {
    event.stopPropagation();
    event.preventDefault();
    const { clientX, clientY } = event;
    const { clientHeight, clientWidth } = event.target;
    const { currentTarget } = event;
    element = currentTarget;
    // console.log(element);
    // const { className } = event.target;
    style.current = { width: clientWidth, height: clientHeight };
    // setStyle({ width: clientWidth, height: clientHeight });

    // element = document.getElementsByClassName(className)[0];
    // origin移动起始坐标轴
    positon.current = { x: clientX, y: clientY };
    // setPositon({ x: clientX, y: clientY });
    console.log('style', style.current.width, style.current.height);
    bindEvents();
  };


  const onMouseMove = event => {
    event.stopPropagation();
    event.preventDefault();
    // console.log(event);
    const { clientX, clientY } = event;
    // console.log('client', clientX, clientY);
    const width = style.current.width + clientX - positon.current.x;
    const height = style.current.height + clientY - positon.current.y;
    // console.log('endstyle', width, height);
    if (changeWidth) {
      element.style.width = `${width}px`;
    }
    if (changeHeight) {
      element.style.height = `${height}px`;
    }
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

  return { onMouseDown };
  // if (changeWidth) {

  // }
  // if (changeHeight) {

  // }
}

export default useDrag;