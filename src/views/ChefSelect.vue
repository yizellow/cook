<script setup>
import { ref } from "vue";
import { chefs } from "../menuConfig.js";

const selectedChef = ref(null);

const selectChef = (chef) => {
  selectedChef.value = chef;
};

const goBack = () => {
  window.location.hash = "#/";
};

const goNext = () => {
  if (!selectedChef.value) {
    alert("Please select a chef. / Bitte wählen Sie einen Koch.");
    return;
  }

  localStorage.setItem("selectedChef", JSON.stringify(selectedChef.value));
  window.location.hash = "#/chef-detail";
};
</script>

<template>
  <section class="page">
    <div class="art-card">
      <h1 class="title">Choose your Chef</h1>
      <p class="subtitle">Wählen Sie Ihren Koch</p>

      <div class="chef-list">
        <button
          v-for="chef in chefs"
          :key="chef.id"
          class="chef-btn"
          :class="{ active: selectedChef?.id === chef.id }"
          @click="selectChef(chef)"
        >
          <h3>{{ chef.title }}</h3>
        </button>
      </div>

      <div class="nav-buttons">
        <button class="back-btn" @click="goBack">Back / Zurück</button>
        <button class="next-btn" @click="goNext">Next / Weiter</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chef-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

.chef-btn {
  padding: 1rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
}

.chef-btn:hover {
  border-color: #007bff;
}

.chef-btn.active {
  border-color: #007bff;
  background: #f8f9fa;
}

.chef-btn h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.chef-btn p {
  margin: 0;
  color: #666;
}
</style>
