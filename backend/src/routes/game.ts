import express from 'express';
import { playRPS, playOddEven, playRoulette } from '../controllers/gameController';
import authenticateJWT from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/rps', authenticateJWT, playRPS);
router.post('/oddeven', authenticateJWT, playOddEven);
router.post('/roulette', authenticateJWT, playRoulette);

export default router;