// import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { memoizeAsync, cacheKeyFrom } from "@/utils/cache";
import { resolveDeep, type MaybeLazy } from "@/utils/lazy-helpers";

const _prompt = async (
  prompt: MaybeLazy<string>,
  systemMessage?: MaybeLazy<string>,
): Promise<string> => {
  // const apiKey = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined;
  // if (!apiKey) throw new Error("VITE_GOOGLE_API_KEY is required for AI layout generation");
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  if (!apiKey) throw new Error("VITE_GROQ_API_KEY is required for AI layout generation");
  const groq = createGroq({ apiKey });

  // const google = createGoogleGenerativeAI({ apiKey });
  const { text } = await generateText({
    model: groq("openai/gpt-oss-120b"),
    system: await resolveDeep(systemMessage),
    prompt: await resolveDeep(prompt),
    temperature: 0,
    providerOptions: {
      google: {
        thinkingConfig: {
          includeThoughts: false,
          thinkingBudget: 0,
        },
      },
    },
  });

  return text;
};

export const prompt = memoizeAsync(_prompt, {
  ttlMs: 1000 * 60 * 60,
  namespace: "prompt",
  key: (prompt, systemMessage) => cacheKeyFrom("prompt", [prompt, systemMessage]),
});
