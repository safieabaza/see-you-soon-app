import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { env } from '../config';

const createToken = (userId: string) => jwt.sign({ userId }, env.jwtSecret, { expiresIn: '7d' });

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = createToken(user.id);
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
};

export const profile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};
