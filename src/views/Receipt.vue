<script setup>
const name = localStorage.getItem("art_name") || "Not provided";
const email = localStorage.getItem("art_email") || "Not provided";

const selectedSnack = JSON.parse(localStorage.getItem("selectedSnack") || "null");
const selectedChef = JSON.parse(localStorage.getItem("selectedChef") || "null");
const selectedMenuItem = JSON.parse(localStorage.getItem("selectedMenuItem") || "null");
const parameterValues = JSON.parse(localStorage.getItem("parameterValues") || "{}");

const submitOrder = () => {
  // 建立訂單物件
  const order = {
    id: Date.now(),
    customer: {
      name,
      email,
    },
    order: {
      snack: selectedSnack,
      chef: selectedChef,
      menuItem: selectedMenuItem,
      parameters: parameterValues,
    },
    createdAt: new Date().toLocaleString(),
  };

  // 從 localStorage 取得現有訂單
  const existingOrders = JSON.parse(localStorage.getItem("art_orders")) || [];

  // 添加新訂單
  existingOrders.push(order);

  // 保存回 localStorage
  localStorage.setItem("art_orders", JSON.stringify(existingOrders));

  // 清除當前訂單數據
  localStorage.removeItem("art_name");
  localStorage.removeItem("art_email");
  localStorage.removeItem("selectedSnack");
  localStorage.removeItem("selectedChef");
  localStorage.removeItem("selectedMenuItem");
  localStorage.removeItem("parameterValues");

  alert("Order submitted successfully! / Bestellung erfolgreich eingereicht!");
  window.location.hash = "#/orders";
};

const goBack = () => {
  window.location.hash = "#/menu-wheel";
};

const goHome = () => {
  window.location.hash = "#/";
};

const formatParameterValue = (param, value) => {
  if (value === undefined || value === null) return 'Not set';

  switch (param.type) {
    case 'percentage':
      return `${value}%`;
    case 'range':
      return value;
    case 'spectrum':
      return `${value}%`;
    case 'boolean':
      return value ? 'Yes' : 'No';
    case 'single-choice':
      return value;
    case 'text':
      return value || 'Not provided';
    default:
      return value;
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
        <p><strong>Snack:</strong> {{ selectedSnack?.name || 'None' }}</p>
        <p><strong>Chef:</strong> {{ selectedChef?.name || 'None' }}</p>
        <p><strong>Menu Item:</strong> {{ selectedMenuItem?.name || 'None' }}</p>
      </div>

      <div class="receipt-section" v-if="selectedMenuItem">
        <h2>Parameters</h2>
        <div
          v-for="param in selectedMenuItem.parameters"
          :key="param.id"
          class="parameter-item"
        >
          <strong>{{ param.name }}:</strong>
          <span>{{ formatParameterValue(param, parameterValues[param.id]) }}</span>
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
  </section>
</template>
