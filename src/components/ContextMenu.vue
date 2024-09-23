<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const contextMenu = ref<HTMLDivElement | null>(null);
const showContextMenu = ref(false);

const handleMenu = (e: MouseEvent) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const menuWidth = contextMenu.value?.offsetWidth || 0;
  const menuHeight = contextMenu.value?.offsetHeight || 0;
  const posX = e.clientX;
  const posY = e.clientY;

  // Default position
  let adjustedX = posX;
  let adjustedY = posY;

  // Check if menu is offscreen horizontally
  if (posX + menuWidth > viewportWidth) {
    adjustedX = viewportWidth - menuWidth - 10; // 10px padding from the right edge
  } else if (posX <= 10) {
    adjustedX = 10; // 10px padding from the left edge
  }

  // Check if menu is offscreen vertically
  if (posY + menuHeight > viewportHeight) {
    adjustedY = viewportHeight - menuHeight - 10; // 10px padding from the bottom edge
  } else if (posY <= 10) {
    adjustedY = 10; // 10px padding from the top edge
  }

  showContextMenu.value = true;

  if (contextMenu.value) {
    contextMenu.value.style.top = `${adjustedY}px`;
    contextMenu.value.style.left = `${adjustedX}px`;
  }
};

onClickOutside(contextMenu, () => {
  showContextMenu.value = false;
});

defineExpose({
  showContextMenu,
  handleMenu
});
</script>
<template>
  <Transition name="fade">
    <div
      v-show="showContextMenu"
      ref="contextMenu"
      class="absolute bg-neutral-200 dark:bg-neutral-800 p-1 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-md"
    >
      <ul class="list-none m-0 p-0">
        <!-- Render passed items -->
        <slot></slot>
      </ul>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-500 ease-out;
}

:deep(li) {
  .fade-enter-from,
  .fade-leave-to {
    @apply opacity-0;
  }

  .fade-enter-active,
  .fade-leave-active {
    @apply transition-opacity duration-500 ease-out;
  }
}
</style>
