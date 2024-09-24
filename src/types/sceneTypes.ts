import * as THREE from 'three';

// Define a common interface for all objects
export interface SceneObject {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  mesh: THREE.Mesh;
  update?: (deltaTime: number) => void;
}
