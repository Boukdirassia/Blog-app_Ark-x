## Blog-app_Ark-x

Application de blog full‑stack (MERN) avec authentification JWT, publication avec image, commentaires, likes et favoris. Le projet est organisé en deux sous‑dossiers: `blog-backend` (API Node/Express + MongoDB) et `blog-frontend` (React + Vite).

### Fonctionnalités
- Authentification par JWT (inscription, connexion, session côté client)
- CRUD des articles avec upload d’images (Multer)
- Commentaires sur les articles
- Likes et favoris (bookmarks)
- Pagination et recherche côté client
- Routes protégées côté frontend, redirection en cas d’expiration de token

### Stack technique
- Backend: Node.js, Express, Mongoose, Multer, JSON Web Token, CORS, dotenv
- Frontend: React, React Router, Axios, Vite, Framer Motion, Heroicons/Lucide
- Base de données: MongoDB

---

## Prérequis
- Node.js ≥ 18
- MongoDB en local ou cluster MongoDB Atlas

---

## Démarrage rapide (développement)
1) Installer les dépendances

```bash
cd blog-backend && npm install
cd ../blog-frontend && npm install
```

2) Créer le fichier d’environnement du backend `blog-backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blog_app_arkx
JWT_SECRET=remplacez_par_une_chaine_secrete
```

3) Lancer le backend (port 5000)

```bash
cd blog-backend
npm run dev
```

4) Lancer le frontend (Vite par défaut sur 5173)

```bash
cd blog-frontend
npm run dev
```

Le frontend consomme l’API sur `http://localhost:5000/api` (configuré dans `blog-frontend/src/services/api.js`). Le CORS du backend autorise `http://localhost:5173`.

---

## Scripts utiles
- Backend
  - `npm run dev`: démarre l’API avec Nodemon sur le port défini par `PORT` (par défaut 5000)
- Frontend
  - `npm run dev`: lance Vite en mode dev
  - `npm run build`: build de production
  - `npm run preview`: prévisualisation du build

---

## Structure du projet
```
blog-backend/
  config/            # Connexion MongoDB
  controllers/       # Logique métier (auth, posts, comments, likes, bookmarks)
  middleware/        # Auth, upload, logger, handlers d’erreurs
  models/            # Schémas Mongoose
  routes/            # Routes Express /api/*
  uploads/           # Fichiers uploadés (images de posts)
  server.js          # Entrée de l’app Express

blog-frontend/
  src/components/    # UI (PostCard, PostForm, Buttons, Navbar, etc.)
  src/pages/         # Pages (Home, PostDetail, Add/Edit, Auth)
  src/context/       # Contexts (Auth, Notifications)
  src/services/api.js# Client Axios + endpoints
  vite.config.js
```

---

## API – Aperçu des routes
Base URL: `http://localhost:5000/api`

- Auth: `/auth`
  - `POST /auth/register` – inscription
  - `POST /auth/login` – connexion, renvoie le token

- Posts: `/posts`
  - `GET /posts` – liste paginée/filtrée
  - `GET /posts/:id` – détail d’un article
  - `POST /posts` – créer (multipart/form-data pour image)
  - `PUT /posts/:id` – modifier (multipart/form-data ou JSON)
  - `DELETE /posts/:id` – supprimer

- Comments: `/comments`
  - `GET /comments/post/:postId`
  - `POST /comments/post/:postId`
  - `PUT /comments/:commentId`
  - `DELETE /comments/:commentId`

- Likes: `/likes`
  - `GET /likes/post/:postId`
  - `POST /likes/post/:postId/toggle`
  - `GET /likes/user/liked`

- Bookmarks: `/bookmarks`
  - `GET /bookmarks/post/:postId`
  - `POST /bookmarks/post/:postId/toggle`
  - `GET /bookmarks/user`

Note: Les routes protégées exigent un header `Authorization: Bearer <token>`.

---

## Upload d’images
Les images des articles sont stockées côté serveur dans `blog-backend/uploads` et servies statiquement via `/uploads`. Lors de la création/modification d’un post avec image, envoyer un `FormData` avec le champ fichier attendu par le middleware (voir `upload-middleware.js`).

---

## Variables d’environnement (backend)
- `PORT` (ex: 5000)
- `MONGO_URI` (ex: `mongodb://127.0.0.1:27017/blog_app_arkx`)
- `JWT_SECRET` (chaîne secrète robuste)

Astuce: créer un `.env.example` si vous souhaitez partager la configuration de base sans secrets.

---

## Déploiement (aperçu rapide)
- Backend
  - Configurer les variables d’environnement (`PORT`, `MONGO_URI`, `JWT_SECRET`)
  - Servir `server.js` avec un process manager (PM2) ou un service système
  - Exposer le dossier `uploads` et configurer CORS pour le domaine du frontend
- Frontend
  - `npm run build` puis servir le dossier `dist` via un hébergeur statique ou un proxy
  - Mettre à jour la `baseURL` d’Axios si l’API n’est plus sur `localhost`

---

## Dépannage
- 401 côté frontend: le token a expiré → l’app vous redirige vers `/login`
- 404/500 API: vérifier la console serveur et la `MONGO_URI`
- Erreur réseau: assurez-vous que le backend tourne sur `PORT=5000` et que le CORS autorise `http://localhost:5173`

---

## Licence
ISC (voir `blog-backend/package.json`).


