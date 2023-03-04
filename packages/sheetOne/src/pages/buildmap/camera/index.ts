import * as THREE from 'three';


export function Camera(target: any) {
  target.prototype.createCamera = function () {
    this.camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.9, 1000);
    this.camera.position.z = 5;
  };
}
