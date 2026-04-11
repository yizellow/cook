<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import {
  mapMidiToAngle,
  setupMidiListener,
  parseMidiControlChange,
} from "../utils/midiUtils";
import RadialLayer from "./RadialLayer.vue";

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

const handleSegmentSelected = (event) => {
  const { layerIndex, segmentIndex } = event;
  const newSegments = [...internalSelectedSegments.value];
  newSegments[layerIndex] = segmentIndex;
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
</script>

<template>
  <div
    class="radial-interface"
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
  >
    <!-- Three concentric circle layers -->
    <RadialLayer
      v-for="circleIndex in [2, 1, 0]"
      :key="`layer-${circleIndex}-${JSON.stringify(props.layers[circleIndex])}`"
      :layer-index="circleIndex"
      :segments="props.layers[circleIndex]"
      :segment-count="props.segmentCounts[circleIndex] || 8"
      :size="props.size"
      :selected-segment="internalSelectedSegments[circleIndex]"
      :is-selected-circle="selectedCircle === circleIndex"
      :circle-width="circleWidth"
      :radius="circleRadiuses[circleIndex]"
      @mouseenter="handleCircleMouseEnter(circleIndex)"
      @mouseleave="handleCircleMouseLeave"
      @segment-selected="handleSegmentSelected"
    />
  </div>
</template>

<style scoped>
.radial-interface {
  position: relative;
  margin: 20px auto;
}

.radial-circle {
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
}
</style>
