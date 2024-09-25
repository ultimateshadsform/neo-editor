<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useTresContext } from '@tresjs/core';
import * as THREE from 'three';

const props = defineProps<{
  fov: number;
  lookSpeed: number;
  moveSpeed: number;
}>();

const isMouseCaptured = ref(false);

const { camera } = useTresContext();

const velocity = new THREE.Vector3();
const acceleration = new THREE.Vector3();
const euler = new THREE.Euler(0, 0, 0, 'YXZ');

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  ' ': false,
  Shift: false
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
  if (!isMouseCaptured.value || !camera.value) return;

  euler.setFromQuaternion(camera.value.quaternion);
  euler.y -= event.movementX * props.lookSpeed;
  euler.x -= event.movementY * props.lookSpeed;
  euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
  camera.value.quaternion.setFromEuler(euler);
};

const toggleMouseCapture = () => {
  isMouseCaptured.value = !isMouseCaptured.value;
  if (isMouseCaptured.value) {
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
  if (keys[' ']) verticalMovement += props.moveSpeed; // Move up
  if (keys.Shift) verticalMovement -= props.moveSpeed; // Move down

  // Apply acceleration to velocity
  velocity.add(acceleration.multiplyScalar(props.moveSpeed));

  // Apply damping to smoothly decelerate when no keys are pressed
  velocity.multiplyScalar(0.9);

  // Move camera based on velocity (only horizontal movement)
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.value.quaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.value.quaternion);

  forward.y = 0; // Ensure forward vector is horizontal
  right.y = 0; // Ensure right vector is horizontal

  forward.normalize();
  right.normalize();

  camera.value.position.addScaledVector(forward, -velocity.z);
  camera.value.position.addScaledVector(right, velocity.x);

  // Apply vertical movement directly to the camera's Y position
  camera.value.position.y += verticalMovement;

  // Update camera FOV
  if (camera.value instanceof THREE.PerspectiveCamera) {
    camera.value.fov = props.fov;
    camera.value.updateProjectionMatrix();
  }

  camera.value.updateMatrixWorld();

  requestAnimationFrame(update);
};

watch(
  () => props.fov,
  (newFov) => {
    if (camera.value instanceof THREE.PerspectiveCamera) {
      camera.value.fov = newFov;
      camera.value.updateProjectionMatrix();
    }
  }
);

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('keypress', (e) => {
    if (e.key === 'z') toggleMouseCapture();
  });
  requestAnimationFrame(update);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>
