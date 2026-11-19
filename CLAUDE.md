# WealthHealth

OpenClassrooms HRnet migration: legacy jQuery HR app rebuilt as a React 19 + TypeScript SPA (Vite 8, `react-router` 8, React context + `useReducer`). No backend in this repo; employees live in memory and are lost on reload. `README.md` and `ARCHITECTURE.md` own the overview.

## Commands

- `pnpm run dev` (:5173, strictPort), `build` (tsc app + node configs, then Vite), `preview` (:3000), `type-check`.
- Quality gates run by CI: `lint`, `lint:styles`, `format:check`, `knip`; also `lint:fix` and `format`.
- `pnpm run lighthouse`: LHCI via `.lighthouserc.local.json`; needs a built `dist/` and a free port 4173. `lighthouse:report`, `:report:hrnet`, `:pdf`, `:compare` and `:full` produce the before/after comparison with `HRNet-original/`.
- Node 24 (`.nvmrc`), pnpm 10 (`packageManager` pins `pnpm@10.33.0`).
- CI (`ci.yml`) runs on push to `main`/`dev` and on PRs; `deploy.yml` builds with `VITE_BASE_PATH=/<repo-name>/`, publishes to GitHub Pages and runs Lighthouse CI against the deployed URL.

## Layout

- Routes in `src/App.tsx`: `/` Home, `/create`, `/employees`, `*` NotFound.
- `src/features/employees/` (form, table, list controls), `src/components/` (`ui/`, `patterns/`, `shell/`), `src/context/EmployeeContext.tsx`, `src/hooks/`, `src/helpers/validator.ts`, `src/utils/states.ts`, `src/types/`.
- `.oc/` holds the OpenClassrooms brief, deliverables and plugin issues (French); `HRNet-original/` is the legacy Lighthouse baseline.

## Rules

- jQuery plugin replacements: native `<input type="date">`, `Modal` from `@steinshy/wealthhealth-modal` (the sibling library project), native `<select>` via `ui/Select`, React-rendered table.
- Validation rules live in `helpers/validator.ts`: required text fields, 5-digit zip, date of birth in the past, start date after it.
- Path alias `@` maps to `src`; TypeScript is strict.
- There is no unit-test runner; Lighthouse is the only automated performance check.
- Deliverable reminder: one jQuery plugin converted to a standalone React library and published to npm (done as `@steinshy/wealthhealth-modal`).
