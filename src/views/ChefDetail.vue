<script setup>
import { ref, computed } from "vue";

const selectedChef = ref(
  JSON.parse(localStorage.getItem("selectedChef") || "null"),
);
const answers = ref({
  question1: selectedChef.value?.question1?.default || 0,
  question2: "",
  question3: selectedChef.value?.question3?.default || 1,
});


const goBack = () => {
  window.location.hash = "#/chef-select";
};

const goNext = () => {
  // 驗證所有問題都已回答
  if (!answers.value.question2) {
    alert("Please answer all questions. / Bitte beantworten Sie alle Fragen.");
    return;
  }

  localStorage.setItem("answers", JSON.stringify(answers.value));
  window.location.hash = "#/receipt";
};
</script>

<template>
  <section class="page">
    <div class="art-card">
      <h1 class="title">{{ selectedChef.title }}</h1>
      <p class="subtitle">
        Answer these 3 questions / Beantworten Sie diese 3 Fragen
      </p>

      <div class="questions-container">
        <!-- Question 1: Percentage -->
        <div class="question">
          <h3>{{ selectedChef.question1.title }}</h3>
          <div class="percentage-group">
            <input
              v-model.number="answers.question1"
              type="range"
              :min="selectedChef.question1.min"
              :max="selectedChef.question1.max"
              class="slider"
            />
            <span>{{ answers.question1 }}%</span>
          </div>
        </div>

        <!-- Question 2: Single Choice -->
        <div class="question">
          <h3>{{ selectedChef.question2.title }}</h3>
          <div class="choice-options">
            <button
              v-for="option in selectedChef.question2.options"
              :key="option"
              class="choice-btn"
              :class="{ active: answers.question2 === option }"
              @click="answers.question2 = option"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <!-- Question 3: Range -->
        <div class="question">
          <h3>{{ selectedChef.question3.title }}</h3>
          <div class="range-group">
            <input
              v-model.number="answers.question3"
              type="range"
              :min="selectedChef.question3.min"
              :max="selectedChef.question3.max"
              class="slider"
            />
            <span>{{ answers.question3 }}</span>
          </div>
        </div>
      </div>

      <div class="nav-buttons">
        <button class="back-btn" @click="goBack">Back / Zurück</button>
        <button class="next-btn" @click="goNext">Next / Weiter</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.questions-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;
}

.question {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.question h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #333;
}

.percentage-group,
.range-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
  border: none;
}

.choice-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.choice-btn {
  padding: 1rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.choice-btn:hover {
  border-color: #007bff;
}

.choice-btn.active {
  border-color: #007bff;
  background: #f0f8ff;
  color: #007bff;
}
</style>
