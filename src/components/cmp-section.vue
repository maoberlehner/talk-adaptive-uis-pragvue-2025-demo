<script setup lang="ts">
import BaseAwait from "@/components/base-await.vue";
import { Skeleton } from "@/components/ui/skeleton";
import type { MaybeLazy } from "@/utils/lazy-helpers";

const props = defineProps<{
  headline?: MaybeLazy<string>;
}>();
</script>

<template>
  <section>
    <BaseAwait v-if="props.headline" :value="props.headline">
      <template #default="{ value }">
        <h2
          class="my-8 text-4xl font-medium tracking-tight text-pretty text-gray-950 dark:text-white"
        >
          {{ value }}
        </h2>
      </template>
      <template #loading>
        <div class="my-8">
          <Skeleton class="h-8 w-1/2" />
        </div>
      </template>
    </BaseAwait>
    <div v-if="$slots.default" class="flex flex-col gap-8">
      <slot />
    </div>
  </section>
</template>
