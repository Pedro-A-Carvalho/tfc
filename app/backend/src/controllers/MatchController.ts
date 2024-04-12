import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class TeamController {
  private service: MatchService;
  constructor() {
    this.service = new MatchService();
  }

  public async getAllMatches(req: Request, res: Response): Promise<void> {
    const { query } = req;
    const { status, data } = await this.service.getAllMatches(query);
    console.log(req.query);
    res.status(status).json(data);
  }

  public async finishMatch(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status, data } = await this.service.finishMatch(Number(id));
    res.status(status).json(data);
  }

  public async updateMatch(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const matchDetails = req.body;
    const { status, data } = await this.service.updateMatch(Number(id), matchDetails);
    res.status(status).json(data);
  }

  public async createMatch(req: Request, res: Response): Promise<void> {
    const matchDetails = req.body;
    const { status, data } = await this.service.createMatch(matchDetails);
    res.status(status).json(data);
  }
}
