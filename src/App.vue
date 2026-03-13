<script setup>
import { ref, computed } from "vue";
import Home from "./views/Home.vue";
import Menu from "./views/Menu.vue";
import Combo from "./views/Combo/Basis.vue";
import Topping from "./views/Combo/Topping.vue";
import Sauce from "./views/Combo/Sauce.vue";
import Snack from "./views/Snack/Snack.vue";
import Receipt from "./views/Receipt.vue";
import NotFound from "./views/NotFound.vue";

const routes = {
  "/": Home,
  "/menu": Menu,
  "/combo": Combo,
  "/combo/topping": Topping,
  "/combo/sauce": Sauce,
  "/receipt": Receipt,

  "/snack": Snack,
};

const currentPath = ref(window.location.hash || "#/");

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash || "#/";
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || NotFound;
});
</script>

<template>
  <component :is="currentView" />
</template>

<style lang="scss">
@import "./assets/style.scss";
</style>
