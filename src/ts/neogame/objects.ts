import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  Group,
  Object3D,
  Mesh,
  MeshStandardMaterial,
  Euler,
  BoxGeometry,
  MeshBasicMaterial,
  BufferGeometry,
  Material,
  type NormalBufferAttributes,
  type Object3DEventMap
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import LaserBase from '@/assets/models/laser_base.glb';
import LaserBeam from '@/assets/models/laser_beam.glb';
import { Scene, Vector3, Camera } from 'three';
import type { SceneObject } from '@/types/sceneTypes';

class BaseObject {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;

  constructor(
    position = new Vector3(0, 0, 0),
    rotation = new Euler(0, 0, 0),
    scale = new Vector3(1, 1, 1)
  ) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  setPosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
  }

  getPosition() {
    return this.position;
  }

  setRotation(x: number, y: number, z: number) {
    this.rotation.set(x, y, z);
  }

  getRotation() {
    return this.rotation;
  }

  setScale(x: number, y: number, z: number) {
    this.scale.set(x, y, z);
  }

  getScale() {
    return this.scale;
  }
}

class LaserTrap extends BaseObject implements SceneObject {
  private readonly _csvName: string;
  private readonly _displayName: string;
  private _baseModel: Object3D;
  private _beamModel: Object3D;
  private _combinedGroup: Group;
  mesh: Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>;
  update?: ((deltaTime: number) => void) | undefined;

  constructor(
    position = new Vector3(0, 0, 0),
    rotation = new Euler(0, 0, 0),
    scale = new Vector3(1, 1, 1),
    csvName = 'laserTrap1',
    displayName = 'Laser Trap',
    baseModelUrl = LaserBase,
    beamModelUrl = LaserBeam,
    baseColor = { r: 13, g: 13, b: 13, a: 1 },
    beamColor = { r: 255, g: 0, b: 0, a: 1 }
  ) {
    super(position, rotation, scale);
    this._csvName = csvName;
    this._displayName = displayName;

    this._baseModel = new Object3D();
    this._beamModel = new Object3D();
    this._combinedGroup = new Group();

    // Initialize mesh with a temporary geometry
    const tempGeometry = new BufferGeometry();
    const tempMaterial = new MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new Mesh(tempGeometry, tempMaterial);

    this.loadModels(baseModelUrl, beamModelUrl);
    this.setBaseModelColor(baseColor.r, baseColor.g, baseColor.b, baseColor.a);
    this.setBeamModelColor(beamColor.r, beamColor.g, beamColor.b, beamColor.a);

    // Apply position, rotation, and scale to the combined group
    this._combinedGroup.position.copy(this.position);
    this._combinedGroup.rotation.copy(this.rotation);
    this._combinedGroup.scale.copy(this.scale);

    // Add the combined group to the mesh
    this.mesh.add(this._combinedGroup);
  }

  // Getter for csvName
  get csvName(): string {
    return this._csvName;
  }

  // Getter for displayName
  get displayName(): string {
    return this._displayName;
  }

  loadModels(baseModelUrl: string, beamModelUrl: string) {
    const loader = new GLTFLoader();

    loader.load(baseModelUrl, (gltf: GLTF) => {
      this._baseModel = gltf.scene;
      this._combinedGroup.add(this._baseModel);
    });

    loader.load(beamModelUrl, (gltf: GLTF) => {
      this._beamModel = gltf.scene;
      this._combinedGroup.add(this._beamModel);
    });
  }

  setBaseModelColor(r: number, g: number, b: number, a: number) {
    this._baseModel.traverse((child) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.color.setRGB(r / 255, g / 255, b / 255);
        child.material.opacity = a;
        child.material.transparent = a < 1.0;
      }
    });
  }

  setBeamModelColor(r: number, g: number, b: number, a: number) {
    this._beamModel.traverse((child) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.color.setRGB(r / 255, g / 255, b / 255);
        child.material.opacity = a;
        child.material.transparent = a < 1.0;
      }
    });
  }

  getCombinedGroup(): Group {
    return this._combinedGroup;
  }

  // New static method to add a LaserTrap to the scene
  static addToScene(scene: Scene, camera: Camera, objects: SceneObject[]): LaserTrap {
    const position = new Vector3(0, 0, -5).applyQuaternion(camera.quaternion).add(camera.position);
    const newLaserTrap = new LaserTrap(position);
    objects.push(newLaserTrap);
    scene.add(newLaserTrap.mesh);
    return newLaserTrap;
  }
}

// You can add other object classes here, following the same pattern
// class LaserLoop extends BaseObject implements SceneObject { ... }
// class Spikes extends BaseObject implements SceneObject { ... }

export { BaseObject, LaserTrap /*, LaserLoop, Spikes */ };
