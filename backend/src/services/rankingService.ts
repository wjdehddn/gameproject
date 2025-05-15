import prisma from '../config/prisma';

export const updateRanking = async (userId: number, earnings: number) => {
  try {
    const existing = await prisma.ranking.findFirst({ where: { userId } });
    if (!existing || earnings > existing.score) {
      await prisma.ranking.upsert({
        where: { id: existing?.id || 0 },
        update: { score: earnings },
        create: { userId, score: earnings },
      });
    }
  } catch (err) {
    console.error('랭킹 업데이트 실패:', err);
  }
};