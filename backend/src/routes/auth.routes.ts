import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

// Authenticated auth routes
router.post('/logout', authenticate, authController.logout);
router.post('/reset-password', authenticate, authController.resetPassword);
router.get('/me', authenticate, authController.getMe);
router.put('/update-profile', authenticate, authController.updateProfile);
router.post('/invite', authenticate, authController.inviteStaff);

export default router;
