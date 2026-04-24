import { Request, Response } from 'express';
import Stripe from 'stripe';
import { env } from '../config';
import { prisma } from '../prisma';

const stripe = new Stripe(env.stripeSecretKey, { apiVersion: '2026-04-22.dahlia' as any });

export const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'];
  if (!signature || Array.isArray(signature)) {
    return res.status(400).send('Missing Stripe signature');
  }

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);
  } catch (error) {
    return res.status(400).send(`Webhook signature verification failed: ${(error as Error).message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } });
    }
  }

  return res.json({ received: true });
};
