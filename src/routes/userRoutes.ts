import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Toutes les routes utilisateurs nécessitent une authentification
router.use(authenticate);

// Routes CRUD (seuls les admins peuvent voir tous les utilisateurs)
router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);

export default router;