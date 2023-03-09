import React, { useRef, useEffect } from 'react';
import App from './threeJsApp';


const draw = (ref) => {
  const app = new App(ref);
  app.init();
  app.render();
  app.animate();
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
      <div ref={canvasRef} />;
    </>
  );
}

export default ThreeScene;
