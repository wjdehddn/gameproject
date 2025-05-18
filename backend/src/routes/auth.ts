import express from 'express';
import {
  login,
  signup,
  resetPassword,
  checkUsername,
  checkNickname,
  verifyPassword,
} from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/reset-password', resetPassword);
router.post('/verify-password', authMiddleware, verifyPassword);
router.get('/check-username', checkUsername);
router.get('/check-nickname', checkNickname);

export default router;  