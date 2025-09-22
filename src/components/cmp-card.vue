<script setup lang="ts">
import { marked } from "marked";
import BaseAwait from "@/components/base-await.vue";
import { Skeleton } from "@/components/ui/skeleton";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardImage from "@/components/ui/card/CardImage.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import type { MaybeLazy } from "@/utils/lazy-helpers";

const props = defineProps<{
  title?: MaybeLazy<string>;
  image?: MaybeLazy<{ src: string; alt: string; width?: number; height?: number }>;
  body?: MaybeLazy<string>;
}>();
</script>

<template>
  <Card>
    <BaseAwait v-if="props.image" :value="props.image">
      <template #default="{ value }">
        <CardImage>
          <img
            :src="`${(value as any).src}?auto=compress&fit=crop&w=384&h=288`"
            :alt="(value as any).alt"
            width="384"
            height="288"
            class="w-full h-auto"
          />
        </CardImage>
      </template>
      <template #loading>
        <CardImage>
          <Skeleton class="block w-full aspect-[4/3]" />
        </CardImage>
      </template>
    </BaseAwait>
    <BaseAwait v-if="props.title" :value="props.title">
      <template #default="{ value }">
        <CardHeader>
          <CardTitle>{{ value }}</CardTitle>
        </CardHeader>
      </template>
      <template #loading>
        <CardHeader>
          <CardTitle>
            <Skeleton class="h-6 w-2/3" />
          </CardTitle>
        </CardHeader>
      </template>
    </BaseAwait>
    <BaseAwait v-if="props.body" :value="props.body">
      <template #default="{ value }">
        <CardContent>
          <p v-html="marked(value)" class="text-gray-300" />
        </CardContent>
      </template>
      <template #loading>
        <CardContent>
          <div class="space-y-2">
            <Skeleton class="h-4 w-11/12" />
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-9/12" />
          </div>
        </CardContent>
      </template>
    </BaseAwait>
  </Card>
</template>
