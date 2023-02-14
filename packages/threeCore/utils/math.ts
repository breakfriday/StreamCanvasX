import { Box3, Object3D } from 'three';

export function computeAABB(object3D: Object3D): Box3 {

  object3D.updateWorldMatrix(true, true);
  const aabb = new Box3().expandByObject(object3D);
  return aabb;
}
 