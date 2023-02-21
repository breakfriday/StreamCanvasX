import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

let scene; let renderer; let camera; let
  controls;
let MAT_BUILDING; let
  MAT_ROAD;
const center = [-3.188822, 55.943686];
let iR;
let iR_Road;
let iR_Line;

const FLAG_ROAD_ANI = true;
const Animated_Line_Speed = 0.004;
const Animated_Line_Distances = [];
const geos_building = [];
const collider_building = [];
const raycaster: any = null;

const api = 'https://gistcdn.githack.com/isjeffcom/b40d625e7b67170f0b2dd0203e980893/raw/4a5df10aeb3f3928c1158977620798d0153de6ac/gistfile1.txt';


function ThreeScene() {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // init scene
    // Init scene

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.9, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const gridHelper = new THREE.GridHelper(100, 90, 0x0000ff, 0x808080);
    gridHelper.position.y = -0.9;
    gridHelper.position.x = -1;
    scene.add(gridHelper);



    renderer.render(scene, camera);

    // function animate() {
    //   requestAnimationFrame(animate);

    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;

    //   renderer.render(scene, camera);
    // }

    // animate();
  }, []);

  return <canvas ref={canvasRef} />;
}

export default ThreeScene;
