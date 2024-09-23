<template>
  <li
    @mouseenter="showSubmenuHandler"
    @mouseleave="hideSubmenu"
    @click="handleClick"
    class="cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 p-2 rounded-md relative min-w-32 flex justify-between items-center"
    ref="menuItemRef"
  >
    <!-- Render the main item content -->
    <div class="flex items-center space-x-3">
      <img
        v-if="icon"
        :src="icon"
        class="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 object-cover flex-shrink-0"
      />
      <span class="truncate">{{ label }}</span>
    </div>

    <!-- Add submenu indicator -->
    <span v-if="hasSubmenu" class="text-xs text-neutral-500 ml-2">▶</span>

    <!-- Update the submenu container classes -->
    <Transition name="fade">
      <ul
        v-if="hasSubmenu && showSubmenu"
        class="fixed bg-neutral-200 dark:bg-neutral-800 p-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-md max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-400 dark:scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500 dark:hover:scrollbar-thumb-neutral-500 scrollbar-thumb-rounded-full"
        ref="submenuRef"
      >
        <ContextMenuItem
          v-for="(subItem, index) in submenu"
          :key="index"
          :label="subItem.label"
          :icon="subItem.icon"
          :action="subItem.action"
          :submenu="subItem.submenu"
        >
          {{ subItem.label }}
        </ContextMenuItem>
      </ul>
    </Transition>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import type { MenuItem } from '@/ts/menu';

const props = defineProps<{
  label: string;
  action?: () => void;
  submenu?: MenuItem[];
  icon?: string;
}>();

const emit = defineEmits(['action']);

const showSubmenu = ref(false);
const submenuRef = ref<HTMLElement | null>(null);
const menuItemRef = ref<HTMLElement | null>(null);

// Check if the submenu prop exists
const hasSubmenu = computed(() => props.submenu && props.submenu.length > 0);

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

  // If submenu goes below the viewport, adjust its position
  if (top + submenuRect.height > viewportHeight) {
    const spaceAbove = menuItemRect.top;
    const spaceBelow = viewportHeight - menuItemRect.bottom;

    if (spaceAbove > spaceBelow) {
      // Position above if there's more space
      top = Math.max(0, menuItemRect.top - submenuRect.height);
    } else {
      // Position below, but limit to viewport height
      top = Math.min(menuItemRect.bottom, viewportHeight - submenuRect.height);
    }
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

const handleClick = () => {
  if (props.action) {
    props.action();
  }
  emit('action');
};
</script>
