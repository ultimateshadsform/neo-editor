import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useSettingsStore = defineStore('settings', () => {
  const mouseSensitivity = useStorage('mouseSensitivity', 0.002);

  const updateMouseSensitivity = (value: number) => {
    mouseSensitivity.value = value;
  };

  return {
    mouseSensitivity,
    updateMouseSensitivity
  };
});
