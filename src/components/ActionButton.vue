<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  /** Button text */
  text: {
    type: String,
    required: true,
  },
  /** Button type (primary, secondary, danger, etc.) */
  type: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "danger", "back"].includes(value),
  },
  /** Shortcut key (e.g., "Enter", "Escape", "ArrowRight") */
  shortcutKey: {
    type: String,
    default: null,
  },
  /** Whether to show the shortcut key in the button */
  showShortcut: {
    type: Boolean,
    default: true,
  },
  /** Disable state */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Icon asset URL */
  icon: {
    type: String,
    default: null,
  },
  /** Icon position (left or right) */
  iconPosition: {
    type: String,
    default: "left",
    validator: (value) => ["left", "right"].includes(value),
  },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  if (!props.disabled) {
    emit("click");
  }
};

const handleKeyDown = (event) => {
  if (props.shortcutKey && !props.disabled) {
    // Check if the pressed key matches our shortcut
    const keyMatches =
      event.key === props.shortcutKey ||
      event.code === `Key${props.shortcutKey}`;

    if (keyMatches) {
      event.preventDefault();
      emit("click");
    }
  }
};

// Add keyboard listener when mounted
onMounted(() => {
  if (props.shortcutKey) {
    window.addEventListener("keydown", handleKeyDown);
  }
});

// Clean up keyboard listener
onUnmounted(() => {
  if (props.shortcutKey) {
    window.removeEventListener("keydown", handleKeyDown);
  }
});
</script>

<template>
  <button
    @click="handleClick"
    :disabled="disabled"
    class="app-button"
    :class="[`app-button--${type}`, { 'app-button--disabled': disabled }]"
  >
    <img
      v-if="icon && iconPosition === 'left'"
      :src="icon"
      alt=""
      class="app-button__icon app-button__icon--left"
    />
    <span class="app-button__text">{{ text }}</span>
    <img
      v-if="icon && iconPosition === 'right'"
      :src="icon"
      alt=""
      class="app-button__icon app-button__icon--right"
    />
  </button>
</template>

<style scoped>
.app-button {
  position: relative;
  padding: 0.5rem 0.5rem;
  border: 3px solid var(--color-outline);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-width: 6rem;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.app-button__icon {
  width: 1rem;
  height: 1rem;
  object-fit: contain;
}

.app-button__icon--left {
  margin-right: 0.25rem;
}

.app-button__icon--right {
  margin-left: 0.25rem;
}

.app-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Button types */
.app-button--primary {
  background-color: var(--color-blue-highlight);
}

.app-button--primary:hover:not(:disabled) {
  background-color: var(--color-blue);
}

.app-button--secondary {
  background-color: white;
}

.app-button--secondary:hover:not(:disabled) {
  background-color: #eeeeee;
}

.app-button--danger {
  background-color: var;
  color: white;
}

.app-button--danger:hover:not(:disabled) {
  background-color: var(--color-red);
}
</style>
