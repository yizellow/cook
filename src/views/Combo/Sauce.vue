<script setup>
import { ref } from "vue";

const calmSpicy = ref(50);
const monochromeColorful = ref(50);
const sweetSalty = ref(50);

const goBack = () => {
  window.location.hash = "#/combo/topping";
};

const goNext = () => {
  localStorage.setItem("sauce_calm_spicy", calmSpicy.value);
  localStorage.setItem("sauce_monochrome_colorful", monochromeColorful.value);
  localStorage.setItem("sauce_sweet_salty", sweetSalty.value);

  window.location.hash = "#/receipt";
};
</script>

<template>
  <section class="page">
    <div class="art-card sauce-page">
      <h1 class="title">4. Mix your secret sauce</h1>
      <p class="subtitle">4. Mischen Sie Ihre geheime Sauce</p>

      <div class="slider-group">
        <div class="slider-header">
          <span>calm</span>
          <strong>{{ calmSpicy }}%</strong>
          <span>spicy</span>
        </div>
        <input
          v-model="calmSpicy"
          type="range"
          min="0"
          max="100"
          class="slider"
        />
      </div>

      <div class="slider-group">
        <div class="slider-header">
          <span>monochrome</span>
          <strong>{{ monochromeColorful }}%</strong>
          <span>colorful</span>
        </div>
        <input
          v-model="monochromeColorful"
          type="range"
          min="0"
          max="100"
          class="slider"
        />
      </div>

      <div class="slider-group">
        <div class="slider-header">
          <span>sweet</span>
          <strong>{{ sweetSalty }}%</strong>
          <span>salty</span>
        </div>
        <input
          v-model="sweetSalty"
          type="range"
          min="0"
          max="100"
          class="slider"
        />
      </div>

      <div class="nav-buttons">
        <button class="back-btn" @click="goBack">Back / Zurück</button>
        <button class="next-btn" @click="goNext">Next / Weiter</button>
      </div>
    </div>
  </section>
</template>
