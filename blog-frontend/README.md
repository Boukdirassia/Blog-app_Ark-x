# Blog App Frontend

Une application de blog moderne et professionnelle développée avec React et Vite, offrant une interface utilisateur élégante et réactive pour la gestion d'articles de blog.

## Fonctionnalités

- **Interface utilisateur moderne** avec design responsive
- **Gestion complète des articles** (création, lecture, mise à jour, suppression)
- **Recherche d'articles** par mots-clés
- **Pagination** pour naviguer facilement entre les articles
- **Tri** par date ou par titre
- **Système de tags** pour catégoriser les articles
- **Validation des formulaires** pour une saisie de données sécurisée
- **Gestion des erreurs** et états de chargement
- **Interface en français**

## Technologies utilisées

- **React 18** avec Hooks pour la gestion d'état
- **React Router v6** pour la navigation
- **Axios** pour les appels API
- **CSS moderne** avec variables CSS pour le styling
- **Lucide React** pour les icônes

## Structure du projet

```
src/
├── components/       # Composants réutilisables
├── pages/           # Pages de l'application
├── services/        # Services pour les appels API
├── assets/          # Ressources statiques
└── App.jsx          # Composant principal avec routing
```

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## API Backend

L'application se connecte à un backend RESTful avec les endpoints suivants :

- `GET /api/posts` - Récupérer tous les articles (avec pagination, recherche, tri)
- `GET /api/posts/:id` - Récupérer un article spécifique
- `POST /api/posts` - Créer un nouvel article
- `PUT /api/posts/:id` - Mettre à jour un article existant
- `DELETE /api/posts/:id` - Supprimer un article

## Déploiement

```bash
# Construire pour la production
npm run build
```

Les fichiers de production seront générés dans le dossier `dist`.
