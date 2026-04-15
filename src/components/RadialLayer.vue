<script setup>
import { ref, computed, onMounted } from "vue";
import RadialLabel from "./RadialLabel.vue";

const props = defineProps({
  layerIndex: {
    type: Number,
    required: true,
  },
  segments: {
    type: Array,
    default: () => [],
  },
  size: {
    type: Number,
    default: 300,
  },
  selectedSegment: {
    type: Number,
    default: 0,
  },
  isSelectedCircle: {
    type: Boolean,
    default: false,
  },
  circleWidth: {
    type: Number,
    required: true,
  },
  radius: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:selectedSegment", "segmentSelected"]);

const labelReadyCount = ref(0);
const totalLabels = ref(props.segments.length);
const transformsEnabled = ref(false);

// workaround: wait for circle type transforms of lables to be applied before enabling own transforms
const handleLabelReady = () => {
  labelReadyCount.value++;
  if (labelReadyCount.value >= totalLabels.value) {
    transformsEnabled.value = true;
  }
};

const segmentCount = computed(() => {
  return props.segments.length;
});

const getSegmentLabel = (segmentIndex) => {
  return props.segments[segmentIndex]?.name || segmentIndex + 1;
};

const getSegmentStyle = (segmentIndex) => {
  const positionOffset = props.circleWidth / 2 - 4;
  const segmentAngleSize = (2 * Math.PI) / segmentCount.value;
  const segmentPositionAngle =
    segmentIndex * segmentAngleSize - segmentAngleSize / 2;
  const segmentRotationAngle = segmentPositionAngle + Math.PI / 2;
  const radius = props.radius - positionOffset;

  const x = Math.cos(segmentPositionAngle) * radius + radius + positionOffset;
  const y = Math.sin(segmentPositionAngle) * radius + radius + positionOffset;
  const segmentSize = props.circleWidth / 2;

  const isSelected = props.selectedSegment === segmentIndex;

  const transformValue = transformsEnabled.value
    ? `rotate(${segmentRotationAngle * (180 / Math.PI)}deg)`
    : "none";

  return {
    left: `${x - segmentSize / 2}px`,
    top: `${y - segmentSize / 2}px`,
    width: `${segmentSize}px`,
    height: `${segmentSize}px`,
    // backgroundColor: isSelected
    //   ? "var(--accent-color-highlight)"
    //   : "var(--accent-color)",
    transform: transformValue,
  };
};

const getCircleStyle = () => {
  const segmentAngleSize = (2 * Math.PI) / segmentCount.value;
  const segmentAnglePosition =
    (props.selectedSegment * segmentAngleSize -
      segmentAngleSize / 2 +
      Math.PI / 2) *
    (180 / Math.PI);

  const transformValue = transformsEnabled.value
    ? `rotate(-${segmentAnglePosition}deg)`
    : "none";

  return {
    width: `${props.radius * 2}px`,
    height: `${props.radius * 2}px`,
    left: `${props.size / 2 - props.radius}px`,
    top: `${props.size / 2 - props.radius}px`,
    transform: transformValue,
  };
};

const selectSegment = (segmentIndex) => {
  emit("segmentSelected", { layerIndex: props.layerIndex, segmentIndex });
};

const handleWheel = (e) => {
  e.preventDefault();
  if (!props.isSelectedCircle) return;

  const currentAngle =
    (props.selectedSegment / segmentCount.value) * (2 * Math.PI);
  const scrollDelta = e.deltaY * 0.01;
  let newAngle = currentAngle - scrollDelta;
  newAngle = ((newAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

  const newSegment =
    Math.floor((newAngle / (Math.PI * 2)) * segmentCount.value) %
    segmentCount.value;
  emit("segmentSelected", {
    layerIndex: props.layerIndex,
    segmentIndex: newSegment,
  });
};
</script>

<template>
  <div
    class="radial-circle"
    :data-layer="layerIndex"
    :style="getCircleStyle()"
    @wheel="handleWheel"
  >
    <slot></slot>
    <div
      v-for="segmentIndex in segmentCount"
      :key="segmentIndex"
      class="radial-segment"
      :class="{ selected: selectedSegment == segmentIndex - 1 }"
      :style="getSegmentStyle(segmentIndex - 1)"
      @click.stop="selectSegment(segmentIndex - 1)"
    >
      <RadialLabel
        :label="getSegmentLabel(segmentIndex - 1)"
        :radius="radius - circleWidth / 2"
        @circletype-ready="handleLabelReady"
      />
    </div>
  </div>
</template>

<style scoped>
.radial-circle {
  --circle-width: v-bind(circleWidth);
  --accent-color: var(--color-blue);
  --accent-color-highlight: var(--color-blue-highlight);
  position: absolute;
  border-radius: 50%;
  /*cursor: pointer;*/
  transition: all 0.3s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    display: block;
    user-select: none;
  }
}

.radial-segment {
  position: absolute;
  border-radius: 50%;
  /*transition: all 0.1s ease-out;*/
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /*border: 3px solid var(--color-outline);*/

  &.selected {
    .segment-label {
      color: var(--color-text);
    }
  }
}
</style>
