<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useTresContext } from '@tresjs/core';
import { Pane } from 'tweakpane';
import * as THREE from 'three';

// Props with default values
const props = withDefaults(
  defineProps<{
    initialFov?: number;
    initialMoveSpeed?: number;
    initialLookSpeed?: number;
  }>(),
  {
    initialFov: 75,
    initialMoveSpeed: 0.1,
    initialLookSpeed: 0.002
  }
);

// Camera settings
const cameraSettings = {
  fov: props.initialFov,
  moveSpeed: props.initialMoveSpeed,
  lookSpeed: props.initialLookSpeed
};

const { camera } = useTresContext();

// Movement variables
const velocity = new THREE.Vector3();
const acceleration = new THREE.Vector3();
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
let isMouseCaptured = false;

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  ' ': false,
  Shift: false
};

// Tweakpane setup
const initTweakpane = () => {
  const pane = new Pane();

  pane.addBinding(cameraSettings, 'fov', { min: 30, max: 120, step: 1, label: 'FOV' });
  pane.addBinding(cameraSettings, 'moveSpeed', {
    min: 0.01,
    max: 0.2,
    step: 0.01,
    label: 'Move Speed'
  });
  pane.addBinding(cameraSettings, 'lookSpeed', {
    min: 0.001,
    max: 0.01,
    step: 0.001,
    label: 'Look Speed'
  });

  return pane;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key in keys) {
    keys[event.key as keyof typeof keys] = true;
  }
};

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key in keys) {
    keys[event.key as keyof typeof keys] = false;
  }
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isMouseCaptured || !camera.value) return;

  euler.setFromQuaternion(camera.value.quaternion);
  euler.y -= event.movementX * cameraSettings.lookSpeed;
  euler.x -= event.movementY * cameraSettings.lookSpeed;
  euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
  camera.value.quaternion.setFromEuler(euler);
};

const toggleMouseCapture = () => {
  isMouseCaptured = !isMouseCaptured;
  if (isMouseCaptured) {
    document.body.requestPointerLock();
  } else {
    document.exitPointerLock();
  }
};

const update = () => {
  if (!camera.value) return;

  // Apply acceleration based on key states
  acceleration.set(0, 0, 0);
  if (keys.w) acceleration.z -= 1;
  if (keys.s) acceleration.z += 1;
  if (keys.a) acceleration.x -= 1;
  if (keys.d) acceleration.x += 1;

  // Vertical movement
  let verticalMovement = 0;
  if (keys[' ']) verticalMovement += cameraSettings.moveSpeed;
  if (keys.Shift) verticalMovement -= cameraSettings.moveSpeed;

  // Apply acceleration to velocity
  velocity.add(acceleration.multiplyScalar(cameraSettings.moveSpeed));

  // Apply damping to smoothly decelerate when no keys are pressed
  velocity.multiplyScalar(0.9);

  // Move camera based on velocity
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.value.quaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.value.quaternion);

  forward.y = 0;
  right.y = 0;

  forward.normalize();
  right.normalize();

  camera.value.position.addScaledVector(forward, -velocity.z);
  camera.value.position.addScaledVector(right, velocity.x);
  camera.value.position.y += verticalMovement;

  // Update camera FOV
  if (camera.value instanceof THREE.PerspectiveCamera) {
    camera.value.fov = cameraSettings.fov;
    camera.value.updateProjectionMatrix();
  }

  camera.value.updateMatrixWorld();

  requestAnimationFrame(update);
};

onMounted(() => {
  const pane = initTweakpane();

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('keypress', (e) => {
    if (e.key === 'z') toggleMouseCapture();
  });
  requestAnimationFrame(update);

  onBeforeUnmount(() => {
    pane.dispose();
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('mousemove', handleMouseMove);
  });
});
</script>

<template>
  <TresPerspectiveCamera
    :position="[0, 0, 10]"
    :fov="cameraSettings.fov"
    :aspect="16 / 9"
    :near="0.1"
    :far="1000"
  />
</template>
