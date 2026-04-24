import { Router } from 'express';
import { getProperty, listProperties, propertyStats } from '../controllers/propertyController';

const router = Router();
router.get('/', listProperties);
router.get('/stats', propertyStats);
router.get('/:slug', getProperty);

export default router;
