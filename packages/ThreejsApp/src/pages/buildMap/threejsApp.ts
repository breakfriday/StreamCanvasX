
import * as THREE from 'three';
import {
  MapControls
} from 'three/examples/jsm/controls/OrbitControls.js';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { getDistance, getRhumbLineBearing } from 'geolib';

import map_data from './map.json';


class threeJsApp {
  scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: any;
  constructor(el) {
    const width = el.current.clientWidth; // window.innerWidth
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);


    el.current.appendChild(this.renderer.domElement);
  }

  init() {
    this.addController();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  addController() {

  }
}


export default threeJsApp;
