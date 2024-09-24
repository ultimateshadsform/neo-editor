import * as THREE from 'three';

export class ThreeWrapper {
  private _object: THREE.Object3D;

  constructor(object: THREE.Object3D) {
    this._object = object;
  }

  get object(): THREE.Object3D {
    return this._object;
  }

  updateMatrix(): void {
    this._object.updateMatrix();
  }

  updateMatrixWorld(force?: boolean): void {
    this._object.updateMatrixWorld(force);
  }

  get modelViewMatrix(): THREE.Matrix4 {
    return (this._object as any).modelViewMatrix;
  }

  set modelViewMatrix(value: THREE.Matrix4) {
    (this._object as any).modelViewMatrix = value;
  }

  // Add more methods as needed to interact with the Three.js object
}
