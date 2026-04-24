import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { addLeadNote, createLead, listLeads, updateLeadStatus } from '../controllers/leadController';

const router = Router();
router.post('/', authenticate, createLead);
router.get('/', authenticate, authorize('ADMIN', 'SALES'), listLeads);
router.patch('/:id/status', authenticate, authorize('ADMIN', 'SALES'), updateLeadStatus);
router.post('/:id/notes', authenticate, authorize('ADMIN', 'SALES'), addLeadNote);

export default router;
