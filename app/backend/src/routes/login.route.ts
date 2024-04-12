import { Router } from 'express';
import LoginController from '../controllers/LoginController';
import authMiddleware from '../middlewares/authMiddleware';

const loginRouter = Router();
const loginController = new LoginController();

loginRouter.post('/', (req, res) => loginController.login(req, res));
loginRouter.get('/role', authMiddleware, (req, res) => loginController.getRole(req, res));

export default loginRouter;
