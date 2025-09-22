# Adaptive UIs with Vue and AI: What If Your UI Could Build Itself?

Slides: https://talk-adaptive-uis-pragvue-2025.netlify.app/1

We carefully craft the design of current-day apps and websites tailored to a specific use case. Yet the needs of our users often don’t fit neatly into the boxes we put them in when we imagine how they use our applications. What if we could take it a step further and build interfaces that adapt on demand to the specific needs of our users? With the power of modern, state-of-the-art LLMs, we can dynamically generate and adapt the UI of our application to meet the exact needs of our users in real-time. In this talk, we explore how to build a single AI-powered component that automatically responds to all UI requirements in a fast and reliable way.

In this talk you'll learn:

1. What the “adaptive UI” pattern is and how it differs from vibe coding.
2. How to implement a minimal adaptive renderer in Vue that consumes a YAML UI spec and a whitelisted component registry.
3. How to apply guardrails to keep it fast and reliable with a constrained schema and caching/latency tricks.

## Running the app

> Warning: this application is not meant to be live deployed as is! The code exposes secrets to the frontend!

- Add your API keys in a local `.env` file:
  - `VITE_EXA_API_KEY` (required for research)
  - `VITE_GOOGLE_API_KEY` (required for AI YAML generation)
- Start the dev server: `pnpm dev`

Use the bottom prompt bar to describe the UI you want. The AI uses the layout-generator system prompt to produce YAML, which is then rendered live.
