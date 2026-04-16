<script setup>
import { computed, ref, onMounted } from "vue";
import SimpleWheel from "../components/SimpleWheel.vue";
import RadialInterface from "../components/RadialInterface.vue";
import ActionButton from "../components/ActionButton.vue";

const orderCode = ref("001"); // 預設值
const isLoadingOrderCode = ref(true);

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

// 在組件載入時獲取下一個訂單編號
onMounted(async () => {
  try {
    const res = await fetch("/.netlify/functions/get-next-order-code");
    const data = await res.json();

    if (res.ok && data.success) {
      orderCode.value = data.nextOrderCode;
    } else {
      console.error("Failed to get next order code:", data.error);
      // 保留預設值
    }
  } catch (error) {
    console.error("Error fetching next order code:", error);
    // 保留預設值
  } finally {
    isLoadingOrderCode.value = false;
  }
});

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
      return value ? "Ja" : "Nein";
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
      orderCode: orderCode.value,
      order: {
        drinkName: selectedDrink.value.name,
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
        <div  class="title">
          <!-- <img class="logo" src="../assets/hat-color.png"></img> -->
          <img class="logo" src="../assets/caps-logo.png"></img>
          <h1>Menü</h1>
        </div>
      </div>
      <div class="main-content">
        <div class="order-summary">
          <div class="receipt-section">
            <h2>Bestellung</h2>
            <p><strong>Portion:</strong> {{ selectedSnack?.name || "None" }}</p>
            <p>
              <strong>Kategorie:</strong> {{ selectedChef?.name || "None" }}
            </p>
            <p>
              <strong>Gericht:</strong> {{ selectedMenuItem?.name || "None" }}
            </p>
          </div>

          <hr></hr>


          <div class="receipt-section" v-if="selectedMenuItem">
            <h3>Geschmacksprofil</h3>
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

          <hr></hr>


          <div class="receipt-section" v-if="selectedMenuItem">
            <p><strong>Getränk: </strong>{{ selectedDrink.name }}</p>
          </div>

          <hr></hr>

          <div class="receipt-section">
            <p><strong>Bestellnummer: </strong># {{ orderCode }}</p>
          </div>
        </div>

        <div class="wheel-container">
          <h3>Getränk</h3>
          <p>Wird serviert während deine Bestellung zubereitet wird.</p>
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
          text="Zurück"
          type="back"
          shortcutKey="ArrowLeft"
          @click="goBack"
        />
        <ActionButton
          text="Absenden"
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
  margin: 0 auto;
  margin-top: 4rem;
  padding: 2rem 0;
  max-height: 600px;

  h3 {
    margin: 0;
  }

  p {
    margin: .25rem 0;
  }
}

.order-summary {
  background: white;
  margin: 0 auto;
  padding: 2rem 3rem;

  h2 {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  p {
    margin: 0.5rem 0;
  }

  .parameter-item {
    margin: 0.125rem 0;
    p {
      margin: 0;
    }
  }

  h3 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  hr {
    border: 1px solid var(--color-outline-faded);
    margin: 1rem 0;
  }
}
</style>
