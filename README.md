# API MODART

## Prérequis

- Node.js (version recommandée : 18 ou supérieure)
- npm ou yarn
- Docker et Docker Compose (pour l'environnement de développement)

## Installation

1. Clonez le repository
```bash
git 
cd 
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

### Authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "nom": "Doe",
  "prenom": "John",
  "role": "ETUDIANT"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

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

#### Mise à jour d'un utilisateur
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nom": "Nouveau Nom",
  "prenom": "Nouveau Prénom"
}
```

#### Suppression d'un utilisateur (Admin uniquement)
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

L'API utilise :
- Express.js
- JWT pour l'authentification
- TypeScript
- Docker
