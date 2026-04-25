# Qu’allez-vous apprendre dans ce projet ?

Dans ce projet, vous participerez à la conversion d’une application de jQuery vers React pour une grande société financière.

Votre mission principale sera de refondre les pages clés de l’application en remplaçant un plugin jQuery spécifique par un composant React. Cela impliquera une compréhension approfondie des deux technologies et leur interaction.

Vous serez chargé de mesurer les performances de l’application avant et après la conversion. Cette analyse de performance vous permettra de quantifier les avantages de la migration vers React.

La documentation du composant converti sera une étape importante de votre travail. Cela comprendra la rédaction de documents techniques détaillant l’architecture du composant, son fonctionnement, et les raisons de sa conception.

Vous livrerez les résultats de votre travail avec des rapports détaillés, y compris des analyses de performance et des explications sur les choix techniques effectués pendant la conversion.

## En quoi ces compétences seront-elles importantes pour votre carrière ?

La migration d’une application de jQuery vers React est un exemple concret de la manière de réduire la dette technique et d’améliorer la performance d’une application web.

La maîtrise de ces techniques est essentielle pour les développeurs front-end, surtout dans un contexte où la modernisation des applications existantes est souvent nécessaire.

La capacité à documenter techniquement vos travaux est également essentielle pour la communication au sein des équipes de développement et pour assurer une maintenance efficace.

## Objectifs pédagogiques

- Analyser la performance d’une application web
- Déployer une application front-end
- Refondre une application pour réduire la dette technique
- Mettre en place son environnement Front-End
- Produire de la documentation technique pour une application

## Pour ce projet, il vous faudra principalement

- Analyser l’application existante qui utilise jQuery.
- Identifier un plugin jQuery spécifique à remplacer.
- Reprendre les pages clés de l’application et convertir leur code de jQuery vers React en créant des composants fonctionnels et modulaires.
- Documenter soigneusement le nouveau composant React : architecture, fonctionnement, etc.
- Mesurer les performances de l’application avant et après la conversion avec des outils comme Lighthouse.
- Présenter un rapport comparatif des performances.
- Préparer une présentation orale de 15 minutes pour expliquer votre méthodologie, montrer vos livrables, et répondre à des questions techniques.

## Questions de réflexion

### Conversion jQuery vers React

- Comment pouvez-vous transformer les interactions et manipulations DOM faites avec jQuery en composants React ?
- Avez-vous identifié les parties du code qui deviennent des composants autonomes ?
- Quels sont les avantages d’utiliser des fonctions pures et des hooks React dans ce contexte ?

### Documentation du composant React

- Quelles informations techniques sont importantes à expliquer pour faciliter la compréhension du composant (props, état, méthodes internes, etc.) ?
- Comment structurer un document technique clair et accessible ?
- Serait-il utile d’ajouter des exemples d’utilisation ou des diagrammes ?

### Mesure des performances

- Quel outil pensez-vous utiliser pour évaluer les performances avant/après (par exemple Lighthouse) ?
- Quelles métriques ciblerez-vous (temps de chargement, First Contentful Paint, nombre de requêtes, etc.) ?
- Comment comptez-vous interpréter et présenter ces données pour montrer l’impact de la migration ?

---

## Réponses — projet WealthHealth (état actuel du dépôt)

**Contexte utile :** l’application React (Vite, React Router) vit sous `src/` (`CreateEmployee`, `EmployeeList`, `SuccessModal`, validation dans `helpers/validator.ts`, persistance via `utils/states.ts`). La version jQuery de référence se trouve dans `.oc/Frontend base/`. La liste des plugins à traiter pour le livrable est dans `.oc/jQuery plugins to convert/Index.md` (sélecteur de date, modal, menu déroulant type selectmenu, DataTables). Un premier alignement avec le brief est déjà visible : la **modal** est remplacée par un composant React (`SuccessModal`) piloté par l’état plutôt que par des appels jQuery sur le DOM.

### Conversion jQuery vers React — éléments de réponse

- **Transformer interactions / manipulations DOM :** ne plus sélectionner ni modifier les nœuds avec `$()` et des plugins. Mettre **ce qui doit s’afficher** dans l’**état** (`useState`), dériver l’interface de cet état, et utiliser **props** et **événements** (`onChange`, `onSubmit`, etc.). Les effets de bord (focus, timers) se placent dans **`useEffect`** avec des dépendances explicites — par exemple `SuccessModal` s’appuie sur `isOpen` et `onClose` au lieu d’équivalents du type `$('#modal').modal('show')`.
- **Composants autonomes identifiés :** **`SuccessModal`** (notification en overlay), **`CreateEmployee`** (page formulaire), **`EmployeeList`** (tableau avec recherche, tri, pagination). La logique partagée (validation) est isolée dans un **helper** (`validateEmployee`) plutôt que dans la couche DOM.
- **Fonctions pures et hooks :** les hooks regroupent **état** et **effets** au plus près du besoin. Une fonction de validation **pure** est simple à tester et à réutiliser. Les effets isolent **l’impératif** (focus, `setTimeout`) pour garder le rendu prévisible.

### Documentation du composant React — éléments de réponse

- **Informations techniques utiles :** pour un composant comme `SuccessModal` : **props** (`isOpen`, `onClose`), **comportement au montage** (rendu conditionnel), **effets** (focus + fermeture automatique après délai), **accessibilité** (`role="dialog"`, attributs `aria-*`), et **contraintes** (stabilité de `onClose` / dépendances de `useEffect`).
- **Structurer un document clair :** sections courtes : _Objectif → Props → Comportement → Accessibilité → Limites / évolutions possibles_, plus un **extrait d’utilisation** montrant comment la page parente (`CreateEmployee`) pilote l’état (`showModal` / fermeture).
- **Exemples et diagrammes :** oui — un **exemple minimal d’utilisation** et un petit **schéma d’états** (fermé → ouvert → timer → fermé) facilitent la lecture pour un correcteur ou une équipe.

### Mesure des performances — éléments de réponse

- **Outil :** **Lighthouse** (Chrome DevTools). En option, **Web Vitals** (LCP, INP, CLS) pour le discours « Core Web Vitals ».
- **Métriques visées :** au minimum le **score Performance**, **First Contentful Paint (FCP)**, **Largest Contentful Paint (LCP)**, **Total Blocking Time (TBT)**, **Speed Index**, **Cumulative Layout Shift (CLS)**. On peut aussi commenter la **charge JS / réseau** (moins de plugins jQuery vs bundle Vite) dans une comparaison ancienne appli / React.
- **Interprétation et présentation :** conditions comparables (même machine, même **throttling** réseau, navigation privée pour limiter les extensions), **build de production** pour React (`npm run build` puis `npm run preview`). Présenter un **tableau avant / après** et deux phrases sur **ce qui s’améliore et pourquoi** (chemin critique, moins de travail main-thread lié aux plugins, etc.).

---

## Guide pratique — comment réaliser le livrable avec ce dépôt

1. **Choisir un plugin jQuery** dans `.oc/jQuery plugins to convert/Index.md` et le relier au **code legacy** dans `.oc/Frontend base/` (où la modal, le datepicker, etc. sont initialisés).
2. **Montrer le remplacement React** dans `src/` (exemple déjà exploitable : **`SuccessModal`** utilisé depuis **`CreateEmployee`**).
3. **Rédiger la documentation technique** (fichier dédié ou section du livrable) : objectif, API (props), flux d’état / effets, accessibilité, exemple d’usage ; diagramme ou schéma optionnel.
4. **Mesurer « avant » :** ouvrir la version statique / jQuery (fichiers sous `.oc/Frontend base/`), lancer Lighthouse, **conserver captures ou export** (JSON / PDF).
5. **Mesurer « après » :** `npm run build` puis `npm run preview`, Lighthouse sur la **même fonctionnalité** (création d’employé, liste, etc.), mêmes réglages.
6. **Présentation orale (15 min) :** problème → plugin choisi → conception React → tableau de performances → apprentissages.
