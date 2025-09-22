# Repository Guidelines

## Project Structure & Module Organization

- src/: Vue 3 app code. Notable folders: components/ (UI, e.g., cmp-\*.vue), repositories/ (data access), utils/ (helpers), router/ (Vue Router), prompts/ (content), entites/ (types/config).
- public/ and index.html: static assets and HTML shell.
- test/: shared test setup (e.g., setup.ts). Unit tests live co-located in src/\*_/_.test.ts.
- e2e/: Playwright tests (\*.spec.ts).
- Config: vite.config.ts (plugins, @ alias), vitest.config.ts (jsdom), eslint.config.ts, .prettierrc.json, .editorconfig.

## Build, Test, and Development Commands

- pnpm dev: Start Vite dev server.
- pnpm build: Type-check (vue-tsc) then build with Vite.
- pnpm preview: Preview the production build locally.
- pnpm test:unit: Run Vitest unit tests.
- pnpm test:e2e: Run Playwright tests (first run: npx playwright install).
- pnpm type-check: Run TypeScript type checks.
- pnpm lint: Run ESLint and Oxlint; pnpm format to apply Prettier to src/.

## Coding Style & Naming Conventions

- TypeScript + Vue SFCs. Use 2 spaces, LF, max width 100, single quotes, no semicolons (see .editorconfig/.prettierrc.json).
- Components: file names kebab-case (e.g., cmp-card.vue), component names PascalCase.
- Imports: prefer @ alias for src (e.g., import X from '@/utils/...').
- Keep UI logic in components/, data in repositories/, pure helpers in utils/.
- Don't leave comments in the code at the place where you made a change explaining what you did.

## Testing Guidelines

- Unit: Vitest + jsdom + Testing Library. Name as \*.spec.ts (co-locate with code).
- Setup: test/setup.ts is loaded by Vitest config.
- E2E: Playwright specs in e2e/\*.spec.ts. Build before running on CI.
- Aim to cover critical utils, repositories, and rendering of key components.

## Commit & Pull Request Guidelines

- Commits: imperative, concise subject; optionally add scope (e.g., components: refactor stack layout).
- PRs: clear description, linked issues, screenshots/GIFs for UI changes, testing notes.
- Checks: run pnpm lint, pnpm type-check, pnpm test:unit locally; include e2e scope if relevant.

## Security & Configuration Tips

- Use Node 20.19+ or 22.12+. Prefer pnpm.
- Do not commit secrets. For client config, use Vite env vars (VITE\_\* in .env) and document required keys.
- Be mindful: VITE\_\* variables are exposed to the client; avoid sensitive data.
