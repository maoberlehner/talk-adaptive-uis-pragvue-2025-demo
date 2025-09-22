<script setup lang="ts">
import { colSpanMap, type ConfigColSpan } from "@/entites/config";
import BaseAwait from "@/components/base-await.vue";
import { Skeleton } from "@/components/ui/skeleton";
import type { MaybeLazy } from "@/utils/lazy-helpers";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";

const props = withDefaults(
  defineProps<{
    images: MaybeLazy<{ src: string; alt: string; width: number; height: number }[]>;
    colSpan?: ConfigColSpan[];
  }>(),
  {
    colSpan: () => ["6", "md:3"],
  },
);
</script>

<template>
  <BaseAwait :value="props.images">
    <template #default="{ value: images }">
      <Card>
        <CardContent>
          <div class="grid grid-cols-12 gap-4">
            <div
              v-for="image in (images as any[]) || []"
              :class="props.colSpan.map((cs) => colSpanMap[cs])"
              :key="(image as any).src"
            >
              <img
                :src="`${(image as any).src}?auto=compress&fit=crop&h=800&w=800`"
                :alt="(image as any).alt"
                :width="800"
                :height="800"
                class="w-full h-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
    <template #loading>
      <Card>
        <CardContent>
          <div class="grid grid-cols-12 gap-4">
            <div v-for="i in 6" :key="i" :class="props.colSpan.map((cs) => colSpanMap[cs])">
              <Skeleton class="w-full aspect-square" />
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
  </BaseAwait>
</template>
