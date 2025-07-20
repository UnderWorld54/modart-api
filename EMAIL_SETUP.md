# 📧 Système d'Envoi d'Emails pour Comptes Étudiants

## 🚀 Vue d'ensemble

Ce système permet de créer des comptes étudiants en lot avec génération automatique de mots de passe temporaires et envoi d'emails de bienvenue.

## 🔧 Configuration

### Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env` :

```env
# Configuration des emails
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Mod'Art International" <noreply@modart.fr>

# URL du frontend
FRONTEND_URL=http://localhost:3000
```

### Configuration Gmail

1. **Activez l'authentification à 2 facteurs** sur votre compte Gmail
2. **Générez un mot de passe d'application** :
   - Allez dans les paramètres de votre compte Google
   - Sécurité → Authentification à 2 facteurs → Mots de passe des applications
   - Générez un mot de passe pour "Mail"
   - Utilisez ce mot de passe dans `EMAIL_PASS`

## 📝 Utilisation

### 1. Test de la configuration

```bash
node test-email.js
```

### 2. Création d'étudiants en lot

**Endpoint :** `POST /api/students/batch-create`  
**Autorisation :** Admin uniquement

```json
{
  "students": [
    {
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@example.com"
    },
    {
      "firstName": "Marie", 
      "lastName": "Martin",
      "email": "marie.martin@example.com"
    }
  ]
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "2 étudiant(s) créé(s) avec succès, 0 échec(s)",
  "summary": {
    "total": 2,
    "success": 2,
    "errors": 0
  },
  "results": [
    {
      "student": {
        "firstName": "Jean",
        "lastName": "Dupont", 
        "email": "jean.dupont@example.com"
      },
      "success": true,
      "userId": "65f...",
      "emailSent": true
    }
  ]
}
```

### 3. Changement de mot de passe temporaire

**Endpoint :** `PUT /api/auth/change-temporary-password`  
**Autorisation :** Utilisateur authentifié avec `mustChangePassword: true`

```json
{
  "currentPassword": "Art2024!Xy12",
  "newPassword": "MonNouveauMotDePasse123!"
}
```

### 4. Statistiques des étudiants

**Endpoint :** `GET /api/students/stats`  
**Autorisation :** Admin uniquement

```json
{
  "success": true,
  "stats": {
    "totalStudents": 150,
    "activeStudents": 145,
    "studentsWithTemporaryPassword": 25,
    "studentsMustChangePassword": 25,
    "inactiveStudents": 5
  }
}
```

## 🔒 Sécurité

### Génération des mots de passe temporaires

Les mots de passe sont générés avec le format : `[Adjectif][Année][Caractère spécial][2 lettres][2 chiffres]`

Exemples :
- `Smart2024!Xy12`
- `Creative2024@Ab87`
- `Design2024#Tz34`

### Workflow de sécurité

1. **Création** : `isTemporaryPassword: true`, `mustChangePassword: true`
2. **Première connexion** : L'API retourne `mustChangePassword: true`
3. **Changement obligatoire** : L'utilisateur doit utiliser `/change-temporary-password`
4. **Finalisation** : `isTemporaryPassword: false`, `mustChangePassword: false`, `passwordChangedAt` mis à jour

## 📧 Template d'Email

Le template `welcomeStudent.hbs` inclut :
- **Header** avec logo Mod'Art International
- **Message de bienvenue** personnalisé
- **Identifiants de connexion** (email + mot de passe temporaire)
- **Bouton de connexion** vers le frontend
- **Informations importantes** sur le changement de mot de passe
- **Footer** avec coordonnées de l'école

## 🛠 Développement

### Nouveaux fichiers créés

```
src/
├── config/
│   └── email.ts              # Configuration Nodemailer
├── services/
│   └── emailService.ts       # Service d'envoi d'emails
├── templates/
│   └── welcomeStudent.hbs    # Template HTML d'email
├── controllers/
│   └── studentController.ts  # Contrôleur pour étudiants
└── routes/
    └── studentRoutes.ts      # Routes pour étudiants
```

### Modifications apportées

```
src/models/User.ts           # Ajout champs : isTemporaryPassword, mustChangePassword, passwordChangedAt
src/types/index.ts           # Mise à jour interface IUser
src/services/authService.ts  # Ajout méthode updatePasswordFlags
src/controllers/authController.ts # Ajout changeTemporaryPassword, modification login
src/routes/authRoutes.ts     # Ajout route change-temporary-password
src/app.ts                   # Ajout routes étudiants
```

## 🧪 Tests

### Test de configuration email
```bash
node test-email.js
```

### Test de création d'étudiants

1. **Démarrez le serveur**
```bash
npm run dev
```

2. **Connectez-vous en tant qu'admin**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@modart.fr","password":"admin123"}'
```

3. **Créez des étudiants**
```bash
curl -X POST http://localhost:5000/api/students/batch-create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @sample-students.json
```

## 📊 Monitoring

Les logs incluent :
- ✅ Succès de création d'utilisateurs
- 📧 Statut d'envoi des emails
- ⚠️ Échecs avec détails des erreurs
- 🔄 Changements de mots de passe temporaires

## 🆘 Dépannage

### Erreur SMTP
- Vérifiez les variables d'environnement
- Confirmez le mot de passe d'application Gmail
- Testez avec `node test-email.js`

### Emails non reçus
- Vérifiez les dossiers spam/promotions
- Confirmez `EMAIL_FROM` et `FRONTEND_URL`
- Consultez les logs serveur

### Problèmes de permissions
- Vérifiez que l'utilisateur est admin pour `/batch-create`
- Confirmez l'authentification JWT

## 🔄 Prochaines étapes

1. **Monitoring avancé** : Dashboard d'administration
2. **Templates multiples** : Emails de rappel, réinitialisation
3. **Importation CSV** : Interface pour upload de fichiers
4. **Notifications** : Webhooks pour succès/échecs
5. **Personnalisation** : Templates par filière/promotion 