<script setup lang="ts">
import { gapMap, type ConfigPropsGap } from "@/entites/config";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import BaseAwait from "@/components/base-await.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveDeep } from "@/utils/lazy-helpers";
import type { MaybeLazy } from "@/utils/lazy-helpers";

const props = withDefaults(
  defineProps<{
    title?: MaybeLazy<string | null>;
    description?: MaybeLazy<string | null>;
    gap?: ConfigPropsGap;
  }>(),
  {
    title: null,
    description: null,
    gap: "4",
  },
);
</script>

<template>
  <BaseAwait :value="resolveDeep(props)">
    <template #default="{ value }">
      <Card>
        <CardHeader v-if="value.title">
          <CardTitle>{{ value.title }}</CardTitle>
          <CardDescription v-if="value.description">
            {{ value.description }}
          </CardDescription>
        </CardHeader>
        <CardContent :class="['flex', 'flex-col', gapMap[props.gap]]">
          <slot />
        </CardContent>
      </Card>
    </template>
    <template #loading>
      <Card>
        <CardHeader>
          <CardTitle><Skeleton class="h-7 w-24" /></CardTitle>
          <CardDescription>
            <Skeleton class="h-7 w-32" />
          </CardDescription>
        </CardHeader>
        <CardContent :class="['flex', 'flex-col', gapMap[props.gap]]">
          <div class="space-y-2">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-10/12" />
            <Skeleton class="h-4 w-11/12" />
          </div>
          <div class="space-y-2">
            <Skeleton class="h-4 w-10/12" />
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-11/12" />
          </div>
        </CardContent>
      </Card>
    </template>
  </BaseAwait>
</template>
