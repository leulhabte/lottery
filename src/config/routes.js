import express from 'express';
import testRoute from '../routes/test';
import contractRoutes from '../routes/contract';

const router = express.Router();

router.use('/test', testRoute);
router.use('/', contractRoutes);

export default router;
