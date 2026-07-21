# Architecture — WealthHealth (HRNet)

[English](ARCHITECTURE.md)

## Vue d’ensemble

WealthHealth est une application monopage React 19 + TypeScript construite avec Vite. Elle remplace le projet HRNet jQuery d’origine et permet au personnel RH de créer des fiches employés et de parcourir la liste. Aucune dépendance serveur : tout l’état vit en mémoire le temps de la session.

**Stack :** React 19 · TypeScript 6 · Vite 8 · React Router 7 · CSS classique

**Outillage :** pnpm 10 (voir `packageManager` dans `package.json`) · Node 24 (`.nvmrc`) · GitHub Actions (CI + déploiement Pages)

---

## Structure du projet

```
src/
├── main.tsx                    # Point d’entrée — monte <App> dans StrictMode
├── App.tsx                     # Racine — fournisseurs + routeur
├── index.css                   # Jetons globaux et styles de base
│
├── context/
│   └── EmployeeContext.tsx     # État employé global (Context + useReducer)
│
├── pages/
│   ├── Home/
│   │   └── Home.tsx            # Route "/" — page d’accueil avec CTA
│   ├── NotFound/
│   │   └── NotFound.tsx        # Route "*" — page 404
│   └── employees/              # Routes chargées à la demande (React.lazy)
│       ├── Create.tsx          # Route "/create" — formulaire de création
│       └── List.tsx            # Route "/employees" — tableau des employés
│
├── features/
│   └── employees/
│       └── components/
│           ├── EmployeeForm/          # Formulaire + sous-parties pour la création
│           ├── EmployeeTable/         # Tableau triable + défilement horizontal sur petit écran
│           └── EmployeeListControls/  # Recherche + infos de comptage
│
├── components/
│   ├── shell/                  # Gabarits de mise en page (Layout, PageTemplate, ErrorBoundary)
│   ├── patterns/               # Motifs d’interface composés
│   │   ├── FormField/          # Libellé + input/select/date + message d’erreur
│   │   ├── Pagination/         # Contrôles page précédente / suivante
│   │   ├── SearchInput/        # Champ de recherche contrôlé
│   │   ├── SortableTh/         # <th> triable avec <button> accessible
│   │   └── TableInfo/          # « Affichage X–Y sur Z entrées »
│   ├── ui/                     # Primitifs UI atomiques
│   │   ├── Button/
│   │   ├── Heading/
│   │   ├── Label/
│   │   ├── Select/
│   │   ├── TextInput/
│   │   ├── ErrorMessage/
│   │   └── SortIndicator/
│
├── hooks/
│   ├── useDocumentTitle.ts     # document.title par page
│   ├── useEmployeeForm.ts      # État du formulaire, validation, soumission
│   ├── useFilter.ts            # Filtre plein texte générique
│   ├── usePagination.ts        # Tranche de page + navigation
│   └── useSortableData.ts      # Tableau triable (chaînes + dates)
│
├── helpers/
│   └── validator.ts            # Fonctions de validation pures pour Employee
│
├── utils/
│   └── states.ts               # Données statiques : États US, services
│
└── types/
    └── index.ts                # Interfaces partagées (Employee, StoredEmployee, State)
```

---

## Amorçage de l’application

```
main.tsx
  └── <React.StrictMode>
        └── <App>
              └── <BrowserRouter>
                    └── <EmployeeProvider>   ← état employé global
                          └── <ErrorBoundary>   ← capture les erreurs de rendu
                                └── <Layout>
                                      └── <Suspense>   ← routes différées
                                            ├── Route "/"           → <Home>
                                            ├── Route "/create"     → <Create>
                                            ├── Route "/employees"  → <List>
                                            └── Route "*"           → <NotFound>
```

---

## Gestion d’état

L’état employé est global et entièrement **en mémoire** via React Context + `useReducer`.

**`src/context/EmployeeContext.tsx`**

| Export             | Rôle                                                                  |
| ------------------ | --------------------------------------------------------------------- |
| `EmployeeProvider` | Enveloppe l’app ; détient le tableau `employees` et le `dispatch`     |
| `useEmployees()`   | Hook consommé par tout composant qui lit `employees` ou `addEmployee` |

**Actions du reducer :**

| Action         | Effet                                                       |
| -------------- | ----------------------------------------------------------- |
| `ADD_EMPLOYEE` | Ajoute un employé avec un identifiant `crypto.randomUUID()` |

> L’état est réinitialisé au rechargement de la page (pas de persistance). C’est voulu : l’évaluation demandait un système de gestion d’état plutôt que `localStorage`.

---

## Flux de données

### Création d’un employé

```
page <Create>
  └── <EmployeeForm>
        └── useEmployeeForm()
              ├── handleChange → met à jour l’état local formData
              └── handleSubmit
                    ├── validateEmployee(formData)  ← fonction pure, sans effet de bord
                    │     └── renvoie ValidationError[]
                    ├── en cas d’erreurs → setErrors() → FormField affiche les messages
                    └── en cas de succès → addEmployee(formData) → dispatch EmployeeContext
                                  → onSuccess() → <Create> affiche <Modal>
```

### Liste des employés

```
page <List>
  └── useEmployees()          ← lit employees[] depuis le contexte
        └── useFilter(employees)         → filtré par terme de recherche (tous champs)
              └── useSortableData(filtered)    → tri selon la colonne cliquée
                    └── usePagination(sorted, 10)  → tranche de la page courante
```

Les trois hooks s’enchaînent : chacun reçoit la sortie du précédent. La remise à zéro de la pagination quand la recherche change est faite explicitement dans `<List>` via `pagination.reset()` dans `handleSearch`.

---

## Routage

| Chemin       | Composant    | Rôle                   |
| ------------ | ------------ | ---------------------- |
| `/`          | `<Home>`     | Page d’accueil         |
| `/create`    | `<Create>`   | Créer un employé       |
| `/employees` | `<List>`     | Voir tous les employés |
| `*`          | `<NotFound>` | Page 404 (joker)       |

Utilise `BrowserRouter` avec `basename={import.meta.env.BASE_URL}` pour la compatibilité avec le déploiement GitHub Pages. `Create`, `List` et `NotFound` sont découpés en chunks via `React.lazy` ; seul `Home` fait partie du bundle initial.

---

## Conception des composants — Atomic Design

Trois niveaux principaux :

| Couche     | Dossier                          | Rôle                                                                                      |
| ---------- | -------------------------------- | ----------------------------------------------------------------------------------------- |
| Atomes     | `components/ui/`                 | Éléments simples : Button, TextInput, Select, Label, Heading, ErrorMessage, SortIndicator |
| Molécules  | `components/patterns/`           | Composés à partir d’atomes : FormField, SortableTh, Pagination, SearchInput, TableInfo    |
| Organismes | `features/employees/components/` | Blocs métier : EmployeeForm (inclut AddressFieldset), EmployeeTable, EmployeeListControls |
| Gabarits   | `components/shell/`              | Enveloppes : Layout (nav + principal), PageTemplate (titre + emplacement contenu)         |

---

## Validation

`src/helpers/validator.ts` est une logique pure sans effet de bord. **`validateEmployee`** est le seul export public ; il exécute en interne les contrôles code postal, date de naissance et date d’entrée, et renvoie un `ValidationError[]` (les helpers et le type `ValidationError` restent privés au module).

| Règle              | Contrainte                                                              |
| ------------------ | ----------------------------------------------------------------------- |
| Texte requis       | Prénom, nom, rue et ville ne doivent pas être vides                     |
| Code postal        | Exactement 5 chiffres                                                   |
| Date de naissance  | Doit être une date valide et strictement avant « maintenant »           |
| Date d’entrée      | Strictement après la date de naissance (si la date de naissance est OK) |
| `validateEmployee` | Exécute les contrôles ci-dessus et agrège les erreurs                   |

`useEmployeeForm` appelle `validateEmployee` à la soumission et projette le résultat dans un objet d’erreurs indexé par champ, lu par `FormField` via la prop `error`.

---

## Paquet externe

Le plugin modal jQuery a été remplacé par `@steinshy/wealthhealth-modal`, paquet npm autonome dans un dépôt séparé. Il est utilisé dans `<Create>` pour confirmer la création d’un employé.

```tsx
// src/pages/employees/Create.tsx (extrait)
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

Voir le dépôt du paquet modal pour son architecture et sa documentation d’API.

---

## Performance et qualité

| Outil         | Fichier de config     | Rôle                                            |
| ------------- | --------------------- | ----------------------------------------------- |
| Lighthouse CI | `.lighthouserc.json`  | Perf ≥ 0,80, A11y ≥ 0,90, BP ≥ 0,90, SEO ≥ 0,90 |
| Knip          | `knip.json`           | Fichiers / exports inutilisés, dépendances      |
| ESLint        | `eslint.config.js`    | Règles React Hooks, ordre des imports           |
| Stylelint     | `stylelint.config.js` | Ordre des propriétés CSS                        |
| Prettier      | `prettier.config.js`  | Formatage homogène                              |
| TypeScript    | mode strict           | Typage complet                                  |

**Scores Lighthouse (app React) :** Performance 0,82 · Accessibilité 1,0 · Bonnes pratiques 1,0 · SEO 1,0

Rapports : `lighthouse-reports/`

---

[README (Français)](README.fr.md) · [README (English)](README.md) · [Architecture (English)](ARCHITECTURE.md)
