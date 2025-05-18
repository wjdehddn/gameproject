import express from 'express';
import { getUserStats, updateUserInfo, refillMoney, getMyMoney } from '../controllers/userController';
import authenticateJWT from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/mypage', authenticateJWT, getUserStats);
router.get('/money', authenticateJWT, getMyMoney); // 💡 추가된 부분
router.patch('/update', authenticateJWT, updateUserInfo);
router.post('/refill', authenticateJWT, refillMoney);

export default router;