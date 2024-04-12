import { Request, Response } from 'express';
import LoginService from '../services/LoginService';

export default class TeamController {
  private service: LoginService;
  constructor() {
    this.service = new LoginService();
  }

  public async login(req: Request, res: Response): Promise<void> {
    const userDetails = req.body;
    const { status, data } = await this.service.login(userDetails);
    res.status(status).json(data);
  }
}
