<template>
  <section class="page menu-wheel-page">
    <div class="wheel-container">
      <h1 class="title">Choose Your Order</h1>
      <p class="subtitle">Select from the three layers</p>

      <div class="main-content">
        <!-- Left: Wheel Selector -->
        <div class="wheel-section">
          <WheelSelector
            :selectedSnack="selectedSnack"
            :selectedChef="selectedChef"
            :selectedMenuItem="selectedMenuItem"
            :availableMenuItems="availableMenuItems"
            @select-snack="selectSnack"
            @select-chef="selectChef"
            @select-menu-item="selectMenuItem"
          />
        </div>

        <!-- Right: Dynamic Form -->
        <div class="form-section">
          <SelectionSummary
            :selectedSnack="selectedSnack"
            :selectedChef="selectedChef"
            :selectedMenuItem="selectedMenuItem"
          />
          <DynamicForm
            :parameters="currentParameters"
            :values="parameterValues"
            @update:parameter="updateParameter"
          />
        </div>
      </div>

      <div class="nav-buttons">
        <button class="back-btn" @click="goBack">Back / Zurück</button>
        <button class="next-btn" @click="goNext">Next / Weiter</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import WheelSelector from '../components/WheelSelector.vue';
import DynamicForm from '../components/DynamicForm.vue';
import SelectionSummary from '../components/SelectionSummary.vue';
import { useMenuSelection } from '../composables/useMenuSelection.js';

const {
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
} = useMenuSelection();

const goBack = () => {
  window.location.hash = "#/menu";
};

const goNext = () => {
  if (!selectedChef.value || !selectedMenuItem.value) {
    alert("Please select a chef/media and menu item. / Bitte wählen Sie einen Koch/Media und Menüelement.");
    return;
  }

  window.location.hash = "#/receipt";
};
</script>

<style scoped>
.menu-wheel-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.wheel-container {
  max-width: 1200px;
  width: 100%;
}

.title {
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.subtitle {
  text-align: center;
  margin-bottom: 2rem;
  color: #666;
}

.main-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  justify-content: center;
}

.wheel-section {
  flex: 1;
  display: flex;
  justify-content: center;
}

.form-section {
  flex: 1;
  max-width: 400px;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.back-btn,
.next-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.back-btn {
  background: #6c757d;
  color: white;
}

.back-btn:hover {
  background: #5a6268;
}

.next-btn {
  background: #007bff;
  color: white;
}

.next-btn:hover {
  background: #0056b3;
}
</style>