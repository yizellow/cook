<template>
  <div class="dynamic-form">
    <ParameterField
      v-for="(param, index) in parameters"
      :key="param.id"
      :parameter="param"
      :value="values[param.id]"
      :index="index + 1"
      @update:value="updateParameter(param.id, $event)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import ParameterField from "./ParameterField.vue";
import {
  setupMidiListener,
  parseMidiControlChange,
  mapMidiToRange,
  mapMidiToPercentage,
  mapMidiToSpectrum,
  mapMidiToBoolean,
  mapMidiToChoice,
} from "../utils/midiUtils";

const props = defineProps({
  parameters: Array,
  values: Object,
  randomInterval: {
    type: Number,
    default: 100, // Same as RadialInterface
  },
});
const emit = defineEmits(["update:parameter"]);

const updateParameter = (paramId, value) => {
  emit("update:parameter", paramId, value);
};

// MIDI Configuration
const midiEnabled = true;
const midiDebug = false; // Set to true to enable debug logs
const midiMappings = ref([]);

// Random Generator Configuration
const randomGeneratorActive = ref(false);
const randomIntervalId = ref(null);

// Create MIDI mappings based on parameters
const updateMidiMappings = () => {
  midiMappings.value = props.parameters
    .map((param, index) => {
      if (index >= 4) return null; // Limit to 4 parameters

      switch (param.type) {
        case "percentage":
          return {
            channel: 0,
            cc: 74 + index, // CC 74, 75, 76, 77
            paramId: param.id,
            mapper: mapMidiToPercentage,
          };
        case "range":
          return {
            channel: 0,
            cc: 74 + index,
            paramId: param.id,
            mapper: mapMidiToRange,
            min: param.min || 0,
            max: param.max || 100,
            step: param.step || 1,
          };
        case "spectrum":
          return {
            channel: 0,
            cc: 74 + index,
            paramId: param.id,
            mapper: mapMidiToSpectrum, // Spectrum uses percentage mapping
          };
        case "boolean":
          return {
            channel: 0,
            cc: 74 + index,
            paramId: param.id,
            mapper: mapMidiToBoolean,
          };
        case "single-choice":
          return {
            channel: 0,
            cc: 74 + index,
            paramId: param.id,
            mapper: mapMidiToChoice,
            options: param.options,
          };
        default:
          return null; // No MIDI mapping for text
      }
    })
    .filter((mapping) => mapping !== null);
};

// Update mappings when parameters change
watch(() => props.parameters, updateMidiMappings, {
  immediate: true,
  deep: true,
});

// Debug: Log MIDI mappings
watch(
  midiMappings,
  (newMappings) => {
    if (midiDebug) {
      console.log("MIDI Mappings updated:", newMappings);
    }
  },
  { deep: true },
);

// MIDI Handler
const handleMidiUpdate = (event) => {
  const midiData = parseMidiControlChange(event);
  if (!midiData) {
    if (midiDebug) {
      console.log("Not a control change message");
    }
    return;
  }

  // console.log("Parsed MIDI data:", midiData); // Log parsed MIDI data

  // Find matching mapping
  const mapping = midiMappings.value.find(
    (m) => m.channel === midiData.channel && m.cc === midiData.controlNumber,
  );

  if (mapping) {
    const mapper = mapping.mapper || mapMidiToRange;
    let value;
    if (mapper === mapMidiToRange) {
      value = mapper(midiData.value, mapping.min, mapping.max, mapping.step);
    } else if (mapping.options) {
      // For single-choice with options
      value = mapper(midiData.value, mapping.options);
    } else {
      value = mapper(midiData.value, mapping.min, mapping.max);
    }
    updateParameter(mapping.paramId, value);
    if (midiDebug) {
      console.log(
        `MIDI update: ${mapping.paramId} = ${value} (CC${mapping.cc}, Ch${mapping.channel + 1})`,
      );
    }
  } else {
    if (midiDebug) {
      console.log(
        "No mapping found for CC",
        midiData.controlNumber,
        "on channel",
        midiData.channel,
      );
    }
  }
};

// Setup MIDI
let cleanupMidi = null;
onMounted(() => {
  if (midiDebug) {
    console.log("DynamicForm mounted, setting up MIDI...");
  }
  if (midiEnabled && typeof navigator.requestMIDIAccess === "function") {
    if (midiDebug) {
      console.log("Web MIDI API available, setting up listener");
    }
    cleanupMidi = setupMidiListener(handleMidiUpdate);
  } else {
    if (midiDebug) {
      console.log("Web MIDI API not available or MIDI disabled");
    }
  }
  
  // Setup keyboard listeners for random generator
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  if (midiDebug) {
    console.log("DynamicForm unmounted, cleaning up MIDI...");
  }
  if (cleanupMidi) {
    cleanupMidi();
    if (midiDebug) {
      console.log("MIDI cleanup completed");
    }
  }
  
  // Cleanup random generator
  stopRandomGenerator();
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});

// Random Generator Keyboard Handlers
const handleKeyDown = (event) => {
  if (event.key === 'r' || event.key === 'R') {
    startRandomGenerator();
  }
};

const handleKeyUp = (event) => {
  if (event.key === 'r' || event.key === 'R') {
    stopRandomGenerator();
  }
};

const startRandomGenerator = () => {
  if (randomGeneratorActive.value) return;

  randomGeneratorActive.value = true;
  randomIntervalId.value = setInterval(generateRandomValues, props.randomInterval);
};

const stopRandomGenerator = () => {
  if (!randomGeneratorActive.value) return;

  randomGeneratorActive.value = false;
  if (randomIntervalId.value) {
    clearInterval(randomIntervalId.value);
    randomIntervalId.value = null;
  }
};

const generateRandomValues = () => {
  props.parameters.forEach(param => {
    let newValue;
    
    switch (param.type) {
      case 'percentage':
        newValue = Math.floor(Math.random() * 101); // 0-100
        break;
      case 'range':
        const range = param.max - param.min;
        const randomValue = Math.floor(Math.random() * (range + 1));
        // Apply step increment if specified
        if (param.step && param.step > 1) {
          newValue = param.min + Math.round(randomValue / param.step) * param.step;
        } else {
          newValue = param.min + randomValue;
        }
        break;
      case 'spectrum':
        newValue = Math.floor(Math.random() * 101); // 0-100 like percentage
        break;
      case 'boolean':
        newValue = Math.random() > 0.5; // true/false
        break;
      case 'single-choice':
        if (param.options && param.options.length > 0) {
          const randomIndex = Math.floor(Math.random() * param.options.length);
          newValue = param.options[randomIndex];
        }
        break;
      case 'text':
        // Skip text fields as requested
        return;
      default:
        return;
    }
    
    // Only update if we have a valid new value
    if (newValue !== undefined) {
      updateParameter(param.id, newValue);
    }
  });
};
</script>

<style scoped>
.dynamic-form {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.dynamic-form h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #333;
}
</style>
