<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Pane } from 'tweakpane';
import { onClickOutside } from '@vueuse/core';

const props = defineProps<{
  fov: number;
  lookSpeed: number;
  moveSpeed: number;
}>();

const emit = defineEmits<{
  (e: 'update:fov', value: number): void;
  (e: 'update:lookSpeed', value: number): void;
  (e: 'update:moveSpeed', value: number): void;
}>();

const isModalOpen = ref(false);
let modalPane: Pane | null = null;
let speedPane: Pane | null = null;
const tweakpaneContainer = ref<HTMLDivElement | null>(null);
const speedPaneContainer = ref<HTMLDivElement | null>(null);

onClickOutside(tweakpaneContainer, () => {
  isModalOpen.value = false;
});

const initModalPane = () => {
  if (!tweakpaneContainer.value) return;

  modalPane = new Pane({
    container: tweakpaneContainer.value
  });
  const folder = modalPane.addFolder({ title: 'Camera Settings' });

  folder
    .addBinding({ fov: props.fov }, 'fov', { min: 30, max: 120, step: 1 })
    .on('change', (ev) => emit('update:fov', ev.value));

  folder
    .addBinding({ lookSpeed: props.lookSpeed }, 'lookSpeed', {
      min: 0.0001,
      max: 0.01,
      step: 0.0001
    })
    .on('change', (ev) => emit('update:lookSpeed', ev.value));
};

const initSpeedPane = () => {
  if (!speedPaneContainer.value) return;

  speedPane = new Pane({
    container: speedPaneContainer.value
  });

  speedPane
    .addBinding({ moveSpeed: props.moveSpeed }, 'moveSpeed', {
      min: 0.01,
      max: 0.2, // Reduced from 1 to 0.2 for finer control
      step: 0.01,
      label: 'Camera Speed'
    })
    .on('change', (ev) => emit('update:moveSpeed', ev.value));
};

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

onMounted(() => {
  initModalPane();
  initSpeedPane();
});

onBeforeUnmount(() => {
  modalPane?.dispose();
  speedPane?.dispose();
});
</script>

<template>
  <button
    @click="toggleModal"
    class="fixed top-2.5 left-2.5 z-50 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    Editor Settings
  </button>
  <div
    ref="speedPaneContainer"
    class="fixed bottom-2.5 left-2.5 z-50 bg-neutral-800 p-2 rounded-lg shadow-lg"
  ></div>
  <teleport to="body">
    <Transition name="fade">
      <div
        v-show="isModalOpen"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      >
        <div class="bg-neutral-800 p-6 rounded-lg shadow-lg" ref="tweakpaneContainer"></div>
      </div>
    </Transition>
  </teleport>
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
