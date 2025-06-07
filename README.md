# API MODART

## Prérequis

- Node.js (version recommandée : 18 ou supérieure)
- npm ou yarn
- Docker et Docker Compose (pour l'environnement de développement)

## Installation

1. Clonez le repository
```bash
git clone https://github.com/UnderWorld54/modart-api
cd modart-api
```

2. Installez les dépendances :
```bash
npm install
```

## Configuration

1. Créez un fichier `.env` à la racine du projet avec les variables d'environnement suivantes :
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://admin:password123@localhost:27017/modart?authSource=admin
JWT_SECRET=modart-esgi-2025
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

## Démarrage

### Développement

Pour lancer le serveur en mode développement :
```bash
npm run dev
```

### Docker

Pour lancer l'application avec Docker :
```bash
# Démarrer les conteneurs
npm run docker:up

# Voir les logs
npm run docker:logs

# Arrêter les conteneurs
npm run docker:down
```

## Documentation des Routes API

### Accès à la documentation Swagger

L'interface Swagger est disponible à l'adresse :
```
http://localhost:3000/api-docs
```

Vous pouvez y tester toutes les routes de l'API directement depuis votre navigateur.

### Seeds (Données de test)

Pour insérer des utilisateurs, des événements et des projets de test dans la base de données, utilisez les scripts suivants :

- **Seeder les utilisateurs** :
  ```bash
  npm run seed:users
  ```
- **Seeder les événements (défilés de mode)** :
  ```bash
  npm run seed:events
  ```
- **Tout seed d'un coup (utilisateurs + événements)** :
  ```bash
  npm run seed:all
  ```

> **Remarque :** Les seeds suppriment les anciennes données avant d'insérer les nouvelles.

### Connexion avec l'utilisateur admin

Après avoir seedé la base, vous pouvez vous connecter avec l'utilisateur admin :

- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`

Exemple de requête (Postman, Swagger ou curl) :
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

La réponse contiendra un token JWT à utiliser dans les routes protégées (ex : création/modification/suppression d'événements).

### Utilisateurs

#### Liste des utilisateurs (Admin uniquement)
```http
GET /api/users
Authorization: Bearer <token>
```

#### Détails d'un utilisateur
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Projets d'un utilisateur (public)
```http
GET /api/users/:id/projects
```
Retourne tous les projets créés par l'utilisateur d'id `:id`.

#### Ajout d'un utilisateur (Admin uniquement)
```http
POST /api/users/add-user
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nouvel Utilisateur",
  "email": "nouveau@exemple.com",
  "password": "motdepasse123",
  "age": 22,
  "socials": [
    { "platform": "instagram", "url": "https://instagram.com/monprofil" }
  ]
}
```

### Réseaux sociaux des utilisateurs

Chaque utilisateur peut avoir plusieurs réseaux sociaux, par exemple :
```json
"socials": [
  { "platform": "instagram", "url": "https://instagram.com/monprofil" },
  { "platform": "linkedin", "url": "https://linkedin.com/in/monprofil" }
]
```
Plateformes supportées : `instagram`, `facebook`, `linkedin`, `twitter`, `tiktok`.

### Projets

- **Créer un projet** (étudiant ou admin) :
  ```http
  POST /api/projects
  Authorization: Bearer <token>
  Content-Type: application/json

  {
    "title": "Nom du projet",
    "description": "Description du projet",
    "externalUrl": "https://lien-exemple.com" // optionnel
  }
  ```
- **Lister tous les projets** :
  ```http
  GET /api/projects
  ```
- **Obtenir un projet par ID** :
  ```http
  GET /api/projects/:id
  ```
- **Modifier un projet** (créateur ou admin) :
  ```http
  PUT /api/projects/:id
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Supprimer un projet** (créateur ou admin) :
  ```http
  DELETE /api/projects/:id
  Authorization: Bearer <token>
  ```

### Événements

- **Lister tous les événements** :
  ```http
  GET /api/events
  ```
- **Lister les événements actifs** :
  ```http
  GET /api/events/active
  ```
- **Obtenir un événement par ID** :
  ```http
  GET /api/events/:id
  ```
- **Créer, modifier, supprimer un événement** (admin uniquement) :
  ```http
  POST /api/events
  PUT /api/events/:id
  DELETE /api/events/:id
  Authorization: Bearer <token>
  ```

L'API utilise :
- Express.js
- Mongoose
- Joi (validation)
- Winston (logs)
- Swagger (documentation)
