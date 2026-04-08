<script setup>
import SimpleWheel from "../components/SimpleWheel.vue";

const name = localStorage.getItem("art_name") || "Not provided";
const email = localStorage.getItem("art_email") || "Not provided";

const selectedSnack = JSON.parse(
  localStorage.getItem("selectedSnack") || "null",
);
const selectedChef = JSON.parse(localStorage.getItem("selectedChef") || "null");
const selectedMenuItem = JSON.parse(
  localStorage.getItem("selectedMenuItem") || "null",
);
const parameterValues = JSON.parse(
  localStorage.getItem("parameterValues") || "{}",
);

const goBack = () => {
  window.location.hash = "#/menu-wheel";
};

const goHome = () => {
  window.location.hash = "#/";
};

const formatParameterValue = (param, value) => {
  if (value === undefined || value === null) return "Not set";

  switch (param.type) {
    case "percentage":
      return `${value}%`;
    case "range":
      return String(value);
    case "spectrum":
      return `${value}%`;
    case "boolean":
      return value ? "Yes" : "No";
    case "single-choice":
      return String(value);
    case "text":
      return value || "Not provided";
    default:
      return String(value);
  }
};

const submitOrder = async () => {
  try {
    if (!name || !email || !selectedChef || !selectedMenuItem) {
      alert("Missing required order data");
      return;
    }

    const parameters = (selectedMenuItem.parameters || []).map((param) => ({
      id: param.id,
      name: param.name,
      type: param.type,
      value: formatParameterValue(param, parameterValues[param.id]),
    }));

    const payload = {
      customer: {
        name,
        email,
      },
      order: {
        snackName: selectedSnack?.name || "",
        chefId: selectedChef?.id || "",
        chefName: selectedChef?.name || "",
        menuItemId: selectedMenuItem?.id || "",
        menuItemName: selectedMenuItem?.name || "",
        parameters,
      },
      createdAt: new Date().toISOString(),
    };

    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Submit failed:", data);
      alert(`Submit failed: ${data.error || "Unknown error"}`);
      return;
    }

    localStorage.removeItem("art_name");
    localStorage.removeItem("art_email");
    localStorage.removeItem("selectedSnack");
    localStorage.removeItem("selectedChef");
    localStorage.removeItem("selectedMenuItem");
    localStorage.removeItem("parameterValues");

    alert(
      "Order submitted successfully! / Bestellung erfolgreich eingereicht!",
    );
    window.location.hash = "#/orders";
  } catch (error) {
    console.error("Submit order error:", error);
    alert("Failed to submit order");
  }
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
        <p><strong>Snack:</strong> {{ selectedSnack?.name || "None" }}</p>
        <p><strong>Chef:</strong> {{ selectedChef?.name || "None" }}</p>
        <p>
          <strong>Menu Item:</strong> {{ selectedMenuItem?.name || "None" }}
        </p>
      </div>

      <div class="receipt-section" v-if="selectedMenuItem">
        <h2>Parameters</h2>
        <div
          v-for="param in selectedMenuItem.parameters"
          :key="param.id"
          class="parameter-item"
        >
          <strong>{{ param.name }}:</strong>
          <span>{{
            formatParameterValue(param, parameterValues[param.id])
          }}</span>
        </div>
      </div>

      <div class="nav-buttons">
        <button class="back-btn" @click="goBack">Back / Zurück</button>
        <button class="submit-btn" @click="submitOrder">
          Submit Order / Bestellung einreichen
        </button>
        <button class="next-btn" @click="goHome">Home / Start</button>
      </div>
    </div>

    <!-- Simple Wheel Component -->
    <div class="wheel-container">
      <SimpleWheel
        :options="['Coffee', 'Tea', 'Water']"
        :size="250"
        :midiEnabled="true"
        :midiChannel="0"
        :midiControlNumber="70"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.page {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  flex-wrap: wrap;
}

.art-card.receipt-page {
  flex: 1;
  min-width: 300px;
}

.wheel-container {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
