<script setup lang="ts">
import { marked } from "marked";
import BaseAwait from "@/components/base-await.vue";
import { Skeleton } from "@/components/ui/skeleton";
import type { MaybeLazy } from "@/utils/lazy-helpers";
import { Button } from "@/components/ui/button";
import { iconMap, type ActionIcon } from "@/utils/icons";

const props = defineProps<{
  title?: MaybeLazy<string>;
  snippet?: MaybeLazy<string>;
  action?: () => unknown;
  actionLabel?: MaybeLazy<string>;
  actionIcon?: MaybeLazy<ActionIcon>;
}>();

const onAction = async () => {
  if (props.action) await Promise.resolve(props.action());
};
</script>

<template>
  <div class="text-white max-w-prose flex items-start justify-between gap-4">
    <div class="min-w-0">
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
    <div v-if="props.action" class="shrink-0">
      <Button variant="secondary" @click="onAction">
        <Component v-if="props.actionIcon" :is="iconMap[props.actionIcon]" class="size-4" />
        <BaseAwait v-if="props.actionLabel" :value="props.actionLabel">
          <template #default="{ value }">{{ value }}</template>
          <template #loading>
            <Skeleton class="h-4 w-16" />
          </template>
        </BaseAwait>
        <template v-else>Action</template>
      </Button>
    </div>
  </div>
</template>
