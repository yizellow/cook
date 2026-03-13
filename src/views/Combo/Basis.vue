<script setup>
import { ref } from "vue";

const selectedBasis = ref("");

const basisOptions = ["Drawing", "Website", "Animation", "Poster", "Zine"];

const selectBasis = (option) => {
  selectedBasis.value = option;
};

const goBack = () => {
  window.location.hash = "#/menu";
};

const goNext = () => {
  if (!selectedBasis.value) {
    alert("Please choose a basis. / Bitte wählen Sie eine Basis.");
    return;
  }

  localStorage.setItem("combo_basis", selectedBasis.value);
  window.location.hash = "#/combo/topping";
};
</script>

<template>
  <section class="page">
    <div class="art-card basis-page">
      <h1 class="title">1. Choose your Basis</h1>
      <p class="subtitle">1. Wählen Sie Ihre Basis</p>

      <div class="basis-list">
        <button
          v-for="option in basisOptions"
          :key="option"
          class="basis-btn"
          :class="{ active: selectedBasis === option }"
          @click="selectBasis(option)"
        >
          {{ option }}
        </button>
      </div>

      <div class="nav-buttons">
        <button class="back-btn" @click="goBack">Back / Zurück</button>
        <button class="next-btn" @click="goNext">Next / Weiter</button>
      </div>
    </div>
  </section>
</template>
