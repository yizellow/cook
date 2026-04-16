<script setup>
import { ref, onMounted } from "vue";
import ActionButton from "../components/ActionButton.vue";

// Extract order code from URL hash (format: #/thank-you/ORDERCODE)
const currentHash = window.location.hash;
const pathParts = currentHash.split("/");
const orderCode = pathParts.length > 2 ? pathParts.pop() : "unknown";

const countdown = ref(5);

onMounted(() => {
  // Start countdown timer
  const timer = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      clearInterval(timer);
      // Redirect to menu wheel after countdown
      window.location.hash = "#/menu-wheel";
    }
  }, 1000);
});

const goToMenu = () => {
  window.location.hash = "#/menu-wheel";
};
</script>

<template>
  <section class="page thank-you-page">
    <div class="content-container">
      <div class="thank-you-content">
        <div class="logo-container">
          <img
            class="logo"
            src="../assets/caps-kitchen-complete.png"
            alt="Caps Kitchen Logo"
          />
        </div>

        <h1>Vielen Dank für deine Bestellung!</h1>
        <p>Thank you for your order!</p>

        <div class="order-info">
          <p>Deine Bestellnummer:</p>
          <div class="order-code">#{{ orderCode }}</div>
        </div>

        <div class="countdown">
          <p>Weiterleitung in {{ countdown }} Sekunden...</p>
        </div>

        <div class="nav-buttons">
          <ActionButton
            text="Zurück zum Menü"
            type="secondary"
            @click="goToMenu"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.thank-you-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-background);
}

.content-container {
  max-width: 800px;
  width: 100%;
  padding: 2rem;
  text-align: center;
}

.thank-you-content {
  background-color: white;
  padding: 3rem;
}

.logo-container {
}

.logo {
  height: 20rem;
  width: auto;
}

h1 {
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 0.25rem;
  font-weight: 700;
}

p {
  margin: 0;
}

h2 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 2rem;
  font-weight: 400;
}

.order-info {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--color-blue-highlight);
  border-radius: 8px;
  border: 3px dashed var(--color-outline);
}

.order-info p:first-child {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin: 0.5rem;
  font-weight: 800;
}

.order-code {
  font-size: 2rem;
  font-weight: 700;
  background: var(--color-blue);
  border: 3px solid var(--color-outline);
  letter-spacing: 0.1em;
  width: 7rem;
  display: inline-block;
  border-radius: 8px;
}

.countdown {
  margin: 2rem 0;
  font-size: 1rem;
  color: var(--color-text-secondary);
}

.nav-buttons {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .thank-you-content {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  .order-code {
    font-size: 1.5rem;
  }
}
</style>
