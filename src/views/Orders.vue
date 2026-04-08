<script setup>
import { ref, computed, onMounted } from "vue";

const orders = ref([]);
const isLoading = ref(true);
const loadError = ref("");

onMounted(async () => {
  try {
    const res = await fetch("/api/get-orders");
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to load orders");
    }

    if (data.success) {
      orders.value = Array.isArray(data.orders) ? data.orders : [];
    } else {
      orders.value = [];
    }
  } catch (error) {
    console.error("Failed to load orders:", error);
    loadError.value = error.message || "Failed to load orders";
  } finally {
    isLoading.value = false;
  }
});

const groupedOrders = computed(() => {
  const groups = {};

  orders.value.forEach((order) => {
    const chef = order.order?.chefName || "Unknown Chef";
    if (!groups[chef]) {
      groups[chef] = [];
    }
    groups[chef].push(order);
  });

  return groups;
});

const categories = computed(() => {
  return Object.keys(groupedOrders.value).sort();
});

const goHome = () => {
  window.location.hash = "/";
};

const getParameterList = (order) => {
  const parameters = order.order?.parameters || [];
  return Array.isArray(parameters) ? parameters : [];
};

const deleteOrder = async (orderId) => {
  const confirmed = confirm(
    "Are you sure you want to delete this order? / Sind Sie sicher, dass Sie diese Bestellung löschen möchten?",
  );

  if (!confirmed) return;

  try {
    const res = await fetch("/api/delete-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to delete order");
    }

    orders.value = orders.value.filter((order) => order._id !== orderId);
  } catch (error) {
    console.error("Delete order failed:", error);
    alert(`Delete failed: ${error.message}`);
  }
};

const clearAllOrders = () => {
  alert("Clear All is not connected to database yet.");
};
</script>

<template>
  <section class="page">
    <div class="art-card orders-page">
      <h1 class="title">Order Management / Bestellungsverwaltung</h1>
      <p class="subtitle">All Orders / Alle Bestellungen</p>

      <div v-if="isLoading" class="no-orders">
        <p>Loading orders... / Bestellungen werden geladen...</p>
      </div>

      <div v-else-if="loadError" class="no-orders">
        <p>{{ loadError }}</p>
      </div>

      <div v-else-if="orders.length === 0" class="no-orders">
        <p>No orders yet. / Noch keine Bestellungen.</p>
      </div>

      <div v-else class="orders-container">
        <div
          v-for="category in categories"
          :key="category"
          class="category-section"
        >
          <h2 class="category-title">{{ category }}</h2>

          <div class="orders-table">
            <div class="table-header">
              <div class="col col-code">Order Code</div>
              <div class="col col-drink">Drink</div>
              <div class="col col-snack">Snack</div>
              <div class="col col-chef">Chef</div>
              <div class="col col-item">Menu Item</div>
              <div class="col col-params">Parameters</div>
              <div class="col col-date">Created At</div>
              <div class="col col-action">Action</div>
            </div>

            <div
              v-for="order in groupedOrders[category]"
              :key="order._id"
              class="table-row"
            >
              <div class="col col-code">
                {{ order.orderCode || "Unknown" }}
              </div>
              <div class="col col-drink">
                {{ order.order?.drinkName || "None" }}
              </div>
              <div class="col col-snack">
                {{ order.order?.snackName || "None" }}
              </div>
              <div class="col col-chef">
                {{ order.order?.chefName || "Unknown Chef" }}
              </div>
              <div class="col col-item">
                {{ order.order?.menuItemName || "Unknown Item" }}
              </div>

              <div class="col col-params">
                <div
                  v-for="param in getParameterList(order)"
                  :key="param.id"
                  class="param-item"
                >
                  <strong>{{ param.name }}:</strong> {{ param.value }}
                </div>
              </div>

              <div class="col col-date">
                {{
                  order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "Unknown"
                }}
              </div>

              <div class="col col-action">
                <button class="delete-btn" @click="deleteOrder(order._id)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="nav-buttons">
        <button class="back-btn" @click="goHome">Back / Zurück</button>
        <button
          v-if="orders.length > 0"
          class="clear-btn"
          @click="clearAllOrders"
        >
          Clear All / Alles löschen
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.orders-page {
  max-width: 1400px;
}

.no-orders {
  padding: 40px 20px;
  text-align: center;
  color: #888;
}

.orders-container {
  margin: 30px 0;
}

.category-section {
  margin-bottom: 50px;
  border-top: 3px solid #333;
  padding-top: 20px;

  &:first-child {
    border-top: none;
    padding-top: 0;
  }
}

.category-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  text-transform: capitalize;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns:
    120px
    180px
    100px
    120px
    120px
    200px
    160px
    90px;
  gap: 10px;
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
  align-items: start;
  font-size: 13px;
}

.table-header {
  background-color: #f5f5f5;
  font-weight: bold;
  border-bottom: 2px solid #333;
  position: sticky;
  top: 0;
}

.table-row {
  background-color: #fff;

  &:hover {
    background-color: #f9f9f9;
  }
}

.col {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.col-name {
    font-weight: 500;
  }

  &.col-email {
    font-size: 12px;
  }

  &.col-date {
    font-size: 12px;
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }

  &.col-params {
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }

  &.col-action {
    text-align: center;
  }
}

.delete-btn {
  padding: 5px 10px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #cc0000;
  }
}

.nav-buttons {
  display: flex;
  gap: 10px;
  margin-top: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.back-btn,
.clear-btn {
  padding: 10px 20px;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #444;
  }
}

.clear-btn {
  background-color: #ff6666;

  &:hover {
    background-color: #dd0000;
  }
}

.param-item {
  font-size: 11px;
  margin-bottom: 4px;
  line-height: 1.3;
}

.param-item:last-child {
  margin-bottom: 0;
}

@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 100px 150px 80px 100px 100px 150px 120px 70px;
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 80px 120px 70px 80px 80px 120px 90px 60px;
    gap: 5px;
    padding: 8px 5px;
    font-size: 11px;
  }

  .col-email {
    display: none;
  }

  .table-header,
  .table-row {
    grid-template-columns: 80px 70px 80px 80px 120px 90px 60px;
  }
}
</style>
