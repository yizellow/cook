<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import {
  mapMidiToAngle,
  setupMidiListener,
  parseMidiControlChange,
} from "../utils/midiUtils";
import RadialLabel from "./RadialLabel.vue";

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

const circleWidth = computed(() => props.size / 3);
const emit = defineEmits(["update:selectedSegments"]);

const selectedCircle = ref(null);
const internalSelectedSegments = ref([...props.selectedSegments]);
const selectionAngles = ref([0, 0, 0]);

const circleSegmentCounts = computed(() => {
  return props.layers.map((layer, index) => {
    return layer?.length || props.segmentCounts[index] || 8;
  });
});

const circleRadiuses = computed(() => {
  return props.layers.map((layer, index) => {
    return props.size * (0.3 + index * 0.2);
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
    Math.floor((newAngle / (Math.PI * 2)) * segmentCount) % segmentCount;

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
  const positionOffset = circleWidth.value * 0.3;
  const segmentAngleSize =
    (2 * Math.PI) / circleSegmentCounts.value[circleIndex];
  const segmentPositionAngle =
    segmentIndex * segmentAngleSize - segmentAngleSize / 2;
  const segmentRotationAngle = segmentPositionAngle + Math.PI / 2;
  if (circleIndex == 1) console.log(segmentPositionAngle * (180 / Math.PI));
  const radius = circleRadiuses.value[circleIndex] - positionOffset;

  const x = Math.cos(segmentPositionAngle) * radius + radius + positionOffset;
  const y = Math.sin(segmentPositionAngle) * radius + radius + positionOffset;
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
      ? "var(--accent-color-highlight)"
      : "var(--accent-color)",
    border: "3px solid var(--color-outline)",
    transform: isSelected ? "scale(1.2)" : "scale(1.0)",
    transform: `rotate(${segmentRotationAngle * (180 / Math.PI)}deg)`,
  };
};

const getCircleStyle = (circleIndex) => {
  const radius = circleRadiuses.value[circleIndex];
  const isHovered = selectedCircle.value === circleIndex;

  const segmentAngleSize =
    (2 * Math.PI) / circleSegmentCounts.value[circleIndex];
  const segmentAnglePosition =
    (internalSelectedSegments.value[circleIndex] * segmentAngleSize -
      segmentAngleSize / 2 +
      Math.PI / 2) *
    (180 / Math.PI);

  return {
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    left: `${props.size / 2 - radius}px`,
    top: `${props.size / 2 - radius}px`,
    // opacity: isHovered ? 0.4 : 1,
    transform: `rotate(-${segmentAnglePosition}deg)`,
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
      :data-layer="circleIndex"
      :style="getCircleStyle(circleIndex)"
      @mouseenter="handleCircleMouseEnter(circleIndex)"
      @mouseleave="handleCircleMouseLeave"
      @wheel="handleWheel($event, circleIndex)"
    >
      <div class="outer-circle"></div>
      <div class="inner-circle"></div>
      <div
        v-for="segmentIndex in circleSegmentCounts[circleIndex]"
        :key="`${circleIndex}-${segmentIndex}`"
        class="radial-segment"
        :style="getSegmentStyle(segmentIndex - 1, circleIndex)"
        @click.stop="selectSegment(circleIndex, segmentIndex - 1)"
      >
        <RadialLabel
          :label="getSegmentLabel(segmentIndex - 1, circleIndex)"
          :radius="circleRadiuses[circleIndex] - circleWidth * 0.3"
        />
      </div>
    </div>

    <!-- cursors for each circle (for debugging) -->
    <!-- <div
      v-for="circleIndex in [2, 1, 0]"
      class="radial-cursor"
      :style="getCursorStyle(circleIndex)"
    ></div> -->
  </div>
</template>

<style scoped>
.radial-interface {
  position: relative;
  margin: 20px auto;
}

.radial-circle {
  --circle-width: v-bind(circleWidth);
  --accent-color: var(--color-blue);
  --accent-color-highlight: var(--color-blue-highlight);
  position: absolute;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease-out;

  /*border: 10px solid var(--accent-color);*/

  &[data-layer*="0"] {
    --accent-color: var(--color-yellow);
    --accent-color-highlight: var(--color-yellow-highlight);
  }

  &[data-layer*="1"] {
    --accent-color: var(--color-pink);
    --accent-color-highlight: var(--color-pink-highlight);
  }

  &[data-layer*="2"] {
    --accent-color: var(--color-green);
    --accent-color-highlight: var(--color-green-highlight);
  }

  .inner-circle {
    border: 4px solid var(--color-outline);
    background-color: var(--color-background);
    position: absolute;
    width: calc(100% - var(--circle-width) * 1px);
    height: calc(100% - var(--circle-width) * 1px);
    top: calc(var(--circle-width) / 2 * 1px);
    left: calc(var(--circle-width) / 2 * 1px);
    border-radius: 50%;
  }

  .outer-circle {
    border: 4px solid var(--color-outline);
    background-color: var(--accent-color);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 50%;
  }
}

.radial-segment {
  position: absolute;
  border-radius: 50%;
  transition: all 0.1s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.segment-label {
  /*position: absolute;*/
  /*width: 20px;*/
  /*height: 20px;*/

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
