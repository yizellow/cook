<template>
  <section class="page menu-wheel-page">
    <div class="wheel-container">
      <div class="title-section"></div>
      <h1 class="title">Choose Your Order</h1>
      <p class="subtitle">Select from the three layers</p>

      <div class="main-content">
        <!-- Left: Wheel Selector -->
        <RadialInterface
          :layers="[menuConfig.snacks, menuConfig.chefs, availableMenuItems]"
          :selectedSegments="radialSegments"
          @update:selectedSegments="onRadialSelectedSegmentsChange"
          :size="480"
        />

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
        <ActionButton
          text="Next"
          type="secondary"
          shortcutKey="ArrowRight"
          @click="goNext"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import RadialInterface from "../components/RadialInterface.vue";
import DynamicForm from "../components/DynamicForm.vue";
import SelectionSummary from "../components/SelectionSummary.vue";
import ActionButton from "../components/ActionButton.vue";
import { useMenuSelection } from "../composables/useMenuSelection.js";
import { menuConfig } from "../config/menuConfig.js";

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
  updateParameter,
} = useMenuSelection();

const radialSegments = ref([0, 0, 0]);

const syncRadialSegments = () => {
  const snackIndex = menuConfig.snacks.findIndex(
    (snack) => snack.id === selectedSnack.value?.id,
  );
  const chefIndex = menuConfig.chefs.findIndex(
    (chef) => chef.id === selectedChef.value?.id,
  );
  const menuIndex = availableMenuItems.value.findIndex(
    (item) => item.id === selectedMenuItem.value?.id,
  );

  radialSegments.value = [
    snackIndex >= 0 ? snackIndex : 0,
    chefIndex >= 0 ? chefIndex : 0,
    menuIndex >= 0 ? menuIndex : 0,
  ];
};

syncRadialSegments();

watch(
  [selectedSnack, selectedChef, selectedMenuItem, availableMenuItems],
  syncRadialSegments,
  { deep: true },
);

const onRadialSelectedSegmentsChange = (segments) => {
  if (!Array.isArray(segments)) return;

  const [snackIndex, chefIndex, menuIndex] = segments;
  const snack = menuConfig.snacks[snackIndex] || menuConfig.snacks[0];
  const chef = menuConfig.chefs[chefIndex] || menuConfig.chefs[0];

  if (snack && snack.id !== selectedSnack.value?.id) {
    selectSnack(snack);
  }

  if (chef && chef.id !== selectedChef.value?.id) {
    selectChef(chef);
  }

  const items = chef?.menuItems || [];
  const menuItem = items[menuIndex] || items[0];
  if (menuItem && menuItem.id !== selectedMenuItem.value?.id) {
    selectMenuItem(menuItem);
  }
};

const goNext = () => {
  if (!selectedChef.value || !selectedMenuItem.value) {
    alert(
      "Please select a chef/media and menu item. / Bitte wählen Sie einen Koch/Media und Menüelement.",
    );
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
  height: 100%;
  max-height: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;

  .wheel-section {
    flex: 1;
    display: flex;
    justify-content: center;
    height: 100%;
  }

  .form-section {
    flex: 1;
    max-width: 400px;
    height: 100%;
  }
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
