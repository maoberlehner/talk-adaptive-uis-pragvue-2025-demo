<script setup lang="ts">
import AdaptiveUIComponent from "@/components/adaptive-ui-component.vue";
import { colSpanMap, type Config } from "@/entites/config";

const props = defineProps<{
  config: Config;
  context: Record<string, unknown>;
}>();
</script>

<template>
  <div class="grid grid-cols-12 gap-12">
    <template v-for="childConfig in props.config.children" :key="childConfig">
      <div
        class="animate-zoom-in opacity-0"
        :class="
          childConfig.colSpan ? childConfig.colSpan.map((cs) => colSpanMap[cs]) : `col-span-12`
        "
      >
        <AdaptiveUIComponent :config="childConfig" :context="context" />
      </div>
    </template>
  </div>
</template>
