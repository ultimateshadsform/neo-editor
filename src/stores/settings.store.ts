import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useSettingsStore = defineStore('settings', () => {
  const mouseSensitivity = useStorage('mouseSensitivity', 0.002);
  const fov = useStorage('fov', 60);

  const updateMouseSensitivity = (value: number) => {
    mouseSensitivity.value = value;
  };

  const updateFov = (value: number) => {
    fov.value = value;
  };

  return {
    mouseSensitivity,
    fov,
    updateMouseSensitivity,
    updateFov
  };
});
