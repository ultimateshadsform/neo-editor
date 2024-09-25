<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import Camera from './Camera.vue';

// No camera logic or OrbitControls here
</script>

<template>
  <TresCanvas>
    <Camera :initialFov="75" :initialMoveSpeed="0.06" :initialLookSpeed="0.002" />
    <!-- Other 3D objects -->
    <TresMesh>
      <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
      <TresMeshBasicMaterial color="orange" />
    </TresMesh>
    <TresAmbientLight :intensity="1" />
  </TresCanvas>
</template>
