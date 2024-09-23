<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useSettingsStore } from '../stores/settings.store';
import ContextMenu from './ContextMenu.vue';
import ContextMenuItem from './ContextMenuItem.vue';
import EditorSettingsModal from './EditorSettingsModal.vue';
import { menuItems } from '../ts/menu';

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

onMounted(() => {
  if (!editor.value) return;
  window.addEventListener('beforeunload', handleBeforeUnload);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
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
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(h, 0.0)), 1.0);
      }
    `,
    side: THREE.BackSide
  });

  const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  scene.add(skybox);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(2, 0, 0);
  scene.add(cube);

  const cubeGeometry = new THREE.BoxGeometry();
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube2);

  const animate = function () {
    camera.rotation.y = mouseState.x;
    camera.rotation.order = 'YXZ';

    camera.rotation.x = pitch;

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

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);

  const handleResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  window.addEventListener('resize', handleResize);

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
          v-for="(item, index) in menuItems"
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
