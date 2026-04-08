<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { mapMidiToAngle, setupMidiListener, parseMidiControlChange } from "../utils/midiUtils";

const props = defineProps({
  layers: {
    type: Array,
    default: () => [[], [], []],
  },
  segmentCounts: {
    type: Array,
    default: () => [8, 8, 8], // fallback counts if layers are empty
  },
  selectedSegments: {
    type: Array,
    default: () => [0, 0, 0],
  },
  size: {
    type: Number,
    default: 300,
  },
  midiEnabled: {
    type: Boolean,
    default: true,
  },
  midiChannels: {
    type: Array,
    default: () => [0, 0, 0], // MIDI channels for [inner, middle, outer] circles
  },
  midiControlNumbers: {
    type: Array,
    default: () => [70, 71, 72], // MIDI CC numbers for [inner, middle, outer] circles
  },
});

const emit = defineEmits(["update:selectedSegments"]);

const selectedCircle = ref(null);
const internalSelectedSegments = ref([...props.selectedSegments]);
const selectionAngles = ref([0, 0, 0]);

const circleSegmentCounts = computed(() => {
  return props.layers.map((layer, index) => {
    return layer?.length || props.segmentCounts[index] || 8;
  });
});

watch(
  () => props.selectedSegments,
  (newSegments) => {
    if (Array.isArray(newSegments)) {
      internalSelectedSegments.value = [...newSegments];
    }
  },
  { deep: true, immediate: true },
);

const emitSelectedSegments = (segments) => {
  emit("update:selectedSegments", [...segments]);
};

const handleCircleMouseEnter = (circleIndex) => {
  selectedCircle.value = circleIndex;
};

const handleCircleMouseLeave = () => {
  selectedCircle.value = null;
};

const handleWheel = (e, circleIndex) => {
  e.preventDefault();

  if (selectedCircle.value !== circleIndex) return;

  const currentAngle = selectionAngles.value[circleIndex] || 0;
  const scrollDelta = e.deltaY * 0.01;
  let newAngle = currentAngle - scrollDelta;
  newAngle = wrapAngle(newAngle);
  selectionAngles.value[circleIndex] = newAngle;

  const segmentCount = circleSegmentCounts.value[circleIndex];
  const segment =
    Math.round((newAngle / (Math.PI * 2)) * segmentCount) % segmentCount;

  const newSegments = [...internalSelectedSegments.value];
  newSegments[circleIndex] = segment;
  internalSelectedSegments.value = newSegments;
  emitSelectedSegments(newSegments);
};

const selectSegment = (circleIndex, segmentIndex) => {
  const newSegments = [...internalSelectedSegments.value];
  newSegments[circleIndex] = segmentIndex;
  internalSelectedSegments.value = newSegments;
  emitSelectedSegments(newSegments);
};

const wrapAngle = (angle) => {
  const wrapped = angle % (Math.PI * 2);
  return wrapped < 0 ? wrapped + Math.PI * 2 : wrapped;
};

const handleMidiMessage = (event) => {
  const midiData = parseMidiControlChange(event);
  if (!midiData) return;

  for (let circleIndex = 0; circleIndex < 3; circleIndex++) {
    if (
      props.midiChannels[circleIndex] === midiData.channel &&
      props.midiControlNumbers[circleIndex] === midiData.controlNumber
    ) {
      const newAngle = mapMidiToAngle(midiData.value);
      selectionAngles.value[circleIndex] = newAngle;

      const segmentCount = circleSegmentCounts.value[circleIndex];
      const segment =
        Math.floor((newAngle / (Math.PI * 2)) * segmentCount) % segmentCount;
      const newSegments = [...internalSelectedSegments.value];
      newSegments[circleIndex] = segment;
      internalSelectedSegments.value = newSegments;
      emitSelectedSegments(newSegments);

      break;
    }
  }
};

// Setup MIDI listener using the utility
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

const getSegmentLabel = (segmentIndex, circleIndex) => {
  const item = props.layers?.[circleIndex]?.[segmentIndex];
  return item?.name || segmentIndex + 1;
};

const getSegmentStyle = (segmentIndex, circleIndex) => {
  const segmentCount = circleSegmentCounts.value[circleIndex];
  const angle = segmentIndex * (360 / segmentCount) * (Math.PI / 180);
  const radius = props.size * (0.3 + circleIndex * 0.2);

  const x = Math.cos(angle) * radius + props.size / 2;
  const y = Math.sin(angle) * radius + props.size / 2;
  const segmentSize = props.size * 0.12;

  const isSelected =
    internalSelectedSegments.value[circleIndex] === segmentIndex;
  const isHoveredCircle = selectedCircle.value === circleIndex;

  return {
    left: `${x - segmentSize / 2}px`,
    top: `${y - segmentSize / 2}px`,
    width: `${segmentSize}px`,
    height: `${segmentSize}px`,
    backgroundColor: isSelected
      ? "#4CAF50"
      : isHoveredCircle
        ? "#8BC34A"
        : circleIndex === 0
          ? "#E0E0E0"
          : circleIndex === 1
            ? "#BDBDBD"
            : "#9E9E9E",
    border: isSelected ? "3px solid #2E7D32" : "none",
    transform: isSelected ? "scale(1.2)" : "scale(1.0)",
  };
};

const getCircleStyle = (circleIndex) => {
  const radius = props.size * (0.3 + circleIndex * 0.2);
  const isHovered = selectedCircle.value === circleIndex;

  return {
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    left: `${props.size / 2 - radius}px`,
    top: `${props.size / 2 - radius}px`,
    border: `4px solid ${isHovered ? "#FFC107" : circleIndex === 0 ? "#90CAF9" : circleIndex === 1 ? "#64B5F6" : "#42A5F5"}`,
    backgroundColor: isHovered ? "rgba(255, 193, 7, 0.1)" : "transparent",
  };
};

const getCursorStyle = (circleIndex) => {
  const angle = selectionAngles.value[circleIndex];
  const radius = props.size * (0.3 + circleIndex * 0.2);

  const x = Math.cos(angle) * radius + props.size / 2;
  const y = Math.sin(angle) * radius + props.size / 2;
  const cursorSize = props.size * 0.1;

  return {
    left: `${x - cursorSize / 2}px`,
    top: `${y - cursorSize / 2}px`,
    width: `${cursorSize}px`,
    height: `${cursorSize}px`,
  };
};
</script>

<template>
  <div
    class="radial-interface"
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
  >
    <!-- Three concentric circles with hover detection -->
    <div
      v-for="circleIndex in [2, 1, 0]"
      :key="circleIndex"
      class="radial-circle"
      :style="getCircleStyle(circleIndex)"
      @mouseenter="handleCircleMouseEnter(circleIndex)"
      @mouseleave="handleCircleMouseLeave"
      @wheel="handleWheel($event, circleIndex)"
    ></div>

    <!-- Segments for each circle -->
    <div v-for="circleIndex in [2, 1, 0]" :key="`segments-${circleIndex}`">
      <div
        v-for="segmentIndex in circleSegmentCounts[circleIndex]"
        :key="`${circleIndex}-${segmentIndex}`"
        class="radial-segment"
        :style="getSegmentStyle(segmentIndex - 1, circleIndex)"
        @click.stop="selectSegment(circleIndex, segmentIndex - 1)"
      >
        <div class="segment-label">
          {{ getSegmentLabel(segmentIndex - 1, circleIndex) }}
        </div>
      </div>
    </div>

    <!-- cursors for each circle -->
    <div
      v-for="circleIndex in [2, 1, 0]"
      class="radial-cursor"
      :style="getCursorStyle(circleIndex)"
    ></div>
  </div>
</template>

<style scoped>
.radial-interface {
  position: relative;
  margin: 20px auto;
}

.radial-circle {
  position: absolute;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.1s ease-out;
}

.radial-segment {
  position: absolute;
  border-radius: 50%;
  transition: all 0.1s ease-out;
}

.segment-label {
  position: absolute;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  transition: opacity 0.2s ease-out;
  pointer-events: none;
}

.radial-cursor {
  position: absolute;
  border-radius: 50%;
  /*transition: all 0.3s ease;*/
  background-color: black;
  z-index: 5;
}
</style>
