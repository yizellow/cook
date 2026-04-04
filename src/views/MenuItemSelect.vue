<script setup>
import { ref, computed } from "vue";
import { menuConfig } from "../menuConfig.js";

const selectedChef = ref(
  JSON.parse(localStorage.getItem("selectedChef") || "null"),
);
const selectedMenuItem = ref(null);

const menuItems = computed(() => {
  return selectedChef.value?.menuItems || [];
});

const selectMenuItem = (item) => {
  selectedMenuItem.value = item;
};

const goBack = () => {
  window.location.hash = "#/menu";
};

const goNext = () => {
  if (!selectedMenuItem.value) {
    alert("Please select a menu item. / Bitte wählen Sie ein Menüelement.");
    return;
  }

  localStorage.setItem(
    "selectedMenuItem",
    JSON.stringify(selectedMenuItem.value),
  );
  window.location.hash = "#/dynamic-form";
};
</script>

<template>
  <section class="page">
    <div class="art-card">
      <h1 class="title">{{ selectedChef.name }} - {{ selectedChef.media }}</h1>
      <p class="subtitle">Choose your menu item / Wählen Sie Ihr Menüelement</p>

      <div class="menu-item-list">
        <div
          v-for="item in menuItems"
          :key="item.id"
          class="menu-item-card"
          :class="{ active: selectedMenuItem?.id === item.id }"
          @click="selectMenuItem(item)"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>

      <div class="nav-buttons">
        <button class="back-btn" @click="goBack">Back / Zurück</button>
        <button class="next-btn" @click="goNext">Next / Weiter</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.menu-item-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

.menu-item-card {
  padding: 1rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

.menu-item-card:hover {
  border-color: #007bff;
}

.menu-item-card.active {
  border-color: #007bff;
  background: #f8f9fa;
}

.menu-item-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.menu-item-card p {
  margin: 0;
  color: #666;
}
</style>
