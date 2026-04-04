// src/utils/parameterTypes.js
// Parameter type constants and utilities
export const PARAMETER_TYPES = {
  PERCENTAGE: 'percentage',
  RANGE: 'range',
  SPECTRUM: 'spectrum',
  BOOLEAN: 'boolean',
  SINGLE_CHOICE: 'single-choice',
  MULTI_CHOICE: 'multi-choice',
  TEXT: 'text'
};

// Utility function to get default value for a parameter
export function getDefaultValue(parameter) {
  return parameter.default;
}

// Utility function to validate parameter value
export function validateParameterValue(parameter, value) {
  switch (parameter.type) {
    case PARAMETER_TYPES.PERCENTAGE:
    case PARAMETER_TYPES.RANGE:
      return typeof value === 'number' && value >= parameter.min && value <= parameter.max;
    case PARAMETER_TYPES.SPECTRUM:
      return typeof value === 'number' && value >= parameter.min && value <= parameter.max;
    case PARAMETER_TYPES.BOOLEAN:
      return typeof value === 'boolean';
    case PARAMETER_TYPES.SINGLE_CHOICE:
      return parameter.options.includes(value);
    case PARAMETER_TYPES.TEXT:
      return typeof value === 'string';
    default:
      return true;
  }
}