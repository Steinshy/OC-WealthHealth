# CLAUDE.md

Guidance for AI coding agents (Claude Code) working in this repository.

## Project

WealthHealth (HRnet) — an OpenClassrooms project migrating a jQuery HR app to a
React SPA. HR staff create employees and browse a searchable, sortable,
paginated list. All state is in-memory (React Context + `useReducer`); there is
no backend, no persistence, and — intentionally — no `localStorage`.

**Stack:** React 19 · TypeScript 6 (strict) · Vite 8 (Rolldown/oxc) ·
React Router 7 · plain CSS (co-located per component, no CSS Modules).

## Package manager

**pnpm** (version pinned in `package.json` → `packageManager`; enable with
`corepack enable`). Node version: `.nvmrc` (24), `engines` requires >= 22.
Never use npm or yarn; never commit `package-lock.json` or `yarn.lock`.

## Commands

| Command                 | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| `pnpm install`          | Install dependencies                          |
| `pnpm run dev`          | Vite dev server on port 5173                  |
| `pnpm run build`        | Typecheck (app + node tsconfigs) + vite build |
| `pnpm run type-check`   | Typecheck only                                |
| `pnpm run lint`         | ESLint (flat config, `eslint.config.js`)      |
| `pnpm run lint:styles`  | Stylelint on `src/**/*.css`                   |
| `pnpm run format:check` | Prettier check (config: `prettier.config.js`) |
| `pnpm run knip`         | Unused files/exports/dependencies             |

CI (`.github/workflows/ci.yml`) runs build, knip, lint, lint:styles and
format:check — all must pass. There is no test runner/test suite.

## Layout

- `src/pages/` — route components (`/`, `/create`, `/employees`)
- `src/features/employees/` — EmployeeForm, EmployeeTable, list controls
- `src/components/ui/` — atoms (Button, TextInput, Select, …)
- `src/components/patterns/` — molecules (FormField, Pagination, SortableTh, …)
- `src/components/shell/` — Layout, PageTemplate
- `src/context/EmployeeContext.tsx` — global employee state
- `src/hooks/` — useEmployeeForm, useFilter, useSortableData, usePagination
- `src/helpers/validator.ts` — pure form validation
- `HRNet-original/` — the legacy jQuery app kept for reference; do not modify
- `scripts/` — local Lighthouse reporting tools (not part of the app build)

See `ARCHITECTURE.md` for data flow and component-design details.

## Conventions

- Path alias `@/*` → `src/*` (see `tsconfig.app.json`); prefer it over deep
  relative imports.
- TypeScript is strict (`noUncheckedIndexedAccess` included) — no `any`,
  no non-null assertions to silence errors.
- Named exports; components are arrow functions (`export const Foo = () =>`).
- Styles live next to the component (`Component/Component.css`).
- The success modal comes from the published package
  `@steinshy/wealthhealth-modal` — do not reimplement it here.
- Docs are bilingual: any change to `README.md` or `ARCHITECTURE.md` must be
  mirrored in `README.fr.md` / `ARCHITECTURE.fr.md`.
