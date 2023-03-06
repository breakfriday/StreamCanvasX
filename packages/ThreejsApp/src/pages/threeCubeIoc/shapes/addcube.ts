import * as THREE from 'three';
import { injectable } from 'inversify';

@injectable()
export class AddCubeService {
  addCube(scene: THREE.Scene): void {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  }
}
