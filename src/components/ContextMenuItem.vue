<template>
  <li
    @mouseenter="showSubmenuHandler"
    @mouseleave="hideSubmenu"
    @click="handleClick"
    class="cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 p-2 rounded-md relative min-w-32 flex justify-between items-center"
    ref="menuItemRef"
  >
    <!-- Render the main item content -->
    <span>
      <slot>{{ label }}</slot>
    </span>

    <!-- Add submenu indicator -->
    <span v-if="hasSubmenu" class="submenu-indicator ml-2">▶</span>

    <!-- Render the submenu if it exists and should be shown -->
    <Transition name="fade">
      <ul
        v-if="hasSubmenu && showSubmenu"
        class="fixed bg-neutral-200 dark:bg-neutral-800 p-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-md submenu"
        ref="submenuRef"
      >
        <ContextMenuItem
          v-for="(subItem, index) in submenu"
          :key="index"
          :label="subItem.label"
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
import { ref, computed, nextTick, useSlots } from 'vue';

interface MenuItem {
  label: string;
  action?: () => void;
  submenu?: MenuItem[];
}

const props = defineProps<{
  label: string;
  action?: () => void;
  submenu?: MenuItem[];
}>();

const emit = defineEmits(['action']);

const showSubmenu = ref(false);
const submenuRef = ref<HTMLElement | null>(null);
const menuItemRef = ref<HTMLElement | null>(null);
const slots = useSlots();

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

const handleClick = () => {
  if (props.action) {
    props.action();
  }
  emit('action');
};
</script>

<style scoped>
.submenu {
  z-index: 1000;
}

.submenu-indicator {
  font-size: 0.8em;
  color: #888;
}
</style>
