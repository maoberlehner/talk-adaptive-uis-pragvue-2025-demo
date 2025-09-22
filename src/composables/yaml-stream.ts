import merge from "lodash.merge";
import { ref } from "vue";
import { parse } from "yaml";

const sanitize = (chunk: string) => {
  return chunk
    .replace(/(.*?)<\/think>/, "")
    .split("\n")
    .filter((l) => !l.trim().startsWith("```"))
    .filter((l) => l.trim() !== "yml")
    .filter((l) => l.trim() !== "yaml")
    .join("\n");
};

export const useYamlStream = <T>({ initialValue }: { initialValue: T }) => {
  const result = ref<T>(structuredClone(initialValue));
  let yaml: string = "";

  let isThinking = false;
  const push = (chunk: string) => {
    if (chunk.includes(`<think>`)) {
      isThinking = true;
    }
    if (chunk.includes(`</think>`)) {
      isThinking = false;
    }
    if (isThinking) return;

    yaml += sanitize(chunk);
    const yamlWithNoPendingLines = yaml.slice(0, Math.max(0, yaml.lastIndexOf("\n")));

    try {
      merge(result.value, parse(yamlWithNoPendingLines));
    } catch (error) {
      console.debug(yaml);
      throw error;
    }
  };
  const finish = () => push("\n");
  const reset = () => {
    result.value = structuredClone(initialValue);
    yaml = "";
  };

  return { result, push, finish, reset };
};
