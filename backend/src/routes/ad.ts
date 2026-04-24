import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { createAd, listAds, trackClick, trackImpression } from '../controllers/adController';

const router = Router();
router.get('/', listAds);
router.post('/', authenticate, authorize('ADMIN'), createAd);
router.post('/:id/impression', trackImpression);
router.post('/:id/click', trackClick);

export default router;
