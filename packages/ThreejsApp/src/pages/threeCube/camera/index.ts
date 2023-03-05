import * as THREE from 'three';

export function AddCamera(arams: any) {
  return function<T extends { new (...args: any[]): {} }>(targetClass: T) {
    return class extends targetClass {
      camera!: THREE.PerspectiveCamera;
      constructor(...args) {
        super(...args);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
      }
    };
  };
}
