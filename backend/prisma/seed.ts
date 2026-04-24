import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'see-you-soon' },
    update: {},
    create: {
      name: 'See You Soon',
      slug: 'see-you-soon',
      brandName: 'See You Soon',
      primaryColor: '#0f172a'
    }
  });

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const salesPassword = await bcrypt.hash('Sales123!', 10);
  const guestPassword = await bcrypt.hash('User123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@seeyousoon.com' },
    update: {},
    create: {
      email: 'admin@seeyousoon.com',
      name: 'Platform Admin',
      role: 'ADMIN',
      password: adminPassword,
      tenantId: tenant.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'sales@seeyousoon.com' },
    update: {},
    create: {
      email: 'sales@seeyousoon.com',
      name: 'Sales Agent',
      role: 'SALES',
      password: salesPassword,
      tenantId: tenant.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'guest@seeyousoon.com' },
    update: {},
    create: {
      email: 'guest@seeyousoon.com',
      name: 'Vacation Seeker',
      role: 'USER',
      password: guestPassword,
      tenantId: tenant.id
    }
  });

  const amenities = await Promise.all([
    prisma.amenity.upsert({ where: { name: 'Pool' }, update: {}, create: { name: 'Pool', icon: 'pool' } }),
    prisma.amenity.upsert({ where: { name: 'WiFi' }, update: {}, create: { name: 'WiFi', icon: 'wifi' } }),
    prisma.amenity.upsert({ where: { name: 'Parking' }, update: {}, create: { name: 'Parking', icon: 'parking' } }),
    prisma.amenity.upsert({ where: { name: 'Air Conditioning' }, update: {}, create: { name: 'Air Conditioning', icon: 'ac_unit' } })
  ]);

  const villa = await prisma.property.upsert({
    where: { slug: 'north-coast-villa' },
    update: {},
    create: {
      title: 'North Coast Luxury Villa',
      slug: 'north-coast-villa',
      description: 'A premium villa with private pool, sea view, and fast WiFi in the North Coast.',
      address: 'Marina El Alamein',
      city: 'Alexandria',
      country: 'Egypt',
      pricePerNight: 250,
      bedrooms: 4,
      bathrooms: 3,
      guests: 10,
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
      ],
      tenantId: tenant.id,
      amenities: { connect: amenities.map((amenity) => ({ id: amenity.id })) }
    }
  });

  await prisma.availability.createMany({
    data: Array.from({ length: 30 }, (_, index) => ({
      propertyId: villa.id,
      date: new Date(Date.now() + index * 86400000),
      blocked: index % 7 === 0
    }))
  });

  await prisma.ad.upsert({
    where: { title: 'Summer Escape North Coast' },
    update: {},
    create: {
      title: 'Summer Escape North Coast',
      imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      destination: '/properties/north-coast-villa',
      placement: 'HOME',
      tenantId: tenant.id,
      impressions: 2500,
      clicks: 220
    }
  });

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
