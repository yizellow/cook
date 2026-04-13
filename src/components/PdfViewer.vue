<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker from local public directory
try {
  // Use the worker file we copied to public directory
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  console.log('PDF.js worker configured from local file');
} catch (e) {
  console.warn('PDF.js worker setup issue:', e);
}

const props = defineProps({
  pdfData: {
    type: [String, Uint8Array],
    required: true
  },
  scale: {
    type: Number,
    default: 1.0
  }
});

const canvas = ref(null);
const isLoading = ref(true);
const error = ref(null);
const pdfDocument = ref(null);

const dataUrlToUint8Array = (dataUrl) => {
  try {
    console.log('Parsing data URL:', dataUrl.substring(0, 100) + '...');
    
    // Check if it's actually a data URL
    if (!dataUrl.startsWith('data:application/pdf')) {
      throw new Error('Not a PDF data URL: ' + dataUrl.substring(0, 50));
    }
    
    // Extract the base64 part from the data URL
    const base64Match = dataUrl.match(/;base64,([A-Za-z0-9+/=]+)/);
    if (!base64Match || !base64Match[1]) {
      throw new Error('No base64 data found in URL');
    }
    
    const base64 = base64Match[1];
    console.log('Base64 length:', base64.length);
    
    // Convert base64 to binary string
    const binaryString = atob(base64);
    
    // Create Uint8Array
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log('Successfully converted to Uint8Array, length:', bytes.length);
    return bytes;
    
  } catch (error) {
    console.error('Error converting data URL:', error);
    throw error;
  }
};

const renderPage = async (pageNum = 1) => {
  try {
    isLoading.value = true;
    error.value = null;
    
    // Debug: Check if PDF.js is loaded
    console.log('PDF.js version:', pdfjsLib.version);
    console.log('Worker src:', pdfjsLib.GlobalWorkerOptions.workerSrc);
    
    // Use the PDF data directly (already in correct format)
    let pdfDataToUse = props.pdfData;
    
    // If it's a string (data URL), convert it
    if (typeof props.pdfData === 'string') {
      if (props.pdfData.startsWith('data:application/pdf')) {
        console.log('Converting data URL to Uint8Array');
        pdfDataToUse = dataUrlToUint8Array(props.pdfData);
      } else {
        console.log('Using string as URL:', props.pdfData);
        // For URL strings, we need to use the url parameter instead
        pdfDataToUse = { url: props.pdfData };
      }
    } else {
      console.log('Using Uint8Array directly, length:', props.pdfData?.length);
    }
    
    // Load the PDF document (simplified without CMaps for our simple use case)
    const loadingTask = pdfjsLib.getDocument({
      ...(typeof pdfDataToUse === 'object' && !('byteLength' in pdfDataToUse) 
        ? pdfDataToUse 
        : { data: pdfDataToUse })
    });
    
    // Get the PDF document
    pdfDocument.value = await loadingTask.promise;
    
    // Always render just the first page (we only need page 1 for receipts)
    const page = await pdfDocument.value.getPage(1);
    
    // Set scale and viewport
    const viewport = page.getViewport({ scale: props.scale });
    
    // Prepare canvas
    const ctx = canvas.value.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.value.height = viewport.height;
    canvas.value.width = viewport.width;
    
    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
  } catch (err) {
    console.error("Error rendering PDF:", err);
    error.value = "Failed to load PDF: " + (err.message || String(err));
    if (props.pdfUrl && props.pdfUrl.startsWith('data:')) {
      console.log('Data URL length:', props.pdfUrl.length);
      console.log('Data URL starts with:', props.pdfUrl.substring(0, 50) + '...');
    }
  } finally {
    isLoading.value = false;
  }
};

const goToPage = (pageNum) => {
  if (pageNum >= 1 && pageNum <= totalPages.value) {
    renderPage(pageNum);
  }
};

const zoomIn = () => {
  if (props.scale < 2.0) {
    // We'd need to re-render with new scale, but for now just reload
    renderPage(currentPage.value);
  }
};

const zoomOut = () => {
  if (props.scale > 0.5) {
    // We'd need to re-render with new scale, but for now just reload  
    renderPage(currentPage.value);
  }
};

// Watch for PDF URL changes
watch(() => props.pdfUrl, (newUrl) => {
  if (newUrl) {
    renderPage(1);
  }
});

// Initialize when mounted
onMounted(() => {
  if (props.pdfData) {
    renderPage(1);
  }
});

// Watch for PDF data changes
watch(() => props.pdfData, (newData) => {
  if (newData) {
    renderPage(1);
  }
});
</script>

<template>
  <div class="pdf-viewer">
    <div v-if="isLoading" class="pdf-loading">
      Loading PDF...
    </div>
    
    <div v-else-if="error" class="pdf-error">
      {{ error }}
    </div>
    
    <div v-else class="pdf-container">
      <canvas ref="canvas" class="pdf-canvas"></canvas>
    </div>
  </div>
</template>

<style scoped>
.pdf-viewer {
  width: 100%;
  position: relative;
}

.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pdf-canvas {
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.pdf-controls {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-btn {
  padding: 5px 15px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn:hover:not(:disabled) {
  background-color: #eee;
}

.page-info {
  font-size: 0.85em;
  color: #666;
}
</style>