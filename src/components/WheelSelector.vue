<template>
  <div class="wheel-selector">
    <!-- Outer Ring: Menu Items -->
    <WheelRing
      :items="availableMenuItems"
      :selectedId="selectedMenuItem?.id"
      layerType="outer"
      @select="selectMenuItem"
    />

    <!-- Middle Ring: Chefs/Media -->
    <WheelRing
      :items="chefs"
      :selectedId="selectedChef?.id"
      layerType="middle"
      @select="selectChef"
    />

    <!-- Inner Ring: Snacks -->
    <WheelRing
      :items="snacks"
      :selectedId="selectedSnack?.id"
      layerType="inner"
      @select="selectSnack"
    />
  </div>
</template>

<script setup>
import WheelRing from './WheelRing.vue';
import { menuConfig } from '../config/menuConfig.js';

defineProps(['selectedSnack', 'selectedChef', 'selectedMenuItem', 'availableMenuItems']);
const emit = defineEmits(['select-snack', 'select-chef', 'select-menu-item']);

const { snacks, chefs } = menuConfig;

const selectSnack = (snack) => {
  emit('select-snack', snack);
};

const selectChef = (chef) => {
  emit('select-chef', chef);
};

const selectMenuItem = (menuItem) => {
  emit('select-menu-item', menuItem);
};
</script>

<style scoped>
.wheel-selector {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
}
</style>