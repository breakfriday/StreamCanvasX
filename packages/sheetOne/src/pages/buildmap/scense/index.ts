import * as THREE from 'three';

export function Scene(target: any) {
  target.prototype.createScene = function () {
    this.scene = new THREE.Scene();
  };
}
