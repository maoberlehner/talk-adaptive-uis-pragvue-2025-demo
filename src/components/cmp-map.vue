<script setup lang="ts">
import BaseAwait from "@/components/base-await.vue";
import { Skeleton } from "@/components/ui/skeleton";
import type { MaybeLazy } from "@/utils/lazy-helpers";

const props = defineProps<{
  items: MaybeLazy<unknown[]>;
}>();
</script>

<template>
  <BaseAwait :value="props.items">
    <template #default="{ value: items }">
      <template v-if="items.length > 0">
        <template v-for="item in items || []" :key="item">
          <slot :context="{ item }" />
        </template>
      </template>
      <template v-else>
        <div class="text-gray-500 col-span-12">No items found.</div>
      </template>
    </template>
    <template #loading>
      <div class="space-y-2 col-span-12">
        <Skeleton class="h-8 w-11/12" />
        <Skeleton class="h-8 w-full" />
        <Skeleton class="h-8 w-9/12" />
        <Skeleton class="h-8 w-10/12" />
        <Skeleton class="h-8 w-11/12" />
      </div>
    </template>
  </BaseAwait>
</template>
