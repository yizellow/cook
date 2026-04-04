<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  segmentCounts: {
    type: Array,
    default: () => [8, 8, 8], // [inner, middle, outer] circle segment counts
  },
  size: {
    type: Number,
    default: 300,
  },
  midiEnabled: {
    type: Boolean,
    default: false,
  },
  midiChannels: {
    type: Array,
    default: () => [0, 1, 2], // MIDI channels for [inner, middle, outer] circles
  },
  midiControlNumbers: {
    type: Array,
    default: () => [10, 11, 12], // MIDI CC numbers for [inner, middle, outer] circles
  },
});

const selectedCircle = ref(null);
const selectedSegments = ref([null, null, null]);
const selectionAngles = ref([0, 0, 0]);
// One selected segment per circle

const handleCircleMouseEnter = (circleIndex) => {
  selectedCircle.value = circleIndex;
};

const handleCircleMouseLeave = () => {
  selectedCircle.value = null;
};

const handleWheel = (e, circleIndex) => {
  e.preventDefault();

  if (selectedCircle.value !== circleIndex) return;

  // Get current angle or initialize to 0
  const currentAngle = selectionAngles.value[circleIndex] || 0;

  // Calculate delta in radians with smooth scrolling
  const scrollDelta = e.deltaY * 0.01; // Adjust sensitivity as needed
  let newAngle = currentAngle - scrollDelta; // Negative for natural scroll direction

  // Smooth wrapping: ensure angle stays within 0 to 2π range
  newAngle = wrapAngle(newAngle);

  // Update the angle for this circle
  selectionAngles.value[circleIndex] = newAngle;

  // Calculate which segment this angle corresponds to
  const segmentCount = props.segmentCounts[circleIndex] || 8;
  const segment =
    Math.round((newAngle / (Math.PI * 2)) * segmentCount) % segmentCount;

  // Update only this circle's selected segment
  const newSegments = [...selectedSegments.value];
  newSegments[circleIndex] = segment;
  selectedSegments.value = newSegments;
};

const wrapAngle = (angle) => {
  // Ensure angle is always positive and within 0 to 2π range
  const wrapped = angle % (Math.PI * 2);
  return wrapped < 0 ? wrapped + Math.PI * 2 : wrapped;
};

const mapMidiToAngle = (midiValue) => {
  // Map MIDI value (0-127) to angle (0 to 2π)
  return (midiValue / 127) * Math.PI * 2;
};

const handleMidiMessage = (event) => {
  // console.log(event.data);
  const [status, data1, data2] = event.data;

  // Check if it's a control change message
  if ((status & 0xf0) === 0xb0) {
    const channel = status & 0x0f;
    const controlNumber = data1;
    const midiValue = data2;
    // Find which circle this MIDI message corresponds to
    for (let circleIndex = 0; circleIndex < 3; circleIndex++) {
      if (
        props.midiChannels[circleIndex] === channel &&
        props.midiControlNumbers[circleIndex] === controlNumber
      ) {
        // Map MIDI value to angle and update
        const newAngle = mapMidiToAngle(midiValue);
        selectionAngles.value[circleIndex] = newAngle;

        // Update the selected segment
        const segmentCount = props.segmentCounts[circleIndex] || 8;
        const segment =
          Math.floor((newAngle / (Math.PI * 2)) * segmentCount) % segmentCount;
        const newSegments = [...selectedSegments.value];
        newSegments[circleIndex] = segment;
        selectedSegments.value = newSegments;

        break;
      }
    }
  }
};

// Setup MIDI when component mounts
onMounted(() => {
  if (props.midiEnabled && typeof navigator.requestMIDIAccess === "function") {
    navigator.requestMIDIAccess().then(
      (midiAccess) => {
        const inputs = midiAccess.inputs.values();
        for (
          let input = inputs.next();
          input && !input.done;
          input = inputs.next()
        ) {
          input.value.onmidimessage = handleMidiMessage;
        }
      },
      (error) => {
        console.error("MIDI access failed:", error);
      },
    );
  }
});

onUnmounted(() => {
  // Cleanup MIDI listeners when component unmounts
  if (props.midiEnabled && typeof navigator.requestMIDIAccess === "function") {
    navigator.requestMIDIAccess().then((midiAccess) => {
      const inputs = midiAccess.inputs.values();
      for (
        let input = inputs.next();
        input && !input.done;
        input = inputs.next()
      ) {
        input.value.onmidimessage = null;
      }
    });
  }
});

const getSegmentStyle = (segmentIndex, circleIndex) => {
  const segmentCount = props.segmentCounts[circleIndex] || 8;
  const angle = segmentIndex * (360 / segmentCount) * (Math.PI / 180);
  const radius = props.size * (0.3 + circleIndex * 0.2); // 30%, 50%, 70% of size

  const x = Math.cos(angle) * radius + props.size / 2;
  const y = Math.sin(angle) * radius + props.size / 2;

  const segmentSize = props.size * 0.12;

  const isSelected = selectedSegments.value[circleIndex] === segmentIndex;
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
  const radius = props.size * (0.3 + circleIndex * 0.2); // 30%, 50%, 70% of size

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
        v-for="segmentIndex in props.segmentCounts[circleIndex] || 8"
        :key="`${circleIndex}-${segmentIndex}`"
        class="radial-segment"
        :style="getSegmentStyle(segmentIndex - 1, circleIndex)"
      >
        <div class="segment-label">
          {{ segmentIndex }}
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
