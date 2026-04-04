<script setup>
const name = localStorage.getItem("art_name") || "";

const goChefSelect = () => {
  window.location.hash = "#/menu-wheel";
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
        <button class="menu-btn chef-select" @click="goChefSelect">
          Choose Chef
          <span>(Dynamic menu)</span>
        </button>
      </div>

      <button class="back-btn" @click="goBack">Back / Zurück</button>
    </div>
  </section>
</template>
