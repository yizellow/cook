<template>
  <section class="page menu-page">
    <div class="content-container">
      <div class="title-section">
        <div  class="title">
          <!-- <img class="logo" src="../assets/hat-color.png"></img> -->
          <img class="logo" src="../assets/caps-logo.png"></img>
          <h1>Menü</h1>
        </div>
      </div>

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
          text="Weiter"
          type="secondary"
          icon="/assets/arrow-icon.svg"
          icon-position="left"
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

// Auto-select first items on each layer if nothing is selected
const initializeSelections = () => {
  if (!selectedSnack.value && menuConfig.snacks.length > 0) {
    selectSnack(menuConfig.snacks[0]);
  }
  
  if (!selectedChef.value && menuConfig.chefs.length > 0) {
    selectChef(menuConfig.chefs[0]);
  }
  
  if (!selectedMenuItem.value && availableMenuItems.value.length > 0) {
    selectMenuItem(availableMenuItems.value[0]);
  }
};

const syncRadialSegments = () => {
  const snackIndex = menuConfig.snacks.findIndex(
    (snack) => snack.id === selectedSnack.value?.id,
  );
  const chefIndex = menuConfig.chefs.findIndex(
    (chef) => chef.id === selectedChef.value?.id,
  );
  const menuIndex = availableMenuItems.value.findIndex(
    (item) => item.id === selectedMenuItem.value?.id || 0,
  );

  radialSegments.value = [
    snackIndex >= 0 ? snackIndex : 0,
    chefIndex >= 0 ? chefIndex : 0,
    menuIndex >= 0 ? menuIndex : 0,
  ];
};

syncRadialSegments();
initializeSelections();

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

<style scoped lang="scss">
@use "../styles/menuPage.scss";

.form-section {
  flex-grow: 1;
  max-width: 400px;
  height: 100%;
}
</style>
