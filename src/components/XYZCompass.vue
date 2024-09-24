<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, ref, watch, onUnmounted } from 'vue';

const props = defineProps<{
  cameraQuaternion: THREE.Quaternion;
}>();

const compassContainer = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let axesHelper: THREE.AxesHelper;
let xLabel: THREE.Sprite;
let yLabel: THREE.Sprite;
let zLabel: THREE.Sprite;

onMounted(() => {
  if (!compassContainer.value) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(100, 100);
  compassContainer.value.appendChild(renderer.domElement);

  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  axesHelper = new THREE.AxesHelper(2);
  scene.add(axesHelper);

  xLabel = createLabel('X', 2.2, 0, 0, 'red');
  yLabel = createLabel('Y', 0, 2.2, 0, 'green');
  zLabel = createLabel('Z', 0, 0, 2.2, 'blue');
  scene.add(xLabel, yLabel, zLabel);

  renderer.setAnimationLoop(animate);
});

const animate = () => {
  updateCompass();
  renderer.render(scene, camera);
};

const updateCompass = () => {
  if (axesHelper && xLabel && yLabel && zLabel) {
    const inverseQuaternion = props.cameraQuaternion.clone().invert();
    axesHelper.quaternion.copy(inverseQuaternion);
    xLabel.quaternion.copy(inverseQuaternion);
    yLabel.quaternion.copy(inverseQuaternion);
    zLabel.quaternion.copy(inverseQuaternion);
  }
};

watch(() => props.cameraQuaternion, updateCompass, { deep: true });

function createLabel(text: string, x: number, y: number, z: number, color: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 64;
  canvas.height = 64;

  context.fillStyle = color;
  context.font = 'bold 48px Arial';
  context.fillText(text, 16, 48);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.position.set(x, y, z);
  sprite.scale.set(0.5, 0.5, 0.5);

  return sprite;
}

onUnmounted(() => {
  renderer.setAnimationLoop(null);
  compassContainer.value?.removeChild(renderer.domElement);
});
</script>

<template>
  <div ref="compassContainer" class="absolute left-4 bottom-4 w-[100px] h-[100px]"></div>
</template>
