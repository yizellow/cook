<template>
  <div class="selection-summary">
    <h4>Current Selection</h4>
    <div class="summary-item">
      <strong>Snack:</strong> {{ selectedSnack?.name || 'None' }}
    </div>
    <div class="summary-item">
      <strong>Chef/Media:</strong> {{ selectedChef?.name || 'None' }}
    </div>
    <div class="summary-item">
      <strong>Menu Item:</strong> {{ selectedMenuItem?.name || 'None' }}
    </div>
  </div>
</template>

<script setup>
defineProps(['selectedSnack', 'selectedChef', 'selectedMenuItem']);
</script>

<style scoped>
.selection-summary {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.selection-summary h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
}

.summary-item {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
</style>