# WealthHealth / HRnet - Project TODO

**Project Status:** Phase 2 (npm library + Lighthouse) — In Progress  
**Last Updated:** April 9, 2026

**OpenClassrooms briefs:** [`.oc/Livrable.md`](.oc/Livrable.md) · [`.oc/Mail.md`](.oc/Mail.md) · [`.oc/index.md`](.oc/index.md)

---

## 📋 Project Overview

Three-phase project for **HRnet** (internal employee records), migration **jQuery → React** (OpenClassrooms P12):

- **Phase 1:** Full **HRnet** SPA in React — **Create Employee** + **Employee List**, **localStorage** state (no jQuery in the bundle).
- **Phase 2:** Pick **one** legacy jQuery plugin → implement a **reusable React component** in a **separate GitHub repo**, publish to **npm** (or **GitHub Packages**), then **install** it into HRnet. The **other three** plugin areas are replaced **inside this repo only** (your code or small documented dependencies).
- **Phase 3:** **Lighthouse** PDF reports — legacy static app **before** vs React **production build** **after** — plus submission **TXT/PDF** with required links (see `.oc/Livrable.md`).

---

## 📄 FILES TO CREATE

### Frontend Files (this repo — `src/`)

- [ ] `src/components/Layout/PageShell.tsx` — Optional shared shell: HRnet title, padding, children slot.
  - Use if you want one place for page chrome instead of duplicating wrappers in pages.
- [ ] `src/components/Navigation/MainNav.tsx` — Optional nav with `<Link to="/">` and `<Link to="/employees">`.
  - Prefer `<Link>` over `<button onClick={navigate}>` for internal routes (a11y + open in new tab).
- [ ] `src/components/DateField.tsx` — Optional controlled date field replacing **xdsoft datetimepicker** (`m/d/Y` in legacy → align format in `validator.ts` / display).
  - **⚠️ DECISION NEEDED:** Native `<input type="date">` only vs small custom calendar UI?
- [ ] `src/components/DepartmentSelect.tsx` — Optional `<select>` for departments with **fixed option order** (mitigates jQuery UI SelectMenu ordering issues).
- [ ] `src/components/EmployeeTable.tsx` — Optional presentational table + sort UI to slim down `EmployeeList.tsx`.
- [ ] `docs/HRNET-ARCHITECTURE.md` — Optional: routes, localStorage key, data flow (helps oral + team).

### New GitHub repository (npm library — **one** chosen plugin only)

Create **outside** this folder — **separate repo** per `.oc/Mail.md`:

- [ ] `package.json` — `name`, `version`, `"type": "module"`, **`peerDependencies`**: `react`, `react-dom`; **dev**: TypeScript, Vite or `tsup`, React for tests.
- [ ] `tsconfig.json` — `declaration: true`, strict paths.
- [ ] `src/index.ts` — Public exports of your component.
- [ ] `src/Modal.tsx` (example if you chose modal) — Functional component + **JSDoc / comments on each prop** (Jade requirement).
- [ ] `README.md` — What it does, `npm install`, minimal usage example, props table, limitations.
- [ ] `LICENSE` — e.g. MIT.
- [ ] `CHANGELOG.md` — Version history for npm.
- [ ] `.gitignore` — `node_modules/`, `dist/`.

### Deliverable & report files (submission)

- [ ] `lighthouse-reports/before/hrnet-jquery-<date>.pdf` — Lighthouse export for **legacy** app (serve `.oc/Frontend base/`).
- [ ] `lighthouse-reports/after/hrnet-react-<date>.pdf` — Lighthouse on **`npm run preview`** (production build).
- [ ] `livrable-oc.txt` or `.pdf` — **Three links** per `.oc/Livrable.md`: (1) library repo, (2) full HRnet repo, (3) npm or GitHub Packages URL (adjust filename to platform rules).

### Configuration Files (optional)

- [ ] `.env.example` — Only if you introduce `VITE_*` variables (not required for localStorage-only HRnet).

---

# ✅ PHASE 1: HRNET REACT APPLICATION

### Frontend Status

- [x] Project initialized (React + TypeScript + Vite + React Router).
- [x] Routes: `/` → Create Employee, `/employees` → Employee List (`src/App.tsx`).
- [x] Pages: `src/pages/CreateEmployee.tsx`, `src/pages/EmployeeList.tsx`.
- [x] Persistence: `src/utils/states.ts` + `localStorage` (replaces legacy `app.js` / `employee-list.js` reads).
- [x] Success feedback: `src/components/SuccessModal.tsx` (replaces `$('#confirmation').modal()`).
- [x] Styling: `src/styles/form.css`, `table.css`, `modal.css`.
- [ ] **Plugin parity (inside this repo — no second npm package required for these three):**
  - [ ] **Dates** — Legacy uses **xdsoft datetimepicker** on `#date-of-birth`, `#start-date` (`app.js`). React: controlled fields + validation (`helpers/validator.ts`).
  - [ ] **State / department selects** — Legacy uses **jQuery UI selectmenu** on `#state`, `#department`. React: native `<select>` + stable options (`utils/states.ts` for states).
  - [ ] **Table** — Legacy uses **DataTables** on `#employee-table` (`employee-list.js`). React: custom table + search + sort + pagination in `EmployeeList.tsx`.
- [ ] **Data quality**
  - [ ] Stable **`id`** on each new employee + use as React `key` in list (not array index).
  - [ ] List **refreshes** after creating an employee (reload from `getEmployees()` on navigation or focus).
  - [ ] Defensive **`JSON.parse`** in `getEmployees` (corrupt localStorage must not crash the app).
- [ ] **Navigation polish** — Replace internal `<button> + navigate()` with `<Link>` where appropriate.
- [ ] **⚠️ DECISION NEEDED:** Published modal library (Phase 2) — replace `SuccessModal` body with npm component or keep wrapper component?

### Implementation Strategy (Agent Approved)

1. **Data model** — Lock `Employee` in `src/types/index.ts` + `saveEmployee` / `getEmployees` behaviour.
2. **Create Employee** — All fields, validation messages, submit, reset, open success modal.
3. **Employee List** — Load employees, search, sort, pagination, empty state, stable keys.
4. **Remove any jQuery** — Confirm `index.html` has no jQuery/datatables/datetimepicker CDN scripts.
5. **UX / a11y** — Focus order, labels, modal behaviour documented for Phase 2 integration.

### Files to Modify

- `src/App.tsx` — Route table; optional layout wrapper.
- `src/pages/CreateEmployee.tsx` — Form fields matching legacy; wire to `saveEmployee`, `SuccessModal`.
- `src/pages/EmployeeList.tsx` — Table + filters; **refresh** data when route is shown; `key={employee.id}`.
- `src/components/SuccessModal.tsx` — Later: thin wrapper around npm modal or merge behaviour.
- `src/utils/states.ts` — Save/load employees; optional migration when adding `id`.
- `src/helpers/validator.ts` — Zip, dates, `startDate` vs `dateOfBirth`, etc.
- `src/types/index.ts` — `Employee` shape aligned with localStorage.
- `src/styles/form.css`, `src/styles/table.css`, `src/styles/modal.css` — Parity with `.oc/Frontend base/app.css` or document UI changes in README.
- `index.html` — Title/branding; **must not** load jQuery.
- `README.md` (root) — How to run, how the four plugin areas are covered, link to npm package when published.

- [ ] **Styling & responsive** — Match existing breakpoints / containers from legacy CSS where required by mentor.
- [ ] **Error handling** — Show field errors on create form; disable submit while invalid if you add async later.

#### Testing Requirements

- [ ] Create employee with valid data → appears in `/employees` without full page refresh issues.
- [ ] Invalid submit → errors shown, nothing persisted incorrectly.
- [ ] Search / sort / pagination with 25+ rows.
- [ ] Reload browser → employees still listed (`localStorage`).
- [ ] Network tab: **no** `jquery.min.js` / DataTables / datetimepicker CDN for the React app.

---

## 📦 PHASE 2: JQUERY PLUGIN → REACT LIBRARY + NPM

### Requirements Summary (`.oc/Mail.md` + `.oc/Livrable.md`)

- **One** plugin chosen from: datepicker, modal, selectmenu, DataTables (see `.oc/jQuery plugins to convert/Index.md`).
- **Separate GitHub repository** containing only the React replacement for that plugin’s **UI behaviour** (skip AJAX / unrelated features).
- **Publish** to **npm** or **GitHub Packages**; document install command and peer React version.
- **Integrate** into WealthHealth: `npm install <your-package>` and use in HRnet (e.g. modal component).

### Library Checklist

- [ ] Implement component(s) with **functional** components only (no classes).
- [ ] **README** + **inline comments** on each **prop** (per Jade).
- [ ] `peerDependencies`: `react`, `react-dom`.
- [ ] Build outputs: ESM (+ CJS if needed), **TypeScript declarations**, `"files": ["dist"]`.
- [ ] `npm publish` (or GH Packages) and save the **package URL** for the submission file.

### Integration Tasks (this repo)

- [ ] `npm install <package>@<version>` (or `npm link` during dev).
- [ ] Replace or wrap `SuccessModal` (if modal chosen) — import from **npm**, not copy-paste source.
- [ ] `npm run build` succeeds.

#### Testing Requirements

- [ ] Fresh `npm install` in a clean clone: HRnet runs and shows the component from the published package.
- [ ] Version pin documented in `README.md`.

---

## 📊 PHASE 3: LIGHTHOUSE & OPENCLASSROOMS SUBMISSION

### Requirements Summary (`.oc/Livrable.md`)

1. **PDF** — Lighthouse report for **legacy** HRnet (static jQuery app).
2. **PDF** — Lighthouse report for **React** HRnet (**after** `npm run build`, test with `npm run preview` — not dev server, per brief).
3. **TXT or PDF** — Contains links to: library repo, full HRnet repo, npm/GitHub Packages.

### Tasks

- [ ] Serve legacy: e.g. `npx serve ".oc/Frontend base"` → run Lighthouse in Chrome → **Save as PDF** → `lighthouse-reports/before/`.
- [ ] `npm run build && npm run preview` → note port (often **4173**) → Lighthouse **Save as PDF** → `lighthouse-reports/after/`.
- [ ] Short **comparison** (table: FCP, LCP, CLS, TBT, scores + test conditions).
- [ ] Assemble **submission** file with **three links** + attach/zip PDFs per platform rules.
- [ ] Prepare **~15 min** oral (see `.oc/index.md`): problem, plugin choice, architecture, demo, metrics.

#### Testing Requirements

- [ ] Same machine / same throttling for both runs if you compare numbers in the report.
- [ ] Incognito / few extensions to reduce noise.

---

## 🛠️ Development Setup

### Frontend Setup (WealthHealth)

```bash
# Install dependencies
npm install
# Development
npm run dev              # Vite dev server (http://localhost:5173)
# Code quality
npm run lint             # ESLint on src
npm run type-check       # TypeScript noEmit
npm run lint:styles      # Stylelint on CSS
npm run format           # Prettier
npm run format:check
# Production
npm run build            # tsc + vite build
npm run preview          # Serve dist — use for Lighthouse "after"
```

### Legacy jQuery app (Lighthouse "before" only)

```bash
# From repo root — serve static legacy pages (pick a free port)
npx --yes serve ".oc/Frontend base"
# Open http://localhost:3000 (or printed URL) → run Lighthouse → export PDF
```

### Environment Variables

- **WealthHealth** — No `.env` required for default localStorage-only flow. Add `VITE_*` only if you introduce API calls later.

---

## 📁 Key File Locations

### React application (`src/`)

- `src/main.tsx` — React root.
- `src/App.tsx` — Router and routes.
- `src/pages/CreateEmployee.tsx` — Create form.
- `src/pages/EmployeeList.tsx` — List, search, sort, pagination.
- `src/components/SuccessModal.tsx` — Success dialog (legacy: jquery-modal).
- `src/utils/states.ts` — US states data + employee localStorage helpers.
- `src/helpers/validator.ts` — Form validation.
- `src/types/index.ts` — `Employee`, `State` types.
- `src/index.css`, `src/App.css` — Global styles.
- `src/styles/form.css`, `table.css`, `modal.css` — Feature styles.

### Legacy HRnet (reference only)

- `.oc/Frontend base/index.html` — Create Employee + plugins.
- `.oc/Frontend base/employee-list.html` — DataTables list.
- `.oc/Frontend base/app.js` — selectmenu, datetimepicker, save + modal.
- `.oc/Frontend base/employee-list.js` — DataTables columns.
- `.oc/Frontend base/app.css` — Legacy layout reference.

### OpenClassrooms briefs

- `.oc/Livrable.md` — Submission format.
- `.oc/Mail.md` — Jade scenario + rules.
- `.oc/index.md` — Learning goals + reflection answers + guide.
- `.oc/jQuery plugins to convert/Index.md` — Plugin URLs.
- `.lighthouserc.json` — LHCI config (may target `npm run dev`; **submission** audits should use **preview** build).

---

## 📝 Notes

### Known Issues / Gotchas

1. **Lighthouse** — `.lighthouserc.json` may start **dev** server (port **5173**). For **deliverable PDF**, audit **`npm run preview`** (production bundle), often port **4173**.
2. **localStorage** — Legacy `app.js` does not add `id`; add **`id`** in React for stable keys and future features.
3. **Date format** — Legacy picker used **`m/d/Y`** strings; React often uses **ISO `YYYY-MM-DD`** from `input type="date"` — keep validation and display consistent.
4. **One npm library only** — Do not publish four packages; only **one** plugin is the separate repo + npm deliverable.

### Testing Workflow

1. `npm run dev` — Create employee → navigate to list → verify row appears.
2. `npm run build && npm run preview` — Smoke test production build.
3. Legacy: `npx serve ".oc/Frontend base"` — Compare UX with React (optional).
4. Before submission: run Lighthouse PDFs + fill link file.

### Code Quality Commands

```bash
npm run lint:fix
npm run lint:styles:fix
npm run format
```

---

## 📋 HTML TEMPLATE ANALYSIS (Legacy HRnet)

### index.html (Create Employee)

**Current Structure:**

- `<head>` loads jQuery, **xdsoft datetimepicker**, **jquery-modal**, **jQuery UI** (selectmenu), `app.js`, `app.css`.
- Body: title **HRnet**, link to `employee-list.html`, **Create Employee** form `#create-employee`.
- Fields: first name, last name, **date of birth**, **start date**, address fieldset (street, city, **state** select, zip), **department** select.
- **Save** button calls `saveEmployee()`; hidden modal `#confirmation` for success.

**CSS Classes Used:**

- `title`, `container`, `address` (fieldset), labels/inputs as in `app.css`.

**Scripts / plugins loaded:**

- jQuery 3.5.1, `jquery.datetimepicker.full.min.js`, jquery-modal, jQuery UI 1.12.1.

**Behaviour (see `app.js`):**

- `#department`, `#state` → `.selectmenu()`.
- `#date-of-birth`, `#start-date` → `.datetimepicker({ timepicker: false, format: 'm/d/Y' })`.
- `saveEmployee()` → push to `employees` in **localStorage** → `$('#confirmation').modal()`.

**Data written to localStorage:**

```
Employee {
  firstName, lastName, dateOfBirth, startDate,
  department, street, city, state, zipCode
}
// No id in legacy snippet
```

### employee-list.html (Current Employees)

**Current Structure:**

- Loads jQuery, **DataTables** CSS/JS, `employee-list.js`, `app.css`.
- `#employee-div` with `#employee-table` empty (filled by DataTables).

**Columns (DataTables) — `employee-list.js`:**

- First Name, Last Name, Start Date, Department, Date of Birth, Street, City, State, Zip Code.

**Data source:**

- `JSON.parse(localStorage.getItem('employees'))`.

### Current React vs Legacy Template Comparison

**CreateEmployee.tsx vs index.html:**

| Feature            | React (target)                | Legacy template                                |
| ------------------ | ----------------------------- | ---------------------------------------------- |
| Form fields        | Same business fields          | Same IDs in HTML; React uses controlled inputs |
| Date inputs        | Native or custom `DateField`  | xdsoft datetimepicker `m/d/Y`                  |
| State / department | Native `<select>`             | jQuery UI **selectmenu**                       |
| Success            | `SuccessModal` or npm modal   | `jquery-modal` on `#confirmation`              |
| Scripts            | None from CDN in `index.html` | jQuery + plugins                               |

**EmployeeList.tsx vs employee-list.html:**

| Feature | React (target)            | Legacy template            |
| ------- | ------------------------- | -------------------------- |
| Table   | Custom HTML table + logic | **DataTables** plugin      |
| Columns | Same employee fields      | Same column set            |
| Data    | `getEmployees()`          | `localStorage` parse in JS |

---

**Status:** Phase 1 mostly complete — Phase 2 (npm library) + Phase 3 (Lighthouse + links) pending  
**Last Commit:** _(run `git log -1 --oneline` and paste here)_
