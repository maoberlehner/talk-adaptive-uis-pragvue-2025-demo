<script setup lang="ts">
import { colSpanMap, type ConfigColSpan } from "@/entites/config";

const props = withDefaults(
  defineProps<{
    colSpan?: ConfigColSpan[];
  }>(),
  {
    colSpan: () => ["12"],
  },
);
</script>

<template>
  <div :class="[...(props.colSpan.map((cs) => colSpanMap[cs]) || [])]">
    <slot />
  </div>
</template>
