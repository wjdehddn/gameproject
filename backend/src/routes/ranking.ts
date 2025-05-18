import express from 'express';
import { getRankingBoard, getMyRanking } from '../controllers/rankingController';
import authenticateJWT from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/board', getRankingBoard);
router.get('/my', authenticateJWT, getMyRanking);

export default router;