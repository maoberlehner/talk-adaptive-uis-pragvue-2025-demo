<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { config } from "@/config";

interface SkeletonProps {
  class?: HTMLAttributes["class"];
}

const props = defineProps<SkeletonProps>();
</script>

<template>
  <div
    v-if="config.perf.skeleton"
    data-slot="skeleton"
    :class="cn('animate-pulse rounded-md bg-primary/10', props.class)"
  />
</template>
