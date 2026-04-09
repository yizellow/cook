<script setup>
import { useTemplateRef, onMounted } from "vue";
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

const label = useTemplateRef("label");

onMounted(() => {
  const circleType = new CircleType(label.value);
  circleType.radius(props.radius).dir(1);
});
</script>

<template>
  <span ref="label" class="segment-label">
    {{ props.label }}
  </span>
</template>
