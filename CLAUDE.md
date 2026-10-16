# WealthHealth — HRnet Employee Management System

**Type:** Frontend web application (OpenClassrooms HRnet migration)  
**Status:** React SPA at repo root; jQuery removed from the app; backend not present in this repository

---

## Project Overview

HRnet is an OpenClassrooms project demonstrating:

- Migrating a legacy jQuery HR app to a modern React + TypeScript SPA
- Employee create and list flows with in-memory state (React context; no persistence across reloads)
- Responsive UI and performance-oriented tooling (Lighthouse CI)

Reference material for the brief, deliverables, and legacy jQuery assets lives under **`.oc/`** (see [OpenClassrooms notes (.oc)](#openclassrooms-notes-oc)).

---

## Architecture Overview

### Frontend (this repository)

| Area        | Details                                                              |
| ----------- | -------------------------------------------------------------------- |
| **UI**      | React 19 + TypeScript                                                |
| **Build**   | Vite 8 (Rolldown bundler; vendor chunks split via `rolldownOptions`) |
| **Routing** | React Router 8 (`react-router` package)                              |
| **State**   | React context + `useReducer` (`EmployeeContext`), in memory          |
| **Quality** | ESLint 10, Stylelint 17, Prettier 3, TypeScript 6, Knip 6            |

Routes (`src/App.tsx`): `/` → Home, `/create` → Create Employee, `/employees` → Employee List, `*` → NotFound.

### Backend / database

Not included here. Any REST API or database work remains out of scope for this repo unless added later.

---

## Repository layout

The React app lives at the **repository root** (there is no `Frontend/` subfolder for the current app).

```
WealthHealth/
├── .oc/                          # OpenClassrooms brief, deliverables, issue screenshots
│   ├── index.md                  # Project brief overview (FR)
│   ├── Livrable.md               # Deliverable checklist (FR)
│   ├── Mail.md                   # Full project narrative / tasks (FR)
│   ├── Issues/Issues.md          # Links & context for the four jQuery plugins (+ PNG screenshots)
│   ├── jQuery plugins to convert/Index.md
│   ├── Submission/Submission.txt # Submission fields (repo and npm package URLs)
│   ├── touse.md                  # External link (mui.com)
│   └── logo.png
├── HRNet-original/               # Legacy jQuery HRnet app (Lighthouse baseline)
├── public/                       # Static assets (assets/, Mockup/, robots.txt)
├── scripts/                      # Lighthouse report, PDF and compare scripts (.mjs)
├── src/
│   ├── components/               # ui/, patterns/, shell/ (shared building blocks)
│   ├── context/                  # EmployeeContext
│   ├── features/employees/       # EmployeeForm, EmployeeTable, EmployeeListControls
│   ├── helpers/                  # validator.ts (form rules)
│   ├── hooks/                    # useEmployeeForm, useFilter, usePagination, useSortableData, useDocumentTitle
│   ├── pages/                    # Home, employees/Create, employees/List, NotFound
│   ├── types/                    # Employee, StoredEmployee, State; env.d.ts
│   ├── utils/                    # states.ts (states, departments)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── dist/                         # Production build output (generated, gitignored)
├── .github/workflows/            # ci.yml (quality checks), deploy.yml (GitHub Pages + Lighthouse)
├── index.html
├── vite.config.ts
├── tsconfig.json                 # References tsconfig.app.json and tsconfig.node.json
├── eslint.config.js
├── stylelint.config.js
├── prettier.config.js
├── knip.json
├── .lighthouserc.json            # LHCI config for CI (deployed URL)
├── .lighthouserc.local.json      # LHCI config for `pnpm run lighthouse` (local preview, port 4173)
├── .lighthouseci/                # LHCI assertion results
├── package.json
├── pnpm-lock.yaml
├── .nvmrc                        # Node 24
└── README.md, README.fr.md, ARCHITECTURE.md, ARCHITECTURE.fr.md
```

### CI / deployment

- **`.github/workflows/ci.yml`** — on push to `main`/`dev` and on PRs: `pnpm install --frozen-lockfile`, `pnpm run build` (includes `tsc`), `pnpm run knip`, `pnpm run lint`, `pnpm run lint:styles`, `pnpm run format:check` (Node 24).
- **`.github/workflows/deploy.yml`** — on push to `main`/`dev`: build with `VITE_BASE_PATH` set to `/<repo-name>/`, upload `dist` to **GitHub Pages**, then run Lighthouse CI (3 runs, `.lighthouserc.json`) on the deployed URL.

---

## Development setup

### Prerequisites

- Node.js 24 (`.nvmrc`; `engines` in `package.json` says `>=22`)
- pnpm 10 (pinned by `packageManager`: `pnpm@10.33.0`)

### Install and run

```bash
pnpm install
pnpm install --frozen-lockfile   # CI-equivalent install
pnpm run dev                     # http://localhost:5173 (strictPort)
pnpm run build                   # tsc (app + node configs) + vite build
pnpm run preview                 # serve dist/ on http://localhost:3000 (vite.config.ts)
```

### Code quality

```bash
pnpm run type-check
pnpm run lint
pnpm run lint:fix
pnpm run lint:styles
pnpm run format
pnpm run format:check
pnpm run knip
```

### Performance (Lighthouse CI)

```bash
pnpm run lighthouse              # LHCI with .lighthouserc.local.json: preview on :4173, / and /employees
pnpm run lighthouse:report       # HTML + JSON reports for app routes → lighthouse-reports/app/
pnpm run lighthouse:report:hrnet # HTML + JSON reports for HRNet-original → lighthouse-reports/hrnet/
pnpm run lighthouse:pdf          # HTML reports → PDF
pnpm run lighthouse:compare      # PDF comparison of app vs HRNet original
pnpm run lighthouse:full         # all four steps above, in order
```

---

## Current features

**Employee management**

- Create employee with validation (`src/helpers/validator.ts`)
- List employees with search, sortable columns, and pagination
- In-memory state only (`EmployeeContext`); employees are lost on reload

**UX**

- Responsive layout (media queries), success modal after save (`@steinshy/wealthhealth-modal`)

**Technical**

- TypeScript strict mode, path alias `@` → `src` (`vite.config.ts`, `tsconfig.app.json`)
- Optional `VITE_BASE_PATH` for deployed base path (see `vite.config.ts`)

---

## jQuery plugin migration (HRnet → React)

The legacy stack used third-party jQuery plugins (see `.oc/Issues/Issues.md` and `.oc/jQuery plugins to convert/Index.md`): **datetimepicker**, **jquery-modal**, **jQuery UI selectmenu**, **DataTables**.

In this React app:

| Concern   | Approach in codebase                            |
| --------- | ----------------------------------------------- |
| Dates     | Native `<input type="date">` on Create Employee |
| Modal     | `Modal` from `@steinshy/wealthhealth-modal`     |
| Dropdowns | Native `<select>` (wrapped by `ui/Select`) for state and department |
| Table     | React-rendered table on Employee List           |

**OpenClassrooms deliverable:** convert **one** of those plugins into a **standalone React library**, document it, and publish it to **npm** or **GitHub Packages** — typically in a **separate repository** from the main HRnet app. See `.oc/Livrable.md` and `.oc/Mail.md` for the full brief (links to GitHub, npm package, Lighthouse before/after).

---

## Testing

- **Lighthouse:** `@lhci/cli` runs against `/` and `/employees` locally via `.lighthouserc.local.json`, and against the deployed Pages URL in CI via `.lighthouserc.json`.
- **Unit/integration tests:** no runner (e.g. Vitest/Jest) is wired in `package.json` at present; the brief allows manual testing if time-constrained.

---

## Key files

| File                              | Role                                                             |
| --------------------------------- | ---------------------------------------------------------------- |
| `src/App.tsx`                     | Routes (`/`, `/create`, `/employees`, `*`)                       |
| `src/pages/employees/Create.tsx`  | Form page; opens the success `Modal` after save                  |
| `src/pages/employees/List.tsx`    | Table + search, sort, pagination                                 |
| `src/features/employees/`         | `EmployeeForm`, `EmployeeTable`, `EmployeeListControls`          |
| `src/context/EmployeeContext.tsx` | In-memory employee list (`useReducer`) and `addEmployee`         |
| `src/helpers/validator.ts`        | Form rules: required text fields, 5-digit zip, DOB in the past, start date after DOB |
| `src/utils/states.ts`             | `states` and `departments` lists (no storage helpers)            |
| `src/types/index.ts`              | `Employee`, `StoredEmployee`, `State`                            |
| `vite.config.ts`                  | React plugin, typecheck checker (dev), bundle visualizer (prod build), `@` alias |

---

## Dependencies (snapshot)

Versions drift with `pnpm install`; `package.json` holds the exact ranges.

- **Runtime:** `react` ^19.2, `react-dom` ^19.2, `react-router` ^8.2 (not `react-router-dom`), `@steinshy/wealthhealth-modal` ^0.2, `@fontsource/roboto` and `@fontsource/dm-serif-display` ^5.3
- **Tooling:** `vite` ^8.1, `@vitejs/plugin-react` ^6, `vite-plugin-checker` ^0.14, `typescript` ^6.0, `typescript-eslint` ^8.64, ESLint 10, Stylelint 17, Prettier 3, Knip 6, `lighthouse` ^13, `@lhci/cli` ^0.15, `puppeteer` ^25, `rollup-plugin-visualizer` ^7

---

## OpenClassrooms notes (.oc)

| File                                 | Contents                                                                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `index.md`                           | Project brief overview (FR)                                                                                                            |
| `Livrable.md`                        | Deliverable list: GitHub links, npm/GitHub Packages link for the converted library, Lighthouse PDF before/after                        |
| `Mail.md`                            | Full stakeholder story: convert HRnet to React, replace plugins, functional style, Lighthouse on production build, optional unit tests |
| `Issues/Issues.md`                   | GitHub issue links for date picker, modal, dropdowns, DataTables (+ PNG screenshots in `Issues/`)                                      |
| `jQuery plugins to convert/Index.md` | Short link list per plugin (datetimepicker, jquery-modal, selectmenu, DataTables)                                                      |
| `Submission/Submission.txt`          | Submission fields: library repo URL, WealthHealth repo URL, npm package URL                                                            |
| `touse.md`                           | External link (mui.com, UI library reference)                                                                                          |

---

## Troubleshooting

- See `README.md` for quick start.
- Build failures: run `pnpm run type-check` and `pnpm run lint`.
- LHCI (local): `.lighthouserc.local.json` starts `vite preview` on port 4173, so a built `dist/` and a free port 4173 are required.

---

## Quick reference

| Action           | Command                     |
| ---------------- | --------------------------- |
| Dev server       | `pnpm run dev`              |
| Production build | `pnpm run build`            |
| Preview build    | `pnpm run preview`          |
| Typecheck        | `pnpm run type-check`       |
| Lint / styles    | `pnpm run lint` / `pnpm run lint:styles` |
| Format check     | `pnpm run format:check`     |
| Unused code      | `pnpm run knip`             |
| Lighthouse CI    | `pnpm run lighthouse`       |
| Lighthouse full  | `pnpm run lighthouse:full`  |
