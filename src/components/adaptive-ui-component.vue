<script setup lang="ts">
import { computed } from "vue";
import type { ConfigComponent } from "@/entites/config";
import { parseComponent } from "@/utils/components";
import { componentMap } from "@/adaptive";
import { publish, unpublish } from "@/repositories/pubsub";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataSources } from "@/composables/data-sources";

const props = defineProps<{
  config: ConfigComponent;
  context: Record<string, unknown>;
}>();

const dataSourcesRaw = computed(() => props.config.dataSources || []);
const { dataSources } = useDataSources(dataSourcesRaw, { context: props.context });

const context = computed(
  () =>
    ({
      ...props.context,
      ...dataSources.value,
      publish,
      unpublish,
    }) satisfies Record<string, unknown>,
);
const component = computed(() =>
  parseComponent(props.config.component, { context: context.value }),
);
</script>

<template>
  <template v-if="component">
    <Component :is="componentMap[component.name]" v-bind="component.props" v-slot="slotProps">
      <template v-for="child in props.config.children || []" :key="child">
        <AdaptiveUiComponent :config="child" :context="{ ...context, ...slotProps.context }" />
      </template>
    </Component>
  </template>
  <template v-else>
    <Skeleton class="h-56" />
  </template>
</template>
