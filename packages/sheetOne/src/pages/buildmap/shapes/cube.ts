import * as THREE from 'three';

export function Cube(target: any) {
  target.prototype.createCube = function (x: number, y: number, z: number) {
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      flatShading: true,
      wireframe: true,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    this.scene.add(cube);
  };
}
