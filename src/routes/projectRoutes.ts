import { Router } from 'express';
import { ProjectController, projectSchema } from '../controllers/eventController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();
const projectController = new ProjectController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: Titre du projet
 *         description:
 *           type: string
 *           description: Description du projet
 *         externalUrl:
 *           type: string
 *           description: Lien externe (optionnel)
 *         createdBy:
 *           type: string
 *           description: ID de l'utilisateur créateur
 *
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Liste tous les projets
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Liste des projets
 *   post:
 *     summary: Créer un projet (étudiant ou admin)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Projet créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.get('/', projectController.getAllProjects);
router.post('/', authenticate, validateBody(projectSchema), projectController.createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtenir un projet par ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Projet trouvé
 *       404:
 *         description: Projet non trouvé
 *   put:
 *     summary: Modifier un projet (créateur ou admin)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Projet modifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Projet non trouvé
 *   delete:
 *     summary: Supprimer un projet (créateur ou admin)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Projet supprimé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Projet non trouvé
 */
router.get('/:id', projectController.getProjectById);
router.put('/:id', authenticate, validateBody(projectSchema), projectController.updateProject);
router.delete('/:id', authenticate, projectController.deleteProject);

export default router; 