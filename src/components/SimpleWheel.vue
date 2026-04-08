<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import {
  mapMidiToAngle,
  setupMidiListener,
  parseMidiControlChange,
} from "../utils/midiUtils";

const props = defineProps({
  options: {
    type: Array,
    default: () => ["Coffee", "Tea", "Water"],
  },
  selectedIndex: {
    type: Number,
    default: 0,
  },
  size: {
    type: Number,
    default: 250,
  },
  midiEnabled: {
    type: Boolean,
    default: true,
  },
  midiChannel: {
    type: Number,
    default: 0,
  },
  midiControlNumber: {
    type: Number,
    default: 70,
  },
});

const emit = defineEmits(["update:selectedIndex"]);

const selectedIndex = ref(props.selectedIndex);
const selectionAngle = ref(0);
const wheelAccumulator = ref(0);
const wheelThreshold = 100; // Adjust this value to control sensitivity

const segmentCount = computed(() => props.options.length);

const selectSegment = (index) => {
  selectedIndex.value = index;
  emit("update:selectedIndex", index);
};

// Reset wheel accumulator when selection changes
watch(selectedIndex, () => {
  wheelAccumulator.value = 0;
});

const handleWheel = (event) => {
  event.preventDefault();

  // Accumulate wheel delta
  wheelAccumulator.value += event.deltaY;

  // Only change selection when threshold is reached
  if (Math.abs(wheelAccumulator.value) >= wheelThreshold) {
    const currentIndex = selectedIndex.value;

    if (wheelAccumulator.value > 0) {
      // Scroll down - next option
      const nextIndex = (currentIndex + 1) % segmentCount.value;
      selectSegment(nextIndex);
    } else {
      // Scroll up - previous option
      const prevIndex = currentIndex === 0 ? segmentCount.value - 1 : currentIndex - 1;
      selectSegment(prevIndex);
    }

    // Reset accumulator
    wheelAccumulator.value = 0;
  }
};

const handleMidiMessage = (event) => {
  const midiData = parseMidiControlChange(event);
  if (!midiData) return;

  if (
    props.midiChannel === midiData.channel &&
    props.midiControlNumber === midiData.controlNumber
  ) {
    const newAngle = mapMidiToAngle(midiData.value);
    selectionAngle.value = newAngle;

    const segment =
      Math.floor((newAngle / (Math.PI * 2)) * segmentCount.value) %
      segmentCount.value;
    selectSegment(segment);
  }
};

let cleanupMidi = null;
onMounted(() => {
  if (props.midiEnabled) {
    cleanupMidi = setupMidiListener(handleMidiMessage);
  }
});

onUnmounted(() => {
  if (cleanupMidi) {
    cleanupMidi();
  }
});

const getSegmentStyle = (index) => {
  const segmentCount = props.options.length;
  const angle = (index / segmentCount) * 2 * Math.PI - Math.PI / 2; // Start from top
  const radius = props.size * 0.35; // Distance from center to segment center
  const segmentSize = props.size * 0.15; // Size of each segment

  const x = Math.cos(angle) * radius + props.size / 2;
  const y = Math.sin(angle) * radius + props.size / 2;

  const isSelected = selectedIndex.value === index;

  return {
    left: `${x - segmentSize / 2}px`,
    top: `${y - segmentSize / 2}px`,
    width: `${segmentSize}px`,
    height: `${segmentSize}px`,
    transform: isSelected ? "scale(1.2)" : "scale(1.0)",
    zIndex: isSelected ? 10 : 1,
  };
};

const getSelectionIndicatorStyle = () => {
  const segmentCount = props.options.length;
  const angle =
    (selectedIndex.value / segmentCount) * 2 * Math.PI - Math.PI / 2;
  const radius = props.size * 0.45; // Slightly outside the segments

  const x = Math.cos(angle) * radius + props.size / 2;
  const y = Math.sin(angle) * radius + props.size / 2;
  const indicatorSize = props.size * 0.08;

  return {
    left: `${x - indicatorSize / 2}px`,
    top: `${y - indicatorSize / 2}px`,
    width: `${indicatorSize}px`,
    height: `${indicatorSize}px`,
  };
};
</script>

<template>
  <div
    class="simple-wheel"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <!-- Background circle -->
    <div
      class="wheel-background"
      :style="{ width: `${size}px`, height: `${size}px` }"
      @wheel="handleWheel"
    ></div>

    <!-- Segments -->
    <div
      v-for="(option, index) in options"
      :key="index"
      class="wheel-segment"
      :style="getSegmentStyle(index)"
      @click="selectSegment(index)"
    >
      <div class="segment-content">
        <span class="segment-text">{{ option }}</span>
      </div>
    </div>

    <!-- Selection indicator -->
    <div
      class="selection-indicator"
      :style="getSelectionIndicatorStyle()"
    ></div>

    <!-- Center circle -->
    <div
      class="center-circle"
      :style="{ width: `${size * 0.3}px`, height: `${size * 0.3}px` }"
    >
      <div class="center-text">DRINK</div>
    </div>
  </div>
</template>

<style scoped>
.simple-wheel {
  position: relative;
  margin: 20px auto;
}

.wheel-background {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 3px solid #e1e8ed;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  cursor: ns-resize; /* Indicates vertical scrolling */
}

.wheel-segment {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.wheel-segment:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.segment-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2px;
}

.segment-text {
  font-size: 11px;
  font-weight: 600;
  color: white;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  line-height: 1;
  word-break: break-word;
  hyphens: auto;
}

.selection-indicator {
  position: absolute;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.6);
  animation: pulse 2s infinite;
  z-index: 15;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.center-circle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px solid #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.center-text {
  font-size: 12px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}
</style>
