<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, onUnmounted, ref, type ComponentPublicInstance } from 'vue';
import ContextMenu from './ContextMenu.vue';
import ContextMenuItem from './ContextMenuItem.vue';

const editor = ref<HTMLDivElement | null>(null);

const contextMenu = ref<ComponentPublicInstance<{ handleMenu: (e: MouseEvent) => void }> | null>(
  null
);

const handleCtxMenu = (e: MouseEvent) => contextMenu.value?.handleMenu(e);

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = '';
  return e.returnValue;
};

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  editor.value!.appendChild(renderer.domElement);

  const moveSpeed = 0.05;
  const sprintMultiplier = 2.5; // New: Speed multiplier for sprinting
  const mouseSensitivity = 0.002;
  const keyState: { [key: string]: boolean } = {};
  const mouseState = { x: 0, y: 0 };
  let pitch = 0; // New: Separate pitch for looking up/down
  let isMouseCaptured = false;

  function handleKeyDown(event: KeyboardEvent) {
    keyState[event.key.toLowerCase()] = true;
    if (event.code === 'Space') keyState['space'] = true;
    if (event.code === 'ControlLeft' || event.code === 'ControlRight') keyState['ctrl'] = true;
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') keyState['shift'] = true;
    if (event.key.toLowerCase() === 'z') {
      toggleMouseCapture();
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    keyState[event.key.toLowerCase()] = false;
    if (event.code === 'Space') keyState['space'] = false;
    if (event.code === 'ControlLeft' || event.code === 'ControlRight') keyState['ctrl'] = false;
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') keyState['shift'] = false;
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isMouseCaptured) return;

    mouseState.x -= event.movementX * mouseSensitivity;
    pitch -= event.movementY * mouseSensitivity;

    // Clamp the pitch to prevent over-rotation
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

  // Position the camera
  camera.position.z = 5;

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Create skybox
  const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
  const skyboxMaterial = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(0x0077ff) }, // Sky blue
      bottomColor: { value: new THREE.Color(0x626262) } // Dark grey
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

  // Add a cube to the scene for reference
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
    // Update camera rotation
    camera.rotation.y = mouseState.x;
    camera.rotation.order = 'YXZ'; // Ensure correct rotation order

    // Apply pitch rotation to camera
    camera.rotation.x = pitch;

    // Calculate forward and right vectors based on camera's Y rotation only
    const forward = new THREE.Vector3(
      -Math.sin(camera.rotation.y),
      0,
      -Math.cos(camera.rotation.y)
    );
    const right = new THREE.Vector3(Math.cos(camera.rotation.y), 0, -Math.sin(camera.rotation.y));

    // Calculate current move speed
    const currentMoveSpeed = keyState['shift'] ? moveSpeed * sprintMultiplier : moveSpeed;

    // Move camera
    if (keyState['w']) camera.position.addScaledVector(forward, currentMoveSpeed);
    if (keyState['s']) camera.position.addScaledVector(forward, -currentMoveSpeed);
    if (keyState['a']) camera.position.addScaledVector(right, -currentMoveSpeed);
    if (keyState['d']) camera.position.addScaledVector(right, currentMoveSpeed);
    if (keyState['space']) camera.position.y += currentMoveSpeed;
    if (keyState['ctrl']) camera.position.y -= currentMoveSpeed;

    // Ensure rotation is within bounds
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<template>
  <div class="overflow-hidden relative">
    <ContextMenu ref="contextMenu">
      <ContextMenuItem>
        Create Object
        <template #submenu>
          <ContextMenuItem>
            Buildings
            <template #submenu>
              <ContextMenuItem @action="() => console.log('Create Wall')">Wall</ContextMenuItem>
              <ContextMenuItem @action="() => console.log('Create House')">House</ContextMenuItem>
              <ContextMenuItem @action="() => console.log('Create Skyscraper')"
                >Skyscraper</ContextMenuItem
              >
            </template>
          </ContextMenuItem>
          <ContextMenuItem>
            Infrastructure
            <template #submenu>
              <ContextMenuItem @action="() => console.log('Create Road')">Road</ContextMenuItem>
              <ContextMenuItem @action="() => console.log('Create Bridge')">Bridge</ContextMenuItem>
              <ContextMenuItem @action="() => console.log('Create Railway')"
                >Railway</ContextMenuItem
              >
            </template>
          </ContextMenuItem>
          <ContextMenuItem>
            Nature
            <template #submenu>
              <ContextMenuItem @action="() => console.log('Create Tree')">Tree</ContextMenuItem>
              <ContextMenuItem @action="() => console.log('Create Lake')">Lake</ContextMenuItem>
              <ContextMenuItem @action="() => console.log('Create Mountain')"
                >Mountain</ContextMenuItem
              >
            </template>
          </ContextMenuItem>
          <ContextMenuItem>
            Vehicles
            <template #submenu>
              <ContextMenuItem @action="() => console.log('Create Car')">Car</ContextMenuItem>
              <ContextMenuItem @action="() => console.log('Create Bus')">Bus</ContextMenuItem>
              <ContextMenuItem @action="() => console.log('Create Airplane')"
                >Airplane</ContextMenuItem
              >
            </template>
          </ContextMenuItem>
        </template>
      </ContextMenuItem>
    </ContextMenu>
    <div ref="editor" @contextmenu.prevent="handleCtxMenu"></div>
  </div>
</template>

<style lang="scss" scoped></style>
