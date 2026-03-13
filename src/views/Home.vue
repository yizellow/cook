<script setup>
import { ref } from "vue";

const name = ref("");
const email = ref("");

const goNext = () => {
  if (!name.value.trim()) {
    alert("Please enter your name. / Bitte geben Sie Ihren Namen ein.");
    return;
  }

  localStorage.setItem("art_name", name.value);
  localStorage.setItem("art_email", email.value);

  window.location.hash = "#/menu";
};
</script>

<template>
  <section class="page">
    <div class="art-card">
      <h1 class="title">Artwork Menu / Kunstwerk-Menü</h1>
      <p class="subtitle">
        Please enter your details. / Bitte geben Sie Ihre Daten ein.
      </p>

      <div class="form-group">
        <label for="name">Name / Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="Enter your name / Geben Sie Ihren Namen ein"
        />
      </div>

      <div class="form-group">
        <label for="email">Email (optional) / E-Mail (optional)</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email / Geben Sie Ihre E-Mail ein"
        />
      </div>

      <button class="main-btn" @click="goNext">Next / Weiter</button>
    </div>
  </section>
</template>
