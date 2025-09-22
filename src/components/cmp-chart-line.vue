<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent, TitleComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { provide } from "vue";
import BaseAwait from "@/components/base-await.vue";
import { Skeleton } from "@/components/ui/skeleton";
import type { MaybeLazy } from "@/utils/lazy-helpers";
import { resolveDeep } from "@/utils/lazy-helpers";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type Axis = {
  type: "category" | "value";
  data?: MaybeLazy<(string | number)[]>;
};

const props = defineProps<{
  title: MaybeLazy<string>;
  xAxis: MaybeLazy<Axis>;
  yAxis: MaybeLazy<Axis>;
  series: MaybeLazy<MaybeLazy<{ value: number }[]>[]>;
}>();

use([CanvasRenderer, GridComponent, LineChart, TitleComponent]);
provide(THEME_KEY, "dark");
</script>

<template>
  <BaseAwait :value="resolveDeep(props)">
    <template #default="{ value }">
      <Card>
        <CardHeader>
          <CardTitle>{{ value.title }}</CardTitle>
          <CardDescription> </CardDescription>
        </CardHeader>
        <CardContent class="h-96">
          <VChart
            :option="{
              xAxis: value.xAxis,
              yAxis: value.yAxis,
              series: value.series.map((data: any) => ({ type: 'line', data })),
              backgroundColor: 'transparent',
              grid: { top: 30, right: 0, bottom: 30, left: 0 },
            }"
            autoresize
          />
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
        <CardContent class="h-96">
          <Skeleton class="w-full h-full" />
        </CardContent>
      </Card>
    </template>
  </BaseAwait>
</template>
