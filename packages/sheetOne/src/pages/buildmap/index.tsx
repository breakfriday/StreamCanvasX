import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene; let renderer; let camera; let
  controls;


const draw = () => {
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x00FFFF);
  const camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.9, 1000);
  camera.position.z = 5;

  // init 渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);


  // init 立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
  const material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    flatShading: true,
    wireframe: true,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(2, 0, 0);
  scene.add(cube);

  // init 网格
  const gridHelper = new THREE.GridHelper(100, 90, 0x0000ff, 0x808080);
  gridHelper.position.y = -0.5;
  gridHelper.position.x = -1;
  scene.add(gridHelper);

  const light = new THREE.AmbientLight(0x8FBCD4, 0.9); // soft white light
  scene.add(light);


  controls = new OrbitControls(camera, renderer.domElement);

  // controls.enableDamping = true;
  // controls.dampingFactor = 0.25;
  // controls.screenSpacePanning = false;
  // controls.maxDistance = 800;


  // renderer.render(scene, camera);

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    controls.update();
  }

  animate();
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
