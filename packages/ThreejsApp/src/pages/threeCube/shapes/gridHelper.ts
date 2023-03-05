import * as THREE from 'three';

export function AddGridHelp() {
  return function<T extends { new (...args: any[]): {} }>(targetClass: T) {
    return class extends targetClass {
      constructor(...args: any[]) {
        super(...args);
        const gridHelper = new THREE.GridHelper(100, 90, 0x0000ff, 0x808080);
        gridHelper.position.y = -0.5;
        gridHelper.position.x = -1;
        this.scene.add(gridHelper);
      }
    };
  };
}

