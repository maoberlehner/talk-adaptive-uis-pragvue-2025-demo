<script setup lang="ts">
import BaseAwait from "@/components/base-await.vue";
import { Skeleton } from "@/components/ui/skeleton";
import Card from "@/components/ui/card/Card.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import type { MaybeLazy } from "@/utils/lazy-helpers";
import { resolveDeep } from "@/utils/lazy-helpers";

const props = defineProps<{
  eyebrow: MaybeLazy<string>;
  number: MaybeLazy<number | string>;
  numberPrefix?: MaybeLazy<string>;
}>();
</script>

<template>
  <Card>
    <BaseAwait :value="resolveDeep(props)">
      <template v-slot="{ value }">
        <CardHeader>
          <CardDescription>{{ value.eyebrow }}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            <template v-if="value.numberPrefix">
              {{ value.numberPrefix }}
            </template>
            {{ Number(value.number).toLocaleString() }}
          </CardTitle>
        </CardHeader>
      </template>
      <template #loading>
        <CardHeader>
          <CardDescription>
            <Skeleton />
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            <Skeleton />
          </CardTitle>
        </CardHeader>
      </template>
    </BaseAwait>
  </Card>
</template>
