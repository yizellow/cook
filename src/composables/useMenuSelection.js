// src/composables/useMenuSelection.js
import { ref, computed, watch } from 'vue';
import { menuConfig } from '../config/menuConfig.js';

export function useMenuSelection() {
  // State definitions
  const selectedSnack = ref(JSON.parse(localStorage.getItem('selectedSnack') || 'null'));
  const selectedChef = ref(JSON.parse(localStorage.getItem('selectedChef') || 'null'));
  const selectedMenuItem = ref(JSON.parse(localStorage.getItem('selectedMenuItem') || 'null'));
  const parameterValues = ref(JSON.parse(localStorage.getItem('parameterValues') || '{}'));

  // Computed properties
  const availableMenuItems = computed(() => {
    return selectedChef.value?.menuItems || [];
  });

  const currentParameters = computed(() => {
    return selectedMenuItem.value?.parameters || [];
  });

  // State flow logic
  const selectSnack = (snack) => {
    selectedSnack.value = snack;
    // Does not reset other states, does not affect right panel
  };

  const selectChef = (chef) => {
    selectedChef.value = chef;
    // Reset menuItem if it doesn't exist in new chef
    if (!availableMenuItems.value.find(item => item.id === selectedMenuItem.value?.id)) {
      selectedMenuItem.value = null;
      parameterValues.value = {};
    }
  };

  const selectMenuItem = (menuItem) => {
    selectedMenuItem.value = menuItem;
    // Initialize parameter values
    const newValues = {};
    menuItem.parameters.forEach(param => {
      newValues[param.id] = parameterValues.value[param.id] ?? param.default;
    });
    parameterValues.value = newValues;
  };

  const updateParameter = (paramId, value) => {
    parameterValues.value = { ...parameterValues.value, [paramId]: value };
  };

  // Persist to localStorage
  watch([selectedSnack, selectedChef, selectedMenuItem, parameterValues], () => {
    localStorage.setItem('selectedSnack', JSON.stringify(selectedSnack.value));
    localStorage.setItem('selectedChef', JSON.stringify(selectedChef.value));
    localStorage.setItem('selectedMenuItem', JSON.stringify(selectedMenuItem.value));
    localStorage.setItem('parameterValues', JSON.stringify(parameterValues.value));
  }, { deep: true });

  return {
    selectedSnack,
    selectedChef,
    selectedMenuItem,
    parameterValues,
    availableMenuItems,
    currentParameters,
    selectSnack,
    selectChef,
    selectMenuItem,
    updateParameter
  };
}