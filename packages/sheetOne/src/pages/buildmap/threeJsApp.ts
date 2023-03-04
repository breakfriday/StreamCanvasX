
import * as THREE from 'three';
import { AddScene } from './scense';
import { AddCamera } from './camera';


@AddScene('')
@AddCamera('')
class threeJsApp {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}


export default threeJsApp;
