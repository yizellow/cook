<template>
  <div class="dynamic-form">
    <h3>Parameters</h3>
    <ParameterField
      v-for="param in parameters"
      :key="param.id"
      :parameter="param"
      :value="values[param.id]"
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

const props = defineProps(["parameters", "values"]);
const emit = defineEmits(["update:parameter"]);

const updateParameter = (paramId, value) => {
  emit("update:parameter", paramId, value);
};

// MIDI Configuration
const midiEnabled = true;
const midiDebug = false; // Set to true to enable debug logs
const midiMappings = ref([]);

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
});
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
