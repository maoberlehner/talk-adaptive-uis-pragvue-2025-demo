<script setup lang="ts">
import { computed, ref } from "vue";
import { SendHorizonal, Loader } from "lucide-vue-next";
import AdaptiveUI from "@/components/adaptive-ui.vue";
import type { Config } from "@/entites/config";
import { getLayoutYaml, streamLayoutYaml } from "@/repositories/ai";
import { useYamlStream } from "@/composables/yaml-stream";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { config as appConfig } from "@/config";
import { resolveDeep } from "@/utils/lazy-helpers";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import { useDataSources } from "@/composables/data-sources";

const prompt = ref("");
const isInitialized = ref(false);
const isWaitingForResponse = ref(false);
const configIsResolved = ref(false);
const error = ref<string | null>(null);

const {
  result: config,
  push,
  finish,
  reset,
} = useYamlStream<Config>({ initialValue: { children: [] } });

const submit = async () => {
  isInitialized.value = true;
  error.value = null;
  if (!prompt.value.trim()) return;
  isWaitingForResponse.value = true;
  try {
    reset();
    if (appConfig.perf.streaming) {
      const stream = streamLayoutYaml(prompt.value.trim());
      for await (const delta of stream.textStream) {
        push(delta);
      }
      finish();
    } else {
      push(await getLayoutYaml(prompt.value.trim()));
      finish();
      await resolveDeep(config.value);
      configIsResolved.value = true;
    }
  } catch (e) {
    console.debug(config.value);
    error.value = e instanceof Error ? e.message : "Unknown error generating layout";
  } finally {
    isWaitingForResponse.value = false;
  }
};
const dataSourcesRaw = computed(() => config.value.dataSources || null);
const { dataSources: context, isResolved: dataSourcesResolved } = useDataSources(dataSourcesRaw);

const canRender = computed(
  () =>
    config.value.children?.length &&
    (appConfig.perf.streaming || (configIsResolved.value && dataSourcesResolved.value)),
);
const hasSkeleton = computed(
  () =>
    (isInitialized.value && !canRender.value) ||
    (isWaitingForResponse.value && !config.value.children?.length),
);
const isLoading = computed(() => isWaitingForResponse.value || hasSkeleton.value);
</script>

<template>
  <div class="container mx-auto pb-28 grow flex flex-col">
    <template v-if="canRender">
      <Suspense>
        <AdaptiveUI :config="config" :context="context" />
      </Suspense>
    </template>
    <template v-else-if="hasSkeleton">
      <div class="space-y-16">
        <div class="space-y-8">
          <Skeleton class="h-12 w-96" />
          <div class="space-y-4">
            <div class="grid gap-4 grid-cols-12">
              <Skeleton class="h-44 col-span-12 md:col-span-4" />
              <Skeleton class="h-44 col-span-12 md:col-span-4" />
              <Skeleton class="h-44 col-span-12 md:col-span-4" />
            </div>
            <Skeleton class="h-44" />
          </div>
        </div>
        <div class="space-y-8">
          <Skeleton class="h-12 w-2/3" />
          <div class="space-y-4">
            <Skeleton class="h-44" />
            <div class="grid gap-4 grid-cols-12">
              <Skeleton class="h-44 col-span-12 md:col-span-6" />
              <Skeleton class="h-44 col-span-12 md:col-span-6" />
            </div>
            <Skeleton class="h-44" />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex grow">
        <div class="text-center m-auto max-w-96 text-pretty">
          <h1 class="text-6xl font-semibold">What do you want to get done today?</h1>
          <p class="text-gray-400 mt-6 text-xl">
            Let me know what you want to accomplish, and I'll show you a custom-tailored UI for your
            needs.
          </p>
        </div>
      </div>
    </template>
  </div>
  <div
    class="fixed bottom-0 left-0 right-0 border-t bg-background/70 backdrop-blur px-4 py-8 shadow-lg"
  >
    <form class="flex max-w-5xl mx-auto" @submit.prevent="submit">
      <label for="prompt" class="sr-only">Describe what you want to do</label>
      <Input
        id="prompt"
        name="prompt"
        type="text"
        class="flex-1 border-r-0 rounded-r-none"
        placeholder="How can I help you?"
        :disabled="isLoading"
        v-model="prompt"
      />
      <Button class="rounded-l-none" size="icon" :class="cn(isLoading && 'opacity-70')">
        <span class="sr-only">Generate UI for the task</span>
        <Loader v-if="isLoading" class="animate-spin" />
        <SendHorizonal v-else />
      </Button>
    </form>
    <p v-if="error" class="text-red-600 mt-2 max-w-5xl mx-auto">{{ error }}</p>
  </div>
</template>
