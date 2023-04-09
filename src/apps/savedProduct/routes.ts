import { Router } from 'express';

import { getSavedProducts } from './controller';

const router = Router();

router.get('/', getSavedProducts);

export default router;
