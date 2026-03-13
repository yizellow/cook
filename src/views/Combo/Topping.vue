<script setup>
import { ref } from "vue";

const selectedTopping = ref("");

const toppingOptions = ["scribbles", "sparkles", "gradients", "glitches"];

const selectTopping = (option) => {
  selectedTopping.value = option;
};

const goBack = () => {
  window.location.hash = "#/combo";
};

const goNext = () => {
  if (!selectedTopping.value) {
    alert("Please choose a topping. / Bitte wählen Sie ein Topping.");
    return;
  }

  localStorage.setItem("combo_topping", selectedTopping.value);
  window.location.hash = "#/combo/sauce";
};
</script>

<template>
  <section class="page">
    <div class="art-card basis-page">
      <h1 class="title">3. Toppings</h1>
      <p class="subtitle">3. Toppings</p>

      <div class="basis-list">
        <button
          v-for="option in toppingOptions"
          :key="option"
          class="basis-btn"
          :class="{ active: selectedTopping === option }"
          @click="selectTopping(option)"
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
