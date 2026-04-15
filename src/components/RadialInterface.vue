<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import {
  mapMidiToAngle,
  setupMidiListener,
  parseMidiControlChange,
} from "../utils/midiUtils";
import RadialLayer from "./RadialLayer.vue";
import InnerRing from "./rings/InnerRing.vue";
import MiddleRing from "./rings/MiddleRing.vue";
import OuterRing2 from "./rings/OuterRing2.vue";
import OuterRing3 from "./rings/OuterRing3.vue";
import OuterRing4 from "./rings/OuterRing4.vue";
import SingleRing from "./rings/SingleRing.vue";

const props = defineProps({
  layers: {
    type: Array,
    default: () => [[], [], []],
  },
  singleRing: {
    type: Boolean,
    default: false,
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

const rings = [
  Array(3).fill(InnerRing),
  Array(3).fill(MiddleRing),
  [OuterRing2, OuterRing3, OuterRing4],
];

const circleWidth = computed(() => props.size * 0.15);

const emit = defineEmits(["update:selectedSegments"]);

const selectedCircle = ref(null);
const internalSelectedSegments = ref([...props.selectedSegments]);

const circleRadiuses = computed(() => {
  return props.layers.map((layer, index) => {
    return (props.size * (0.333 + index * 0.333)) / 2;
  });
});

const segmentCounts = computed(() => {
  return props.layers.map((layer) => layer.length);
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

const handleMidiMessage = (event) => {
  const midiData = parseMidiControlChange(event);
  if (!midiData) return;

  for (let circleIndex = 0; circleIndex < 3; circleIndex++) {
    if (
      props.midiChannels[circleIndex] === midiData.channel &&
      props.midiControlNumbers[circleIndex] === midiData.controlNumber
    ) {
      const angle = mapMidiToAngle(midiData.value);
      const segmentCount = segmentCounts.value[circleIndex];
      const segment =
        Math.floor((angle / (Math.PI * 2)) * segmentCount) % segmentCount;
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
    <RadialLayer
      v-for="(layer, circleIndex) in layers"
      :key="`layer-${circleIndex}-${JSON.stringify(layer)}`"
      :class="`layer-${circleIndex}`"
      :layer-index="circleIndex"
      :segments="layer"
      :size="props.size"
      :selected-segment="internalSelectedSegments[circleIndex]"
      :is-selected-circle="selectedCircle === circleIndex"
      :circle-width="props.singleRing ? props.size * 0.5 : circleWidth"
      :radius="props.singleRing ? props.size / 2 : circleRadiuses[circleIndex]"
      @mouseenter="handleCircleMouseEnter(circleIndex)"
      @mouseleave="handleCircleMouseLeave"
      @segment-selected="handleSegmentSelected"
    >
      <SingleRing
        v-if="props.singleRing"
        :selected-segment="internalSelectedSegments[circleIndex]"
      ></SingleRing>
      <component
        v-if="!props.singleRing"
        :is="rings[circleIndex][segmentCounts[circleIndex] - 2]"
        :selected-segment="internalSelectedSegments[circleIndex]"
      ></component>
    </RadialLayer>
  </div>
</template>

<style scoped>
.radial-interface {
  position: relative;
  margin: 2rem;
}

.radial-circle {
  &[data-layer*="0"] {
    --accent-color: var(--color-yellow);
    --accent-color-highlight: var(--color-yellow-highlight);
    z-index: 3;
  }

  &[data-layer*="1"] {
    --accent-color: var(--color-pink);
    --accent-color-highlight: var(--color-pink-highlight);
    z-index: 2;
  }

  &[data-layer*="2"] {
    --accent-color: var(--color-green);
    --accent-color-highlight: var(--color-green-highlight);
    z-index: 1;
  }
}
</style>
