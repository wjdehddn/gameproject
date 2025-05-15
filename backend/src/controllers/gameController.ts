import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { updateRanking } from '../services/rankingService';

export const playRPS = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { bet, userChoice } = req.body;

  if (!['rock', 'paper', 'scissors'].includes(userChoice) || typeof bet !== 'number' || bet <= 0) {
    return res.status(400).json({ message: '잘못된 요청입니다.' });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: '사용자 없음' });
  if (user.money < bet) return res.status(400).json({ message: '보유 머니보다 많은 금액을 배팅할 수 없습니다.' });

  const choices = ['rock', 'paper', 'scissors'];
  const computerChoice = choices[Math.floor(Math.random() * 3)];

  let result: 'win' | 'lose' | 'draw';
  if (userChoice === computerChoice) result = 'draw';
  else if (
    (userChoice === 'rock' && computerChoice === 'scissors') ||
    (userChoice === 'paper' && computerChoice === 'rock') ||
    (userChoice === 'scissors' && computerChoice === 'paper')
  ) result = 'win';
  else result = 'lose';

  const earnings =
    result === 'win' ? Math.floor(bet * 1.9) :
    result === 'draw' ? bet : 0;

  const gameLog = await prisma.gameLog.create({
    data: { userId, game: 'RPS', result, bet, earnings },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { money: { increment: earnings - bet } },
  });

  await updateRanking(userId, earnings);
  res.status(200).json({ result, computerChoice, gameLog });
};

export const playOddEven = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { bet, choice } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: '사용자 없음' });
  if (user.money < bet) return res.status(400).json({ message: '보유 머니보다 많은 금액을 배팅할 수 없습니다.' });

  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  const sum = dice1 + dice2;
  const isEven = sum % 2 === 0;

  const result = (isEven && choice === 'even') || (!isEven && choice === 'odd') ? 'win' : 'lose';
  const earnings = result === 'win' ? Math.floor(bet * 1.9) : 0;

  const gameLog = await prisma.gameLog.create({
    data: { userId, game: 'OddEven', bet, result, earnings },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { money: { increment: earnings - bet } },
  });

  await updateRanking(userId, earnings);
  res.status(200).json({ result, dice1, dice2, sum, gameLog });
};

export const playRoulette = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const bet = Number(req.body.bet);
  const selectedMultiplier = Number(req.body.selectedMultiplier);

  if (isNaN(bet) || isNaN(selectedMultiplier) || bet <= 0) {
    return res.status(400).json({ message: '잘못된 입력입니다.' });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: '사용자 없음' });
  if (user.money < bet) return res.status(400).json({ message: '보유 머니보다 많은 금액을 배팅할 수 없습니다.' });

  const rouletteSlots = [
    { multiplier: 2, count: 10 },
    { multiplier: 3, count: 7 },
    { multiplier: 5, count: 4 },
    { multiplier: 10, count: 2 },
    { multiplier: 20, count: 1 },
  ];

  let board: number[] = [];
  rouletteSlots.forEach(slot => {
    for (let i = 0; i < slot.count; i++) {
      board.push(slot.multiplier);
    }
  });

  const randomIndex = Math.floor(Math.random() * board.length);
  const resultMultiplier = board[randomIndex];
  const result = resultMultiplier === selectedMultiplier ? 'win' : 'lose';
  const earnings = result === 'win' ? bet * selectedMultiplier : 0;

  const gameLog = await prisma.gameLog.create({
    data: { userId, game: 'Roulette', bet, result, earnings },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { money: { increment: earnings - bet } },
  });

  await updateRanking(userId, earnings);
  res.status(200).json({ result, resultMultiplier, gameLog });
};