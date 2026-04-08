<template>
  <div class="parameter-field">
    <label>{{ parameter.name }}</label>

    <!-- Percentage Slider -->
    <div v-if="parameter.type === 'percentage'" class="percentage-group">
      <input
        v-model.number="localValue"
        type="range"
        :min="parameter.min"
        :max="parameter.max"
        class="slider"
      />
      <span>{{ localValue }}%</span>
    </div>

    <!-- Range Slider -->
    <div v-else-if="parameter.type === 'range'" class="range-group">
      <input
        v-model.number="localValue"
        type="range"
        :min="parameter.min"
        :max="parameter.max"
        :step="parameter.step || 1"
        class="slider"
      />
      <span>{{ localValue }}</span>
    </div>

    <!-- Spectrum Slider (two-end opposition) -->
    <div v-else-if="parameter.type === 'spectrum'" class="spectrum-group">
      <span>{{ parameter.labels[0] }}</span>
      <input
        v-model.number="localValue"
        type="range"
        :min="parameter.min"
        :max="parameter.max"
        class="slider"
      />
      <span>{{ parameter.labels[1] }}</span>
      <div class="value-display">{{ localValue }}%</div>
    </div>

    <!-- Boolean Toggle -->
    <div v-else-if="parameter.type === 'boolean'" class="boolean-group">
      <button :class="{ active: localValue }" @click="localValue = !localValue">
        {{ localValue ? "Yes" : "No" }}
      </button>
    </div>

    <!-- Single Choice Buttons -->
    <div v-else-if="parameter.type === 'single-choice'" class="choice-group">
      <button
        v-for="option in parameter.options"
        :key="option"
        :class="{ active: localValue === option }"
        @click="localValue = option"
      >
        {{ option }}
      </button>
    </div>

    <!-- Text Input -->
    <div v-else-if="parameter.type === 'text'" class="text-group">
      <input
        v-model="localValue"
        type="text"
        :placeholder="parameter.placeholder || ''"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps(["parameter", "value"]);
const emit = defineEmits(["update:value"]);

const localValue = ref(props.value);

watch(
  () => props.value,
  (newVal) => {
    localValue.value = newVal;
  },
);

watch(localValue, (newVal) => {
  emit("update:value", newVal);
});
</script>

<style scoped>
.parameter-field {
  margin-bottom: 1.5rem;
}

.parameter-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.slider {
  width: 100%;
  height: 4px;
  border-radius: 3px;
  background: var(--color-outline);
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-blue);
  border: 4px solid var(--color-outline);
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-blue);
  border: 4px solid var(--color-outline);
  cursor: pointer;
}

.percentage-group,
.range-group,
.spectrum-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.spectrum-group {
  justify-content: space-between;
}

.value-display {
  font-weight: bold;
  color: #007bff;
}

button {
  border: 4px solid var(--color-outline);
  background: var(--color-blue);
  font-weight: 800;

  &.active {
    background: var(--color-blue-highlight);
  }

  &:hover {
    background: var(--color-blue-highlight);
  }
}

.boolean-group button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.choice-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.choice-group button {
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.text-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.text-group input:focus {
  outline: none;
  border-color: var(--color-blue);
}
</style>
