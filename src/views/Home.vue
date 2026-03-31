<script setup>
import { ref } from "vue";
import RadialInterface from "../components/RadialInterface.vue";

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

const goOrders = () => {
  window.location.hash = "#/orders";
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
      <button class="orders-btn" @click="goOrders">
        View Orders / Bestellungen anzeigen
      </button>
    </div>

    <!-- Radial Interface Component -->
    <div class="radial-container">
      <RadialInterface
        :segmentCounts="[2, 6, 3]"
        :size="250"
        :midiEnabled="true"
        :midiChannels="[0, 0, 0]"
        :midiControlNumbers="[70, 71, 72]"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.orders-btn {
  display: block;
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #444;
  }
}

.radial-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
