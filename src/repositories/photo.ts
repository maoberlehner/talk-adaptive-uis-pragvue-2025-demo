import { createClient } from "pexels";
import { memoizeAsync, cacheKeyFrom } from "@/utils/cache";

const key = import.meta.env.VITE_PEXELS_API_KEY as string | undefined;
if (!key) throw new Error("VITE_PEXELS_API_KEY is required");
const client = createClient(key);

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const _search = async (
  query: string,
  { limit = 80 }: { limit?: number } = {},
): Promise<Photo[]> => {
  const res = await client.photos.search({ query, per_page: limit });
  if (!("photos" in res) || !res.photos) return [];

  const photos = res.photos as Array<{
    src: { original: string };
    alt: string | null;
    width: number;
    height: number;
  }>;

  return photos.slice(0, limit).map((p) => ({
    src: p.src.original,
    alt: p.alt ?? "",
    width: p.width,
    height: p.height,
  }));
};

export const search = memoizeAsync(_search, {
  ttlMs: 1000 * 60 * 60,
  namespace: "photo.search",
  key: (query, { limit = 80 } = {}) => cacheKeyFrom("photo.search", [query, limit]),
});
