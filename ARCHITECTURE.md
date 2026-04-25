# Architecture — WealthHealth (HRNet)

[Français](ARCHITECTURE.fr.md)

## Overview

WealthHealth is a React 19 + TypeScript single-page application built with Vite. It replaces the original jQuery HRNet project, allowing HR staff to create employee records and browse the employee list. There are no server-side dependencies — all state is held in memory for the session.

**Stack:** React 19 · TypeScript 6 · Vite 8 · React Router 7 · Plain CSS

---

## Project Structure

```
src/
├── main.tsx                    # Entry point — mounts <App> in StrictMode
├── App.tsx                     # Root — providers + router
├── index.css                   # Global design tokens and base styles
│
├── context/
│   └── EmployeeContext.tsx     # Global employee state (Context + useReducer)
│
├── pages/
│   ├── Home/
│   │   └── Home.tsx            # Route "/" — landing page with CTAs
│   └── employees/
│       ├── Create.tsx          # Route "/create" — employee creation form
│       └── List.tsx            # Route "/employees" — employee table
│
├── features/
│   └── employees/
│       └── components/
│           ├── EmployeeForm/          # Form + fieldsets for creating an employee
│           ├── EmployeeTable/         # Sortable table + horizontal scroll on small screens
│           └── EmployeeListControls/  # Search + table info (counts)
│
├── components/
│   ├── shell/                  # Layout wrappers (Layout, PageTemplate)
│   ├── patterns/               # Composed UI patterns
│   │   ├── FormField/          # Label + input/select/date + error message
│   │   ├── Pagination/         # Prev/Next page controls
│   │   ├── SearchInput/        # Controlled search box
│   │   ├── SortableTh/         # Sortable <th> with accessible <button>
│   │   └── TableInfo/          # "Showing X–Y of Z entries"
│   ├── ui/                     # Atomic UI primitives
│   │   ├── Button/
│   │   ├── Heading/
│   │   ├── Label/
│   │   ├── Select/
│   │   ├── TextInput/
│   │   ├── ErrorMessage/
│   │   └── SortIndicator/
│
├── hooks/
│   ├── useEmployeeForm.ts      # Form state, validation, submit handler
│   ├── useFilter.ts            # Generic full-text search filter
│   ├── usePagination.ts        # Page slice + navigation
│   └── useSortableData.ts      # Sortable array (string + date keys)
│
├── helpers/
│   └── validator.ts            # Pure validation functions for Employee
│
├── utils/
│   └── states.ts               # Static data: US states list, departments list
│
└── types/
    └── index.ts                # Shared TypeScript interfaces (Employee, State)
```

---

## Application Bootstrap

```
main.tsx
  └── <React.StrictMode>
        └── <App>
              └── <BrowserRouter>
                    └── <EmployeeProvider>   ← global employee state
                          └── <Layout>
                                ├── Route "/"           → <Home>
                                ├── Route "/create"     → <Create>
                                └── Route "/employees"  → <List>
```

---

## State Management

Employee state is global and held entirely in memory using React Context + `useReducer`.

**`src/context/EmployeeContext.tsx`**

| Export             | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `EmployeeProvider` | Wraps the app; owns the `employees` array and `dispatch`            |
| `useEmployees()`   | Hook consumed by any component needing `employees` or `addEmployee` |

**Reducer actions:**

| Action         | Effect                                                 |
| -------------- | ------------------------------------------------------ |
| `ADD_EMPLOYEE` | Appends a new employee with a `crypto.randomUUID()` id |

> State resets on page refresh (no persistence). This is intentional — the eval requirement was to use a state management system rather than localStorage.

---

## Data Flow

### Creating an employee

```
<Create> page
  └── <EmployeeForm>
        └── useEmployeeForm()
              ├── handleChange → updates local formData state
              └── handleSubmit
                    ├── validateEmployee(formData)  ← pure function, no side effects
                    │     └── returns ValidationError[]
                    ├── on errors → setErrors() → FormField shows inline messages
                    └── on success → addEmployee(formData) → EmployeeContext dispatch
                                  → onSuccess() → <Create> shows <Modal>
```

### Listing employees

```
<List> page
  └── useEmployees()          ← reads employees[] from context
        └── useFilter(employees)         → filtered by search term (all fields)
              └── useSortableData(filtered)    → sorted by clicked column
                    └── usePagination(sorted, 10)  → sliced to current page
```

The three hooks compose in sequence — each receives the output of the previous one. Resetting pagination when the search term changes is handled explicitly in `<List>` by calling `pagination.reset()` inside `handleSearch`.

---

## Routing

| Path         | Component  | Purpose               |
| ------------ | ---------- | --------------------- |
| `/`          | `<Home>`   | Landing page          |
| `/create`    | `<Create>` | Create a new employee |
| `/employees` | `<List>`   | View all employees    |

Uses `BrowserRouter` with `basename={import.meta.env.BASE_URL}` for GitHub Pages deployment compatibility.

---

## Component Design — Atomic Design

Components are split into three layers:

| Layer     | Folder                           | Role                                                                                                   |
| --------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Atoms     | `components/ui/`                 | Single-purpose elements: Button, TextInput, Select, Label, Heading, ErrorMessage, SortIndicator        |
| Molecules | `components/patterns/`           | Composed from atoms: FormField (label + input + error), SortableTh, Pagination, SearchInput, TableInfo |
| Organisms | `features/employees/components/` | Feature-specific blocks: EmployeeForm (includes AddressFieldset), EmployeeTable, EmployeeListControls  |
| Templates | `components/shell/`              | Layout wrappers: Layout (nav + main), PageTemplate (heading + slot)                                    |

---

## Validation

`src/helpers/validator.ts` is pure logic with no side effects. **`validateEmployee`** is the only public export; it runs zip, date-of-birth, and start-date checks internally and returns a `ValidationError[]` (the helper functions and `ValidationError` type stay module-private).

| Concern            | Rule                                                       |
| ------------------ | ---------------------------------------------------------- |
| Zip                | Exactly 5 digits                                           |
| Date of birth      | Must parse as a real date and be strictly before “now”     |
| Start date         | Must be on or after date of birth (only checked if DOB OK) |
| `validateEmployee` | Runs the above and aggregates any failures                 |

`useEmployeeForm` calls `validateEmployee` on submit and maps the result into an error object keyed by field name, which `FormField` reads via its `error` prop.

---

## External Package

The jQuery modal plugin was replaced by `@steinshy/wealthhealth-modal` — a standalone npm package built in a separate repository. It is consumed in `<Create>` to show a success confirmation after an employee is saved.

```tsx
// src/pages/employees/Create.tsx (excerpt)
import { Modal, useTheme } from '@steinshy/wealthhealth-modal';

<Modal
  isOpen={showModal}
  onClose={handleCloseModal}
  title="Success"
  status="success"
  autoCloseDuration={1500}
>
  <p>Employee Created!</p>
</Modal>;
```

See the modal package repo for its own architecture and API docs.

---

## Performance & Quality

| Tool          | Config                | Purpose                                     |
| ------------- | --------------------- | ------------------------------------------- |
| Lighthouse CI | `.lighthouserc.json`  | Perf ≥0.80, A11y ≥0.90, BP ≥0.90, SEO ≥0.90 |
| Knip          | `knip.json`           | Unused files, exports, dependency drift     |
| ESLint        | `eslint.config.js`    | React Hooks rules, import order             |
| Stylelint     | `stylelint.config.js` | CSS property order                          |
| Prettier      | `.prettierrc.json`    | Consistent formatting                       |
| TypeScript    | strict mode           | Full type safety                            |

**Lighthouse scores (React app):** Performance 0.82 · Accessibility 1.0 · Best Practices 1.0 · SEO 1.0

Reports: `lighthouse-reports/`

---

**Docs:** [README (English)](README.md) · [README (Français)](README.fr.md) · [Architecture (Français)](ARCHITECTURE.fr.md)
