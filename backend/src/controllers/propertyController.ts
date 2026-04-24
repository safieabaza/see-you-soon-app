import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const listProperties = async (req: Request, res: Response) => {
  const { city, minPrice, maxPrice, guests, amenities } = req.query;

  const filters: any = {
    tenant: { slug: 'see-you-soon' }
  };

  if (city) filters.city = { contains: String(city), mode: 'insensitive' };
  if (minPrice) filters.pricePerNight = { gte: Number(minPrice) };
  if (maxPrice) filters.pricePerNight = { lte: Number(maxPrice) };
  if (guests) filters.guests = { gte: Number(guests) };

  const propertyAmenities = amenities ? String(amenities).split(',') : [];

  const properties = await prisma.property.findMany({
    where: filters,
    include: { amenities: true },
    orderBy: { createdAt: 'desc' }
  }) as Array<{ amenities: Array<{ name: string }> }>;

  const filtered = propertyAmenities.length
    ? properties.filter((property) =>
        propertyAmenities.every((name) => property.amenities.some((a) => a.name.toLowerCase() === name.toLowerCase()))
      )
    : properties;

  res.json(filtered);
};

export const getProperty = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const property = await prisma.property.findUnique({
    where: { slug },
    include: { amenities: true, availability: true, bookings: true }
  });
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json(property);
};

export const propertyStats = async (_req: Request, res: Response) => {
  const total = await prisma.property.count({ where: { tenant: { slug: 'see-you-soon' } } });
  const topProperties = await prisma.property.findMany({
    where: { tenant: { slug: 'see-you-soon' } },
    orderBy: { bookings: { _count: 'desc' } },
    take: 4
  });
  res.json({ total, topProperties });
};
