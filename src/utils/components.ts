import { evaluate } from "@/utils/evaluate";

export const parseComponent = (
  component: string | undefined,
  { context }: { context: Record<string, unknown> },
) => {
  const match = component?.match(/(.*?)\((.*?)\)$/);
  if (!match) return null;

  const [, name, paramsString] = match;
  console.debug("------------------------------------------");
  console.debug({ component });
  console.debug({ paramsString });
  console.debug({ context });
  const props = evaluate(`{${paramsString}}`, { context }) as Record<string, unknown>;
  return {
    name,
    props,
  };
};
