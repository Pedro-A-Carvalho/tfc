import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';
// import authMiddleware from '../middlewares/authMiddleware';

const leaderboardRouter = Router();
const leaderboardController = new LeaderboardController();

leaderboardRouter.get(
  '/',
  (req, res) => leaderboardController.getAllTeams(req, res),
);
leaderboardRouter.get(
  '/home',
  //   authMiddleware,
  (req, res) => leaderboardController.getAllTeamsHome(req, res),
);
leaderboardRouter.get(
  '/away',
  //   authMiddleware,
  (req, res) => leaderboardController.getAllTeamsAway(req, res),
);
// leaderboardRouter.get('/role', authMiddleware, (req, res) => leaderboardController.getRole(req, res));

export default leaderboardRouter;
