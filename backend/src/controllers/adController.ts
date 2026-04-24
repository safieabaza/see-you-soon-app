import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const listAds = async (_req: Request, res: Response) => {
  const ads = await prisma.ad.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(ads);
};

export const createAd = async (req: Request, res: Response) => {
  const { title, imageUrl, destination, placement } = req.body;
  if (!title || !imageUrl || !destination || !placement) {
    return res.status(400).json({ message: 'Missing ad fields' });
  }
  const ad = await prisma.ad.create({
    data: {
      title,
      imageUrl,
      destination,
      placement,
      tenant: { connect: { slug: 'see-you-soon' } }
    }
  });
  res.json(ad);
};

export const trackImpression = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ad = await prisma.ad.update({ where: { id }, data: { impressions: { increment: 1 } } });
  res.json(ad);
};

export const trackClick = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ad = await prisma.ad.update({ where: { id }, data: { clicks: { increment: 1 } } });
  res.json(ad);
};
