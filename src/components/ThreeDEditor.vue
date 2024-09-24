<script setup lang="ts">
import * as THREE from 'three';
import type { SceneObject } from '@/types/sceneTypes';
import { onMounted, onUnmounted, ref, computed, watch, reactive } from 'vue';
import { useSettingsStore } from '../stores/settings.store';
import { createMenuItems } from '../ts/menu';
import { LaserTrap } from '@/ts/neogame/objects';
import { Clock } from 'three';
import { skyboxVertexShader, skyboxFragmentShader } from '@/ts/shaders';

import ContextMenu from './ContextMenu.vue';
import ContextMenuItem from './ContextMenuItem.vue';
import EditorSettingsModal from './EditorSettingsModal.vue';
import XYZCompass from './XYZCompass.vue';

const editor = ref<HTMLDivElement | null>(null);
const cameraSpeed = ref(0.1);
const gridSize = ref(10);
const gridDivisions = ref(10);

// Add this computed property
const cameraSpeedDisplay = computed(() => Number(cameraSpeed.value).toFixed(2));

const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null);

const onContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  contextMenuRef.value?.handleMenu(e);
};

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = '';
  return e.returnValue;
};

const showSettingsModal = ref(false);
const settingsStore = useSettingsStore();

const keyState = ref<Record<string, boolean>>({});

const toggleSettingsModal = () => {
  showSettingsModal.value = !showSettingsModal.value;
};

const cameraQuaternion = reactive(new THREE.Quaternion());
let camera: THREE.PerspectiveCamera | null = null;
let scene: THREE.Scene | null = null;
const objects: SceneObject[] = [];
const clock = new Clock();
const addObject = (type: string) => {
  if (scene && camera) {
    switch (type) {
      case 'LaserTrap':
        LaserTrap.addToScene(scene, camera, objects);
        break;
      // Add cases for other object types as needed
      default:
        console.log(`Object type ${type} not implemented yet`);
    }
  }
};

// Create menu items with the addObject function
const menuItems = createMenuItems(addObject);

onMounted(() => {
  if (!editor.value) return;
  window.addEventListener('beforeunload', handleBeforeUnload);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    settingsStore.fov,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  editor.value.appendChild(renderer.domElement);

  // Add GridHelper
  const gridHelper = new THREE.GridHelper(gridSize.value, gridDivisions.value);
  scene.add(gridHelper);

  const mouseState = { x: 0, y: 0 };
  let pitch = 0;
  let isMouseCaptured = false;

  function handleKeyDown(event: KeyboardEvent) {
    keyState.value[event.key.toLowerCase()] = true;
    if (event.code === 'Space') keyState.value['space'] = true;
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') keyState.value['shift'] = true;
    if (event.key.toLowerCase() === 'z') {
      toggleMouseCapture();
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    keyState.value[event.key.toLowerCase()] = false;
    if (event.code === 'Space') keyState.value['space'] = false;
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') keyState.value['shift'] = false;
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isMouseCaptured) return;

    mouseState.x -= event.movementX * settingsStore.mouseSensitivity;
    pitch -= event.movementY * settingsStore.mouseSensitivity;

    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
  }

  function toggleMouseCapture() {
    if (!isMouseCaptured) {
      editor.value!.requestPointerLock();
    } else {
      document.exitPointerLock();
    }
  }

  function handlePointerLockChange() {
    isMouseCaptured = document.pointerLockElement === editor.value;
  }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('pointerlockchange', handlePointerLockChange);

  camera.position.z = 5;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Create skybox
  const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
  const skyboxMaterial = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(0x0077ff) },
      bottomColor: { value: new THREE.Color(0x626262) }
    },
    vertexShader: skyboxVertexShader,
    fragmentShader: skyboxFragmentShader,
    side: THREE.BackSide
  });

  const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  scene.add(skybox);

  // Create LaserTrap objects
  const laserTrap1 = new LaserTrap(new THREE.Vector3(10, 2, 0));

  // Create cube objects
  const cubeGeometry = new THREE.BoxGeometry();
  const cubeMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cubeMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  const cube1: SceneObject = {
    position: new THREE.Vector3(2, 2, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1),
    mesh: new THREE.Mesh(cubeGeometry, cubeMaterial1),
    update: function (deltaTime: number) {
      this.rotation.x += 0.01;
      this.rotation.y += 0.01;
      // Apply the rotation to the mesh
      this.mesh.rotation.copy(this.rotation);
    }
  };

  const cube2: SceneObject = {
    position: new THREE.Vector3(-2, 2, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1),
    mesh: new THREE.Mesh(cubeGeometry, cubeMaterial2)
  };

  // Add all objects to the array
  objects.push(laserTrap1, cube1, cube2);

  // Add objects to the scene
  objects.forEach((obj) => {
    if (obj instanceof LaserTrap) {
      scene?.add(obj.getCombinedGroup());
    } else {
      scene?.add(obj.mesh);
    }
  });

  const animate = function () {
    if (!camera || !scene) return;

    camera.rotation.y = mouseState.x;
    camera.rotation.order = 'YXZ';

    camera.rotation.x = pitch;

    // Update camera quaternion
    camera.updateMatrixWorld();
    cameraQuaternion.copy(camera.quaternion);

    const forward = new THREE.Vector3(
      -Math.sin(camera.rotation.y),
      0,
      -Math.cos(camera.rotation.y)
    );
    const right = new THREE.Vector3(Math.cos(camera.rotation.y), 0, -Math.sin(camera.rotation.y));

    const currentMoveSpeed = cameraSpeed.value;

    if (keyState.value['w']) camera.position.addScaledVector(forward, currentMoveSpeed);
    if (keyState.value['s']) camera.position.addScaledVector(forward, -currentMoveSpeed);
    if (keyState.value['a']) camera.position.addScaledVector(right, -currentMoveSpeed);
    if (keyState.value['d']) camera.position.addScaledVector(right, currentMoveSpeed);
    if (keyState.value['space']) camera.position.y += currentMoveSpeed;
    if (keyState.value['shift']) camera.position.y -= currentMoveSpeed;

    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

    // Update matrices for all objects
    scene.updateMatrixWorld(true);

    // Update and render all objects
    objects.forEach((obj) => {
      if (obj instanceof LaserTrap) {
        const group = obj.getCombinedGroup();
        group.position.copy(obj.position);
        group.rotation.copy(obj.rotation);
        group.scale.copy(obj.scale);
        group.updateMatrix();
        group.updateMatrixWorld(true);
      } else {
        obj.mesh.position.copy(obj.position);
        obj.mesh.scale.copy(obj.scale);
        obj.mesh.updateMatrix();
        obj.mesh.updateMatrixWorld(true);
      }

      if (obj.update) {
        obj.update(clock.getDelta());
      }
    });

    // Ensure camera matrix is up to date
    camera.updateMatrixWorld();

    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);

  const handleResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
  };

  window.addEventListener('resize', handleResize);

  // Add a watch effect for FOV changes
  watch(
    () => settingsStore.fov,
    (newFov) => {
      if (camera) {
        camera.fov = newFov;
        camera.updateProjectionMatrix();
      }
    }
  );

  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('pointerlockchange', handlePointerLockChange);
    window.removeEventListener('resize', handleResize);
    renderer.setAnimationLoop(null);
    editor.value?.removeChild(renderer.domElement);
  });
});
</script>

<template>
  <div ref="editor" @contextmenu="onContextMenu">
    <Teleport to="body">
      <ContextMenu ref="contextMenuRef">
        <ContextMenuItem
          v-for="(item, index) in menuItems.submenu"
          :key="index"
          :label="item.label"
          :icon="item.icon"
          :action="item.action"
          :submenu="item.submenu"
        />
      </ContextMenu>
    </Teleport>
    <button
      @click="toggleSettingsModal"
      class="bg-white absolute top-4 right-4 dark:bg-neutral-800 p-2 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>

    <div
      class="bg-white absolute bottom-4 right-4 flex items-center space-x-2 dark:bg-neutral-800 p-2 rounded-lg"
    >
      <label
        for="cameraSpeed"
        class="block text-sm font-medium text-neutral-800 dark:text-neutral-200"
      >
        Camera Speed
      </label>
      <input
        id="cameraSpeed"
        v-model.number="cameraSpeed"
        type="range"
        min="0.01"
        max="1"
        step="0.01"
        class="w-48"
      />
      <span class="text-sm text-gray-500">{{ cameraSpeedDisplay }}</span>
    </div>

    <XYZCompass :camera-quaternion="cameraQuaternion" />
  </div>

  <Teleport to="body">
    <Transition name="fade">
      <EditorSettingsModal v-if="showSettingsModal" @close="showSettingsModal = false" />
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-300;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
