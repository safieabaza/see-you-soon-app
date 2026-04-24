import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const createProperty = async (req: Request, res: Response) => {
  const { title, slug, description, address, city, country, pricePerNight, bedrooms, bathrooms, guests, images, amenityIds } = req.body;
  const property = await prisma.property.create({
    data: {
      title,
      slug,
      description,
      address,
      city,
      country,
      pricePerNight: Number(pricePerNight),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      guests: Number(guests),
      images,
      tenant: { connect: { slug: 'see-you-soon' } },
      amenities: { connect: amenityIds?.map((id: string) => ({ id })) ?? [] }
    }
  });
  res.json(property);
};

export const updateProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const property = await prisma.property.update({ where: { id }, data: updates });
  res.json(property);
};

export const deleteProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.property.delete({ where: { id } });
  res.status(204).send();
};

export const uploadAmenity = async (req: Request, res: Response) => {
  const { name, icon } = req.body;
  const amenity = await prisma.amenity.create({ data: { name, icon } });
  res.json(amenity);
};

export const updateAvailability = async (req: Request, res: Response) => {
  const { propertyId, date, blocked } = req.body;
  const record = await prisma.availability.upsert({
    where: { propertyId_date: { propertyId, date: new Date(date) } },
    update: { blocked },
    create: { propertyId, date: new Date(date), blocked }
  });
  res.json(record);
};

export const adminStats = async (_req: Request, res: Response) => {
  const totalVisits = 12000;
  const leadsCount = await prisma.lead.count();
  const conversionRate = 8.5;
  const topProperties = await prisma.property.findMany({
    take: 3,
    orderBy: { bookings: { _count: 'desc' } },
    include: { bookings: true }
  });
  const adsPerformance = await prisma.ad.findMany({ orderBy: { clicks: 'desc' } });
  res.json({ totalVisits, leadsCount, conversionRate, topProperties, adsPerformance });
};
