import { Router } from 'express';

import authRoutes from './auth.routes.js';
import postRoutes from './post.routes.js';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/post', postRoutes);

export default router;