import * as THREE from 'three';

export function AddCamera(targetClass) {
  return class extends targetClass {
    constructor(...args) {
      super(...args);

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 5;
    }
  };
}
