import * as THREE from 'three';
import { Container, injectable, inject } from 'inversify';
import { SERVICE_IDENTIFIER } from './constants';
import { AddCubeService } from './shapes/addcube';

@injectable()
export class ThreeApp {
  private container: Container;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor(@inject(SERVICE_IDENTIFIER.AddCubeService) private addCubeService: AddCubeService) {
    this.container = new Container();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  init(): void {
    this.addCubeService.addCube(this.scene);
    this.camera.position.z = 5;
  }

  render(): void {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
  }
}
