import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getRankingBoard = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { money: 'desc' },
      take: 10,
      select: {
        id: true,
        username: true,
        nickname: true,
        money: true,
      },
    });

    res.status(200).json({ rankings: users });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
};

export const getMyRanking = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;

  try {
    const allUsers = await prisma.user.findMany({
      orderBy: { money: 'desc' },
      select: { id: true },
    });

    const rank = allUsers.findIndex((u: { id: number }) => u.id === userId) + 1;

    if (!rank) {
      res.status(404).json({ message: '랭킹을 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json({ rank });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
};