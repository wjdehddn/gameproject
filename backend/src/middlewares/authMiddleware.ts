import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

const jwtSecret = process.env.JWT_SECRET || 'default-secret';

export interface AuthRequest extends Request {
  user?: { id: number };
}

interface DecodedToken {
  userId: number;
}

const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Unauthorized - Token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    req.user = { id: user.id };
    next();
  } catch (err) {
    res.status(403).json({ message: 'Forbidden - Invalid token' });
  }
};

export default authenticateJWT;