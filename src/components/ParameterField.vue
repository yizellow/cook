<template>
  <div class="parameter-field">
    <label
      ><span>{{ props.index }}</span
      >{{ parameter.name }}</label
    >

    <!-- Percentage Slider -->
    <div v-if="parameter.type === 'percentage'" class="percentage-group">
      <div class="slider-group">
        <input
          v-model.number="localValue"
          type="range"
          :min="parameter.min"
          :max="parameter.max"
          class="slider"
        />
        <span class="value-display slider-value">{{ localValue }}%</span>
      </div>
    </div>

    <!-- Range Slider -->
    <div v-else-if="parameter.type === 'range'" class="range-group">
      <div class="slider-group">
        <input
          v-model.number="localValue"
          type="range"
          :min="parameter.min"
          :max="parameter.max"
          :step="parameter.step || 1"
          class="slider"
        />
        <span class="slider-value value-display">{{ localValue }}</span>
      </div>
    </div>

    <!-- Spectrum Slider (two-end opposition) -->
    <div v-else-if="parameter.type === 'spectrum'" class="spectrum-group">
      <div class="slider-group">
        <div class="labled-slider">
          <input
            v-model.number="localValue"
            type="range"
            :min="parameter.min"
            :max="parameter.max"
            class="slider"
          />
          <div class="label-group">
            <span>{{ parameter.labels[0] }}</span>
            <span>{{ parameter.labels[1] }}</span>
          </div>
        </div>
        <!-- <div class="value-display slider-value">{{ localValue }}%</div> -->
      </div>
    </div>

    <!-- Boolean Toggle -->
    <div v-else-if="parameter.type === 'boolean'" class="boolean-group">
      <button :class="{ active: localValue }" @click="localValue = !localValue">
        {{ localValue ? "Ja" : "Nein" }}
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

const props = defineProps(["parameter", "value", "index"]);
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

  span {
    display: inline-block;
    background: var(--color-blue-highlight);
    padding: 0.125rem 0.25rem;
    border: 3px solid var(--color-outline);
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 800;
    margin-right: 0.5rem;
  }
}

.value-display {
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
  font-size: 0.875rem;
  width: 2rem;
}

.slider-group {
  width: 100%;
  display: flex;
  /*align-items: center;*/
  gap: 0.125rem;

  & > .slider {
    flex-grow: 1;
  }

  & > .labled-slider {
    flex-grow: 1;

    .slider {
      width: 100%;
    }
  }

  .slider-value {
    width: 2.125rem;
    text-align: right;
  }
}

.slider {
  height: 4px;
  margin: 0.5rem 0;
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
  flex-direction: column;
  gap: 0.125rem;

  .label-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: -0.25rem;
    color: var(--color-text-faded);
  }
}

button {
  border: 3px solid var(--color-outline);
  color: var(--color-text-faded);
  background: var(--color-blue-highlight);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &.active {
    background: var(--color-blue);
    color: var(--color-text);
    border-color: var(--color-outline);
  }

  &:hover {
    color: var(--color-text);
  }
}

.boolean-group button {
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  cursor: pointer;
}

.choice-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
  gap: 0.5rem;
}

.choice-group button {
  padding: 0.5rem 0.25rem;
  border-radius: 8px;
  cursor: pointer;
  /*font-size: 0.9rem;*/
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
