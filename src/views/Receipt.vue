<script setup>
import { computed, ref } from "vue";
import SimpleWheel from "../components/SimpleWheel.vue";
import RadialInterface from "../components/RadialInterface.vue";
import ActionButton from "../components/ActionButton.vue";

const savedOrderCount = Number(localStorage.getItem("order_counter") || "0");
const orderCode = `${String(savedOrderCount + 1).padStart(3, "0")}`;

const drinkOptions = [
  { id: "coffee", name: "Kaffee" },
  { id: "tea", name: "Tee" },
  { id: "water", name: "Wasser" },
];

const selectedDrinkIndex = ref([0]);
const selectedDrink = computed(() => drinkOptions[selectedDrinkIndex.value]);

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

const onDrinkSelectionChange = (segments) => {
  console.log(segments);
  selectedDrinkIndex.value = segments[0];
};

const submitOrder = async () => {
  try {
    if (!selectedChef || !selectedMenuItem || !selectedDrink.value) {
      alert("Missing required order data");
      return;
    }

    const parameters = (selectedMenuItem?.parameters || []).map((param) => ({
      id: param.id || "",
      name: param.name || "",
      type: param.type || "",
      value: formatParameterValue(param, parameterValues[param.id]),
    }));

    const payload = {
      orderCode,
      order: {
        drinkName: selectedDrink.value,
        snackName: selectedSnack?.name || "",
        chefId: selectedChef?.id || "",
        chefName: selectedChef?.name || "",
        menuItemId: selectedMenuItem?.id || "",
        menuItemName: selectedMenuItem?.name || "",
        parameters,
      },
      createdAt: new Date().toISOString(),
    };

    const res = await fetch("/.netlify/functions/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("Response is not valid JSON:", text);
    }

    if (!res.ok) {
      console.error("Submit failed:", res.status, data);
      alert(`Submit failed: ${data.error || `HTTP ${res.status}`}`);
      return;
    }

    localStorage.setItem("order_counter", String(savedOrderCount + 1));
    localStorage.removeItem("selectedSnack");
    localStorage.removeItem("selectedChef");
    localStorage.removeItem("selectedMenuItem");
    localStorage.removeItem("parameterValues");

    alert("Order submitted successfully!");
    window.location.hash = "#/menu-wheel";
  } catch (error) {
    console.error("Submit order error:", error);
    alert("Failed to submit order");
  }
};
</script>

<template>
  <section class="page menu-page">
    <div class="content-container">
      <div class="title-section">
        <h1 class="title">Bestellübersicht</h1>
        <!-- <p class="subtitle">Select from the three layers</p> -->
      </div>
      <div class="main-content">
        <div class="order-summary">
          <div class="receipt-section">
            <h2>Bestellnummer</h2>
            <p># {{ orderCode }}</p>
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
            <h2>Geschmacksprofil</h2>
            <div
              v-for="param in selectedMenuItem?.parameters || []"
              :key="param.id"
              class="parameter-item"
            >
              <strong>{{ param.name }}: </strong>
              <span>{{
                formatParameterValue(param, parameterValues[param.id])
              }}</span>
            </div>
          </div>

          <div class="receipt-section" v-if="selectedMenuItem">
            <h2>Getränk</h2>
            <p>{{ selectedDrink.name }}</p>
          </div>
        </div>

        <div class="wheel-container">
          <p>Getränk gefällig, währrend deine Bestellung zubereitet wird?</p>
          <RadialInterface
            :layers="[drinkOptions]"
            :selectedSegments="[selectedDrinkIndex]"
            @update:selectedSegments="onDrinkSelectionChange"
            :singleRing="true"
            :size="400"
            :midiControlNumbers="[73]"
          />
        </div>
      </div>

      <div class="nav-buttons">
        <ActionButton
          text="Back"
          type="back"
          shortcutKey="ArrowLeft"
          @click="goBack"
        />
        <ActionButton
          text="Submit"
          type="primary"
          shortcutKey="ArrowRight"
          @click="submitOrder"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../styles/menuPage.scss";

.wheel-container {
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
}
</style>
