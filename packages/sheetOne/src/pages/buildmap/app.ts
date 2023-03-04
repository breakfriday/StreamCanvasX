
import * as THREE from 'three';
import { Scene } from './scense';
import { Camera } from './camera';
import { Cube } from './shapes/cube';


function Renderer(target: any) {
  target.prototype.createRenderer = function () {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
}

@Scene
@Camera
@Cube
@Renderer
class App {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  constructor() {
    this.name = 21;
  }

  render() {
    const { scene, camera } = this;
    this.renderer.render(scene, camera);
  }
}


export default App;
