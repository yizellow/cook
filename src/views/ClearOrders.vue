<script setup>
import { ref } from "vue";

const isClearing = ref(false);
const statusMessage = ref("");

const clearAllOrders = async () => {
  if (isClearing.value) return;

  const confirmed = confirm(
    "Are you sure you want to delete all orders? / Bist du sicher, dass alle Bestellungen gelöscht werden sollen?",
  );

  if (!confirmed) return;

  isClearing.value = true;
  statusMessage.value = "Clearing orders... / Bestellungen werden gelöscht...";

  try {
    const res = await fetch("/.netlify/functions/clear-orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = res.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      throw new Error(
        data?.error || data || "Failed to clear orders. Unexpected response.",
      );
    }

    statusMessage.value =
      data?.message || "All orders were cleared successfully.";
  } catch (error) {
    const errorText = error?.message || String(error);
    statusMessage.value = `Failed to clear orders: ${errorText}`;
    console.error("Clear orders failed:", error);
  } finally {
    isClearing.value = false;
  }
};

const goHome = () => {
  window.location.hash = "#/orders";
};
</script>

<template>
  <section class="page">
    <div class="art-card orders-page">
      <div class="titles">
        <h1 class="title">Clear Orders</h1>
        <p class="subtitle">Only the Clear All button page</p>
      </div>

      <div class="content">
        <button
          class="back-btn clear-btn"
          @click="clearAllOrders"
          :disabled="isClearing"
        >
          {{ isClearing ? "Clearing..." : "Clear All / Alles löschen" }}
        </button>
      </div>

      <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>

      <div class="nav-buttons">
        <button class="back-btn" @click="goHome">Back / Zurück</button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.page {
  display: flex;
  align-items: center;
  justify-content: center;
}

.orders-page {
  max-width: 600px;
  padding: 3rem 1rem;
  text-align: center;
}

.titles {
  margin-bottom: 2rem;
}

.title {
  margin-bottom: 0.5rem;
}

.content {
  margin-bottom: 2rem;
}

.back-btn,
.clear-btn {
  padding: 14px 24px;
  background-color: #ff6666;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.back-btn:hover,
.clear-btn:hover {
  background-color: #dd0000;
}

.nav-buttons {
  display: flex;
  justify-content: center;
}

.nav-buttons .back-btn {
  width: 200px;
}

.status-message {
  margin: 1rem 0;
  color: #333;
  font-size: 0.95rem;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
