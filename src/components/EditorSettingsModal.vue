<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useSettingsStore } from '../stores/settings.store';

const modal = ref<HTMLDivElement | null>(null);
const settingsStore = useSettingsStore();

onClickOutside(modal, () => {
  handleClose();
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const localMouseSensitivity = ref(settingsStore.mouseSensitivity);
const localFov = ref(settingsStore.fov);

const handleClose = () => {
  emit('close');
};

const handleSave = () => {
  settingsStore.updateMouseSensitivity(Number(localMouseSensitivity.value));
  settingsStore.updateFov(Number(localFov.value));
  handleClose();
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-neutral-800 rounded-lg p-6 w-96" ref="modal">
      <h2 class="text-2xl font-bold mb-4">Editor Settings</h2>

      <div class="mb-4">
        <label
          for="mouseSensitivity"
          class="block text-sm font-medium text-neutral-800 dark:text-neutral-200"
        >
          Mouse Sensitivity
        </label>
        <input
          id="mouseSensitivity"
          v-model="localMouseSensitivity"
          type="range"
          min="0.001"
          max="0.01"
          step="0.001"
          class="w-full"
        />
        <span class="text-sm text-gray-500">{{ Number(localMouseSensitivity).toFixed(3) }}</span>
      </div>

      <div class="mb-4">
        <label for="fov" class="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Field of View (FOV)
        </label>
        <input
          id="fov"
          v-model="localFov"
          type="range"
          min="30"
          max="120"
          step="1"
          class="w-full"
        />
        <span class="text-sm text-gray-500">{{ localFov }}°</span>
      </div>

      <div class="flex justify-end space-x-2">
        <button
          @click="handleClose"
          class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
