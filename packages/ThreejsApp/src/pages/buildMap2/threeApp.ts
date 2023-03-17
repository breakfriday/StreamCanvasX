import * as THREE from 'three';

import {
  MapControls,
} from 'three/examples/jsm/controls/OrbitControls.js';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { getDistance, getRhumbLineBearing } from 'geolib';

import map_data from './map.json';


class threeApp {
  scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: any;
  constructor(el) {
    const width = el.current.clientWidth; // window.innerWidth
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);


    el.current.appendChild(this.renderer.domElement); window.innerWidth;
  }
  init() {
    this.add_scene();
    this.add_light();
    this.add_gridHelper();
  }
  // 注册场景
  add_scene() {
    this.scene = new THREE.Scene();

    this.scene.background = new THREE.Color(0x222222);
  }
  // 注册灯光
  add_light() {
    const light0 = new THREE.AmbientLight(0xfafafa, 0.25);

    const light1 = new THREE.PointLight(0xfafafa, 0.4);
    light1.position.set(200, 90, 40);

    const light2 = new THREE.PointLight(0xfafafa, 0.4);
    light2.position.set(200, 90, -40);

    this.scene.add(light0);
    this.scene.add(light1);
    this.scene.add(light2);
  }
  add_gridHelper() {
    const gridHelper = new THREE.GridHelper(60, 160, new THREE.Color(0x555555), new THREE.Color(0x333333));
    this.scene.add(gridHelper);
  }
  add_controller() {
    this.controls = new MapControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxDistance = 800;
  }
  // 注册摄像头
  add_camera() {

  }
}

export default threeApp;

