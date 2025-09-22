<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from "vue";
import {
  getTopicItems,
  publishBacklog,
  subscribe,
  type PubSubItem,
  type PubSubEvent,
} from "@/utils/pubsub";

const props = defineProps<{
  topic: string;
  sortOrder?: "asc" | "desc";
}>();

const entries = ref<PubSubItem[]>([]);

const handler = (event: PubSubEvent) => {
  if (event.type === "publish" || event.type === "replay") {
    const id = event.item.id;
    if (!entries.value.find((i) => i.id === id)) entries.value.push(event.item);
  }
  if (event.type === "unpublish") {
    entries.value = entries.value.filter((i) => i.id !== event.id);
  }
};

let unsubscribe: (() => void) | null = null;

onMounted(() => {
  entries.value = getTopicItems(props.topic);
  unsubscribe = subscribe(props.topic, handler);
  publishBacklog(props.topic);
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const sortedEntries = computed(() => {
  const sorted = [...entries.value];
  sorted.sort((a, b) => {
    const da = new Date(a.metadata.publishedAt).getTime();
    const db = new Date(b.metadata.publishedAt).getTime();
    return (props.sortOrder ?? "asc") === "asc" ? da - db : db - da;
  });
  return sorted;
});
</script>

<template>
  <template v-if="sortedEntries.length > 0">
    <slot :context="{ entries: sortedEntries }" :key="sortedEntries" />
  </template>
  <template v-else>
    <div class="text-gray-500 col-span-12">No items found.</div>
  </template>
</template>
