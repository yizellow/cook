<script setup>
const goBack = () => {
  window.location.hash = "#/menu";
};
</script>

<template>
  <section class="page">
    <div class="art-card">
      <h1 class="title">Snack</h1>
      <p class="subtitle">10 min production time</p>

      <p>Snack page content here.</p>
      <p>Hier kommt der Inhalt der Snack-Seite.</p>

      <div class="nav-buttons">
        <button class="back-btn" @click="goBack">Back / Zurück</button>
      </div>
    </div>
  </section>
</template>
