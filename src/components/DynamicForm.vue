<template>
  <div class="dynamic-form">
    <h3>Parameters</h3>
    <ParameterField
      v-for="param in parameters"
      :key="param.id"
      :parameter="param"
      :value="values[param.id]"
      @update:value="updateParameter(param.id, $event)"
    />
  </div>
</template>

<script setup>
import ParameterField from './ParameterField.vue';

defineProps(['parameters', 'values']);
const emit = defineEmits(['update:parameter']);

const updateParameter = (paramId, value) => {
  emit('update:parameter', paramId, value);
};
</script>

<style scoped>
.dynamic-form {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.dynamic-form h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #333;
}
</style>