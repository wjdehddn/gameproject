import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma';

export const getUserStats = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        nickname: true,
        money: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    const recentGames = await prisma.gameLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        game: true,
        result: true,
        bet: true,
        earnings: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        money: user.money,
      },
      recentGames,
    });
  } catch (error) {
    res.status(500).json({ message: '사용자 정보 조회 실패' });
  }
};

export const updateUserInfo = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;
  const { nickname, oldPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    return;
  }

  const updateData: any = {};

  if (nickname) {
    const exists = await prisma.user.findFirst({ where: { nickname, NOT: { id: userId } } });
    if (exists) {
      res.status(400).json({ message: '이미 사용 중인 닉네임입니다.' });
      return;
    }
    updateData.nickname = nickname;
  }

  if (newPassword) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: '기존 비밀번호가 일치하지 않습니다.' });
      return;
    }

    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ message: '수정할 정보가 없습니다.' });
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  res.status(200).json({ message: '정보가 성공적으로 수정되었습니다.' });
};

export const refillMoney = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: '사용자 없음' });
      return;
    }

    if (user.money > 0) {
      res.status(400).json({ message: '머니가 아직 남아 있습니다.' });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { money: 1000 },
    });

    res.status(200).json({ message: '머니가 충전되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '충전 실패' });
  }
};

export const getMyMoney = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { money: true },
    });

    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json({ money: user.money });
  } catch (error) {
    res.status(500).json({ message: '금액 조회 실패' });
  }
};