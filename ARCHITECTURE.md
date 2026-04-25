# Architecture — WealthHealth (HRNet)

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
│           ├── EmployeeForm/   # Form + fieldsets for creating an employee
│           └── EmployeeListControls/  # Search + pagination info bar
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
| Organisms | `features/employees/components/` | Feature-specific blocks: EmployeeForm, AddressFieldset, EmployeeTable, EmployeeListControls            |
| Templates | `components/shell/`              | Layout wrappers: Layout (nav + main), PageTemplate (heading + slot)                                    |

---

## Validation

`src/helpers/validator.ts` contains pure functions with no side effects:

| Function              | Rule                                        |
| --------------------- | ------------------------------------------- |
| `validateZipCode`     | Must be exactly 5 digits                    |
| `validateDateOfBirth` | Must be in the past                         |
| `validateStartDate`   | Must be after date of birth                 |
| `validateEmployee`    | Runs all three, returns `ValidationError[]` |

`useEmployeeForm` calls `validateEmployee` on submit and maps the result into an error object keyed by field name, which `FormField` reads via its `error` prop.

---

## External Package

The jQuery modal plugin was replaced by `@steinshy/wealthhealth-modal` — a standalone npm package built in a separate repository. It is consumed in `<Create>` to show a success confirmation after an employee is saved.

```tsx
// src/pages/employees/Create.tsx
import { Modal } from '@steinshy/wealthhealth-modal';

<Modal
  isOpen={showModal}
  onClose={handleCloseModal}
  status="success"
  autoCloseDuration={1500}
>
  <p>Employee Created!</p>
</Modal>;
```

See [`ARCHITECTURE.md` in the modal repo](../WealthHealth-modal/ARCHITECTURE.md) for its internal design.

---

## Performance & Quality

| Tool          | Config                | Purpose                                     |
| ------------- | --------------------- | ------------------------------------------- |
| Lighthouse CI | `.lighthouserc.json`  | Perf ≥0.80, A11y ≥0.90, BP ≥0.90, SEO ≥0.90 |
| ESLint        | `eslint.config.js`    | React Hooks rules, import order             |
| Stylelint     | `stylelint.config.js` | CSS property order                          |
| Prettier      | `.prettierrc.json`    | Consistent formatting                       |
| TypeScript    | strict mode           | Full type safety                            |

**Lighthouse scores (React app):** Performance 0.82 · Accessibility 1.0 · Best Practices 1.0 · SEO 1.0

Reports: `lighthouse-reports/`
