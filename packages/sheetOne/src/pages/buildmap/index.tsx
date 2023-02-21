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
let raycaster: any = null;

const api = 'https://gistcdn.githack.com/isjeffcom/b40d625e7b67170f0b2dd0203e980893/raw/4a5df10aeb3f3928c1158977620798d0153de6ac/gistfile1.txt';


function ThreeScene() {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // init scene
    // Init scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x222222);

    // Init Camera
    camera = new THREE.PerspectiveCamera(25, window.clientWidth / window.clientHeight, 1, 100);
    camera.position.set(8, 4, 0);

    // Init Camera
    camera = new THREE.PerspectiveCamera(25, window.clientWidth / window.clientHeight, 1, 100);
    camera.position.set(8, 4, 0);

    // Init group
    iR = new THREE.Group();
    iR.name = 'Interactive Root';
    iR_Road = new THREE.Group();
    iR_Road.name = 'Roads';
    iR_Line = new THREE.Group();
    iR_Line.name = 'Animated Line on Roads';
    scene.add(iR);
    scene.add(iR_Road);
    scene.add(iR_Line);


    // Init Raycaster
    raycaster = new THREE.Raycaster();

    // Init Light
    const light0 = new THREE.AmbientLight(0xfafafa, 0.25);

    const light1 = new THREE.PointLight(0xfafafa, 0.4);
    light1.position.set(200, 90, 40);

    const light2 = new THREE.PointLight(0xfafafa, 0.4);
    light2.position.set(200, 90, -40);

    scene.add(light0);
    scene.add(light1);
    scene.add(light2);

    const gridHelper = new THREE.GridHelper(60, 160, new THREE.Color(0x555555), new THREE.Color(0x333333));
    scene.add(gridHelper);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // init render
    // renderer = new THREE.WebGL1Renderer({ antialias: true });

    if (canvasRef.current) {
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      const animate = () => {
        requestAnimationFrame(animate);
        // Update Three.js elements and render the scene
        renderer.render(scene, camera);
      };

      animate();
    }
  }, []);

  return <canvas ref={canvasRef} />;
}

export default ThreeScene;
