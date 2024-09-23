<template>
  <li
    @mouseenter="showSubmenuHandler"
    @mouseleave="hideSubmenu"
    @click="() => $emit('action')"
    class="cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 p-2 rounded-md relative min-w-32"
    ref="menuItemRef"
  >
    <!-- Render the main item content -->
    <slot></slot>

    <!-- Render the submenu if it exists and should be shown -->
    <Transition name="fade">
      <div
        v-show="hasSubmenu && showSubmenu"
        class="fixed bg-neutral-200 dark:bg-neutral-800 p-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-md submenu"
        ref="submenuRef"
      >
        <slot name="submenu"></slot>
      </div>
    </Transition>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, useSlots } from 'vue';

const showSubmenu = ref(false);
const submenuRef = ref<HTMLElement | null>(null);
const menuItemRef = ref<HTMLElement | null>(null);
const slots = useSlots();

// Check if the "submenu" slot exists
const hasSubmenu = computed(() => !!slots.submenu);

const adjustSubmenuPosition = () => {
  if (!submenuRef.value || !menuItemRef.value) return;

  const menuItemRect = menuItemRef.value.getBoundingClientRect();
  const submenuRect = submenuRef.value.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = menuItemRect.right;
  let top = menuItemRect.top;

  // If submenu doesn't fit on the right, place it on the left side of the menu item
  if (left + submenuRect.width > viewportWidth) {
    left = menuItemRect.left - submenuRect.width;
  }

  // If submenu goes below the viewport, move it up
  if (top + submenuRect.height > viewportHeight) {
    top = Math.max(0, viewportHeight - submenuRect.height);
  }

  submenuRef.value.style.position = 'fixed';
  submenuRef.value.style.top = `${top}px`;
  submenuRef.value.style.left = `${left}px`;
};

// Apply submenu position adjustment when showing the submenu
const showSubmenuHandler = () => {
  showSubmenu.value = true;
  nextTick(adjustSubmenuPosition);
};

// Hide submenu
const hideSubmenu = () => {
  showSubmenu.value = false;
};
</script>
