<script setup lang="ts">
import { marked } from "marked";
import BaseAwait from "@/components/base-await.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveDeep } from "@/utils/lazy-helpers";
import type { MaybeLazy } from "@/utils/lazy-helpers";

const props = defineProps<{
  body: MaybeLazy<string>;
}>();
</script>

<template>
  <article class="prose dark:prose-invert">
    <BaseAwait :value="resolveDeep(props)">
      <template #default="{ value }">
        <div v-html="marked(value.body)" />
      </template>
      <template #loading>
        <div class="space-y-2">
          <Skeleton class="h-4 w-11/12" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-10/12" />
          <Skeleton class="h-4 w-11/12" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-9/12" />
          <Skeleton class="h-4 w-10/12" />
          <Skeleton class="h-4 w-6/12" />
        </div>
      </template>
    </BaseAwait>
  </article>
</template>
