<script setup lang="ts">
import { marked } from "marked";
import BaseAwait from "@/components/base-await.vue";
import { Skeleton } from "@/components/ui/skeleton";
import type { MaybeLazy } from "@/utils/lazy-helpers";

const props = defineProps<{
  title?: MaybeLazy<string>;
  snippet?: MaybeLazy<string>;
}>();
</script>

<template>
  <div class="text-white max-w-prose">
    <BaseAwait v-if="props.title" :value="props.title">
      <template #default="{ value }">
        <h3 class="font-bold">{{ value }}</h3>
      </template>
      <template #loading>
        <Skeleton class="h-6 w-1/2" />
      </template>
    </BaseAwait>
    <BaseAwait v-if="props.snippet" :value="props.snippet">
      <template #default="{ value }">
        <p v-html="marked(value)" />
      </template>
      <template #loading>
        <div class="mt-3 space-y-2">
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-10/12" />
          <Skeleton class="h-4 w-11/12" />
        </div>
      </template>
    </BaseAwait>
  </div>
</template>
