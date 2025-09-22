<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BaseAwait from "@/components/base-await.vue";
import { Skeleton } from "@/components/ui/skeleton";
import type { MaybeLazy } from "@/utils/lazy-helpers";
import { resolveDeep } from "@/utils/lazy-helpers";
import { Button } from "@/components/ui/button";
import { iconMap, type ActionIcon } from "@/utils/icons";

const props = defineProps<{
  title?: MaybeLazy<string>;
  header: MaybeLazy<string[]>;
  data: MaybeLazy<{ cells: [] } & Record<string, unknown>[]>;
  rowAction?: (row: string[]) => unknown;
  rowActionLabel?: MaybeLazy<string>;
  rowActionIcon?: MaybeLazy<ActionIcon>;
}>();

const { rowAction, ...maybeLazyProps } = props;
</script>

<template>
  <BaseAwait :value="resolveDeep(maybeLazyProps)">
    <template #default="{ value }">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="cell in value.header" :key="cell">{{ cell }}</TableHead>
            <TableHead v-if="value.rowActionLabel || rowAction">{{
              value.rowActionLabel ?? "Action"
            }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in value.data" :key="row">
            <TableCell v-for="cell in row.cells" :key="cell">{{ cell }}</TableCell>
            <TableCell v-if="rowAction">
              <Button variant="ghost" size="sm" @click="() => rowAction?.(row)">
                <Component
                  v-if="value.rowActionIcon"
                  :is="iconMap[value.rowActionIcon]"
                  class="size-4"
                />
                <span class="ml-2" v-if="value.rowActionLabel">{{ value.rowActionLabel }}</span>
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
    <template #loading>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="row in 10" :key="row">
              <Skeleton class="h-7" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in 10" :key="row">
            <TableCell v-for="cell in props.header" :key="`${row}${cell}`">
              <Skeleton class="h-7" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </BaseAwait>
</template>
