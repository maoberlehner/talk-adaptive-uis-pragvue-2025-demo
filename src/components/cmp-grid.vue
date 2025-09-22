<script setup lang="ts">
import { gapMap, type ConfigPropsGap } from "@/entites/config";

const props = withDefaults(
  defineProps<{
    gap?: ConfigPropsGap;
  }>(),
  {
    gap: "4",
  },
);
</script>

<template>
  <div :class="['grid', 'grid-cols-12', gapMap[props.gap]]">
    <slot />
  </div>
</template>
