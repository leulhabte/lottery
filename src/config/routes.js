import express from 'express';
import testRoute from '../routes/test';
import userRoutes from '../routes/user';

const router = express.Router();

router.use('/test', testRoute);
router.use('/user', userRoutes);

export default router;
