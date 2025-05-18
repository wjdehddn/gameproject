import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import gameRouter from './routes/game';
import rankingRouter from './routes/ranking';

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin === 'https://gameproject-sandy.vercel.app' || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/game', gameRouter);
app.use('/ranking', rankingRouter);

export default app;
