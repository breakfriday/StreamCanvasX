import React, { useRef, useEffect } from 'react';
import App from './threeJsApp';


const draw = () => {
  const app = new App();
  app.init();
  app.render();
  app.animate();
};

function ThreeScene() {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    draw();
  }, []);

  return <canvas ref={canvasRef} />;
}

export default ThreeScene;
