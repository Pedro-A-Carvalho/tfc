import { Router } from 'express';
import teamRouter from './team.route';

const router = Router();

router.use('/teams', teamRouter);

export default router;
