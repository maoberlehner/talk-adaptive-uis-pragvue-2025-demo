import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { generateText, streamText } from "ai";
import systemPrompt from "@/prompts/layout-generator.md?raw";
import { config } from "@/config";
import { memoizeAsync, cacheKeyFrom } from "@/utils/cache";

export const streamLayoutYamlFastOrSlow = (prompt: string) => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined;
  if (!apiKey) throw new Error("VITE_GOOGLE_API_KEY is required for AI layout generation");

  const google = createGoogleGenerativeAI({ apiKey });
  const { textStream } = streamText({
    model:
      config.perf.modelSpeed === "fast" ? google("gemini-2.5-flash") : google("gemini-2.5-pro"),
    system: systemPrompt,
    prompt,
    temperature: 0,
    providerOptions: {
      google: {
        thinkingConfig: {
          includeThoughts: false,
          thinkingBudget: config.perf.modelSpeed === "fast" ? 0 : 128,
        },
      },
    },
  });

  return { textStream };
};

export const streamLayoutYamlLudicrous = (prompt: string) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  if (!apiKey) throw new Error("VITE_GROQ_API_KEY is required for AI layout generation");
  const groq = createGroq({ apiKey });
  const { textStream } = streamText({
    model: groq("openai/gpt-oss-120b"),
    system: systemPrompt,
    prompt,
  });

  return { textStream };
};

export const streamLayoutYaml =
  config.perf.modelSpeed === "ludicrous" ? streamLayoutYamlLudicrous : streamLayoutYamlFastOrSlow;

const getLayoutYamlFastOrSlow = async (prompt: string) => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined;
  if (!apiKey) throw new Error("VITE_GOOGLE_API_KEY is required for AI layout generation");

  const google = createGoogleGenerativeAI({ apiKey });
  const { text } = await generateText({
    model:
      config.perf.modelSpeed === "fast" ? google("gemini-2.5-flash") : google("gemini-2.5-pro"),
    system: systemPrompt,
    prompt,
    temperature: 0,
    providerOptions: {
      google: {
        thinkingConfig: {
          includeThoughts: false,
          thinkingBudget: config.perf.modelSpeed === "fast" ? 0 : 128,
        },
      },
    },
  });

  return text;
};

const getLayoutYamlLudicrous = async (prompt: string) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  if (!apiKey) throw new Error("VITE_GROQ_API_KEY is required for AI layout generation");
  const groq = createGroq({ apiKey });
  const { text } = await generateText({
    model: groq("openai/gpt-oss-120b"),
    system: systemPrompt,
    prompt,
  });

  return text;
};

export const getLayoutYaml = memoizeAsync(
  config.perf.modelSpeed === "ludicrous" ? getLayoutYamlLudicrous : getLayoutYamlFastOrSlow,
  {
    ttlMs: 1000 * 60 * 60,
    namespace: "ai.get-layout-yaml",
    key: (prompt) => cacheKeyFrom("ai.get-layout-yaml", [prompt, systemPrompt]),
  },
);
