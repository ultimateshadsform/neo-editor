<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import CameraController from './CameraController.vue';
import CameraSettings from './CameraSettings.vue';
import { ref } from 'vue';

const fov = ref(75);
const lookSpeed = ref(0.002);
const moveSpeed = ref(0.06); // Changed from 0.1 to 0.06
</script>

<template>
  <TresCanvas :clear-color="'#82DBC5'" window-size>
    <CameraController :fov="fov" :lookSpeed="lookSpeed" :moveSpeed="moveSpeed" />
    <TresPerspectiveCamera :position="[3, 3, 3]" :look-at="[0, 0, 0]" />
    <TresMesh>
      <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
      <TresMeshBasicMaterial color="orange" />
    </TresMesh>
    <TresAmbientLight :intensity="1" />
  </TresCanvas>
  <CameraSettings v-model:fov="fov" v-model:lookSpeed="lookSpeed" v-model:moveSpeed="moveSpeed" />
</template>
