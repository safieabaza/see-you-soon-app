import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { createProperty, deleteProperty, updateAvailability, updateProperty, uploadAmenity, adminStats } from '../controllers/adminController';

const router = Router();
router.use(authenticate, authorize('ADMIN'));
router.post('/properties', createProperty);
router.patch('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);
router.post('/amenities', uploadAmenity);
router.post('/availability', updateAvailability);
router.get('/analytics', adminStats);

export default router;
