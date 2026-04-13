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
    <span class="app-button__text">{{ text }}</span>
  </button>
</template>

<style scoped>
.app-button {
  position: relative;
  padding: 12px 24px;
  border: 4px solid var(--color-outline);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
  color: var(--color-text);
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
  background-color: var(--color-blue);
}

.app-button--primary:hover:not(:disabled) {
  background-color: var(--color-blue-highlight);
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
