import * as THREE from 'three';

export function AddCube(size = 1, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
  return function<T extends { new (...args: any[]): {} }>(targetClass: T) {
    return class extends targetClass {
      constructor(...args: any[]) {
        super(...args);
        // const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        // const cube = new THREE.Mesh(geometry, material);
        this.addCube();
      }

      addCube(position: THREE.Vector3 = new THREE.Vector3(0, 0.5, 0)) {
        const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        const material = new THREE.MeshPhongMaterial({
          color: 0xff0000,
          flatShading: true,
          wireframe: true,
        });

        const cube = new THREE.Mesh(geometry, material);
        // cube.position.set(0, 0, 0);
        cube.position.copy(position)

        this.cube = cube;

        this.scene.add(cube);
      }
    };
  };
}

