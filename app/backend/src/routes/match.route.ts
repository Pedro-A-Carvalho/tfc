import { Router } from 'express';
import MatchController from '../controllers/MatchController';
import authMiddleware from '../middlewares/authMiddleware';

const matchRouter = Router();
const matchController = new MatchController();

matchRouter.get('/', (req, res) => matchController.getAllMatches(req, res));
matchRouter.patch(
  '/:id/finish',
  authMiddleware,
  (req, res) => matchController.finishMatch(req, res),
);
matchRouter.patch('/:id', authMiddleware, (req, res) => matchController.updateMatch(req, res));
matchRouter.post('/', authMiddleware, (req, res) => matchController.createMatch(req, res));

export default matchRouter;
