/**
 * MIDI Utility Functions
 * Provides reusable MIDI functionality for components
 */

/**
 * Map MIDI value (0-127) to a target range
 * @param {number} midiValue - MIDI value (0-127)
 * @param {number} min - Target minimum value
 * @param {number} max - Target maximum value
 * @returns {number} Mapped value in target range
 */
export function mapMidiToRange(midiValue, min, max, step) {
  const value = min + (midiValue / 127) * (max - min);
  const roundingValue = 1 / step;
  return Math.round(value * roundingValue) / roundingValue;
}

/**
 * Map MIDI value to angle (0 to 2π radians)
 * @param {number} midiValue - MIDI value (0-127)
 * @returns {number} Angle in radians
 */
export function mapMidiToAngle(midiValue) {
  return mapMidiToRange(midiValue, 0, Math.PI * 2, 0.01);
}

/**
 * Map MIDI value to percentage (0-100)
 * @param {number} midiValue - MIDI value (0-127)
 * @returns {number} Percentage value (0-100)
 */
export function mapMidiToPercentage(midiValue) {
  return mapMidiToRange(midiValue, 0, 100, 1);
}

export function mapMidiToSpectrum(midiValue) {
  return mapMidiToRange(midiValue, -50, 50, 1);
}

/**
 * Map MIDI value to a boolean (with threshold)
 * @param {number} midiValue - MIDI value (0-127)
 * @param {number} threshold - Threshold for true (default: 64)
 * @returns {boolean} Boolean value
 */
export function mapMidiToBoolean(midiValue, threshold = 64) {
  return midiValue >= threshold;
}

/**
 * Map MIDI value to a choice index for single-choice buttons
 * @param {number} midiValue - MIDI value (0-127)
 * @param {Array} options - Array of available options
 * @returns {*} The selected option value
 */
export function mapMidiToChoice(midiValue, options = []) {
  if (!options || options.length === 0) {
    return 0;
  }

  const numOptions = options.length;
  const segmentSize = Math.floor(128 / numOptions);
  const selectedIndex = Math.min(
    Math.floor(midiValue / segmentSize),
    numOptions - 1,
  );

  // Debug log (can be controlled by caller)
  // if (typeof console !== 'undefined' && console.log) {
  //   console.log(`MIDI choice mapping: value ${midiValue} → index ${selectedIndex} → option ${options[selectedIndex]}`);
  // }

  return options[selectedIndex];
}

/**
 * Setup MIDI input listener
 * @param {function} callback - Function to call with MIDI messages
 * @returns {function} Cleanup function to remove listeners
 */
export function setupMidiListener(callback) {
  if (typeof navigator.requestMIDIAccess !== "function") {
    console.warn("Web MIDI API not supported in this browser");
    return () => {}; // Return no-op cleanup function
  }

  let midiAccess = null;
  const inputs = [];

  navigator.requestMIDIAccess().then(
    (access) => {
      midiAccess = access;

      // Store references to all input devices
      for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = callback;
        inputs.push(input);
      }

      // Handle device changes
      midiAccess.onstatechange = (event) => {
        if (event.port.type === "input") {
          if (event.port.state === "connected") {
            event.port.onmidimessage = callback;
            inputs.push(event.port);
          } else {
            // Remove disconnected device
            const index = inputs.findIndex((i) => i === event.port);
            if (index !== -1) {
              inputs.splice(index, 1);
            }
          }
        }
      };
    },
    (error) => {
      console.error("MIDI access failed:", error);
    },
  );

  // Return cleanup function
  return () => {
    if (midiAccess) {
      for (const input of inputs) {
        input.onmidimessage = null;
      }
      midiAccess = null;
    }
  };
}

/**
 * Parse MIDI control change message
 * @param {object} event - MIDI message event
 * @returns {object|null} Parsed MIDI data or null if not a CC message
 */
export function parseMidiControlChange(event) {
  const [status, data1, data2] = event.data;

  // Check if it's a control change message (0xB0-0xBF)
  if ((status & 0xf0) === 0xb0) {
    return {
      channel: status & 0x0f,
      controlNumber: data1,
      value: data2,
    };
  }

  return null;
}

/**
 * Create a MIDI parameter mapper
 * @param {Array} mappings - Array of mapping objects {channel, cc, field, mapper}
 * @returns {function} Function that handles MIDI messages and returns field updates
 */
export function createParameterMapper(mappings) {
  return (event) => {
    const midiData = parseMidiControlChange(event);
    if (!midiData) return null;

    // Find matching mapping
    const mapping = mappings.find(
      (m) => m.channel === midiData.channel && m.cc === midiData.controlNumber,
    );

    if (mapping) {
      const mapper = mapping.mapper || mapMidiToRange;
      return {
        field: mapping.field,
        value: mapper(midiData.value, mapping.min, mapping.max),
      };
    }

    return null;
  };
}
