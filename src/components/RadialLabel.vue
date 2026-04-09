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
  circleType.radius(props.radius - 30).dir(1);
  // circleType.forceWidth(true);
});
</script>

<template>
  <span ref="label" class="segment-label">
    {{ props.label }}
  </span>
</template>
