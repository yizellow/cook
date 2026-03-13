<script setup>
const name = localStorage.getItem("art_name") || "";

const goSnack = () => {
  window.location.hash = "#/snack";
};

const goCombo = () => {
  window.location.hash = "#/combo";
};

const goBack = () => {
  window.location.hash = "#/";
};
</script>

<template>
  <section class="page">
    <div class="art-card">
      <h1 class="title">What would you like to order?</h1>
      <p class="subtitle">Was möchten Sie bestellen?</p>

      <p class="user-name">Hello, {{ name }}.</p>

      <div class="menu-buttons">
        <button class="menu-btn snack" @click="goSnack">
          Snack
          <span>(10 min production time)</span>
        </button>

        <button class="menu-btn combo" @click="goCombo">
          Combo Menu
          <span>(20–30 min production time)</span>
        </button>
      </div>

      <button class="back-btn" @click="goBack">Back / Zurück</button>
    </div>
  </section>
</template>
