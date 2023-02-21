import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function ThreeScene() {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000,
    );

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 'hotpink' });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 10);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
}

export default ThreeScene;
