import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    return;
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

  res.status(200).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      money: user.money,
    },
  });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, password, nickname } = req.body;

  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { nickname }],
    },
  });

  if (exists) {
    res.status(400).json({ message: '이미 사용 중인 아이디 또는 닉네임입니다.' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, password: hashedPassword, nickname },
  });

  res.status(201).json({ message: '회원가입 성공', userId: user.id });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { username, nickname, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: { username, nickname },
  });

  if (!user) {
    res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    return;
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  res.status(200).json({ message: '비밀번호가 재설정되었습니다.' });
};

export const verifyPassword = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;
  const { password } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    res.status(404).json({ valid: false });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  res.status(200).json({ valid: isValid });
};

export const checkUsername = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.query;
  const user = await prisma.user.findUnique({ where: { username: String(username) } });
  res.status(200).json({ isAvailable: !user });
};

export const checkNickname = async (req: Request, res: Response): Promise<void> => {
  const { nickname } = req.query;
  const user = await prisma.user.findFirst({ where: { nickname: String(nickname) } });
  res.status(200).json({ isAvailable: !user });
};