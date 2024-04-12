import { Router } from 'express';
import teamRouter from './team.route';
import loginRouter from './login.route';

const router = Router();

router.use('/login', loginRouter);
router.use('/teams', teamRouter);

export default router;
