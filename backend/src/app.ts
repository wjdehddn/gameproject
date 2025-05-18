import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import gameRouter from './routes/game';
import rankingRouter from './routes/ranking';

const app = express();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/game', gameRouter);
app.use('/ranking', rankingRouter);

export default app;
