import * as THREE from 'three';

export function AddCube(size = 1, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
  return function<T extends { new (...args: any[]): {} }>(targetClass: T) {
    return class extends targetClass {
      constructor(...args: any[]) {
        super(...args);
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
      }
    };
  };
}

