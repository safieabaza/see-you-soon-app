import { Router } from 'express';
import { createCheckoutBooking, getBookings } from '../controllers/bookingController';
import { authenticate } from '../middlewares/auth';

const router = Router();
router.post('/checkout', createCheckoutBooking);
router.get('/', authenticate, getBookings);

export default router;
