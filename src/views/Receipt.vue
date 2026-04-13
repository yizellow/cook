<script setup>
import { computed, ref, onMounted } from "vue";
import SimpleWheel from "../components/SimpleWheel.vue";
import PdfViewerSimple from "../components/PdfViewerSimple.vue";
import { generateReceiptPdf, getPdfAsUint8Array } from "../utils/pdfUtils";

const savedOrderCount = Number(localStorage.getItem("order_counter") || "0");
const orderCode = `ORD-${String(savedOrderCount + 1).padStart(4, "0")}`;

const drinkOptions = ["Coffee", "Tea", "Water"];
const selectedDrinkIndex = ref(0);
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

const pdfData = ref(null);
const isPdfLoading = ref(true);
const pdfError = ref(null);

const loadPdf = async () => {
  try {
    isPdfLoading.value = true;
    pdfError.value = null;
    
    console.log('Generating PDF...');
    const doc = generateReceiptPdf(
      orderCode,
      selectedDrink.value,
      selectedSnack,
      selectedChef,
      selectedMenuItem,
      parameterValues,
    );
    
    console.log('Getting PDF as Uint8Array...');
    const uint8Array = getPdfAsUint8Array(doc);
    console.log('PDF data length:', uint8Array?.length);
    
    pdfData.value = uint8Array;
    
  } catch (error) {
    console.error('Failed to load PDF:', error);
    pdfError.value = 'Failed to generate PDF preview: ' + (error.message || String(error));
  } finally {
    isPdfLoading.value = false;
  }
};

onMounted(() => {
  loadPdf();
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
        <h2>Order Receipt Preview</h2>
        <div class="pdf-preview">
          <div v-if="isPdfLoading" class="pdf-loading">
            Generating PDF preview...
          </div>
          
          <div v-else-if="pdfError" class="pdf-error">
            {{ pdfError }}
          </div>
          
          <PdfViewerSimple v-else :pdf-data="pdfData" />
        </div>
        <p class="pdf-note">
          This is a preview of your order receipt. The final receipt will be
          generated when you submit your order.
        </p>
      </div>

      <div class="nav-buttons">
        <button class="back-btn" @click="goBack">Back / Zurück</button>
        <button class="submit-btn" @click="submitOrder">
          Submit Order / Bestellung einreichen
        </button>
        <button class="next-btn" @click="goHome">Home / Start</button>
      </div>
    </div>

    <div class="wheel-container">
      <SimpleWheel
        :options="drinkOptions"
        :selectedIndex="selectedDrinkIndex"
        @update:selectedIndex="(index) => (selectedDrinkIndex.value = index)"
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

.receipt-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.pdf-preview {
  margin: 15px 0;
  width: 100%;
  max-width: 500px; /* Give a bit more space for the canvas renderer */
}

.pdf-loading, .pdf-error {
  padding: 20px;
  text-align: center;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 4px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-error {
  color: #d32f2f;
  background-color: #ffebee;
}

.pdf-note {
  font-size: 0.85em;
  color: #666;
  font-style: italic;
  margin-top: 10px;
}
</style>
