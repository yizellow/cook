<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker from local public directory
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
} catch (e) {
  console.warn("PDF.js worker setup issue:", e);
}

const props = defineProps({
  pdfData: {
    type: [String, Uint8Array],
    required: true,
  },
  scale: {
    type: Number,
    default: 1.5,
  },
});

const canvas = ref(null);
const isLoading = ref(true);
const error = ref(null);

const renderPdf = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Ensure canvas is available
    if (!canvas.value) {
      throw new Error("Canvas element not available");
    }

    // Use the PDF data directly
    const pdfDataToUse =
      typeof props.pdfData === "string"
        ? { url: props.pdfData }
        : { data: props.pdfData };

    // Load and render just the first page
    const loadingTask = pdfjsLib.getDocument(pdfDataToUse);
    const pdfDocument = await loadingTask.promise;
    const page = await pdfDocument.getPage(1);

    // Set up canvas with nextTick to ensure DOM is ready
    await nextTick();

    if (!canvas.value) {
      throw new Error("Canvas element disappeared");
    }

    const viewport = page.getViewport({ scale: props.scale });
    const ctx = canvas.value.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get 2D context");
    }

    canvas.value.height = viewport.height;
    canvas.value.width = viewport.width;

    // Render the page
    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;
  } catch (err) {
    console.error("Error rendering PDF:", err);
    error.value = "Failed to load PDF preview: " + (err.message || String(err));
  } finally {
    isLoading.value = false;
  }
};

// Watch for PDF data changes
watch(
  () => props.pdfData,
  (newData) => {
    if (newData) {
      renderPdf();
    }
  },
);

// Initialize when mounted
onMounted(() => {
  if (props.pdfData) {
    renderPdf();
  }
});
</script>

<template>
  <div class="pdf-viewer-simple">
    <!-- Always render canvas so ref is available, use overlays for messages -->
    <canvas ref="canvas" class="pdf-canvas" />
    
    <div v-if="isLoading" class="loading-overlay">
      Generating preview...
    </div>
    
    <div v-else-if="error" class="error-overlay">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.pdf-viewer-simple {
  width: 100%;
  position: relative;
  min-height: 200px; /* Ensure space for canvas */
}

.pdf-canvas {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: block; /* Ensure canvas is visible */
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  text-align: center;
  color: #666;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.error-overlay {
  color: #d32f2f;
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
