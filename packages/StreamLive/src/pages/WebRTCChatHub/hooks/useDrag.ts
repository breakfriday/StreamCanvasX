import { useEffect, useRef, useState, useCallback } from 'react';

interface UseDragReturnType{
  style: {width: number | string; height: number | string};
  onMouseDown: (event: any)=>(void);
}

function useDrag(): UseDragReturnType {
  const [style, setStyle] = useState<{width: string | number; height: string | number} >({ width: '', height: '' });

  const clientSize = useRef({ clientWidth: 0, clientHeight: 0 });
  const positon = useRef({ x: 0, y: 0 }); // 指针在containerRef中的位置


  const onMouseDown = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    const { screenX, screenY } = event;
    const { clientHeight, clientWidth } = event.target;
    // console.log(event);
    clientSize.current = { clientWidth: clientWidth, clientHeight: clientHeight };

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

      const width = clientSize.current.clientWidth - screenX + positon.current.x;
      const height = clientSize.current.clientHeight + screenY - positon.current.y;
      const newstlye = { width: width, height: height };
      setStyle(newstlye);
    };

    bindEvents();
  }, []);


  return { style, onMouseDown };
}
export default useDrag;