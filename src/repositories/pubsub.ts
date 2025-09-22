import { appendTopicItem, genId, publishEvent, removeTopicItem } from "@/utils/pubsub";

type Json = Record<string, unknown>;

export const publish = ({
  topic,
  json,
  metadata = {},
}: {
  topic: string;
  json: Json;
  metadata?: Record<string, unknown>;
}): void => {
  const item = {
    id: genId(),
    topic,
    data: json,
    metadata: {
      publishedAt: new Date().toISOString(),
      ...metadata,
    },
  };

  appendTopicItem(topic, item);
  publishEvent(topic, { type: "publish", item });
};

export const unpublish = ({ topic, id }: { topic: string; id: string }): void => {
  removeTopicItem(topic, id);
  publishEvent(topic, { type: "unpublish", id });
};
