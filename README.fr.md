<h1 align="center">WealthHealth</h1>

[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint)](https://eslint.org)
[![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?logo=prettier&logoColor=000)](https://prettier.io)
[![Stylelint](https://img.shields.io/badge/Stylelint-17-000?logo=stylelint)](https://stylelint.io)
[![Lighthouse CI](https://img.shields.io/badge/Lighthouse_CI-configured-F44B21?logo=lighthouse)](https://github.com/GoogleChrome/lighthouse-ci)

<p align="center">
  <img
    src="public/Mockup/mockup.png"
    alt="WealthHealth HR — maquette responsive (bureau, tablette, mobile)"
  />
</p>

Migration **HRnet** OpenClassrooms : une SPA React + TypeScript pour créer et lister des employés, avec l’effectif tenu en **contexte React en mémoire** (un rechargement de page efface les données), validation des saisies, interface responsive et **Lighthouse CI** optionnel dans GitHub Actions.

## Démo en ligne et ressources

| Ressource             | URL ou lien                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------ |
| Langue                | Français · [English](./README.md)                                                          |
| Architecture          | [ARCHITECTURE.md](./ARCHITECTURE.md)                                                       |
| ArchitectureFr        | [ARCHITECTURE.fr.md](./ARCHITECTURE.fr.md)                                                 |
| GitHub                | https://github.com/Steinshy/OC-WealthHealth                                                |
| Démo en ligne         | https://steinshy.github.io/OC-WealthHealth/                                                |
| Paquet modal (npm)    | [@steinshy/wealthhealth-modal](https://www.npmjs.com/package/@steinshy/wealthhealth-modal) |
| Paquet modal (GitHub) | [OC-WealthHealth-modal](https://github.com/Steinshy/OC-WealthHealth-modal)                 |

## Fonctionnalités

- **Parcours type CRUD employé** — Formulaire de création (États-Unis, services, dates, bloc adresse) ; liste avec recherche, tri et pagination
- **État côté client** — Employés dans `EmployeeContext` (`useReducer`) ; pas de `localStorage` ni d’API de persistance dans ce dépôt
- **TypeScript d’abord** — Typage strict des modèles et des hooks
- **React Router 7** — `BrowserRouter` avec `basename` issu de `import.meta.env.BASE_URL` pour GitHub Pages
- **Découpage en composants** — Coque (`Layout`, `PageTemplate`), fonctionnalités sous `features/employees`, UI partagée et motifs réutilisables
- **Interface responsive** — Points de rupture 768px / 480px, défilement horizontal pour le large tableau sur petits écrans, barre d’app tenant compte des encoches (safe area)
- **Qualité** — ESLint 10, Stylelint 17, Prettier 3, Knip, vérifications TypeScript au build et plugin Vite checker en dev (optionnel)

## Prérequis

- **Node.js** >= 22 (voir `engines` dans `package.json`)
- **npm** 9+ recommandé

## Installation

```bash
git clone https://github.com/Steinshy/OC-WealthHealth.git
cd OC-WealthHealth
npm install
```

## Démarrage rapide

### Serveur de développement

```bash
npm run dev
```

L’application est servie sur **http://localhost:5173** (voir `vite.config.ts`).

### Build de production et prévisualisation

```bash
npm run build
npm run preview
```

La prévisualisation utilise par défaut **http://localhost:3000**.

### Modal de succès après création d’un employé

`Create.tsx` enveloppe le formulaire dans `PageTemplate`, utilise `Modal` depuis `@steinshy/wealthhealth-modal` et appelle `setTheme('light')` pour harmoniser le rendu avec la coque :

```tsx
import { Modal, useTheme } from '@steinshy/wealthhealth-modal';
import { PageTemplate } from '@/components/shell';
import { EmployeeForm } from '@/features/employees';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export const Create = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/employees');
  };

  return (
    <PageTemplate pageHeading="Create a new employee">
      <EmployeeForm onSuccess={() => setShowModal(true)} />
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Success"
        status="success"
        autoCloseDuration={1500}
      >
        <p>Employee Created!</p>
      </Modal>
    </PageTemplate>
  );
};
```

## Routes

| Chemin       | Description                                             |
| ------------ | ------------------------------------------------------- |
| `/`          | Accueil — héros d’entrée et liens vers création / liste |
| `/create`    | Formulaire de création + modal de succès                |
| `/employees` | Tableau recherchable, triable et paginé                 |

## Structure du projet

```
src/
├── App.tsx                 # Routes + EmployeeProvider + BrowserRouter
├── main.tsx
├── index.css               # Jetons globaux, polices, reset
├── context/
│   └── EmployeeContext.tsx # Liste employés en mémoire (useReducer)
├── features/employees/     # Formulaire, tableau, contrôles de liste
├── components/
│   ├── shell/              # Layout, PageTemplate
│   ├── patterns/         # SearchInput, Pagination, SortableTh, …
│   └── ui/                # Button, TextInput, Select, …
├── pages/
│   ├── Home/
│   └── employees/         # Create, List
├── hooks/                  # useFilter, useSortableData, usePagination, …
├── helpers/
│   └── validator.ts       # Règles de validation du formulaire
├── types/
│   └── index.ts           # Employee, State
└── utils/
    └── states.ts          # Liste des États US et services
```

## Scripts npm

| Script                            | Description                                        |
| --------------------------------- | -------------------------------------------------- |
| `npm run dev`                     | Serveur de dev Vite (port 5173)                    |
| `npm run build`                   | Typecheck + bundle de production dans `dist/`      |
| `npm run preview`                 | Sert `dist/` (port 3000)                           |
| `npm run type-check`              | `tsc --noEmit` uniquement                          |
| `npm run lint`                    | ESLint                                             |
| `npm run lint:styles`             | Stylelint                                          |
| `npm run format` / `format:check` | Prettier                                           |
| `npm run knip`                    | Fichiers / exports inutilisés et dépendances       |
| `npm run lighthouse`              | Lighthouse CI (fichier `.lighthouserc.local.json`) |

## Modèle de données

Pendant la session, les employés sont conservés dans le contexte. Chaque nouvel enregistrement reçoit un `id` via `crypto.randomUUID()` à l’ajout.

```typescript
export interface Employee {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  startDate: string;
  department: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}
```

## Styles

Les jetons **d’inspiration Material** sont sur `:root` dans `src/index.css`. Les jetons de rupture (`--mu-bp-mobile`, `--mu-bp-tablet`) documentent les valeurs littérales utilisées dans les `@media` des feuilles de composants.

```css
:root {
  --mu-bp-mobile: 480px;
  --mu-bp-tablet: 768px;
  --mu-primary: #1976d2;
  --mu-primary-dark: #1565c0;
  --mu-bg: #f5f5f5;
  --mu-surface: #fff;
  --mu-text-primary: rgb(0 0 0 / 87%);
  --mu-text-secondary: rgb(0 0 0 / 60%);
  --mu-divider: rgb(0 0 0 / 12%);
  --mu-error: #d32f2f;
  --mu-shadow-1: /* elevation */;
  --mu-shadow-4: /* app bar shadow */;
}
```

Les règles par composant sont dans des fichiers `*.css` adjacents (pas de CSS Modules). Pour surcharger, modifiez ces fichiers ou étendez `index.css`.

## Accessibilité

- HTML sémantique pour formulaires, tableaux et navigation
- Libellés reliés aux champs via les motifs `Label` / `FormField`
- En-têtes de colonnes triables exposés comme boutons accessibles (`SortableTh`)
- Styles de focus visibles sur les contrôles interactifs
- Zones de toucher minimales renforcées sur petits écrans (barre d’app, en-têtes de tableau, boutons principaux)

## Navigateurs pris en charge

| Navigateur | Remarque |
| ---------- | -------- |
| Chrome     | Dernière |
| Firefox    | Dernière |
| Safari     | Dernière |
| Edge       | Dernière |

---
