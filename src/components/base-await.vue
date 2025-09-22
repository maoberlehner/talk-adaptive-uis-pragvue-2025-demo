<script setup lang="ts" generic="T">
import { ref, watch } from "vue";
import { Skeleton } from "@/components/ui/skeleton";
import { isFunction, isPromise } from "@/utils/type-helpers";
import type { UnwrapMaybeLazy } from "@/utils/lazy-helpers";

const props = defineProps<{
  value?: T;
}>();

const isResolvable = (v: unknown) => isPromise(v) || isFunction(v);
const initial = isResolvable(props.value) ? undefined : (props.value as UnwrapMaybeLazy<T>);
const resolved = ref<UnwrapMaybeLazy<T> | undefined>(initial);

const resolve = (v: unknown | undefined) => {
  if (isFunction(v)) {
    try {
      return resolve(v());
    } catch (error) {
      resolved.value = undefined;
      console.error(error);
      return;
    }
  }

  if (isPromise(v)) {
    resolved.value = undefined;
    v.then((r) => {
      resolved.value = r;
    });
    return;
  }

  resolved.value = v;
};

watch(
  () => props.value,
  (v) => resolve(v),
  { immediate: true },
);
</script>

<template>
  <template v-if="resolved !== undefined">
    <slot :value="resolved" />
  </template>
  <template v-else>
    <slot name="loading">
      <Skeleton class="h-4 w-24" />
    </slot>
  </template>
</template>
