import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/students/batch-create:
 *   post:
 *     summary: Créer des comptes étudiants en lot
 *     description: Crée plusieurs comptes étudiants à la fois avec envoi d'emails de bienvenue (admin seulement)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - students
 *             properties:
 *               students:
 *                 type: array
 *                 maxItems: 100
 *                 items:
 *                   type: object
 *                   required:
 *                     - firstName
 *                     - lastName
 *                     - email
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       minLength: 2
 *                       maxLength: 50
 *                       example: "Jean"
 *                     lastName:
 *                       type: string
 *                       minLength: 2
 *                       maxLength: 50
 *                       example: "Dupont"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "jean.dupont@example.com"
 *           example:
 *             students:
 *               - firstName: "Jean"
 *                 lastName: "Dupont"
 *                 email: "jean.dupont@example.com"
 *               - firstName: "Marie"
 *                 lastName: "Martin"
 *                 email: "marie.martin@example.com"
 *     responses:
 *       201:
 *         description: Tous les étudiants créés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "2 étudiant(s) créé(s) avec succès, 0 échec(s)"
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 2
 *                     success:
 *                       type: number
 *                       example: 2
 *                     errors:
 *                       type: number
 *                       example: 0
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       student:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *                       success:
 *                         type: boolean
 *                       userId:
 *                         type: string
 *                       emailSent:
 *                         type: boolean
 *       207:
 *         description: Création partielle (certains étudiants créés, d'autres en échec)
 *       400:
 *         description: Données invalides ou aucun étudiant créé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (admin requis)
 *       500:
 *         description: Erreur serveur
 */
router.post('/batch-create', authenticate, authorize('admin'), StudentController.batchCreateStudents);

/**
 * @swagger
 * /api/students/stats:
 *   get:
 *     summary: Obtenir les statistiques des étudiants
 *     description: Récupère les statistiques sur les comptes étudiants (admin seulement)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: number
 *                       example: 150
 *                     activeStudents:
 *                       type: number
 *                       example: 145
 *                     studentsWithTemporaryPassword:
 *                       type: number
 *                       example: 25
 *                     studentsMustChangePassword:
 *                       type: number
 *                       example: 25
 *                     inactiveStudents:
 *                       type: number
 *                       example: 5
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (admin requis)
 *       500:
 *         description: Erreur serveur
 */
router.get('/stats', authenticate, authorize('admin'), StudentController.getStudentStats);

export default router; 