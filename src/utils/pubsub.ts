import PubSub from "pubsub-js";

export type PubSubItem<T = unknown> = {
  id: string;
  topic: string;
  data: T;
  metadata: {
    publishedAt: string;
    [k: string]: unknown;
  };
};

export type PubSubEvent<T = unknown> =
  | { type: "publish"; item: PubSubItem<T> }
  | { type: "unpublish"; id: string }
  | { type: "replay"; item: PubSubItem<T> };

const storageKey = (topic: string) => `pubsub:${topic}`;

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    console.warn("pubsub storage parse failed", e);
    return fallback;
  }
};

export const getTopicItems = <T = unknown>(topic: string): PubSubItem<T>[] => {
  if (typeof localStorage === "undefined") return [];
  return safeParse<PubSubItem<T>[]>(localStorage.getItem(storageKey(topic)), []);
};

export const setTopicItems = <T = unknown>(topic: string, items: PubSubItem<T>[]) => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(storageKey(topic), JSON.stringify(items));
  } catch (e) {
    console.warn("pubsub storage write failed", e);
  }
};

export const appendTopicItem = <T = unknown>(topic: string, item: PubSubItem<T>) => {
  const items = getTopicItems<T>(topic);
  items.push(item);
  setTopicItems(topic, items);
};

export const removeTopicItem = (topic: string, id: string) => {
  const items = getTopicItems(topic);
  const next = items.filter((i) => i.id !== id);
  setTopicItems(topic, next);
};

export const subscribe = <T = unknown>(topic: string, handler: (event: PubSubEvent<T>) => void) => {
  const token = PubSub.subscribe(topic, (_msg: string, event: PubSubEvent<T>) => handler(event));
  return () => PubSub.unsubscribe(token);
};

export const publishEvent = <T = unknown>(topic: string, event: PubSubEvent<T>) => {
  PubSub.publish(topic, event);
};

export const publishBacklog = <T = unknown>(topic: string) => {
  const items = getTopicItems<T>(topic);
  for (const item of items) publishEvent<T>(topic, { type: "replay", item });
};

export const genId = () => {
  try {
    // @ts-ignore
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return Math.random().toString(36).slice(2);
};
