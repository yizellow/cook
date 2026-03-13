<script setup>
const name = localStorage.getItem("art_name") || "Not provided";
const email = localStorage.getItem("art_email") || "Not provided";

const basis = localStorage.getItem("combo_basis") || "Not selected";
const ingredients =
  localStorage.getItem("combo_ingredients") || "Not selected yet";
const topping = localStorage.getItem("combo_topping") || "Not selected";

const calmSpicy = Number(localStorage.getItem("sauce_calm_spicy") || 50);
const monochromeColorful = Number(
  localStorage.getItem("sauce_monochrome_colorful") || 50,
);
const sweetSalty = Number(localStorage.getItem("sauce_sweet_salty") || 50);

const goBack = () => {
  window.location.hash = "#/combo/sauce";
};

const goHome = () => {
  window.location.hash = "#/";
};
</script>

<template>
  <section class="page">
    <div class="art-card receipt-page">
      <h1 class="title">Receipt</h1>
      <p class="subtitle">Zusammenfassung / Summary</p>

      <div class="receipt-section">
        <h2>User Info</h2>
        <p><strong>Name:</strong> {{ name }}</p>
        <p><strong>Email:</strong> {{ email }}</p>
      </div>

      <div class="receipt-section">
        <h2>Order</h2>
        <p><strong>Basis:</strong> {{ basis }}</p>
        <p><strong>Ingredients:</strong> {{ ingredients }}</p>
        <p><strong>Topping:</strong> {{ topping }}</p>
      </div>

      <div class="receipt-section">
        <h2>Secret Sauce</h2>
        <p><strong>Calm → Spicy:</strong> {{ calmSpicy }}%</p>
        <p><strong>Monochrome → Colorful:</strong> {{ monochromeColorful }}%</p>
        <p><strong>Sweet → Salty:</strong> {{ sweetSalty }}%</p>
      </div>

      <div class="nav-buttons">
        <button class="back-btn" @click="goBack">Back / Zurück</button>
        <button class="next-btn" @click="goHome">Home / Start</button>
      </div>
    </div>
  </section>
</template>
