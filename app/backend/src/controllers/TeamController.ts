import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  private service: TeamService;
  constructor() {
    this.service = new TeamService();
  }

  public async getAllTeams(req: Request, res: Response): Promise<void> {
    const { status, data } = await this.service.getAllTeams();
    res.status(status).json(data);
  }

  public async getTeamById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status, data } = await this.service.getTeamById(Number(id));
    res.status(status).json(data);
  }
}
