import type { Config } from "@/entites/config";
import { parse } from "yaml";

export const yamlToConfig = (yaml: string): Config => {
  const raw = parse(yaml) ?? {};
  return raw;
};
