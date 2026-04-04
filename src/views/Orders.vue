<script setup>
import { ref, computed, onMounted } from "vue";

const orders = ref([]);

// 在组件挂载时从 localStorage 加载订单
onMounted(() => {
  const savedOrders = localStorage.getItem("art_orders");
  if (savedOrders) {
    orders.value = JSON.parse(savedOrders);
  }
});

// 按 Chef 分组
const groupedOrders = computed(() => {
  const groups = {};

  orders.value.forEach((order) => {
    const chef = order.order?.chef?.name || "Unknown Chef";
    if (!groups[chef]) {
      groups[chef] = [];
    }
    groups[chef].push(order);
  });

  return groups;
});

// 获取所有唯一的 Chef 类别
const categories = computed(() => {
  return Object.keys(groupedOrders.value).sort();
});

// 删除订单
const deleteOrder = (orderId) => {
  if (
    confirm(
      "Are you sure you want to delete this order? / Sind Sie sicher, dass Sie diese Bestellung löschen möchten?",
    )
  ) {
    orders.value = orders.value.filter((order) => order.id !== orderId);
    localStorage.setItem("art_orders", JSON.stringify(orders.value));
  }
};

// 清空所有订单
const clearAllOrders = () => {
  if (
    confirm(
      "Are you sure you want to delete all orders? / Sind Sie sicher, dass Sie alle Bestellungen löschen möchten?",
    )
  ) {
    orders.value = [];
    localStorage.removeItem("art_orders");
  }
};

const goHome = () => {
  window.location.hash = "#/";
};

// 獲取參數列表用於顯示
const getParameterList = (order) => {
  const menuItem = order.order?.menuItem;
  const parameters = order.order?.parameters || {};

  if (!menuItem || !menuItem.parameters) return [];

  return menuItem.parameters.map(param => ({
    id: param.id,
    name: param.name,
    value: formatParameterValue(param, parameters[param.id])
  }));
};

// 格式化參數值顯示
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
    <div class="art-card orders-page">
      <h1 class="title">Order Management / Bestellungsverwaltung</h1>
      <p class="subtitle">All Orders / Alle Bestellungen</p>

      <!-- 未有订单时的提示 -->
      <div v-if="orders.length === 0" class="no-orders">
        <p>No orders yet. / Noch keine Bestellungen.</p>
      </div>

      <!-- 按类别显示订单 -->
      <div v-else class="orders-container">
        <div
          v-for="category in categories"
          :key="category"
          class="category-section"
        >
          <h2 class="category-title">{{ category }}</h2>
          <div class="orders-table">
            <div class="table-header">
              <div class="col col-name">Name</div>
              <div class="col col-email">Email</div>
              <div class="col col-snack">Snack</div>
              <div class="col col-chef">Chef</div>
              <div class="col col-item">Menu Item</div>
              <div class="col col-params">Parameters</div>
              <div class="col col-date">Created At</div>
              <div class="col col-action">Action</div>
            </div>

            <div
              v-for="order in groupedOrders[category]"
              :key="order.id"
              class="table-row"
            >
              <div class="col col-name">{{ order.customer?.name }}</div>
              <div class="col col-email">{{ order.customer?.email }}</div>
              <div class="col col-snack">{{ order.order?.snack?.name || 'None' }}</div>
              <div class="col col-chef">{{ order.order?.chef?.name }}</div>
              <div class="col col-item">{{ order.order?.menuItem?.name }}</div>
              <div class="col col-params">
                <div
                  v-for="param in getParameterList(order)"
                  :key="param.id"
                  class="param-item"
                >
                  <strong>{{ param.name }}:</strong> {{ param.value }}
                </div>
              </div>
              <div class="col col-date">{{ order.createdAt }}</div>
              <div class="col col-action">
                <button class="delete-btn" @click="deleteOrder(order.id)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作按钮 -->
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
    120px    /* Name */
    180px    /* Email */
    100px    /* Snack */
    120px    /* Chef */
    120px    /* Menu Item */
    200px    /* Parameters */
    130px    /* Date */
    80px;    /* Action */
  gap: 10px;
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
  align-items: center;
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
  }

  &.col-sauces {
    text-align: center;
    color: #666;
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
  margin-bottom: 2px;
  line-height: 1.2;
}

.param-item:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 100px 150px 80px 100px 100px 150px 110px 70px;
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
