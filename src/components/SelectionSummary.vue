<template>
  <div class="selection-summary">
    <h4>Deine Auswahl</h4>
    <div class="summary-data">
      <div class="summary-item">
        <strong>Portion: </strong>
        <span>{{ selectedSnack?.name || "None" }}</span>
      </div>
      <div class="summary-item">
        <strong>Kategorie: </strong>
        <span>{{ selectedChef?.name || "None" }}</span>
      </div>
    </div>
    <div class="dish">
      <div class="dish-title summary-item">
        <span>{{ selectedMenuItem?.name || "None" }}</span>
      </div>
      <p class="description">{{ selectedMenuItem?.description || "…" }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps(["selectedSnack", "selectedChef", "selectedMenuItem"]);
</script>

<style scoped>
.selection-summary {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.75rem;

  h4 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    color: var(--color-text-faded);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
  }

  .summary-data {
    display: flex;
    gap: 2rem;
    margin-bottom: 0.5rem;
  }

  .summary-item {
    span {
      /*background-color: var(--color-blue);
      padding: 0.25rem 0.5rem;
      border: 3px solid var(--color-black);
      border-radius: 0.25rem;*/
    }
  }

  .dish {
    .dish-title {
      font-weight: 800;
      margin-bottom: 0.25rem;
    }

    .description {
      margin: 0;
      font-size: 0.875rem;
    }
  }
}

.dish {
}
</style>
