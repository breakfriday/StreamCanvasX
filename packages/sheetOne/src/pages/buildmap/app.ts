
import * as THREE from 'three';
import { Scene } from './scense';
import { Camera } from './camera';

@Scene
class App {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  constructor() {
    this.name = 21;
  }

  render() {

  }
}


export default App;
