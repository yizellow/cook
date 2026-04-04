<template>
  <div class="wheel-ring" :class="`layer-${layerType}`">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="ring-item"
      :class="{ active: selectedId === item.id }"
      :style="getItemStyle(index)"
      @click="$emit('select', item)"
    >
      <span class="item-label">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['items', 'selectedId', 'layerType']);
defineEmits(['select']);

const getItemStyle = (index) => {
  const count = props.items.length;

  if (props.layerType === 'inner') {
    // For inner layer, arrange items vertically in the center
    const spacing = 60; // Space between items
    const startY = -(count - 1) * spacing / 2;
    const y = startY + index * spacing;

    return {
      transform: `translate(-50%, ${y}px)`
    };
  } else {
    // For middle and outer layers, arrange in circle
    const angle = (360 / count) * index;
    const radius = props.layerType === 'middle' ? 80 : 140;

    return {
      transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
    };
  }
};
</script>

<style scoped>
.wheel-ring {
  position: relative;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layer-inner {
  width: 120px;
  height: 120px;
  background: #f0f0f0;
}

.layer-middle {
  width: 200px;
  height: 200px;
  background: #e0e0e0;
}

.layer-outer {
  width: 280px;
  height: 280px;
  background: #d0d0d0;
}

.ring-item {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 0.5rem;
  background: white;
  border: 2px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.8rem;
  font-weight: bold;
  transform-origin: center;
}

.layer-inner .ring-item {
  width: 80px;
  height: 80px;
  z-index: 10; /* Ensure inner items are above others */
}

.layer-middle .ring-item {
  width: 100px;
  height: 100px;
  z-index: 5;
}

.layer-outer .ring-item {
  width: 120px;
  height: 120px;
  z-index: 1;
}

.ring-item:hover {
  border-color: #007bff;
}

.ring-item.active {
  border-color: #007bff;
  background: #f0f8ff;
  color: #007bff;
}

.item-label {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>