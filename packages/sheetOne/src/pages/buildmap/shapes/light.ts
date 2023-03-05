import * as THREE from 'three';

export function AddLight(size = 1, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
  return function<T extends { new (...args: any[]): {} }>(targetClass: T) {
    return class extends targetClass {
      constructor(...args: any[]) {
        super(...args);
        const light = new THREE.AmbientLight(0x8FBCD4, 0.9); // soft white light
        this.scene.add(light);
      }
    };
  };
}

