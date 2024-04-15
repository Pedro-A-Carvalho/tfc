import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  private service: LeaderboardService;
  constructor() {
    this.service = new LeaderboardService();
  }

  public async getAllTeamsHome(req: Request, res: Response): Promise<void> {
    const { status, data } = await this.service.getAllTeamsHome();
    res.status(status).json(data);
  }

  public async getAllTeamsAway(req: Request, res: Response): Promise<void> {
    const { status, data } = await this.service.getAllTeamsAway();
    res.status(status).json(data);
  }

//   public async getTeamById(req: Request, res: Response): Promise<void> {
//     const { id } = req.params;
//     const { status, data } = await this.service.getTeamById(Number(id));
//     res.status(status).json(data);
//   }
}
