<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  cameraQuaternion: THREE.Quaternion;
}>();

const compassContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!compassContainer.value) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(100, 100);
  compassContainer.value.appendChild(renderer.domElement);

  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  const axesHelper = new THREE.AxesHelper(2);
  scene.add(axesHelper);

  const xLabel = createLabel('X', 2.2, 0, 0, 'red');
  const yLabel = createLabel('Y', 0, 2.2, 0, 'green');
  const zLabel = createLabel('Z', 0, 0, 2.2, 'blue');
  scene.add(xLabel, yLabel, zLabel);

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);

  watch(
    () => props.cameraQuaternion,
    (newQuaternion) => {
      axesHelper.quaternion.copy(newQuaternion).invert();
      xLabel.quaternion.copy(newQuaternion).invert();
      yLabel.quaternion.copy(newQuaternion).invert();
      zLabel.quaternion.copy(newQuaternion).invert();
    },
    { deep: true }
  );
});

function createLabel(text: string, x: number, y: number, z: number, color: string) {
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
</script>

<template>
  <div ref="compassContainer" class="absolute left-4 bottom-4 w-[100px] h-[100px]"></div>
</template>
