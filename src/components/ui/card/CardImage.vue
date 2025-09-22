<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-slot="card-image"
    :class="
      cn('first:-mt-6 last:-mb-6 overflow-hidden first:rounded-t-xl last:rounded-b-xl', props.class)
    "
  >
    <slot />
  </div>
</template>
