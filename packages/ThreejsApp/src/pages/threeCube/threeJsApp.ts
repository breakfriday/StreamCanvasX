
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { AddScene } from './scense';
import { AddCamera } from './camera';
import { AddCube } from './shapes/cube';
import { AddGridHelp } from './shapes/gridHelper';
import { AddLight } from './shapes/light';

@AddLight()
@AddCube()
@AddGridHelp()
@AddScene('')
@AddCamera('')
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
    this.addCube(new THREE.Vector3(3, 0.5, 0));
    const h = this.cube;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  addController() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }
}


export default threeJsApp;
