import Exa from "exa-js";
import { memoizeAsync, cacheKeyFrom } from "@/utils/cache";

export type Snippet = {
  title: string;
  snippet: string;
  text: string;
};

const _research = async (
  query: string,
  { limit = 5 }: { limit?: number } = {},
): Promise<Snippet[]> => {
  const key = import.meta.env.VITE_EXA_API_KEY as string | undefined;
  if (!key) throw new Error("VITE_EXA_API_KEY is required for research()");

  const exa = new Exa(key);
  const result = await exa.searchAndContents(query, {
    type: "keyword",
    text: true,
    summary: {
      query:
        "Summarize the information as an executive assistant would for a CEO. Make it read like you would report it to the CEO. Focus in the content not what type of source it is.",
    },
    numResults: limit,
  });

  const items = result?.results ?? [];
  return items.map((item: any, i: number) => {
    const title = String(item?.title ?? item?.url ?? `Result ${i + 1}`);
    const snippet = String(item?.summary ?? "")
      .replace("Summary:", "")
      .trim();
    const text = String(item?.text ?? "");
    return {
      title,
      snippet,
      text,
    };
  });
};

export const research = memoizeAsync(_research, {
  ttlMs: 1000 * 60 * 60,
  namespace: "research.search",
  key: (query, { limit = 5 } = {}) => cacheKeyFrom("research.search", [query, limit]),
});
