<script setup>
import { ref, computed } from "vue";
import Home from "./views/Home.vue";
import Menu from "./views/Menu.vue";
import MenuWheel from "./views/MenuWheel.vue";
import ChefDetail from "./views/ChefDetail.vue";
import Receipt from "./views/Receipt.vue";
import Orders from "./views/Orders.vue";
import ClearOrders from "./views/ClearOrders.vue";
import NotFound from "./views/NotFound.vue";

const routes = {
  "/": MenuWheel,
  "/menu": Menu,
  "/menu-wheel": MenuWheel,
  "/chef-detail": ChefDetail,
  "/receipt": Receipt,
  "/orders": Orders,
  "/clear-orders": ClearOrders,
};

const currentPath = ref(window.location.hash || "#/menu-wheel");

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash || "#/menu-wheel";
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || NotFound;
});
</script>

<template>
  <component :is="currentView" />
</template>
