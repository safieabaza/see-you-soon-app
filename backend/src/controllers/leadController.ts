import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const createLead = async (req: Request, res: Response) => {
  const { name, phone, interests, ownerId } = req.body;
  if (!name || !phone || !interests) {
    return res.status(400).json({ message: 'Lead name, phone, and interest are required' });
  }

  const lead = await prisma.lead.create({
    data: {
      name,
      phone,
      interests,
      ownerId,
      tenant: { connect: { slug: 'see-you-soon' } }
    }
  });
  res.json(lead);
};

export const listLeads = async (_req: Request, res: Response) => {
  const leads = await prisma.lead.findMany({
    include: { assignedTo: true, notes: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(leads);
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const lead = await prisma.lead.update({ where: { id }, data: { status } });
  res.json(lead);
};

export const addLeadNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, authorId } = req.body;
  if (!content || !authorId) {
    return res.status(400).json({ message: 'Note text and author are required' });
  }
  const note = await prisma.note.create({
    data: { content, leadId: id, authorId }
  });
  res.json(note);
};
