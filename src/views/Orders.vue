<script setup>
import { ref, computed, onMounted } from "vue";
import { jsPDF } from "jspdf";

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

const openPdf = (orderId) => {
  const order = orders.value.find((o) => o._id === orderId);
  if (!order) return;

  const doc = new jsPDF({ unit: "mm", format: [57, 100] });
  const yGap = 5;

  // Add title
  doc.setFontSize(10);
  doc.text("Order Receipt", 15, 20);

  // Add order details
  doc.setFontSize(6);
  let yPos = 30;

  doc.text(`Order Code: ${order.orderCode || "Unknown"}`, 5, yPos);
  yPos += yGap;

  doc.text(`Chef: ${order.order?.chefName || "Unknown Chef"}`, 5, yPos);
  yPos += yGap;

  doc.text(
    `Menu Item: ${order.order?.menuItemName || "Unknown Item"}`,
    5,
    yPos,
  );
  yPos += yGap;

  doc.text(`Drink: ${order.order?.drinkName || "None"}`, 5, yPos);
  yPos += yGap;

  doc.text(`Snack: ${order.order?.snackName || "None"}`, 5, yPos);
  yPos += yGap;

  // Add parameters if any
  if (order.order?.parameters && order.order.parameters.length > 0) {
    yPos += 5;
    doc.text("Parameters:", 5, yPos);
    yPos += yGap;

    order.order.parameters.forEach((param) => {
      doc.text(`${param.name}: ${param.value}`, 8, yPos);
      yPos += yGap;
    });
  }

  // Add date
  yPos += yGap;
  doc.text(
    `Created: ${order.createdAt ? new Date(order.createdAt).toLocaleString() : "Unknown"}`,
    5,
    yPos,
  );

  // Open PDF in new tab
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
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
  alert("Clear All is not connected to database yet. Order Co");
};

const resetOrderCount = () => {
  localStorage.setItem("order_counter", 0);
  alert("Order count was reset to 0.");
};
</script>

<template>
  <section class="page">
    <div class="art-card orders-page">
      <div class="titles">
        <h1 class="title">Order Management / Bestellungsverwaltung</h1>
        <p class="subtitle">All Orders / Alle Bestellungen</p>
      </div>

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
            <div
              v-for="order in groupedOrders[category]"
              :key="order._id"
              class="table-row"
            >
              <div class="col col-code">
                <strong>Nr:</strong>
                {{ order.orderCode || "Unknown" }}
              </div>

              <div class="col col-props">
                <div class="main-props">
                  <div class="prop">
                    <strong>Size:</strong>
                    {{ order.order?.snackName || "None" }}
                  </div>
                  <div class="prop">
                    <strong>Category:</strong>
                    {{ order.order?.chefName || "Unknown Chef" }}
                  </div>
                  <div class="prop">
                    <strong>Dish:</strong>
                    {{ order.order?.menuItemName || "Unknown Item" }}
                  </div>
                </div>

                <div class="params">
                  <strong>Parameters:</strong>
                  <div
                    v-for="param in getParameterList(order)"
                    :key="param.id"
                    class="param-item"
                  >
                    <em>{{ param.name }}:</em> {{ param.value }}
                  </div>
                </div>
                <div class="drink">
                  <strong>Drink:</strong>
                  {{ order.order?.drinkName.name || "None" }}
                </div>
              </div>

              <div class="col col-action">
                <div class="date">
                  {{
                    order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "Unknown"
                  }}
                </div>
                <div class="buttons">
                  <button
                    class="action-btn delete-btn"
                    @click="deleteOrder(order._id)"
                  >
                    Delete
                  </button>
                  <button
                    class="action-btn pdf-btn"
                    @click="openPdf(order._id)"
                  >
                    Reciept
                  </button>
                </div>
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
        <button
          v-if="orders.length > 0"
          class="clear-btn"
          @click="resetOrderCount"
        >
          Reset Order Counter
        </button>
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
  max-width: 1400px;
  padding: 3rem 0;
}

.titles {
  text-align: center;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  max-width: 800px;
  border-collapse: collapse;
  overflow-x: auto;
}

.table-row {
  display: flex;
  /* justify-content: space-between; */
  gap: 2rem;
  padding: 12px 10px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  /* align-items: center; */
  /* font-size: 13px; */
  margin: 1rem 0;

  &:hover {
    background-color: #f9f9f9;
  }
}

.col {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
  flex-grow: 1;
  line-height: 1.8;

  &.col-props {
    display: flex;
    gap: 0.5rem 2rem;

    .params {
      strong {
        display: block;
        margin-bottom: 0.125rem;
      }
    }
  }

  &.col-action {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;

    .buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      text-align: center;
      justify-content: center;
    }
  }
}

@media (max-width: 800px) {
  .orders-table {
    max-width: 600px;
  }
  .col.col-props {
    flex-direction: column;
  }
}

@media (max-width: 550px) {
  .orders-table {
    font-size: 1.25rem;
  }

  .col.col-action .buttons {
    width: 100%;
    flex-direction: column;
  }
}

.action-btn {
  flex-grow: 1;
  padding: 5px 10px;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &.delete-btn {
    background-color: #ff4444;
    &:hover {
      background-color: #cc0000;
    }
  }

  &.pdf-btn {
    background-color: #4caf50;

    &:hover {
      background-color: #45a049;
    }
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

.col-email {
  display: none;
}

.table-header,
.table-row {
  grid-template-columns: 80px 70px 80px 80px 120px 90px 60px;
}
</style>
