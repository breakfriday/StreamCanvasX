import React, { useRef, useEffect } from 'react';
import Threapp from './container';


const draw = (ref) => {
  Threapp.init();
  Threapp.render();
};

function ThreeScene() {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef) {
      draw(canvasRef);
    }
  }, []);

  return <div ref={canvasRef} />;
}

export default ThreeScene;
