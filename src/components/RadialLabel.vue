<script setup>
import { useTemplateRef, onMounted, defineEmits } from "vue";
import CircleType from "circletype";

const props = defineProps({
  label: {
    type: String,
    default: "label",
  },
  radius: {
    type: Number,
    default: 200,
  },
});

const emit = defineEmits(["circletype-ready"]);
const label = useTemplateRef("label");

onMounted(() => {
  if (label.value) {
    const circleType = new CircleType(label.value);
    circleType.radius(props.radius).dir(1);
    // Notify parent that CircleType is ready
    emit("circletype-ready");
  }
});
</script>

<template>
  <span ref="label" class="segment-label">
    {{ props.label }}
  </span>
</template>

<style scoped>
.segment-label {
  display: inline-block;
  position: relative;
  text-transform: uppercase;
  font-weight: 600;
}
</style>
