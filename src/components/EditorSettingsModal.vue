<script setup lang="ts">
import { ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';

const modal = ref<HTMLDivElement | null>(null);

onClickOutside(modal, () => {
  handleClose();
});

const props = defineProps<{
  mouseSensitivity: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updateMouseSensitivity', value: number): void;
}>();

const localMouseSensitivity = ref(props.mouseSensitivity);

watch(
  () => props.mouseSensitivity,
  (newValue) => {
    localMouseSensitivity.value = newValue;
  }
);

const handleClose = () => {
  emit('close');
};

const handleSave = () => {
  emit('updateMouseSensitivity', Number(localMouseSensitivity.value));
  handleClose();
};

const updateLocalSensitivity = (event: Event) => {
  const target = event.target as HTMLInputElement;
  localMouseSensitivity.value = Number(target.value);
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
          :value="localMouseSensitivity"
          @input="updateLocalSensitivity"
          type="range"
          min="0.001"
          max="0.01"
          step="0.001"
          class="w-full"
        />
        <span class="text-sm text-gray-500">{{ localMouseSensitivity.toFixed(3) }}</span>
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
