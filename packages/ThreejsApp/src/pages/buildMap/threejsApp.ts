
import * as THREE from 'three';


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
