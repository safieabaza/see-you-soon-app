import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { env } from '../config';
import Stripe from 'stripe';

const stripe = new Stripe(env.stripeSecretKey, { apiVersion: '2026-04-22.dahlia' as any });

const findOrCreateGuestUser = async (email?: string, name?: string, tenantId?: string) => {
  const guestEmail = email || 'guest@seeyousoon.com';
  let user = await prisma.user.findUnique({ where: { email: guestEmail } });
  if (!user && tenantId) {
    user = await prisma.user.create({
      data: {
        email: guestEmail,
        name: name || 'Guest User',
        role: 'USER',
        password: await bcrypt.hash('guest-password', 10),
        tenantId
      }
    });
  }
  return user;
};

export const createCheckoutBooking = async (req: Request, res: Response) => {
  const { propertyId, checkIn, checkOut, guests, contactName, contactPhone, contactEmail } = req.body;
  if (!propertyId || !checkIn || !checkOut || !guests || !contactName || !contactPhone) {
    return res.status(400).json({ message: 'Booking and contact details are required.' });
  }

  const property = await prisma.property.findUnique({ where: { id: propertyId }, include: { tenant: true } });
  if (!property) return res.status(404).json({ message: 'Property not found' });

  const user = await findOrCreateGuestUser(contactEmail, contactName, property.tenantId);
  if (!user) return res.status(500).json({ message: 'Unable to create guest user.' });

  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
  const totalPrice = Number((property.pricePerNight * nights).toFixed(2));

  const booking = await prisma.booking.create({
    data: {
      propertyId,
      userId: user.id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: Number(guests),
      totalPrice,
      status: 'PENDING'
    }
  });

  await prisma.lead.create({
    data: {
      name: contactName,
      phone: contactPhone,
      interests: `Booking inquiry for ${property.title}`,
      status: 'NEW',
      tenantId: property.tenantId
    }
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(totalPrice * 100),
          product_data: {
            name: `Booking: ${property.title}`
          }
        },
        quantity: 1
      }
    ],
    metadata: { bookingId: booking.id },
    success_url: `${env.frontendUrl}/booking/success?bookingId=${booking.id}`,
    cancel_url: `${env.frontendUrl}/booking/cancel?bookingId=${booking.id}`
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { paymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : (session.payment_intent as any)?.id ?? '' }
  });

  res.json({ booking, checkoutUrl: session.url });
};

export const getBookings = async (req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({
    include: { property: true, user: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(bookings);
};
