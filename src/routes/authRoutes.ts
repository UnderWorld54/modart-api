import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées
router.get('/profile', authenticate, authController.getProfile);
router.put('/change-password', authenticate, authController.changePassword);

export default router;