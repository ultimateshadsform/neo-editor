import * as THREE from 'three';

export class ThreeObjectWrapper {
  private _object: THREE.Object3D;

  constructor(object: THREE.Object3D) {
    this._object = object;
  }

  get(): THREE.Object3D {
    return this._object;
  }

  updateMatrix(): void {
    this._object.updateMatrix();
  }

  updateMatrixWorld(force?: boolean): void {
    this._object.updateMatrixWorld(force);
  }
}
