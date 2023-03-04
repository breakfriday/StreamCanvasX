import * as THREE from 'three';

export function AddScene(params: any) {
  return function<T extends { new (...args: any[]): {} }>(targetClass: T) {
    return class extends targetClass {
      scene: THREE.Scene;
      constructor(...args: any[]) {
        super(...args);
        this.scene = new THREE.Scene();
      }
    };
  };
}
