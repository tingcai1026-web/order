# Repository Guidelines

## Project Structure & Module Organization

- `App.tsx` orchestrates menu, cart, checkout, and admin flows; leverages localStorage for order history.
- `components/` holds UI pieces (`MenuCard`, `CartDrawer`, `OrderConfirmation`, `AdminDashboard`); prefer reusable, prop-driven components.
- `constants.ts` stores category/menu data and display order; `types.ts` defines enums and data shapes used across components.
- `index.tsx` boots the React app and mounts into `index.html`; Vite config lives in `vite.config.ts`.
- `.env.local` supplies `GEMINI_API_KEY` for AI calls; never commit secrets.

## Build, Test, and Development Commands

- `npm install` �X install dependencies.
- `npm run dev` �X start Vite dev server with hot reload; opens browser by default.
- `npm run build` �X produce optimized production assets in `dist/`.
- `npm run preview` �X serve the built app locally from `dist/`.
- No formal test script is defined; see Testing Guidelines for expectations.

## Coding Style & Naming Conventions

- TypeScript + React functional components; prefer hooks over class components.
- Use 2-space indentation, PascalCase for components/files in `components/`, camelCase for functions/variables, and UPPER_SNAKE_CASE for constant maps.
- Keep shared types in `types.ts` and avoid duplicating shape definitions inline.
- Keep styling via utility classes as in existing components; co-locate component-specific helpers with the component.

## Testing Guidelines

- Target behavior-first tests (Vitest + React Testing Library recommended) named `*.test.tsx` alongside features or under `components/__tests__/`.
- Minimum coverage when added: rendering without crashing, cart add/remove/update flows, order submission generating an order number, and admin history clear/persist behavior.
- Manual smoke tests before merging: run `npm run dev`, add multiple items (with/without noodles), complete checkout, confirm confirmation modal renders totals, and verify history persists after refresh.

## Commit & Pull Request Guidelines

- Write imperative, concise commit messages (e.g., "Add admin history clear action"); bundle related changes together.
- Pull requests should describe scope, testing performed, and any UI changes (screenshots or short Loom/GIF when applicable).
- Reference relevant issues or tasks; call out breaking changes or migration steps (e.g., new env vars).
- Keep diffs minimal: prefer small, focused PRs; include instructions for reviewers if setup differs locally.

## 回應用中文
