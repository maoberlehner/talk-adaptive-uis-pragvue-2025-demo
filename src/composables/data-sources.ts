import { ref, watchEffect, type Ref } from "vue";
import type { ConfigDataSource } from "@/entites/config";
import { evaluate } from "@/utils/evaluate";
import { resolvers } from "@/adaptive";
import { config as appConfig } from "@/config";

const getDataSourceResolver = (
  dataSourceRaw: string,
  {
    context = {},
  }: {
    context?: Record<string, unknown>;
  } = {},
) => {
  const match = dataSourceRaw.match(/(\w+)\(([\s\S]*?)\)\s*->\s*(\w+)/);
  if (!match) {
    console.debug(dataSourceRaw);
    throw new Error("Error resolving data source!");
  }

  const [, name, paramsRaw, contextName] = match;

  const params = paramsRaw
    ? (evaluate(`{${paramsRaw}}`, { context }) as Record<string, unknown>)
    : undefined;

  return { name, params, contextName };
};

export const useDataSources = (
  dataSourcesRaw: Ref<ConfigDataSource[] | null> = ref([]),
  {
    context = {},
  }: {
    context?: Record<string, unknown>;
  } = {},
) => {
  const dataSources = ref<Record<string, unknown>>({});
  const isResolved = ref(!appConfig.perf.streaming);

  const effectAsync = async () => {
    if (!dataSourcesRaw.value) return;
    isResolved.value = false;
    for (const dataSourceRaw of dataSourcesRaw.value) {
      const { name, params, contextName } = getDataSourceResolver(dataSourceRaw, { context });
      if (dataSources.value[contextName || name]) continue;

      dataSources.value[contextName || name] = await resolvers[name](params);
    }
    isResolved.value = true;
  };

  const effectSync = () => {
    if (!dataSourcesRaw.value) return;
    for (const dataSourceRaw of dataSourcesRaw.value) {
      const { name, params, contextName } = getDataSourceResolver(dataSourceRaw, { context });
      if (dataSources.value[contextName || name]) continue;

      dataSources.value[contextName || name] = resolvers[name](params);
    }
  };

  // Use `watchEffect` instead of `computed` to trigger loading of data sources
  // immediately.
  watchEffect(appConfig.perf.streaming ? effectSync : effectAsync);

  return { dataSources, isResolved };
};
