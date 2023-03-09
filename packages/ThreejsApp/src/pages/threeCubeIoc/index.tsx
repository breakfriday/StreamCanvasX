import React, { useRef, useEffect } from 'react';
import { app } from './container';


const draw = (ref) => {
  app.run();
};

function ThreeScene() {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef) {
      draw(canvasRef);
    }
  }, []);

  return (
    <>
      <div>tesdddt</div>
      <div ref={canvasRef} />
    </>
  );
}

export default ThreeScene;
